<script lang="ts">
	import { onMount } from 'svelte';
	import Calendar from '$lib/components/Calendar.svelte';
	import Streaks from '$lib/components/Streaks.svelte';
	import { loadEntries } from '$lib/utils/entries';
	import type { Entry } from '$lib/utils/entries';
	import { goto } from '$app/navigation';

	let entries: Entry[] = [];

	onMount(() => {
		entries = loadEntries();
		if (entries.length === 0) {
			goto('/');
		}
	});
</script>

<Calendar {entries} onSuccess={() => (entries = loadEntries())} />
<Streaks {entries} />
