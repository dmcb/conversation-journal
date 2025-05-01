<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import EntryForm from '$lib/components/EntryForm.svelte';
	import { addEntry, saveEntries } from '$lib/utils/entries';

	let entries: { name: string; dates: string[] }[] = [];

	onMount(() => {
		const storedEntries = localStorage.getItem('nameEntries');
		if (storedEntries) {
			entries = JSON.parse(storedEntries);
			if (entries.length > 0) {
				goto('/entries');
			}
		}
	});

	function onAdd(name: string) {
		const result = addEntry(entries, name);
		if (result.success) {
			entries = result.entries;
			saveEntries(entries);
			goto('/entries');
		}
		return result.success;
	}
</script>

<section class="intro">
	<h1>
		Stay <div class="title"><span>Con</span><span>nec</span><span>ted</span><span>.</span></div>
	</h1>
	<p>
		Your simple, habit-forming, daily conversation journal to stay connected with the people who
		matter most.
	</p>
	<ul>
		<li><span>Get reminders</span></li>
		<li><span>See who matters</span></li>
		<li><span>Record memories</span></li>
	</ul>
</section>

<section class="first-entry">
	<h2>Make your first journal entry</h2>
	<EntryForm {onAdd} />
</section>

<style>
	h1 .title {
		font-size: clamp(1rem, calc(14vw), 3.5rem);
		display: block;
		transition: color var(--transition-speed) linear;
		font-family: var(--header-font-family);
		line-height: 1em;
		letter-spacing: -3px;
		color: var(--color4);
	}

	p {
		max-width: 400px;
	}
	/* 
	h1 span:nth-child(1) {
		color: var(--color1);
	}

	h1 span:nth-child(2) {
		color: var(--color2);
	}

	h1 span:nth-child(3) {
		color: var(--color3);
	}

	h1 span:nth-child(4) {
		color: var(--color4);
	} */

	ul {
		margin-top: var(--spacing-large);
		padding: 0;
		display: flex;
		gap: var(--spacing);
		justify-content: center;
	}

	li {
		border-radius: var(--border-radius);
		box-shadow: var(--box-shadow);
		padding: var(--spacing);
		background: var(--color-bright-background);
		list-style: none;
	}
	li span {
		font-weight: 800;
	}
</style>
