<script lang="ts">
	import { onMount } from 'svelte';
	import AddEntry from '$lib/components/AddEntry.svelte';
	import EntriesList from '$lib/components/EntriesList.svelte';
	import ReachOutList from '$lib/components/ReachOutList.svelte';
	import { addEntry, loadEntries, saveEntries, calculateDays } from '$lib/utils/entries';
	import type { Entry } from '$lib/utils/entries';

	let entries: Entry[] = [];

	function handleAddEntry(name: string, date?: string): boolean {
		const result = addEntry(entries, name, date);
		if (result.success) {
			entries = result.entries;
			saveEntries(entries);
			// if (saveEntries(entries)) {
			// 	window.dispatchEvent(new CustomEvent('shiftColors'));
			// }
		}
		return result.success;
	}

	onMount(() => {
		entries = loadEntries();
	});

	$: sortedEntries = entries
		.map((entry) => ({
			...entry,
			days: calculateDays(entry.dates)
		}))
		.filter((entry) => entry.dates.length > 0)
		.sort((a, b) => (a.days ?? 0) - (b.days ?? 0));
</script>

<AddEntry onAdd={handleAddEntry} />
<EntriesList entries={sortedEntries} />
<ReachOutList entries={sortedEntries} />
