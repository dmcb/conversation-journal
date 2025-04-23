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
	<h2>Recently connected with</h2>
	{#if entries.length === 0}
		<p>No entries added yet.</p>
	{:else}
		<ul>
			{#each displayedEntries as entry}
				<li>
					<div class="entry-header">
						<span class="name"
							><a href={`/person/${encodeURIComponent(entry.name)}`}>{entry.name}</a></span
						>
						{#if (entry.days ?? 0) > 1}
							<span class="days">{entry.days} days ago</span>
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
		color: var(--color4, #4b2230);
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
		color: var(--color4, #4b2230);
		transition: all 0.3s ease;
		display: block;
		margin: 0 auto;
		padding: 0;
	}

	.show-more:hover {
		color: color-mix(in srgb, var(--color4, #4b2230) 80%, black);
	}
</style>
