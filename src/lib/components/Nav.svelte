<script lang="ts">
	import { page } from '$app/state';
</script>

<nav>
	<span class="title">Conversation Journal</span>
	<div class="links">
		<a href="/entries" aria-current={page.url.pathname === '/entries'}>Entries</a>
		<a href="/calendar" aria-current={page.url.pathname === '/calendar'}>Calendar</a>
	</div>
</nav>

<style>
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
