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
		.map((entry): ReachOutEntry => {
			const daysSinceLastEntry = entry.days ?? 0;
			const totalEntries = entry.dates.length;
			// Time factor increases with days but is dampened by a log function
			const timeFactor = daysSinceLastEntry / (1 + Math.log(daysSinceLastEntry + 1));
			const score = totalEntries * timeFactor;
			return {
				...entry,
				score
			};
		})
		.filter((entry) => entry.score >= 50)
		.sort((a, b) => b.score - a.score)
		.slice(0, 3);
</script>

{#if reachOutEntries.length > 0}
	<section class="reach-out">
		<h2>Consider reaching out to:</h2>
		<ul>
			{#each reachOutEntries as entry}
				<li>
					<div class="entry-header">
						<span class="name">{entry.name}</span>
						<span class="days">
							{#if (entry.days ?? 0) > 1}
								{entry.days} days ago
							{:else if (entry.days ?? 0) === 1}
								Yesterday
							{:else}
								Today
							{/if}
						</span>
					</div>
					<div class="entry-details">
						{entry.score}
						{entry.dates.length}
						{entry.dates.length === 1 ? 'conversation' : 'conversations'} recorded
					</div>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		margin-bottom: 1rem;
		padding: 0.75rem;
		background-color: white;
		border-radius: 6px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.entry-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.25rem;
	}

	.name {
		font-weight: bold;
	}

	.days {
		color: #666;
		font-size: 0.9rem;
	}

	.entry-details {
		font-size: 0.85rem;
		color: #666;
	}
</style>
