<script lang="ts">
	import { onMount } from 'svelte';
	import HeatMap from '$lib/components/HeatMap.svelte';

	interface Entry {
		name: string;
		dates: string[];
		days?: number;
	}

	let entries: Entry[] = [];

	onMount(() => {
		const storedEntries = localStorage.getItem('nameEntries');
		if (storedEntries) {
			entries = JSON.parse(storedEntries);
		}
	});
</script>

<HeatMap {entries} />
