<script lang="ts">
	import { loadEntries } from '$lib/utils/entries';

	export let onAdd: (name: string) => boolean;
	let name = '';
	let suggestions: string[] = [];
	let showSuggestions = false;
	let existingNames: string[] = [];

	// Load existing names from storage
	function loadExistingNames() {
		const entries = loadEntries();
		existingNames = entries.map((e) => e.name);
	}

	// Update suggestions based on input
	function updateSuggestions() {
		if (!name) {
			suggestions = [];
			return;
		}
		const input = name.toLowerCase();
		suggestions = existingNames
			.filter((n) => n.toLowerCase().startsWith(input) && n.toLowerCase() !== input)
			.slice(0, 5); // Limit to 5 suggestions
		showSuggestions = suggestions.length > 0;
	}

	function selectSuggestion(suggestion: string) {
		name = suggestion;
		showSuggestions = false;
		handleSubmit(); // Trigger form submission
	}

	function handleSubmit() {
		if (!name.trim()) return;
		onAdd(name);
		name = '';
		showSuggestions = false;
		loadExistingNames(); // Reload names after adding
	}

	// Initial load of existing names
	loadExistingNames();
</script>

<form on:submit|preventDefault={handleSubmit} class="input-form">
	<div class="input-container">
		<input
			type="text"
			bind:value={name}
			placeholder="Enter a name"
			required
			maxlength="50"
			on:input={updateSuggestions}
			on:focus={() => (showSuggestions = true)}
		/>
		{#if showSuggestions && suggestions.length > 0}
			<ul class="suggestions">
				{#each suggestions as suggestion}
					<button
						type="button"
						on:click={() => selectSuggestion(suggestion)}
						on:keydown={(e: KeyboardEvent) => e.key === 'Enter' && selectSuggestion(suggestion)}
					>
						{suggestion}
					</button>
				{/each}
			</ul>
		{/if}
	</div>
	<button type="submit">Add Entry</button>
</form>

<style>
	.input-form {
		display: flex;
		gap: 10px;
	}

	.input-container {
		flex: 1;
		position: relative;
	}

	input {
		width: 100%;
		padding: 8px;
		font-size: var(--font-size);
		border: 1px solid var(--color-border);
		box-sizing: border-box;
	}

	.suggestions {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		border: 1px solid var(--color-border);
		box-shadow: var(--box-shadow-small);
		margin: 0;
		padding: 0;
		list-style: none;
		z-index: 10;
		display: flex;
		flex-direction: column;
	}

	.suggestions button {
		padding: 8px;
		cursor: pointer;
		transition: background-color var(--transition-speed);
		background-color: transparent;
		font-weight: bold;
		border: none;
		color: var(--color-header);
		font-size: var(--font-size);
		text-align: left;
	}

	.suggestions button:hover,
	.suggestions button:focus {
		background-color: var(--color-background);
		outline: none;
	}

	button[type='submit'] {
		font-size: var(--font-size-small);
		padding: 8px 16px;
		background-color: var(--color4);
		color: white;
		border: none;
		cursor: pointer;
		transition: background-color var(--transition-speed);
	}

	button[type='submit']:hover {
		background-color: color-mix(in srgb, var(--color4) 80%, black);
	}
</style>
