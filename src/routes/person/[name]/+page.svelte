<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	// Simulate data source (replace with real store or API)
	export let data;
	let name = decodeURIComponent($page.params.name || '');
	let chats: string[] = [];
	let editing = false;
	let newName = name;

	// This would come from a store or API in a real app
	let allEntries: { name: string; dates: string[] }[] = [];

	onMount(() => {
		// Load allEntries from localStorage or API
		if (browser) {
			const stored = localStorage.getItem('nameEntries');
			if (stored) allEntries = JSON.parse(stored);
		}
		const person = allEntries.find((e) => e.name === name);
		chats = person
			? [...person.dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
			: [];
	});

	function startEdit() {
		editing = true;
		newName = name;
	}

	function saveName() {
		if (!newName.trim() || newName === name) {
			editing = false;
			return;
		}
		const idx = allEntries.findIndex((e) => e.name === name);
		if (idx !== -1) {
			allEntries[idx].name = newName;
			if (browser) localStorage.setItem('nameEntries', JSON.stringify(allEntries));
			name = newName;
			goto(`/person/${encodeURIComponent(newName)}`);
			// After navigation, reload chats for the new name
			const person = allEntries.find((e) => e.name === newName);
			chats = person
				? [...person.dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
				: [];
		}
		editing = false;
	}

	function deleteChat(date: string) {
		const idx = allEntries.findIndex((e) => e.name === name);
		if (idx !== -1) {
			allEntries[idx].dates = allEntries[idx].dates.filter((d) => d !== date);
			if (browser) localStorage.setItem('nameEntries', JSON.stringify(allEntries));
			chats = [...allEntries[idx].dates].sort(
				(a, b) => new Date(b).getTime() - new Date(a).getTime()
			);
		}
	}
</script>

<section class="person-page">
	{#if editing}
		<input bind:value={newName} on:keydown={(e) => e.key === 'Enter' && saveName()} />
		<button on:click={saveName}>Save</button>
		<button
			on:click={() => {
				editing = false;
				newName = name;
			}}>Cancel</button
		>
	{:else}
		<h2>{name} <button on:click={startEdit}>Edit</button></h2>
	{/if}

	<h3>Chats</h3>
	<ul>
		{#each chats as date (date)}
			<li>{date} <button on:click={() => deleteChat(date)}>Delete</button></li>
		{/each}
	</ul>
	{#if chats.length === 0}
		<p>No chats found for this person.</p>
	{/if}
</section>

<style>
	.person-page {
		max-width: 500px;
		margin: 2rem auto;
		padding: 2rem;
		background: #fff;
		border-radius: 1rem;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
	}
	.person-page h2 {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}
	.person-page input {
		font-size: 1.1em;
		padding: 0.3em;
		margin-right: 0.5em;
	}
	.person-page ul {
		list-style: none;
		padding: 0;
	}
	.person-page li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.4em 0;
	}
	.person-page button {
		margin-left: 0.5em;
	}
</style>
