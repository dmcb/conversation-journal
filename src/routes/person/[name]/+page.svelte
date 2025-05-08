<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import Person from '$lib/components/Person.svelte';

	let name = decodeURIComponent(page.params.name || '');

	import type { Entry } from '$lib/utils/entries';

	let entries: Entry[] = [];

	onMount(() => {
		const storedEntries = localStorage.getItem('nameEntries');
		if (storedEntries) {
			entries = JSON.parse(storedEntries);
		}
	});
</script>

<Person {name} {entries} />
