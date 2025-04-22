<script lang="ts">
	export let onAdd: (name: string) => void;
	let name = '';

	function handleSubmit() {
		if (!name.trim()) return;
		onAdd(name);
		window.dispatchEvent(new CustomEvent('shiftColors'));
		name = '';
	}
</script>

<section class="add-entry">
	<h2>Who have you talked to today?</h2>
	<form on:submit|preventDefault={handleSubmit} class="input-form">
		<input type="text" bind:value={name} placeholder="Enter a name" required />
		<button type="submit">Add Entry</button>
	</form>
</section>

<style>
	.input-form {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
	}

	input {
		flex: 1;
		padding: 8px;
		font-size: 16px;
		border: 1px solid #ccc;
		border-radius: 4px;
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
