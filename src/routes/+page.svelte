<script lang="ts">
	import { onMount } from 'svelte';
	import AddEntry from '$lib/components/AddEntry.svelte';
	import EntriesList from '$lib/components/EntriesList.svelte';
	import ReachOutList from '$lib/components/ReachOutList.svelte';

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

<AddEntry onAdd={handleAddEntry} />
<EntriesList entries={sortedEntries} />
<ReachOutList entries={sortedEntries} />
