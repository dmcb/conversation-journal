<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import EntryForm from '$lib/components/EntryForm.svelte';
	import EntriesList from '$lib/components/EntriesList.svelte';
	import ReachOutList from '$lib/components/ReachOutList.svelte';
	import { loadEntries } from '$lib/utils/entries';
	import { calculateDaysSinceToday } from '$lib/utils/dates';
	import type { Entry } from '$lib/utils/entries';

	let entries: Entry[] = [];

	onMount(() => {
		entries = loadEntries();
		if (entries.length === 0) {
			goto('/');
		}
	});

	$: sortedEntries = entries
		.map(
			(entry: Entry): Entry => ({
				name: entry.name,
				dates: entry.dates,
				days: calculateDaysSinceToday(entry.dates)
			})
		)
		.filter((entry) => entry.dates.length > 0)
		.sort((a, b) => (a.days ?? 0) - (b.days ?? 0));
</script>

<section class="add-entry">
	<h2>Who have you talked to today?</h2>
	<EntryForm onSuccess={() => (entries = loadEntries())} />
</section>

<EntriesList entries={sortedEntries} />
<ReachOutList entries={sortedEntries} />
