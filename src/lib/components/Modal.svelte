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
		background: rgba(0, 0, 0, 0.3);
		z-index: 1000;
	}

	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
		z-index: 1001;
		max-width: 350px;
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
		color: #888;
		position: absolute;
		top: 1rem;
		right: 1rem;
		margin: 0;
		padding: 0;
		line-height: 0;
		height: 2rem;
		width: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	.close-btn:hover {
		transform: scale(1.25);
	}

	.modal-content {
		overflow: scroll;
		padding: 1.5rem;
	}

	:global(.modal-content ul) {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	:global(.modal-content li) {
		padding: 0.5rem 0;
		border-bottom: 1px solid #eee;
	}

	:global(.modal-content li:last-child) {
		border-bottom: none;
	}

	:global(.modal-content p) {
		margin: 0 0 30px 0;
	}
	:global(.modal-content p:first-child) {
		font-weight: bold;
	}

	:global(.modal-content a) {
		color: #111;
		text-decoration: none;
		transition: color 0.2s;
	}

	:global(.modal-content a:hover) {
		color: var(--color4, #4b2245);
	}
</style>
