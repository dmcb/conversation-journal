<script lang="ts">
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children } = $props();
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

	{@render children()}
</main>

<style>
	:global(body) {
		background-color: #f5f5f5;
		margin: 0;
		padding: 0;
	}

	main {
		max-width: 600px;
		margin: 1rem auto;
		padding: 0 20px;
		font-family: 'DM Sans', sans-serif;
	}

	:global(section) {
		margin-top: 3rem;
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
		color: #a25b9f;
	}

	h1 .title span:nth-child(1) {
		color: var(--color1, #e68d5d);
		transition: color 0.3s ease;
	}

	:global(.initial-load) h1 .title span {
		transition: color 0.1s linear;
	}

	h1 .title span:nth-child(2) {
		color: var(--color2, #6bb55d);
		transition: color 0.3s ease;
	}

	h1 .title span:nth-child(3) {
		color: var(--color3, #399bc5);
		transition: color 0.3s ease;
	}

	h1 .title span:nth-child(4) {
		color: var(--color4, #a25b9f);
		transition: color 0.3s ease;
	}

	p {
		line-height: 1.5;
		margin: 0 0 3rem 0;
		color: #444;
	}
</style>
