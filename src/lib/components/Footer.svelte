<script lang="ts">
	import Modal from './Modal.svelte';
	import ContactForm from './ContactForm.svelte';

	let contactModalOpen = false;

	function openContactModal() {
		contactModalOpen = true;
	}

	function closeContactModal() {
		contactModalOpen = false;
	}
</script>

<footer>
	<button class="secondary" on:click={openContactModal}>Share feedback</button>

	<Modal open={contactModalOpen} onClose={closeContactModal}>
		<ContactForm />
	</Modal>
</footer>

<style>
	footer {
		border-top: 1px solid var(--color-border);
		padding-top: var(--spacing-small);
		color: var(--color-faint-text);
		display: flex;
		justify-content: flex-end;
		font-size: var(--font-size-small);
	}
</style>
