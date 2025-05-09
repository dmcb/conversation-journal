<!-- Alert.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';

	export let message: string;
	export let type: 'success' | 'error' = 'success';
	export let duration = 3000;

	let visible = false;

	// Set visible to true on next tick to trigger fade in
	setTimeout(() => {
		visible = true;
	}, 0);

	// Hide after duration
	setTimeout(() => {
		visible = false;
	}, duration);
</script>

{#if visible}
	<div class="alert {type}" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }} role="alert">
		{message}
	</div>
{/if}

<style>
	.alert {
		position: fixed;
		top: var(--spacing);
		left: 50%;
		transform: translateX(-50%);
		padding: var(--spacing-small) var(--spacing);
		border-radius: var(--border-radius);
		font-weight: 500;
		z-index: 10000;
		box-shadow: var(--box-shadow-large);
	}

	.success {
		background-color: var(--brandcolor1);
		color: var(--color-inverse-text);
	}

	.error {
		background-color: var(--brandcolor2);
		color: var(--color-inverse-text);
	}
</style>
