<script lang="ts">
	import { onMount } from 'svelte';
	import Calendar from '$lib/components/Calendar.svelte';

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

<Calendar {entries} />
