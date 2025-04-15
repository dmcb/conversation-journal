<script lang="ts">
	interface Entry {
		name: string;
		dates: string[];
		days?: number;
	}

	export let entries: Entry[] = [];
	let displayState = 'default'; // 'default' | 'more' | 'all'
	const defaultEntries = 5;
	const moreEntries = 35;

	$: displayedEntries =
		displayState === 'all'
			? entries
			: displayState === 'more'
				? entries.slice(0, moreEntries)
				: entries.slice(0, defaultEntries);
	$: remainingEntries = entries.length - moreEntries;
	$: hasMoreEntries = entries.length > defaultEntries;
	$: hasExcessEntries = entries.length > moreEntries;
</script>

<section class="entries">
	<h2>Talked recently with:</h2>
	{#if entries.length === 0}
		<p>No names added yet.</p>
	{:else}
		<ul>
			{#each displayedEntries as entry}
				<li>
					<div class="entry-header">
						<span class="name">{entry.name}</span>
						{#if (entry.days ?? 0) > 1}
							<span class="days">{entry.days} days</span>
						{:else if (entry.days ?? 0) === 1}
							<span class="days">Yesterday</span>
						{:else}
							<span class="days">Today</span>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
		{#if hasMoreEntries && displayState === 'default'}
			<button class="show-more" on:click={() => (displayState = 'more')}>Show More</button>
		{:else if hasExcessEntries && displayState === 'more'}
			<button class="show-more" on:click={() => (displayState = 'all')}>
				Show remaining {remainingEntries}
				{remainingEntries === 1 ? 'contact' : 'contacts'}
			</button>
		{/if}
	{/if}
</section>

<style>
	.entries {
		margin-top: 20px;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	li {
		padding: 8px 0;
		border-bottom: 1px solid #eee;
	}

	.entry-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4px;
	}

	.name {
		font-weight: bold;
	}

	.days {
		color: #666;
	}

	.show-more {
		cursor: pointer;
		background-color: transparent;
		border: none;
		font-weight: bold;
		color: var(--color4, #a25b9f);
		transition: all 0.3s ease;
		display: block;
		margin: 0 auto;
		padding: 0;
	}

	.show-more:hover {
		color: color-mix(in srgb, var(--color4, #a25b9f) 80%, black);
	}
</style>
