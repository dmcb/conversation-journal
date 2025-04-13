<script lang="ts">
	export let onAdd: (name: string) => void;
	let name = '';

	function handleSubmit() {
		if (!name.trim()) return;
		onAdd(name);
		name = '';
	}
</script>

<section class="add-entry">
	<h2>Who have you talked to today?</h2>
	<form on:submit|preventDefault={handleSubmit} class="input-form">
		<input type="text" bind:value={name} placeholder="Enter a name" required />
		<button type="submit">Add Name</button>
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
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: #45a049;
	}
</style>
