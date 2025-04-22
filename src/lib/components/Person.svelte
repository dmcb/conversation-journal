<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	export let name: string;
	export let entries: { name: string; dates: string[] }[] = [];
	let chats: string[] = [];
	let editing = false;
	let newName = name;

	$: {
		const person = entries.find((e) => e.name === name);
		chats = person
			? [...person.dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
			: [];
	}

	function startEdit() {
		editing = true;
		newName = name;
		// Make keyboard focus go on input
		setTimeout(() => {
			const input = document.querySelector('input') as HTMLInputElement;
			if (input) input.focus();
		});
	}

	function saveName() {
		if (!newName.trim() || newName === name) {
			editing = false;
			return;
		}
		const idx = entries.findIndex((e) => e.name === name);
		if (idx !== -1) {
			entries[idx].name = newName;
			if (browser) {
				try {
					localStorage.setItem('nameEntries', JSON.stringify(entries));
				} catch (error) {
					alert('Failed to save your entries');
				}
			}
			name = newName;
			goto(`/person/${encodeURIComponent(newName)}`);
			// After navigation, reload chats for the new name
			const person = entries.find((e) => e.name === newName);
			chats = person
				? [...person.dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
				: [];
		}
		editing = false;
	}

	function deleteChat(date: string) {
		const idx = entries.findIndex((e) => e.name === name);
		if (idx !== -1) {
			entries[idx].dates = entries[idx].dates.filter((d) => d !== date);
			if (browser) {
				try {
					localStorage.setItem('nameEntries', JSON.stringify(entries));
				} catch (error) {
					alert('Failed to save your entries');
				}
			}
			chats = [...entries[idx].dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
		}
	}
</script>

<section>
	{#if editing}
		<div class="edit-name">
			<input bind:value={newName} on:keydown={(e) => e.key === 'Enter' && saveName()} />
			<div class="buttons">
				<button on:click={saveName}>Save</button>
				<button
					on:click={() => {
						editing = false;
						newName = name;
					}}>Cancel</button
				>
			</div>
		</div>
	{:else}
		<h2>
			{name}
			<button on:click={startEdit}>Edit</button>
		</h2>
	{/if}

	<h3>Conversations</h3>
	<ul>
		{#each chats as date (date)}
			<li>{date} <button on:click={() => deleteChat(date)}>Delete</button></li>
		{/each}
	</ul>
	{#if chats.length === 0}
		<p>No entries found for this person.</p>
	{/if}
</section>

<style>
	section {
		padding: 2rem;
		background: #fff;
		border-radius: 1rem;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
	}

	h2 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5em;
		margin: 0;
	}

	.edit-name {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	input {
		max-width: 100%;
		flex-grow: 1;
		border: 0;
		font-size: 1.5rem;
		font-weight: bold;
		margin: 0;
		padding: 0;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.4em 0;
	}

	button {
		padding: 0.5rem 1rem;
		border-radius: 20px;
		transition: all 0.2s ease;
		background-color: var(--color4, #4b2245);
		color: white;
		border: 0;
		cursor: pointer;
	}

	button:hover {
		background-color: color-mix(in srgb, var(--color4, #4b2245) 80%, black);
	}
</style>
