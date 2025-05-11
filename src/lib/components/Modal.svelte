<script lang="ts">
	export let open = false;
	export let onClose: () => void;

	let modalBackdrop: HTMLDivElement;

	function handleBackdropClick(event: MouseEvent) {
		event.stopPropagation();
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
		<button class="util" on:click={onClose}>&times;</button>
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
		width: calc(100% - var(--spacing-medium));
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		transition:
			background-color var(--transition-speed),
			box-shadow var(--transition-speed);
	}

	.modal-content {
		overflow-y: scroll;
		overflow-x: hidden;
		padding: var(--spacing);
	}

	button.util {
		position: absolute;
		right: 0.25rem;
		top: 0.25rem;
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
		color: var(--brandcolor1);
	}
</style>
