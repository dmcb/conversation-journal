<script lang="ts">
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { page } from '$app/state';
	import { onMount, onDestroy } from 'svelte';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children } = $props();

	let baseColors: string[] = [];
	let colors: string[] = [];

	onMount(() => {
		const computedStyle = getComputedStyle(document.documentElement);
		baseColors = [
			computedStyle.getPropertyValue('--color1').trim(),
			computedStyle.getPropertyValue('--color2').trim(),
			computedStyle.getPropertyValue('--color3').trim(),
			computedStyle.getPropertyValue('--color4').trim()
		];
		const offset = Math.floor(Math.random() * 4);
		colors = baseColors.slice(offset).concat(baseColors.slice(0, offset));
	});
	let cycleInterval: number;

	function shiftColors() {
		const lastColor = colors.pop();
		if (lastColor) {
			colors.unshift(lastColor);
			document.documentElement.style.setProperty('--color1', colors[0]);
			document.documentElement.style.setProperty('--color2', colors[1]);
			document.documentElement.style.setProperty('--color3', colors[2]);
			document.documentElement.style.setProperty('--color4', colors[3]);
		}
	}

	function initialColorCycle() {
		let cycles = 0;
		const maxCycles = 4;
		let interval = 200; // Start fast

		function cycle() {
			shiftColors();

			cycles++;
			if (cycles < maxCycles) {
				// Gradually increase the interval to slow down
				interval *= 1.2;
				cycleInterval = window.setTimeout(cycle, interval);
			}
		}

		cycle();
	}

	const handler = () => shiftColors();

	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('shiftColors', handler);
		}
		initialColorCycle();
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('shiftColors', handler);
		}
		if (cycleInterval) {
			clearTimeout(cycleInterval);
		}
	});
</script>

<svelte:head>
	<title>Stay Looped — Daily Conversation Journal</title>
	<meta
		name="description"
		content="A simple, habit-forming, daily journal to track your conversations and stay connected with the people who matter most."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<main>
	<!-- <nav class="primary">
		<a href="/signin">Sign in</a>
		<a href="/register">Register</a>
	</nav> -->

	<section class="intro">
		<h1>
			Stay <div class="title"><span>Lo</span><span>op</span><span>ed</span><span>.</span></div>
		</h1>
		<p>
			A simple, habit-forming, daily journal to track your conversations and stay connected with the
			people who matter most.
		</p>
	</section>

	<nav class="secondary">
		<a href="/" aria-current={page.url.pathname === '/'}>Entries</a>
		<a href="/calendar" aria-current={page.url.pathname === '/calendar'}>Calendar</a>
	</nav>

	{@render children()}
</main>

<style>
	:root {
		--color1: #ea3b5e;
		--color2: #77646f;
		--color3: #b2384f;
		--color4: #4b2230;
		--color-text: #444;
		--color-inverse-text: #fff;
		--color-faint-text: #666;
		--color-header: #111;
		--color-border: #ddd;
		--color-background: #f5f5f5;
		--color-bright-background: #fff;
		--color-modal-backdrop: rgba(0, 0, 0, 0.3);
		--header-font-family: 'Rammetto One', sans-serif;
		--body-font-family: 'DM Sans', sans-serif;
		--transition-speed: 0.3s;
		--box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
		--box-shadow-small: 0 2px 4px rgba(0, 0, 0, 0.1);
		--box-shadow-large: 0 2px 32px rgba(0, 0, 0, 0.2);
		--border-radius: 8px;
		--border-radius-small: 4px;
		--border-radius-large: 16px;
		--font-size: 1rem;
		--font-size-very-small: 0.8rem;
		--font-size-small: 0.875rem;
		--font-size-large: 1.5rem;
		--main-width: 600px;
		--modal-width: 350px;
		--spacing-small: 0.5rem;
		--spacing: 1rem;
		--spacing-medium: 2rem;
		--spacing-large: 3rem;
	}
	:global(body) {
		background-color: var(--color-background);
		margin: 0;
		padding: 0;
		font-family: var(--body-font-family);
		color: var(--color-text);
	}

	:global(h1, h2, h3) {
		color: var(--color-header);
		font-weight: 500;
	}
	:global(section) {
		margin-top: var(--spacing-large);
	}

	:global(input, button) {
		font-family: var(--body-font-family);
		font-weight: 600;
	}

	main {
		max-width: var(--main-width);
		margin: var(--spacing) auto;
		padding: 0 var(--spacing);
	}

	.intro {
		max-width: 400px;
		margin: 0 auto;
	}

	h1 {
		text-transform: lowercase;
		margin: 0 0 0.25em 0;
		font-weight: normal;
	}

	h1 .title {
		font-family: var(--header-font-family);
		display: block;
		font-size: clamp(1rem, calc(20.5vw - 5px), 5.3rem);
		line-height: 1;
		color: var(--color-header);
	}

	h1 .title span {
		transition: color var(--transition-speed) linear;
	}
	h1 .title span:nth-child(1) {
		color: var(--color1);
	}

	h1 .title span:nth-child(2) {
		color: var(--color2);
	}

	h1 .title span:nth-child(3) {
		color: var(--color3);
	}

	h1 .title span:nth-child(4) {
		color: var(--color4);
	}

	p {
		line-height: 1.5;
		margin: 0;
		color: var(--color-text);
	}
	nav.secondary {
		border-top: 1px solid var(--color-border);
		padding-top: var(--spacing-medium);
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin: var(--spacing-medium) 0 0 0;
	}

	nav.secondary a {
		text-decoration: none;
		color: var(--color-text);
		padding: 0.4rem 0.8rem;
		border-radius: var(--border-radius);
		transition: all 0.2s ease;
	}

	nav a:hover {
		background-color: var(--color4);
		color: var(--color-inverse-text);
	}

	nav a[aria-current='true'] {
		background-color: var(--color-border);
		color: var(--color-text);
	}
</style>
