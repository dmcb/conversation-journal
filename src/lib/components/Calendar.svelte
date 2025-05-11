<script lang="ts">
	import Modal from './Modal.svelte';
	import EntryForm from './EntryForm.svelte';
	import { getTimezoneRemovedDateObject, getNiceDateLabelFromDateString } from '$lib/utils/dates';
	import type { Entry, DateEntry } from '$lib/utils/entries';

	export let entries: Entry[] = [];
	export let onSuccess: (() => void) | undefined = undefined;

	interface DayData {
		date: string;
		count: number;
		intensity: number;
	}

	let monthlyData: Map<string, DayData[]> = new Map();
	let currentViewMonth = new Date();
	currentViewMonth.setDate(1); // Start at beginning of month

	function getMonthName(date: Date): string {
		return date.toLocaleString('default', { month: 'long' });
	}

	function handleSuccess() {
		if (onSuccess) {
			onSuccess();
			closeModal();
		}
	}

	$: {
		const dateCounts = new Map<string, number>();
		let allDates: Date[] = [];

		entries.forEach((entry: Entry) => {
			entry.dates.forEach((dateObj: DateEntry) => {
				const date = Object.keys(dateObj)[0];
				const d = new Date(date + 'T00:00:00');
				if (!isNaN(d.getTime())) {
					allDates.push(d);
					const key = d.toISOString().slice(0, 10);
					dateCounts.set(key, (dateCounts.get(key) || 0) + 1);
				}
			});
		});

		const maxCount = Math.max(...dateCounts.values(), 0);
		const year = currentViewMonth.getFullYear();
		const month = currentViewMonth.getMonth();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
		const days: DayData[] = [];

		for (let day = 1; day <= daysInMonth; day++) {
			const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
			const count = dateCounts.get(dateStr) || 0;
			days.push({
				date: dateStr,
				count,
				intensity: maxCount > 0 ? count / maxCount : 0
			});
		}

		monthlyData = new Map([[monthKey, days]]);
	}
	// Modal state and helpers
	let modalOpen = false;
	let selectedDate = '';

	function openModal(date: string) {
		selectedDate = date;
		modalOpen = true;
	}

	function closeModal() {
		modalOpen = false;
	}

	// Get people and their chat counts for a given date
	function getPeopleForDate(date: string): { name: string; count: number }[] {
		const peopleMap = new Map<string, number>();
		entries.forEach((entry) => {
			if (entry.dates.some((d) => Object.keys(d)[0] === date)) {
				peopleMap.set(entry.name, (peopleMap.get(entry.name) || 0) + 1);
			}
		});
		return Array.from(peopleMap.entries())
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => a.name.localeCompare(b.name));
	}
</script>

<section class="calendar">
	<div class="calendar-header">
		<h2>Conversation History</h2>
		{#if entries.length === 0}
			<p>No entries added yet.</p>
		{:else}
			<div class="month-navigation">
				<button
					class="util"
					on:click={() => {
						const newDate = new Date(currentViewMonth);
						newDate.setMonth(newDate.getMonth() - 1);
						currentViewMonth = newDate;
					}}>←</button
				>
				<h3>{getMonthName(currentViewMonth)} {currentViewMonth.getFullYear()}</h3>
				{#if currentViewMonth.getFullYear() < new Date().getFullYear() || (currentViewMonth.getFullYear() === new Date().getFullYear() && currentViewMonth.getMonth() < new Date().getMonth())}
					<button
						class="util"
						on:click={() => {
							const newDate = new Date(currentViewMonth);
							newDate.setMonth(newDate.getMonth() + 1);
							currentViewMonth = newDate;
						}}>→</button
					>
				{:else}
					<button class="util" disabled aria-label="Disabled"></button>
				{/if}
			</div>
		{/if}
	</div>

	{#if entries.length > 0}
		{#each Array.from(monthlyData.entries()) as [monthKey, days]}
			<div class="month">
				<div class="monthview">
					{#each Array.from({ length: 7 }) as _, i}
						<div class="weekday">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</div>
					{/each}
					{#each Array.from({ length: new Date(monthKey + '-01').getUTCDay() }) as _}
						<div class="day empty"></div>
					{/each}
					{#each days as day}
						{@const dayDate = new Date(day.date)}
						{#if dayDate <= getTimezoneRemovedDateObject()}
							<button
								class="day {day.count > 0 ? 'has-entries' : ''}"
								style="background-color: color-mix(in srgb, var(--brandcolor1) {day.intensity *
									50}%, var(--color-bright-background))"
								title={`${day.date}: ${day.count} conversation${day.count === 1 ? '' : 's'}`}
								on:click={() => openModal(day.date)}
							>
								<span class="day-number">{day.date.split('-')[2].replace(/^0/, '')}</span>
								<span class="count">{day.count || '0'}</span>
							</button>
						{:else}
							<div class="day empty future">
								<span class="day-number">{day.date.split('-')[2].replace(/^0/, '')}</span>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</section>

<Modal open={modalOpen} onClose={closeModal}>
	<h4>Conversations on {getNiceDateLabelFromDateString(selectedDate)}</h4>
	{#if getPeopleForDate(selectedDate).length > 0}
		<div class="existing-entries">
			<ul>
				{#each getPeopleForDate(selectedDate) as { name }}
					<li class="name"><a href={`/person/${encodeURIComponent(name)}`}>{name}</a></li>
				{/each}
			</ul>
		</div>
	{:else}
		<p>No conversations on this date.</p>
	{/if}
	<div class="add-entry">
		<h4>Add new entry</h4>
		<EntryForm date={selectedDate} onSuccess={handleSuccess} />
	</div>
</Modal>

<style>
	.month-navigation {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 1rem;
	}
	h3 {
		margin: 0;
		color: var(--color-text);
		min-width: 200px;
		text-align: center;
	}

	.monthview {
		margin-top: var(--spacing);
		display: grid;
		width: 100%;
		grid-template-columns: repeat(7, minmax(10px, 1fr));
		gap: 4px;
	}

	.weekday {
		color: var(--color-faint-text);
		font-size: var(--font-size-very-small);
		text-align: center;
		padding: 4px;
	}

	.day {
		aspect-ratio: 1;
		padding: 4px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: var(--border-radius-small);
		font-size: var(--font-size-very-small);
		color: var(--color-text);
	}

	.day.empty,
	.day.empty.future {
		opacity: 0.3;
	}
	.day:not(.empty) {
		cursor: pointer;
		border: 0;
		transition:
			transform var(--transition-speed) ease,
			box-shadow var(--transition-speed) ease;
		box-shadow: var(--box-shadow-small);
	}

	.day:not(.empty):hover {
		transform: scale(1.25);
		z-index: 1;
		box-shadow: var(--box-shadow-large);
		color: var(--color-text);
	}

	.day.has-entries {
		font-weight: bold;
	}

	.day-number {
		font-weight: bold;
	}

	.count {
		font-size: var(--font-size-small);
		opacity: 0.8;
	}

	.add-entry {
		margin-top: var(--spacing-medium);
	}
</style>
