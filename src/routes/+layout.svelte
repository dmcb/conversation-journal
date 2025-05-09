<script lang="ts">
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { page } from '$app/state';
	import Alert from '$lib/components/Alert.svelte';
	import { alert } from '$lib/stores/alert';
	import { onNavigate } from '$app/navigation';
	import Footer from '$lib/components/Footer.svelte';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<title>Daily Conversation Journal</title>
	<meta
		name="description"
		content="A simple, habit-forming, daily journal to track your conversations and stay connected with the people who matter most."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<main>
	{#if page.url.pathname !== '/'}
		<nav>
			<span class="title">Conversation Journal</span>
			<div class="links">
				<a href="/entries" aria-current={page.url.pathname === '/entries'}>Entries</a>
				<a href="/calendar" aria-current={page.url.pathname === '/calendar'}>Calendar</a>
			</div>
		</nav>
	{/if}

	{#if $alert}
		<Alert message={$alert.message} type={$alert.type} />
	{/if}

	{@render children()}

	<Footer />
</main>

<style>
	:root {
		/* Brand colors */
		--brandcolor1: #e81741;
		--brandcolor2: #77646f;

		/* Light theme colors */
		--color-text: #444;
		--color-inverse-text: #fff;
		--color-faint-text: #666;
		--color-header: #111;
		--color-border: #ddd;
		--color-background: #f5f5f5;
		--color-bright-background: #fff;
		--color-modal-backdrop: rgba(0, 0, 0, 0.3);
		--box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
		--box-shadow-small: 0 2px 4px rgba(0, 0, 0, 0.1);
		--box-shadow-large: 0 2px 32px rgba(0, 0, 0, 0.2);

		/* Font families and sizes */
		--header-font-family: 'Rammetto One', sans-serif;
		--body-font-family: 'DM Sans', sans-serif;
		--font-size: 1rem;
		--font-size-very-small: 0.8rem;
		--font-size-small: 0.875rem;
		--font-size-large: 1.5rem;

		/* Spacing and layout */
		--transition-speed: 0.3s;
		--border-radius: 8px;
		--border-radius-small: 4px;
		--border-radius-large: 16px;
		--main-width: 600px;
		--modal-width: 360px;
		--nav-width: 920px;
		--spacing-tiny: 0.2rem;
		--spacing-small: 0.5rem;
		--spacing: 1rem;
		--spacing-medium: 2rem;
		--spacing-large: 3rem;
	}
	/* Dark mode colors - applied via media query */
	@media (prefers-color-scheme: dark) {
		:root {
			--color-text: #e0e0e0;
			--color-inverse-text: #fff;
			--color-faint-text: #aaa;
			--color-header: #f5f5f5;
			--color-border: #444;
			--color-background: #222;
			--color-bright-background: #333;
			--color-modal-backdrop: rgba(0, 0, 0, 0.6);
			--box-shadow: 0 2px 16px rgba(0, 0, 0, 0.5);
			--box-shadow-small: 0 2px 4px rgba(0, 0, 0, 0.3);
			--box-shadow-large: 0 2px 32px rgba(0, 0, 0, 0.5);
		}
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		touch-action: manipulation;

		background-color: var(--color-background);
		margin: 0;
		padding: 0;
		font-family: var(--body-font-family);
		color: var(--color-text);
		transition:
			background-color var(--transition-speed),
			color var(--transition-speed);
	}

	:global(h1, h2, h3) {
		color: var(--color-header);
		font-weight: 500;
	}
	:global(section) {
		max-width: var(--main-width);
		margin: var(--spacing-large) auto;
	}

	:global(input, button) {
		font-family: var(--body-font-family);
		font-weight: 600;
	}

	:global(input, textarea) {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		font-family: inherit;
		font-size: inherit;
		background-color: var(--color-input-background);
		color: var(--color-text);
	}

	:global(textarea) {
		resize: vertical;
	}

	:global(label) {
		color: var(--color-header);
		font-weight: 500;
		font-size: var(--font-size);
		margin: var(--spacing) 0;
		display: block;
	}

	:global(button) {
		padding: 0.5rem 1rem;
		border-radius: var(--border-radius);
		transition: all var(--transition-speed);
		background-color: var(--color-border);
		color: var(--color-text);
		border: 0;
		cursor: pointer;
	}

	:global(button:hover:not(:disabled)) {
		background-color: var(--brandcolor1);
		color: var(--color-inverse-text);
	}

	:global(button.action) {
		background: var(--brandcolor1);
		color: white;
	}

	:global(button:disabled) {
		opacity: 0.7;
		cursor: not-allowed;
	}

	:global(button.action:hover) {
		background-color: color-mix(in srgb, var(--brandcolor1) 80%, black);
	}

	:global(button.secondary) {
		cursor: pointer;
		background-color: transparent;
		border: none;
		font-weight: bold;
		color: var(--brandcolor1);
		transition: all var(--transition-speed);
		display: block;
		padding: 0;
		font-size: var(--font-size-small);
	}

	:global(button.secondary:hover:not(:disabled)) {
		color: color-mix(in srgb, var(--brandcolor1) 80%, black);
		background-color: transparent;
	}

	main {
		max-width: var(--nav-width);
		margin: var(--spacing) auto;
		padding: 0 var(--spacing);
	}
	nav {
		border-bottom: 1px solid var(--color-border);
		padding-bottom: var(--spacing);
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin: var(--spacing) 0;
		align-items: center;
	}

	nav .title {
		font-family: var(--header-font-family);
		font-weight: normal;
		font-size: 1.2rem;
		line-height: 1em;
		color: var(--brandcolor1);
		transition: color var(--transition-speed) linear;
		letter-spacing: -0.5px;
	}

	nav .links {
		display: flex;
	}

	nav a {
		text-decoration: none;
		color: var(--color-text);
		padding: 0.4rem 0.8rem;
		border-radius: var(--border-radius);
		transition: all 0.2s ease;
	}

	nav a:hover {
		background-color: var(--brandcolor1);
		color: var(--color-inverse-text);
	}

	nav a[aria-current='true'] {
		background-color: var(--color-border);
		color: var(--color-text);
	}
</style>
