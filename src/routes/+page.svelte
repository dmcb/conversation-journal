<script lang="ts">
	import { onMount } from 'svelte';

	interface Entry {
		name: string;
		dates: string[];
		days?: number;
	}

	let name = '';
	let entries: Entry[] = [];

	function addEntry() {
		if (!name.trim()) return;

		const trimmedName = name.trim();
		const currentDate = new Date().toISOString().slice(0, 10);
		const existingEntryIndex = entries.findIndex(
			(entry) => entry.name.toLowerCase() === trimmedName.toLowerCase()
		);

		if (existingEntryIndex >= 0) {
			// Update existing entry with new date if it doesn't already exist
			const existingEntry = entries[existingEntryIndex];
			if (!existingEntry.dates.includes(currentDate)) {
				entries = entries.map((entry, index) =>
					index === existingEntryIndex ? { ...entry, dates: [...entry.dates, currentDate] } : entry
				);
			}
		} else {
			// Create new entry
			const newEntry = {
				name: trimmedName,
				dates: [currentDate]
			};
			entries = [...entries, newEntry];
		}

		localStorage.setItem('nameEntries', JSON.stringify(entries));
		name = '';
	}

	function calculateDays(dates: string[]): number {
		const mostRecentDate = dates.sort().reverse()[0];
		const entryDate = new Date(mostRecentDate);
		const currentDate = new Date().toISOString().slice(0, 10);
		const diffTime = Math.abs(new Date(currentDate).getTime() - entryDate.getTime());
		return Math.floor(diffTime / (1000 * 60 * 60 * 24));
	}

	onMount(() => {
		const storedEntries = localStorage.getItem('nameEntries');
		if (storedEntries) {
			entries = JSON.parse(storedEntries);
		}
	});

	$: sortedEntries = entries
		.map((entry) => ({
			...entry,
			days: calculateDays(entry.dates)
		}))
		.sort((a, b) => (a.days ?? 0) - (b.days ?? 0));
</script>

<div class="container">
	<h1>Stay Looped</h1>
	<p>
		A simple, habit-forming daily journal to track conversations and stay connected with the people
		who matter most.
	</p>

	<section class="add-entry">
		<h2>Who have you talked to today?</h2>
		<form on:submit|preventDefault={addEntry} class="input-form">
			<input type="text" bind:value={name} placeholder="Enter a name" required />
			<button type="submit">Add Name</button>
		</form>
	</section>

	<section class="entries">
		<h2>Talked recently with</h2>
		{#if sortedEntries.length === 0}
			<p>No names added yet</p>
		{:else}
			<ul>
				{#each sortedEntries as entry}
					<li>
						<div class="entry-header">
							<span class="name">{entry.name}</span>
							{#if entry.days > 1}
								<span class="days">{entry.days} days</span>
							{:else if entry.days === 1}
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
</div>

<style>
	.container {
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
	}

	.input-form {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
	}

	input {
		flex: 1;
		padding: 8px;
		font-size: 16px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
		padding: 8px 16px;
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: #45a049;
	}

	.entries-list {
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
