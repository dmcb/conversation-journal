<script lang="ts">
	import { getNiceDateLabelFromDateString, getCurrentDateString } from '$lib/utils/entries';

	import type { Entry } from '$lib/utils/entries';

	export let entries: Entry[] = [];

	let currentStreak = 0;
	let longestStreak = { count: 0, startDate: '', endDate: '' };

	$: {
		// Get all dates from entries
		const allDates = entries.flatMap((entry) => entry.dates.map((d) => Object.keys(d)[0]));
		// Get the unique dates
		const uniqueDates = [...new Set(allDates)];
		// Sort the dates
		uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

		let activeStreak = 1;
		let activeStreakEndDate = '';
		let currentStreakStarted = false;

		// Begin a streak if today has an entry
		const today = getCurrentDateString();
		if (uniqueDates.length && uniqueDates[0] === today) {
			activeStreakEndDate = today;
			currentStreakStarted = true;
		}
		for (let i = 0; i < uniqueDates.length; i++) {
			const entryDate = uniqueDates[i];
			let nextEntryDateToCheck = '';
			if (uniqueDates[i + 1]) {
				nextEntryDateToCheck = uniqueDates[i + 1];
			}
			let dateOfEntry = new Date(entryDate);
			if (activeStreak == 1) {
				activeStreakEndDate = dateOfEntry.toISOString().split('T')[0];
			}
			let whatDateOfNextEntryShouldBe = new Date(entryDate);
			whatDateOfNextEntryShouldBe.setDate(whatDateOfNextEntryShouldBe.getDate() - 1);
			if (nextEntryDateToCheck === whatDateOfNextEntryShouldBe.toISOString().split('T')[0]) {
				activeStreak++;
			} else {
				if (currentStreakStarted) {
					currentStreakStarted = false;
					currentStreak = activeStreak;
				}
				if (activeStreak >= longestStreak.count) {
					longestStreak.count = activeStreak;
					longestStreak.startDate = dateOfEntry.toISOString().split('T')[0];
					longestStreak.endDate = activeStreakEndDate;
				}
				activeStreak = 1;
			}
		}
		longestStreak = longestStreak;
	}
</script>

{#if entries.length > 0}
	<section class="streaks">
		<div class="container">
			<div class="streak">
				<div class="streak-icon">🔥</div>
				<div class="streak-info">
					<div class="streak-count">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</div>
					<div class="streak-label">current streak</div>
				</div>
			</div>
			<p class="streak-description">
				{#if currentStreak > 1}
					You have recorded {currentStreak} entries in a row!
				{:else if currentStreak === 1}
					You've started a new streak today.
				{:else}
					Start a streak by logging a conversation today.
				{/if}
			</p>
		</div>

		<div class="container">
			<div class="streak">
				<div class="streak-icon">🏆</div>
				<div class="streak-info">
					<div class="streak-count">
						{longestStreak.count}
						{longestStreak.count === 1 ? 'day' : 'days'}
					</div>
					<div class="streak-label">longest streak</div>
				</div>
			</div>
			<p class="streak-description">
				{#if longestStreak.count > 1}
					{getNiceDateLabelFromDateString(longestStreak.startDate)} — {getNiceDateLabelFromDateString(
						longestStreak.endDate
					)}
				{:else if longestStreak.count === 1}
					{getNiceDateLabelFromDateString(longestStreak.startDate)}
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
		color: var(--brandcolor1);
	}

	.streak-label {
		font-size: var(--font-size-small);
		color: var(--color-faint-text);
	}

	.streak-description {
		margin-top: var(--spacing-small);
	}

	@media (min-width: 632px) {
		.streaks {
			display: flex;
		}

		.container {
			flex: 1;
		}

		.container:first-child {
			padding-right: var(--spacing-medium);
		}

		.container:last-child {
			border: 0;
			border-left: 1px solid var(--color-border);
			margin: 0;
			padding: 0;
			padding-left: var(--spacing-medium);
		}
	}
</style>
