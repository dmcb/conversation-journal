<script lang="ts">
	import { alert } from '$lib/stores/alert';
	import { PUBLIC_FORMSPREE_ENDPOINT } from '$env/static/public';

	export let onSuccess: () => void;
	let email = '';
	let message = '';
	let submitting = false;

	async function handleSubmit() {
		submitting = true;

		try {
			const formspreeEndpoint = PUBLIC_FORMSPREE_ENDPOINT;
			const response = await fetch(formspreeEndpoint, {
				method: 'POST',
				body: JSON.stringify({ email, message }),
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			});

			if (response.ok) {
				alert.show('Thank you for your feedback!');
				onSuccess();
			} else {
				const data = await response.json();
				if (data.errors && Array.isArray(data.errors)) {
					alert.show(data.errors.map((error: any) => error.message).join(', '), 'error');
				} else {
					alert.show('Failed to submit feedback', 'error');
				}
			}
		} catch (error) {
			alert.show('Failed to submit feedback', 'error');
		} finally {
			submitting = false;
		}
	}
</script>

<h2>Share feedback</h2>

<form on:submit|preventDefault={handleSubmit}>
	<div class="form-group">
		<label for="email">Email</label>
		<input type="email" id="email" bind:value={email} required />
	</div>

	<div class="form-group">
		<label for="message">Message</label>
		<textarea id="message" bind:value={message} rows="4" required></textarea>
	</div>

	<button class="action" type="submit" disabled={submitting}>
		{#if submitting}
			Sending...
		{:else}
			Send
		{/if}
	</button>
</form>

<style>
	form {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.form-group {
		width: 100%;
	}
</style>
