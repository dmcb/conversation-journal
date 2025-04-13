<script lang="ts">
	interface Entry {
		name: string;
		dates: string[];
		days?: number;
	}

	export let entries: Entry[] = [];
</script>

<section class="entries">
	<h2>Talked recently with</h2>
	{#if entries.length === 0}
		<p>No names added yet</p>
	{:else}
		<ul>
			{#each entries as entry}
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
		padding: 10px;
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
</style>
