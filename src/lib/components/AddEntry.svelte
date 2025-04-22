<script lang="ts">
	import { browser } from '$app/environment';

	export let onAdd: (name: string) => boolean;
	let name = '';
	let suggestions: string[] = [];
	let showSuggestions = false;
	let existingNames: string[] = [];

	// Load existing names from storage
	function loadExistingNames() {
		if (browser) {
			const stored = localStorage.getItem('nameEntries');
			if (stored) {
				const entries = JSON.parse(stored);
				existingNames = entries.map((e: { name: string }) => e.name);
			}
		}
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
		const entryAdded = onAdd(name);
		if (entryAdded) {
			window.dispatchEvent(new CustomEvent('shiftColors'));
		}
		name = '';
		showSuggestions = false;
		loadExistingNames(); // Reload names after adding
	}

	// Initial load of existing names
	loadExistingNames();
</script>

<section class="add-entry">
	<h2>Who have you talked to today?</h2>
	<form on:submit|preventDefault={handleSubmit} class="input-form">
		<div class="input-container">
			<input
				type="text"
				bind:value={name}
				placeholder="Enter a name"
				required
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
</section>

<style>
	.input-form {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
	}

	.input-container {
		flex: 1;
		position: relative;
	}

	input {
		width: 100%;
		padding: 8px;
		font-size: 16px;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}

	.suggestions {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		border: 1px solid #ddd;
		border-radius: 0 0 4px 4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
		transition: background-color 0.2s;
		background-color: transparent;
		font-weight: bold;
		border: none;
		color: black;
		font-size: 1rem;
		text-align: left;
	}

	.suggestions button:hover,
	.suggestions button:focus {
		background-color: #f0f0f0;
		outline: none;
	}

	button {
		padding: 8px 16px;
		background-color: var(--color4, #4b2245);
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	button:hover {
		background-color: color-mix(in srgb, var(--color4, #4b2245) 80%, black);
	}
</style>
