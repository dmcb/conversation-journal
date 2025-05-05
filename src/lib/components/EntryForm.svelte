<script lang="ts">
	import { loadEntries } from '$lib/utils/entries';

	export let onAdd: (name: string) => boolean;
	let name = '';
	let suggestions: string[] = [];
	let showSuggestions = false;
	let existingNames: string[] = [];
	let inputElement: HTMLInputElement;
	let inputWidth = 0;

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

	$: if (inputElement) {
		inputWidth = inputElement.offsetWidth;
		const resizeObserver = new ResizeObserver(() => {
			if (inputElement?.offsetWidth) {
				inputWidth = inputElement.offsetWidth;
			}
		});
		resizeObserver.observe(inputElement);
	}

	$: if (inputWidth) {
		document.documentElement.style.setProperty('--suggestions-width', `${inputWidth}px`);
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="input-form">
	<div class="input-container">
		<input
			type="text"
			bind:value={name}
			bind:this={inputElement}
			placeholder="Enter a name"
			required
			maxlength="50"
			on:input={updateSuggestions}
			on:focus={() => (showSuggestions = true)}
			on:resize={() => (inputWidth = inputElement?.offsetWidth || 0)}
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
	<button class="action" type="submit">Add Entry</button>
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
		border-radius: var(--border-radius);
	}

	.suggestions {
		position: fixed;
		width: var(--suggestions-width);
		background: white;
		border: 1px solid var(--color-border);
		box-shadow: var(--box-shadow-small);
		margin: var(--spacing-small) 0 0 0;
		padding: 0;
		list-style: none;
		z-index: 10;
		display: flex;
		flex-direction: column;
		border-radius: var(--border-radius);
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
	}
</style>
