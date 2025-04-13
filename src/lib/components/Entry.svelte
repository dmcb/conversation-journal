<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let name: string;
	let isEditing = false;
	let editedName = name;

	const dispatch = createEventDispatcher<{
		change: { newName: string };
		delete: { name: string };
	}>();

	function handleClick() {
		isEditing = true;
		editedName = name;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			finishEditing();
		} else if (event.key === 'Escape') {
			cancelEditing();
		}
	}

	function finishEditing() {
		if (editedName.trim() && editedName !== name) {
			dispatch('change', { newName: editedName.trim() });
		}
		isEditing = false;
	}

	function cancelEditing() {
		editedName = name;
		isEditing = false;
	}
</script>

<div class="entry-container">
	{#if isEditing}
		<input
			type="text"
			bind:value={editedName}
			on:keydown={handleKeyDown}
			on:blur={finishEditing}
			class="name-input"
			aria-label="Edit name"
		/>
	{:else}
		<button
			type="button"
			class="name-button"
			on:click={handleClick}
			on:keydown={(e) => e.key === 'Enter' && handleClick()}
			aria-label="Click to edit name"
		>
			{name}
		</button>
	{/if}
	<button
		type="button"
		class="delete-button"
		on:click={() => dispatch('delete', { name })}
		aria-label="Delete entry"
	>
		×
	</button>
</div>

<style>
	.entry-container {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.name-button {
		background: none;
		border: none;
		padding: 0;
		font-weight: bold;
		cursor: pointer;
		font-size: inherit;
		color: inherit;
	}

	.name-button:hover {
		text-decoration: underline;
	}

	.name-input {
		font-size: inherit;
		font-weight: bold;
		padding: 2px 4px;
		border: 1px solid #ccc;
		border-radius: 3px;
		width: 200px;
	}

	.delete-button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-size: 18px;
		line-height: 1;
		color: #999;
		opacity: 0;
		transition:
			opacity 0.2s,
			color 0.2s;
	}

	.entry-container:hover .delete-button {
		opacity: 1;
	}

	.delete-button:hover {
		color: #ff4444;
	}
</style>
