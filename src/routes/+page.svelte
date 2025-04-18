<script lang="ts">
	import { onMount } from 'svelte';
	import AddEntry from '$lib/components/AddEntry.svelte';
	import EntriesList from '$lib/components/EntriesList.svelte';
	import ReachOutList from '$lib/components/ReachOutList.svelte';

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

<AddEntry onAdd={handleAddEntry} />
<EntriesList entries={sortedEntries} />
<ReachOutList entries={sortedEntries} />
