<script lang="ts">
	export let open = false;
	export let onClose: () => void;

	let modalBackdrop: HTMLDivElement;

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
			onClose();
		}
	}

	$: if (open && modalBackdrop) {
		modalBackdrop.focus();
	}
</script>

{#if open}
	<div
		class="modal-backdrop"
		bind:this={modalBackdrop}
		tabindex="0"
		role="button"
		aria-label="Close modal"
		on:click={handleBackdropClick}
		on:keydown={handleKeydown}
	></div>
	<div class="modal">
		<button class="close-btn" on:click={onClose}>&times;</button>
		<div class="modal-content" role="dialog" aria-modal="true">
			<slot />
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: var(--color-modal-backdrop);
		z-index: 1000;
	}

	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: var(--color-bright-background);
		border-radius: var(--border-radius);
		box-shadow: var(--box-shadow);
		z-index: 1001;
		max-width: var(--modal-width);
		width: 90vw;
		box-sizing: border-box;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		color: var(--color-faint-text);
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		margin: 0;
		padding: 0;
		line-height: 0;
		height: 2rem;
		width: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all var(--transition-speed);
		border-radius: 100%;
	}

	.close-btn:hover {
		background-color: var(--color-border);
	}

	.modal-content {
		overflow-y: scroll;
		overflow-x: hidden;
		padding: var(--spacing);
	}

	:global(.modal-content ul) {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	:global(.modal-content li) {
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	:global(.modal-content li:last-child) {
		border-bottom: none;
	}
	:global(.modal-content > :first-child) {
		margin: 0 0 var(--spacing-medium) 0;
	}

	:global(.modal-content a) {
		color: var(--color-header);
		text-decoration: none;
		transition: color var(--transition-speed);
	}

	:global(.modal-content a:hover) {
		color: var(--color4);
	}
</style>
