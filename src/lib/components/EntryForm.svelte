<script lang="ts">
	import { loadEntries, addEntry, saveEntries } from '$lib/utils/entries';
	import { alert } from '$lib/stores/alert';
	import MoodPicker from './MoodPicker.svelte';

	export let date: string | undefined = undefined;
	export let onSuccess: (() => void) | undefined = undefined;

	let name = '';
	let note = '';
	let mood: 'sad' | 'neutral' | 'good' | 'great' | null = null;
	let step = 1;
	let suggestions: string[] = [];
	let showSuggestions = false;
	let existingNames: string[] = [];
	let nameInputElement: HTMLInputElement;
	let noteInputElement: HTMLInputElement;
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
		handleNameSubmit(); // Trigger form submission
	}

	function handleNameSubmit() {
		if (!name.trim()) return;
		step = 2;
		showSuggestions = false;
	}

	function handleMetaSubmit() {
		let entries = loadEntries();
		const result = addEntry(entries, name, date, mood, note.trim() || undefined);
		if (result.success) {
			saveEntries(result.entries);
			alert.show(`Entry saved for ${name}`);
			// Reset form
			name = '';
			note = '';
			mood = null;
			step = 1;
			loadExistingNames(); // Reload names after adding

			if (onSuccess) {
				onSuccess();
			}
		} else {
			alert.show('Failed to save entry', 'error');
		}
	}

	// Initial load of existing names
	loadExistingNames();

	$: if (nameInputElement) {
		inputWidth = nameInputElement.offsetWidth;
		const resizeObserver = new ResizeObserver(() => {
			if (nameInputElement?.offsetWidth) {
				inputWidth = nameInputElement.offsetWidth;
			}
		});
		resizeObserver.observe(nameInputElement);
	}

	$: if (step === 2 && noteInputElement) {
		noteInputElement.focus();
	}

	$: if (inputWidth) {
		document.documentElement.style.setProperty('--suggestions-width', `${inputWidth}px`);
	}
</script>

{#if step === 1}
	<form on:submit|preventDefault={handleNameSubmit} class="input-form">
		<div class="input-container">
			<input
				type="text"
				bind:value={name}
				bind:this={nameInputElement}
				placeholder="Enter a name"
				required
				maxlength="50"
				on:input={updateSuggestions}
				on:focus={() => (showSuggestions = true)}
				on:resize={() => (inputWidth = nameInputElement?.offsetWidth || 0)}
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
{:else}
	<form on:submit|preventDefault={handleMetaSubmit} class="input-form">
		<div class="input-container">
			<input
				type="text"
				bind:value={note}
				bind:this={noteInputElement}
				placeholder="Add an optional note"
			/>
			<MoodPicker bind:mood />
			<button class="action" type="submit">Done</button>
		</div>
	</form>
{/if}

<style>
	input {
		min-width: 11.5rem;
	}

	.input-form {
		display: flex;
		gap: 10px;
	}

	.input-container {
		flex: 1;
		position: relative;
		display: flex;
		gap: var(--spacing-small);
		flex-wrap: wrap;
		justify-content: space-between;
	}



	input {
		width: 100%;
		padding: 8px;
		font-size: var(--font-size);
		border: 1px solid var(--color-border);
		box-sizing: border-box;
		border-radius: var(--border-radius);
		background: var(--color-bright-background);
		color: var(--color-text);
	}

	.suggestions {
		position: fixed;
		width: var(--suggestions-width);
		background: var(--color-bright-background);
		border: 1px solid var(--color-border);
		box-shadow: var(--box-shadow-small);
		margin: 3rem 0 0 0;
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
