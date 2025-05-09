<script lang="ts">
	export let mood: 'sad' | 'neutral' | 'good' | 'great' | null = null;

	function toggleMood(selectedMood: 'sad' | 'neutral' | 'good' | 'great') {
		mood = mood === selectedMood ? null : selectedMood;
	}
</script>

<div class="mood-buttons">
	<button
		type="button"
		class:selected={mood === 'sad'}
		on:click={() => toggleMood('sad')}
	>
		☹️
	</button>
	<button
		type="button"
		class:selected={mood === 'neutral'}
		on:click={() => toggleMood('neutral')}
	>
		😐
	</button>
	<button
		type="button"
		class:selected={mood === 'good'}
		on:click={() => toggleMood('good')}
	>
		🙂
	</button>
	<button
		type="button"
		class:selected={mood === 'great'}
		on:click={() => toggleMood('great')}
	>
		😊
	</button>
</div>

<style>
	.mood-buttons {
		display: flex;
	}

	.mood-buttons button {
		font-size: 1.5rem;
		padding: 0 var(--spacing-tiny);
		border: 3px solid transparent;
		border-radius: var(--border-radius);
		background: transparent;
		cursor: pointer;
		transition: all var(--transition-speed);
	}

	.mood-buttons button:hover {
		background: var(--color-border);
	}

	.mood-buttons button.selected {
		border-color: var(--brandcolor1);
	}
</style>
