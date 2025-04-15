<script lang="ts">
	import { onMount } from 'svelte';
	import AddEntry from '$lib/components/AddEntry.svelte';
	import EntriesList from '$lib/components/EntriesList.svelte';

	interface Entry {
		name: string;
		dates: string[];
		days?: number;
	}

	let entries: Entry[] = [];

	function handleAddEntry(name: string) {
		const trimmedName = name.trim();
		const currentDate = new Date();
		const offset = currentDate.getTimezoneOffset();
		const formattedCurrentDate = new Date(currentDate.getTime() - offset * 60 * 1000)
			.toISOString()
			.split('T')[0];
		const existingEntryIndex = entries.findIndex(
			(entry) => entry.name.toLowerCase() === trimmedName.toLowerCase()
		);

		if (existingEntryIndex >= 0) {
			// Update existing entry with new date if it doesn't already exist
			const existingEntry = entries[existingEntryIndex];
			if (!existingEntry.dates.includes(formattedCurrentDate)) {
				entries = entries.map((entry, index) =>
					index === existingEntryIndex
						? { ...entry, dates: [...entry.dates, formattedCurrentDate] }
						: entry
				);
			}
		} else {
			// Create new entry
			const newEntry = {
				name: trimmedName,
				dates: [formattedCurrentDate]
			};
			entries = [...entries, newEntry];
		}

		localStorage.setItem('nameEntries', JSON.stringify(entries));
	}

	function calculateDays(dates: string[]): number {
		const mostRecentDate = dates.sort().reverse()[0];
		const currentDate = new Date();
		const offset = currentDate.getTimezoneOffset();
		const formattedCurrentDate = new Date(currentDate.getTime() - offset * 60 * 1000)
			.toISOString()
			.split('T')[0];
		const entryDate = new Date(mostRecentDate);
		console.log(entryDate, formattedCurrentDate);
		const diffTime = Math.abs(
			new Date(formattedCurrentDate).getTime() - new Date(entryDate).getTime()
		);
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
		.sort((a, b) => a.name.localeCompare(b.name))
		.sort((a, b) => (a.days ?? 0) - (b.days ?? 0));
</script>

<svelte:head>
	<title>Stay Looped — Daily Conversation Journal</title>
	<meta
		name="description"
		content="A simple, habit-forming, daily journal to track your conversations and stay connected with the people who matter most."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<main>
	<section class="intro">
		<h1>
			Stay <div class="title"><span>Lo</span><span>op</span><span>ed</span><span>.</span></div>
		</h1>
		<p>
			A simple, habit-forming, daily journal to track your conversations and stay connected with the
			people who matter most.
		</p>
	</section>

	<AddEntry onAdd={handleAddEntry} />
	<EntriesList entries={sortedEntries} />
</main>

<style>
	:global(body) {
		background-color: #f5f5f5;
		margin: 0;
		padding: 0;
	}

	main {
		max-width: 600px;
		margin: 1rem auto;
		padding: 0 20px;
		font-family: 'DM Sans', sans-serif;
	}

	.intro {
		max-width: 400px;
		margin: 0 auto;
	}

	h1 {
		text-transform: lowercase;
		margin: 0 0 0.25em 0;
		font-weight: normal;
	}

	h1 .title {
		font-family: 'Rammetto One', sans-serif;
		display: block;
		font-size: clamp(1rem, calc(20.5vw - 5px), 5.3rem);
		line-height: 1;
		color: #a25b9f;
	}

	h1 .title span:nth-child(1) {
		color: #e68d5d;
	}

	h1 .title span:nth-child(2) {
		color: #6bb55d;
	}

	h1 .title span:nth-child(3) {
		color: #399bc5;
	}

	h1 .title span:nth-child(4) {
		color: #a25b9f;
	}

	p {
		line-height: 1.5;
		margin: 0 0 3rem 0;
		color: #444;
	}
</style>
