<script lang="ts">
	import Entry from '$lib/components/Entry.svelte';
	import { createEventDispatcher } from 'svelte';

	interface Entry {
		name: string;
		dates: string[];
		days?: number;
	}

	export let entries: Entry[] = [];

	const dispatch = createEventDispatcher<{
		changeName: { oldName: string; newName: string };
		deleteEntry: { name: string };
	}>();

	function handleNameChange(oldName: string, event: CustomEvent<{ newName: string }>) {
		dispatch('changeName', { oldName, newName: event.detail.newName });
	}
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
						<Entry
							name={entry.name}
							on:change={(e) => handleNameChange(entry.name, e)}
							on:delete={(e) => dispatch('deleteEntry', { name: e.detail.name })}
						/>
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

	.days {
		color: #666;
	}
</style>
