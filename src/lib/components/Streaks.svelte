<script lang="ts">
	interface Entry {
		name: string;
		dates: string[];
		days?: number;
	}

	export let entries: Entry[] = [];

	// Calculate current streak of consecutive days with conversations
	function calculateCurrentStreak(): number {
		if (entries.length === 0) return 0;

		// Get all unique dates with entries and convert to Date objects
		let uniqueDates: Date[] = [];
		entries.forEach((entry) => {
			entry.dates.forEach((dateStr) => {
				// Create date at midnight for consistent comparison
				const date = new Date(dateStr);
				date.setHours(0, 0, 0, 0);
				uniqueDates.push(date);
			});
		});

		// Remove duplicates by converting to ISO string and back
		const dateStrings = new Set(uniqueDates.map((d) => d.toISOString().split('T')[0]));
		uniqueDates = Array.from(dateStrings).map((d) => new Date(d));

		// Sort dates in descending order (newest first)
		uniqueDates.sort((a, b) => b.getTime() - a.getTime());

		if (uniqueDates.length === 0) return 0;

		// Check if the most recent date is today or yesterday
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		const mostRecentDate = uniqueDates[0];
		const todayTime = today.getTime();
		const yesterdayTime = yesterday.getTime();
		const mostRecentTime = mostRecentDate.getTime();

		// If the most recent entry is not from today or yesterday, streak is 0
		if (mostRecentTime !== todayTime && mostRecentTime !== yesterdayTime) {
			console.log('No recent entries');
			return 0;
		}

		// Count consecutive days
		let streak = 1;
		let currentDate = new Date(mostRecentDate);

		for (let i = 1; i < uniqueDates.length; i++) {
			// Calculate the expected previous day
			const expectedPrevDay = new Date(currentDate);
			expectedPrevDay.setDate(expectedPrevDay.getDate() - 1);

			// Check if the next date in our sorted array matches the expected previous day
			if (uniqueDates[i].getTime() === expectedPrevDay.getTime()) {
				streak++;
				currentDate = new Date(uniqueDates[i]);
			} else {
				// Chain broken
				break;
			}
		}

		console.log('Current streak:', streak);

		return streak;
	}

	// Calculate longest streak and its date range
	function calculateLongestStreak(): { count: number; startDate: string; endDate: string } {
		if (entries.length === 0) return { count: 0, startDate: '', endDate: '' };

		// Get all unique dates with entries and convert to Date objects
		let uniqueDates: Date[] = [];
		entries.forEach((entry) => {
			entry.dates.forEach((dateStr) => {
				// Create date at midnight for consistent comparison
				const date = new Date(dateStr);
				date.setHours(0, 0, 0, 0);
				uniqueDates.push(date);
			});
		});

		// Remove duplicates and create a map of dates to their string representations
		const dateMap = new Map<number, string>();
		uniqueDates.forEach((date) => {
			const dateStr = date.toISOString().split('T')[0];
			dateMap.set(date.getTime(), dateStr);
		});

		// Get unique timestamps and sort chronologically (oldest first)
		const uniqueTimestamps = Array.from(dateMap.keys()).sort((a, b) => a - b);

		if (uniqueTimestamps.length === 0) return { count: 0, startDate: '', endDate: '' };
		if (uniqueTimestamps.length === 1) {
			const dateStr = dateMap.get(uniqueTimestamps[0]) || '';
			return { count: 1, startDate: dateStr, endDate: dateStr };
		}

		// Find the longest streak of consecutive days
		let longestStreak = 1;
		let currentStreak = 1;
		let longestStartTime = uniqueTimestamps[0];
		let longestEndTime = uniqueTimestamps[0];
		let currentStartTime = uniqueTimestamps[0];

		for (let i = 1; i < uniqueTimestamps.length; i++) {
			const currentTime = uniqueTimestamps[i];
			const prevTime = uniqueTimestamps[i - 1];

			// Check if dates are consecutive (exactly 1 day apart)
			// 86400000 = 24 * 60 * 60 * 1000 = milliseconds in a day
			if (currentTime - prevTime === 86400000) {
				// Consecutive day
				currentStreak++;

				// Update longest streak if current is longer
				if (currentStreak > longestStreak) {
					longestStreak = currentStreak;
					longestStartTime = currentStartTime;
					longestEndTime = currentTime;
				}
			} else {
				// Streak broken
				currentStreak = 1;
				currentStartTime = currentTime;
			}
		}

		console.log('Longest streak:', longestStreak);

		// Return the longest streak info
		return {
			count: longestStreak,
			startDate: dateMap.get(longestStartTime) || '',
			endDate: dateMap.get(longestEndTime) || ''
		};
	}

	$: currentStreak = calculateCurrentStreak();
	$: longestStreak = calculateLongestStreak();

	// Format date for display
	function formatDateForDisplay(dateStr: string): string {
		if (!dateStr) return '';
		const date = new Date(dateStr + 'T00:00:00');
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

{#if entries.length > 0}
	<section class="streaks">
		<div class="container">
			<div class="streak">
				<div class="streak-icon">🔥</div>
				<div class="streak-info">
					<div class="streak-count">{currentStreak}</div>
					<div class="streak-label">{currentStreak === 1 ? 'day' : 'days'} streak</div>
				</div>
			</div>
			<p class="streak-description">
				{#if currentStreak > 0}
					You've had conversations for {currentStreak} consecutive {currentStreak === 1
						? 'day'
						: 'days'}!
				{:else}
					Start a streak by logging a conversation today.
				{/if}
			</p>
		</div>

		<div class="container">
			<div class="streak">
				<div class="streak-icon">🏆</div>
				<div class="streak-info">
					<div class="streak-count">{longestStreak.count}</div>
					<div class="streak-label">longest streak</div>
				</div>
			</div>
			<p class="streak-description">
				{#if longestStreak.count > 0}
					{formatDateForDisplay(longestStreak.startDate)} — {formatDateForDisplay(
						longestStreak.endDate
					)}
				{:else}
					No streaks recorded yet.
				{/if}
			</p>
		</div>
	</section>
{/if}

<style>
	.streak {
		display: flex;
		align-items: center;
		gap: var(--spacing);
	}

	.container + .container {
		margin-top: var(--spacing);
		padding-top: var(--spacing);
		border-top: 1px solid var(--color-border);
	}

	.streak-icon {
		font-size: 2rem;
	}

	.streak-info {
		display: flex;
		flex-direction: column;
	}

	.streak-count {
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--color4);
	}

	.streak-label {
		font-size: var(--font-size-small);
		color: var(--color-faint-text);
	}

	.streak-description {
		margin-top: var(--spacing-small);
	}
</style>
