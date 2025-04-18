<script lang="ts">
	import { onMount } from 'svelte';

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

	let calendarData: DayData[] = [];
	let monthlyData: Map<string, DayData[]>;
	let heatMapContainer: HTMLElement;

	function getDaysInMonth(year: number, month: number): number {
		return new Date(year, month + 1, 0).getDate();
	}

	function generateMonthDays(
		year: number,
		month: number,
		dateCounts: Map<string, number>,
		maxCount: number
	): DayData[] {
		const days: DayData[] = [];
		const daysInMonth = getDaysInMonth(year, month);

		for (let day = 1; day <= daysInMonth; day++) {
			const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
			const count = dateCounts.get(date) || 0;
			days.push({
				date,
				count,
				intensity: maxCount > 0 ? count / maxCount : 0
			});
		}

		return days;
	}

	$: {
		// Get all dates and find min/max
		let minDate = new Date();
		let maxDate = new Date('1970-01-01');
		const dateCounts = new Map<string, number>();

		entries.forEach((entry) => {
			entry.dates.forEach((date) => {
				const d = new Date(date);
				if (d < minDate) minDate = d;
				if (d > maxDate) maxDate = d;

				const count = (dateCounts.get(date) || 0) + 1;
				dateCounts.set(date, count);
			});
		});

		// Find max count for normalization
		const maxCount = Math.max(...dateCounts.values(), 0);

		// Generate all months between min and max date
		calendarData = [];
		const startDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
		const endDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

		for (let d = startDate; d <= endDate; d.setMonth(d.getMonth() + 1)) {
			const monthDays = generateMonthDays(d.getFullYear(), d.getMonth(), dateCounts, maxCount);
			calendarData.push(...monthDays);
		}
	}

	function getMonthName(date: string): string {
		return new Date(date).toLocaleString('default', { month: 'long' });
	}

	function getIntensityColor(intensity: number): string {
		const baseColor =
			getComputedStyle(document.documentElement).getPropertyValue('--color4').trim() || '#a25b9f';
		return `color-mix(in srgb, ${baseColor} ${Math.round(intensity * 100)}%, white)`;
	}

	function groupByMonth(data: DayData[]): Map<string, DayData[]> {
		const grouped = new Map<string, DayData[]>();

		// First group by month-year
		data.forEach((day) => {
			const date = new Date(day.date);
			const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			if (!grouped.has(monthYear)) {
				grouped.set(monthYear, []);
			}
			grouped.get(monthYear)?.push(day);
		});

		// Sort days within each month
		grouped.forEach((days, monthYear) => {
			days.sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate());
		});

		return grouped;
	}

	$: monthlyData = groupByMonth(calendarData);

	onMount(() => {
		setTimeout(() => {
			if (heatMapContainer) {
				heatMapContainer.scrollTop = heatMapContainer.scrollHeight;
			}
		}, 0);
	});
</script>

<section class="heat-map" bind:this={heatMapContainer}>
	<h2>Conversation History</h2>
	{#each Array.from(monthlyData.entries()).sort( ([a], [b]) => a.localeCompare(b) ) as [monthYear, days]}
		<div class="month">
			<h3>{getMonthName(monthYear)} {monthYear.split('-')[0]}</h3>
			<div class="calendar">
				{#each Array.from({ length: 7 }) as _, i}
					<div class="weekday">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</div>
				{/each}
				{#each Array.from({ length: new Date(monthYear + '-01').getDay() }) as _}
					<div class="day empty"></div>
				{/each}
				{#each days as day}
					<div
						class="day"
						style:background-color={getIntensityColor(day.intensity)}
						title={`${day.date}: ${day.count} conversation${day.count === 1 ? '' : 's'}`}
					>
						<span class="day-number">{new Date(day.date).getDate()}</span>
						<span class="count">{day.count || '0'}</span>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</section>

<style>
	.heat-map {
		background: white;
		max-height: 80vh;
		overflow-y: auto;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.month {
		margin-bottom: 2rem;
	}

	.month:last-child {
		margin-bottom: 0;
	}

	h3 {
		margin: 0 0 1rem 0;
		color: #444;
	}

	.calendar {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
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
		transition: transform 0.2s ease;
	}

	.day:hover {
		transform: scale(1.1);
	}

	.day.empty {
		background-color: transparent;
	}

	.day-number {
		font-weight: bold;
	}

	.count {
		font-size: 0.9em;
		opacity: 0.8;
	}
</style>
