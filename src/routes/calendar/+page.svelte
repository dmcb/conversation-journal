<script lang="ts">
	import { onMount } from 'svelte';
	import Calendar from '$lib/components/Calendar.svelte';
	import { addEntry, loadEntries, saveEntries } from '$lib/utils/entries';
	import type { Entry } from '$lib/utils/entries';

	let entries: Entry[] = [];

	function handleAddEntry(name: string, date?: string): boolean {
		const result = addEntry(entries, name, date);
		if (result.success) {
			entries = result.entries;
			if (saveEntries(entries)) {
				window.dispatchEvent(new CustomEvent('shiftColors'));
			}
		}
		return result.success;
	}

	onMount(() => {
		entries = loadEntries();
	});
</script>

<Calendar {entries} onAdd={handleAddEntry} />
