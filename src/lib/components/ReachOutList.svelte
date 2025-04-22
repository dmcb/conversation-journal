<script lang="ts">
	/// <reference types="svelte" />
	interface Entry {
		name: string;
		dates: string[];
		days?: number;
	}

	export let entries: Entry[] = [];

	interface ReachOutEntry extends Entry {
		score: number;
	}

	$: reachOutEntries = entries
		.map((entry) => {
			// Calculate mean number of entries across all contacts
			const entriesArray = entries.map((e) => e.dates.length);
			const meanEntries = entriesArray.reduce((sum, val) => sum + val, 0) / entries.length;

			// Calculate standard deviation
			const variance =
				entriesArray.reduce((sum, val) => sum + Math.pow(val - meanEntries, 2), 0) / entries.length;
			const stdDev = Math.sqrt(variance);

			// Calculate z-score (how many standard deviations from mean)
			const zScore = (entry.dates.length - meanEntries) / (stdDev || 1); // avoid division by 0

			// Normalize z-score to a 0.5-5 range with exponential weighting
			const baseFrequency = Math.max(0.5, (zScore + 2) * 1.25);
			const normalizedFrequency = Math.pow(baseFrequency, 1.5);

			// Time factor increases with days but is dampened by log function and frequency
			const daysSinceLastEntry = entry.days ?? 0;
			const timeFactor =
				(daysSinceLastEntry / (1 + Math.log(daysSinceLastEntry + 1))) *
				(baseFrequency >= 2.5 ? 1 : Math.sqrt(baseFrequency / 2.5));

			// Final score uses normalized frequency instead of raw total
			const score = normalizedFrequency * timeFactor;

			return {
				...entry,
				score
			};
		})
		.filter((entry) => entry.score >= 10)
		.sort((a, b) => b.score - a.score)
		.slice(0, 3);
</script>

{#if reachOutEntries.length > 0}
	<section class="entries">
		<h2>Reconnect with</h2>
		{#if reachOutEntries.length === 0}
			<p>No one needs attention right now.</p>
		{:else}
			<ul>
				{#each reachOutEntries as entry}
					<li>
						<div class="entry-content">
							<div class="entry-header">
								<span class="name"><a href={`/person/${encodeURIComponent(entry.name)}`}>{entry.name}</a></span>
								{#if (entry.days ?? 0) > 1}
									<span class="days">{entry.days} days ago</span>
								{:else if (entry.days ?? 0) === 1}
									<span class="days">Yesterday</span>
								{:else}
									<span class="days">Today</span>
								{/if}
							</div>
							<div class="entry-details">
								{entry.dates.length}
								{entry.dates.length === 1 ? 'entry' : 'entries'}
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
{/if}

<style>
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		padding: 8px 0;
		border-bottom: 1px solid #eee;
	}

	li:last-child {
		border-bottom: none;
	}

	.entry-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4px;
	}

	.name a {
	color: #111;
	text-decoration: none;
	transition: color 0.2s;
}
.name a:hover {
	color: var(--color4, #a25b9f);
}

.name {
		font-weight: bold;
	}

	.days {
		color: #666;
	}
</style>
