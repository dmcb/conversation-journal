<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Person from '$lib/components/Person.svelte';

	// This would come from a store or API in a real app
	let allEntries: { name: string; dates: string[] }[] = [];
	let name = decodeURIComponent($page.params.name || '');

	onMount(() => {
		// Load allEntries from localStorage or API
		if (browser) {
			const stored = localStorage.getItem('nameEntries');
			if (stored) allEntries = JSON.parse(stored);
		}
	});
</script>

<Person {name} bind:allEntries />
