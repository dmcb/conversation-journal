<script lang="ts">
	import Modal from './Modal.svelte';
	import EntryForm from './EntryForm.svelte';

	interface Entry {
		name: string;
		dates: string[];
		days?: number;
	}

	export let onAdd: (name: string, date?: string) => boolean;
	export let entries: Entry[] = [];

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

	$: {
		const dateCounts = new Map<string, number>();
		let allDates: Date[] = [];

		entries.forEach((entry: Entry) => {
			entry.dates.forEach((date: string) => {
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
			if (entry.dates.includes(date)) {
				peopleMap.set(entry.name, (peopleMap.get(entry.name) || 0) + 1);
			}
		});
		return Array.from(peopleMap.entries()).map(([name, count]) => ({ name, count }));
	}
</script>

<section class="calendar">
	<div class="calendar-header">
		<h2>Conversation History</h2>
		<div class="month-navigation">
			<button
				class="nav-button"
				on:click={() => {
					const newDate = new Date(currentViewMonth);
					newDate.setMonth(newDate.getMonth() - 1);
					currentViewMonth = newDate;
				}}>←</button
			>
			<h3>{getMonthName(currentViewMonth)} {currentViewMonth.getFullYear()}</h3>
			{#if currentViewMonth.getFullYear() < new Date().getFullYear() || (currentViewMonth.getFullYear() === new Date().getFullYear() && currentViewMonth.getMonth() < new Date().getMonth())}
				<button
					class="nav-button"
					on:click={() => {
						const newDate = new Date(currentViewMonth);
						newDate.setMonth(newDate.getMonth() + 1);
						currentViewMonth = newDate;
					}}>→</button
				>
			{:else}
				<div class="nav-button-placeholder"></div>
			{/if}
		</div>
	</div>

	{#if entries.length === 0}
		<p>No entries added yet.</p>
	{:else}
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
						{@const currentDate = new Date()}
						{@const dayDate = new Date(day.date)}
						{#if dayDate <= currentDate}
							<button
								class="day {day.count > 0 ? 'has-entries' : ''}"
								style="background-color: color-mix(in srgb, var(--color4, #4b2230) {day.intensity *
									50}%, white)"
								title={`${day.date}: ${day.count} conversation${day.count === 1 ? '' : 's'}`}
								on:click={() => openModal(day.date)}
							>
								<span class="day-number">{day.date.split('-')[2].replace(/^0/, '')}</span>
								<span class="count">{day.count || '0'}</span>
							</button>
						{:else}
							<div class="day empty future"></div>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</section>

<Modal open={modalOpen} onClose={closeModal}>
	<p>{selectedDate}</p>
	{#if getPeopleForDate(selectedDate).length > 0}
		<div class="existing-entries">
			<ul>
				{#each getPeopleForDate(selectedDate) as { name }}
					<li class="name"><a href={`/person/${encodeURIComponent(name)}`}>{name}</a></li>
				{/each}
			</ul>
		</div>
	{/if}
	<div class="add-entry">
		<p>Add new entry</p>
		<EntryForm
			onAdd={(name) => {
				return onAdd(name, selectedDate);
			}}
		/>
	</div>
</Modal>

<style>
	.calendar-header {
		margin-bottom: 2rem;
	}

	.month-navigation {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-top: 1rem;
	}

	.nav-button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--color4);
		padding: 0.5rem;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s;
	}

	.nav-button:hover {
		background-color: #eee;
	}

	.nav-button-placeholder {
		width: 2.5rem;
		height: 2.5rem;
	}

	h3 {
		margin: 0;
		color: #444;
		min-width: 200px;
		text-align: center;
	}

	.monthview {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(7, minmax(10px, 1fr));
		gap: 4px;
	}

	.weekday {
		text-align: center;
		font-size: 0.8em;
		color: #666;
		padding: 4px;
	}

	.day {
		aspect-ratio: 1;
		padding: 4px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		font-size: 0.8em;
		color: #444;
	}

	.day.empty {
		background-color: transparent;
	}

	.day.empty.future {
		background-color: #f5f5f5;
		border-radius: 4px;
	}

	.day:not(.empty) {
		cursor: pointer;
		border: 0;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 0 0 rgba(0, 0, 0, 0.15);
	}

	.day:not(.empty):hover {
		transform: scale(1.25);
		z-index: 1;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
	}

	.day.has-entries {
		font-weight: bold;
	}

	.day-number {
		font-weight: bold;
	}

	.count {
		font-size: 0.9em;
		opacity: 0.8;
	}

	.existing-entries {
		margin-bottom: 30px;
	}
</style>
