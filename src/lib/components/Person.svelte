<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from './Modal.svelte';
	import { saveEntries, getNiceDateLabelFromDateString } from '$lib/utils/entries';

	export let name: string;
	interface DateEntry {
		[key: string]: {
			mood?: 'sad' | 'neutral' | 'good' | 'great' | null;
			note?: string;
		};
	}

	export let entries: { name: string; dates: DateEntry[] }[] = [];
	let chats: DateEntry[] = [];
	let displayChats: string[] = [];
	let editing = false;
	let newName = name;
	let deleteModalOpen = false;
	let chatToDelete: string | null = null;

	$: {
		const person = entries.find((e) => e.name === name);
		chats = person ? [...person.dates] : [];
		displayChats = chats
			.map((d) => Object.keys(d)[0])
			.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
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
				chats = person ? [...person.dates] : [];
				displayChats = chats
					.map((d) => Object.keys(d)[0])
					.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
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
			entries[idx].dates = entries[idx].dates.filter((d) => Object.keys(d)[0] !== chatToDelete);

			// If no more chats, remove the person entirely
			if (entries[idx].dates.length === 0) {
				entries = entries.filter((_, i) => i !== idx);
				userDeleted = true;
			}

			if (saveEntries(entries)) {
				if (userDeleted) {
					goto(`/`);
				} else {
					chats = [...entries[idx].dates];
					displayChats = chats
						.map((d) => Object.keys(d)[0])
						.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
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
				<button
					on:click={() => {
						editing = false;
						errorMessage = '';
						newName = name;
					}}>Cancel</button
				>
				<button class="action" on:click={saveName}>Save</button>
			</div>
		</div>
	{:else}
		<h2>
			{name}
			<button on:click={startEdit}>Edit</button>
		</h2>
	{/if}

	<h3>{chats.length} {chats.length === 1 ? 'conversation' : 'conversations'}</h3>
	<ul>
		{#each displayChats as date (date)}
			{@const chatData = chats.find((d) => Object.keys(d)[0] === date)?.[date]}
			<li>
				<div class="chat-info">
					<div class="date">
						{getNiceDateLabelFromDateString(date)}
						{#if chatData?.mood}
							<div class="mood">
								{#if chatData.mood === 'sad'}
									☹️
								{:else if chatData.mood === 'neutral'}
									😐
								{:else if chatData.mood === 'good'}
									🙂
								{:else if chatData.mood === 'great'}
									😊
								{/if}
							</div>
						{/if}
					</div>
					{#if chatData?.note}
						<div class="note">{chatData.note}</div>
					{/if}
				</div>
				<button on:click={() => confirmDelete(date)}>Delete</button>
			</li>
		{/each}
	</ul>
	{#if chats.length === 0}
		<p>No entries found for this person.</p>
	{/if}

	<Modal open={deleteModalOpen} onClose={handleDeleteCancel}>
		<p>Delete Chat</p>
		<p>
			Are you sure you want to delete the chat on {getNiceDateLabelFromDateString(
				chatToDelete ?? ''
			)}?
		</p>
		<p>This action cannot be undone.</p>
		<div class="modal-buttons">
			<button on:click={handleDeleteCancel}>Cancel</button>
			<button class="action" on:click={handleDeleteConfirm}>Delete</button>
		</div>
	</Modal>
</section>

<style>
	:global(.modal-buttons) {
		display: flex;
		gap: var(--spacing-small);
		justify-content: flex-end;
		margin-top: var(--spacing-medium);
	}

	section {
		padding: var(--spacing-medium);
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
		margin-top: var(--spacing-large);
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

	.buttons {
		display: flex;
		gap: var(--spacing-small);
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
		margin: 0;
		padding: 0;
		font-weight: 500;
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
		padding: var(--spacing-small) 0;
		border-bottom: 1px solid var(--color-border);
		gap: var(--spacing);
	}

	.chat-info {
		flex: 1;
	}

	.date {
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: var(--spacing-tiny);
	}

	.mood {
		line-height: 0;
	}

	.note {
		margin-top: var(--spacing-tiny);
		color: var(--color-faint-text);
		font-size: var(--font-size-small);
	}

	li:last-child {
		border-bottom: none;
	}
</style>
