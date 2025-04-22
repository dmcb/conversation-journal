<script lang="ts">
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { page } from '$app/state';
	import { onMount, onDestroy } from 'svelte';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children } = $props();

	const baseColors = ['#f9476c', '#756477', '#f95950', '#4b2245'];
	const offset = Math.floor(Math.random() * 4);
	// const offset = 0;
	const colors = baseColors.slice(offset).concat(baseColors.slice(0, offset));
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
	<section class="intro">
		<h1>
			Stay <div class="title"><span>Lo</span><span>op</span><span>ed</span><span>.</span></div>
		</h1>
		<p>
			A simple, habit-forming, daily journal to track your conversations and stay connected with the
			people who matter most.
		</p>
	</section>

	<nav>
		<a href="/" aria-current={page.url.pathname === '/'}>Entries</a>
		<a href="/calendar" aria-current={page.url.pathname === '/calendar'}>Calendar</a>
	</nav>

	{@render children()}
</main>

<style>
	:global(body) {
		background-color: #f5f5f5;
		margin: 0;
		padding: 0;
		font-family: 'DM Sans', sans-serif;
	}

	main {
		max-width: 600px;
		margin: 1rem auto;
		padding: 0 20px;
	}

	:global(section) {
		margin-top: 3rem;
	}

	:global(input, button) {
		font-family: 'DM Sans', sans-serif;
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
		font-family: 'Rammetto One', sans-serif;
		display: block;
		font-size: clamp(1rem, calc(20.5vw - 5px), 5.3rem);
		line-height: 1;
		color: #4b2245;
	}

	h1 .title span {
		transition: color 0.1s linear;
	}
	h1 .title span:nth-child(1) {
		color: var(--color1, #f9476c);
		transition: color 0.3s ease;
	}

	h1 .title span:nth-child(2) {
		color: var(--color2, #756477);
		transition: color 0.3s ease;
	}

	h1 .title span:nth-child(3) {
		color: var(--color3, #f95950);
		transition: color 0.3s ease;
	}

	h1 .title span:nth-child(4) {
		color: var(--color4, #4b2245);
		transition: color 0.3s ease;
	}

	p {
		line-height: 1.5;
		margin: 0 0 3rem 0;
		color: #444;
	}

	nav {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	nav a {
		text-decoration: none;
		color: #666;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		transition: all 0.2s ease;
	}

	nav a:hover {
		background-color: #eee;
	}

	nav a[aria-current='true'] {
		background-color: var(--color4, #4b2245);
		color: white;
	}
</style>
