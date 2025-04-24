<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from './Modal.svelte';
	import { saveEntries } from '$lib/utils/entries';

	export let name: string;
	export let entries: { name: string; dates: string[] }[] = [];
	let chats: string[] = [];
	let editing = false;
	let newName = name;
	let deleteModalOpen = false;
	let chatToDelete: string | null = null;

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

	let errorMessage = '';

	function saveName() {
		// Reset error message
		errorMessage = '';

		// Check for empty or unchanged name
		if (!newName.trim() || newName === name) {
			editing = false;
			return;
		}

		// Check if name already exists
		const nameExists = entries.some(
			(e) =>
				e.name.toLowerCase() === newName.toLowerCase() &&
				e.name.toLowerCase() !== name.toLowerCase()
		);
		if (nameExists) {
			errorMessage = 'This name already exists';
			return;
		}

		// Update the name if everything is valid
		const idx = entries.findIndex((e) => e.name === name);
		if (idx !== -1) {
			entries[idx].name = newName;
			if (saveEntries(entries)) {
				name = newName;
				goto(`/person/${encodeURIComponent(newName)}`);
				// After navigation, reload chats for the new name
				const person = entries.find((e) => e.name === newName);
				chats = person
					? [...person.dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
					: [];
			}
		}
		editing = false;
	}

	function confirmDelete(date: string) {
		chatToDelete = date;
		deleteModalOpen = true;
	}

	function handleDeleteConfirm() {
		if (!chatToDelete) return;
		let userDeleted = false;

		const idx = entries.findIndex((e) => e.name === name);
		if (idx !== -1) {
			entries[idx].dates = entries[idx].dates.filter((d) => d !== chatToDelete);

			// If no more chats, remove the person entirely
			if (entries[idx].dates.length === 0) {
				entries = entries.filter((_, i) => i !== idx);
				userDeleted = true;
			}

			if (saveEntries(entries)) {
				if (userDeleted) {
					goto(`/`);
				} else {
					chats = [...entries[idx].dates].sort(
						(a, b) => new Date(b).getTime() - new Date(a).getTime()
					);
				}
			}
		}

		deleteModalOpen = false;
		chatToDelete = null;
	}

	function handleDeleteCancel() {
		deleteModalOpen = false;
		chatToDelete = null;
	}
</script>

<section>
	{#if editing}
		<div class="edit-name">
			<div class="input-wrapper">
				<input
					maxlength="50"
					bind:value={newName}
					on:keydown={(e) => e.key === 'Enter' && saveName()}
				/>
				{#if errorMessage}
					<div class="error-message">{errorMessage}</div>
				{/if}
			</div>
			<div class="buttons">
				<button on:click={saveName}>Save</button>
				<button
					on:click={() => {
						editing = false;
						errorMessage = '';
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
			<li>{date} <button on:click={() => confirmDelete(date)}>Delete</button></li>
		{/each}
	</ul>
	{#if chats.length === 0}
		<p>No entries found for this person.</p>
	{/if}

	<Modal open={deleteModalOpen} onClose={handleDeleteCancel}>
		<p>Delete Chat</p>
		<p>Are you sure you want to delete the chat on {chatToDelete}?</p>
		<p>This action cannot be undone.</p>
		<div class="modal-buttons">
			<button class="secondary" on:click={handleDeleteCancel}>Cancel</button>
			<button class="danger" on:click={handleDeleteConfirm}>Delete</button>
		</div>
	</Modal>
</section>

<style>
	:global(.modal-buttons) {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 2rem;
	}

	:global(.modal-buttons .secondary) {
		background: var(--color-border);
		color: var(--color-text);
	}

	:global(.modal-buttons .secondary:hover) {
		color: white;
	}

	:global(.modal-buttons .danger) {
		background: var(--color4);
		color: white;
	}
	section {
		padding: 2rem;
		background: white;
		border-radius: 1rem;
		box-shadow: var(--box-shadow);
	}

	h2 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5em;
		margin: 0;
	}

	h3 {
		margin-top: 3rem;
	}

	.edit-name {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.input-wrapper {
		flex-grow: 1;
	}

	.error-message {
		color: var(--color-faint-text);
		font-size: var(--font-size-small);
		margin-top: 0.25rem;
	}

	input {
		max-width: 100%;
		flex-grow: 1;
		border: 0;
		font-size: var(--font-size-large);
		font-weight: bold;
		margin: 0;
		padding: 0;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 0;
		border-bottom: 1px solid var(--color-border);
	}

	li:last-child {
		border-bottom: none;
	}

	button {
		padding: 0.5rem 1rem;
		border-radius: var(--border-radius);
		transition: all var(--transition-speed);
		background-color: var(--color-border);
		color: var(--color-text);
		border: 0;
		cursor: pointer;
	}

	button:hover {
		background-color: var(--color4);
		color: var(--color-inverse-text);
	}
</style>
