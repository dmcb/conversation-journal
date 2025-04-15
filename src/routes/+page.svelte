<script lang="ts">
	import { onMount } from 'svelte';
	import AddEntry from '$lib/components/AddEntry.svelte';
	import EntriesList from '$lib/components/EntriesList.svelte';

	const colors = ['#e68d5d', '#6bb55d', '#399bc5', '#a25b9f'];
	let isInitialLoad = true;
	let cycleInterval: number;

	function initialColorCycle() {
		let cycles = 0;
		const maxCycles = 8;
		let interval = 150; // Start fast

		function cycle() {
			shiftColors();

			cycles++;
			if (cycles < maxCycles) {
				// Gradually increase the interval to slow down
				interval *= 1.15;
				cycleInterval = window.setTimeout(cycle, interval);
			} else {
				isInitialLoad = false;
			}
		}

		cycle();
	}

	interface Entry {
		name: string;
		dates: string[];
		days?: number;
	}

	let entries: Entry[] = [];

	function shiftColors() {
		const lastColor = colors.pop();
		if (lastColor) {
			colors.unshift(lastColor);
			document.documentElement.style.setProperty('--color1', colors[0]);
			document.documentElement.style.setProperty('--color2', colors[1]);
			document.documentElement.style.setProperty('--color3', colors[2]);
			document.documentElement.style.setProperty('--color4', colors[3]);
		}
	}

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
		shiftColors();
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

	$: if (typeof document !== 'undefined') {
		document.body.classList.toggle('initial-load', isInitialLoad);
	}

	onMount(() => {
		const storedEntries = localStorage.getItem('nameEntries');
		if (storedEntries) {
			entries = JSON.parse(storedEntries);
		}
		initialColorCycle();

		return () => {
			if (cycleInterval) {
				window.clearTimeout(cycleInterval);
			}
		};
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
		color: var(--color1, #e68d5d);
		transition: color 0.3s ease;
	}

	:global(.initial-load) h1 .title span {
		transition: color 0.1s linear;
	}

	h1 .title span:nth-child(2) {
		color: var(--color2, #6bb55d);
		transition: color 0.3s ease;
	}

	h1 .title span:nth-child(3) {
		color: var(--color3, #399bc5);
		transition: color 0.3s ease;
	}

	h1 .title span:nth-child(4) {
		color: var(--color4, #a25b9f);
		transition: color 0.3s ease;
	}

	p {
		line-height: 1.5;
		margin: 0 0 3rem 0;
		color: #444;
	}
</style>
