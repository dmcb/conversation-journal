<script lang="ts">
	interface Entry {
		name: string;
		dates: string[];
		days?: number;
	}
	export let entries: Entry[] = [];

	interface DayData {
		date: string;
		count: number;
		intensity: number;
	}

	let monthlyData: Map<string, DayData[]> = new Map();

	function getMonthName(monthKey: string): string {
		const [year, month] = monthKey.split('-');
		return new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'long' });
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

		let oldestMonth: Date | null = null;
		if (allDates.length) {
			allDates.sort((a, b) => a.getTime() - b.getTime());
			const oldest = allDates[0];
			oldestMonth = new Date(oldest.getFullYear(), oldest.getMonth(), 1);
		}

		const now = new Date();
		const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const maxCount = Math.max(...dateCounts.values(), 0);

		monthlyData = new Map();

		if (oldestMonth) {
			let month = new Date(currentMonth);
			while (month >= oldestMonth) {
				const year = month.getFullYear();
				const m = month.getMonth();
				const daysInMonth = new Date(year, m + 1, 0).getDate();
				const monthKey = `${year}-${String(m + 1).padStart(2, '0')}`;
				const days: DayData[] = [];
				for (let day = 1; day <= daysInMonth; day++) {
					const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
					const count = dateCounts.get(dateStr) || 0;
					days.push({
						date: dateStr,
						count,
						intensity: maxCount > 0 ? count / maxCount : 0
					});
				}
				monthlyData.set(monthKey, days);
				month.setMonth(month.getMonth() - 1);
			}
		}
	}
	// Modal state and helpers
	let modalOpen = false;
	let modalDate = '';

	function openModal(date: string) {
		modalDate = date;
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
	<h2>Conversation History</h2>
	{#each Array.from(monthlyData.entries()) as [monthKey, days], index}
		<div class="month">
			<h3>{getMonthName(monthKey)} {monthKey.split('-')[0]}</h3>
			<div class="monthview">
				{#each Array.from({ length: 7 }) as _, i}
					<div class="weekday">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</div>
				{/each}
				{#each Array.from({ length: new Date(monthKey + '-01').getUTCDay() }) as _}
					<div class="day empty"></div>
				{/each}
				{#each days as day}
					{#if index !== 0 || (index === 0 && parseInt(day.date.split('-')[2], 10) <= new Date().getDate())}
						{#if day.count > 0}
							<button
								class="day"
								style="background-color: color-mix(in srgb, var(--color4, #a25b9f) {day.intensity *
									50}%, white)"
								title={`${day.date}: ${day.count} conversation${day.count === 1 ? '' : 's'}`}
								onclick={() => openModal(day.date)}
							>
								<span class="day-number">{day.date.split('-')[2].replace(/^0/, '')}</span>
								<span class="count">{day.count || '0'}</span>
							</button>
						{:else}
							<div
								class="day"
								style="background-color: color-mix(in srgb, var(--color4, #a25b9f) {day.intensity *
									50}%, white)"
								title={`${day.date}: ${day.count} conversation${day.count === 1 ? '' : 's'}`}
							>
								<span class="day-number">{day.date.split('-')[2].replace(/^0/, '')}</span>
								<span class="count">{day.count || '0'}</span>
							</div>
						{/if}
					{/if}
				{/each}
			</div>
		</div>
	{/each}
</section>

{#if modalOpen}
	<div
		class="modal-backdrop"
		tabindex="0"
		role="button"
		aria-label="Close modal"
		onclick={closeModal}
		onkeydown={(e) => {
			if (e.key === 'Escape' || e.key === ' ') closeModal();
		}}
	></div>
	<div class="modal">
		<button class="close-btn" onclick={closeModal}>&times;</button>
		<p>Connected with</p>
		<ul>
			{#each getPeopleForDate(modalDate) as { name }}
				<li class="name"><a href={`/person/${encodeURIComponent(name)}`}>{name}</a></li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		z-index: 1000;
	}
	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
		padding: 1.5rem;
		z-index: 1001;
		max-width: 350px;
		width: 90vw;
		box-sizing: border-box;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		color: #888;
		position: absolute;
		top: 1rem;
		right: 1rem;
		margin: 0;
		padding: 0;
		line-height: 0;
		height: 2rem;
		width: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal ul {
		list-style: none;
		padding: 0;
		margin: 0;
		overflow: scroll;
	}

	.modal li {
		padding: 8px 0;
		border-bottom: 1px solid #eee;
	}

	.modal li:last-child {
		border-bottom: none;
	}

	.modal p {
		margin: 0 0 1rem 0;
	}

	.modal .name a {
	color: #111;
	text-decoration: none;
	transition: color 0.2s;
}
.modal .name a:hover {
	color: var(--color4, #a25b9f);
}

.modal .name {
		font-weight: bold;
	}

	.month {
		margin-bottom: 3rem;
	}

	.month:last-child {
		margin-bottom: 0;
	}

	h3 {
		margin: 0 0 1rem 0;
		color: #444;
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

	button.day {
		cursor: pointer;
		border: 0;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 0 0 rgba(0, 0, 0, 0.15);
	}
	button.day:hover {
		transform: scale(1.25);
		z-index: 1;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
	}

	.day-number {
		font-weight: bold;
	}

	.count {
		font-size: 0.9em;
		opacity: 0.8;
	}
</style>
