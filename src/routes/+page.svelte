<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import EntryForm from '$lib/components/EntryForm.svelte';

	let entries: { name: string; dates: string[] }[] = [];
	let loading = true;

	onMount(() => {
		const storedEntries = localStorage.getItem('nameEntries');
		if (storedEntries) {
			entries = JSON.parse(storedEntries);
			if (entries.length > 0) {
				goto('/entries');
			}
		}
		loading = false;
	});
</script>

{#if !loading && !entries.length}
	<section class="intro">
		<h1>
			Stay <div class="title"><span>Con</span><span>nec</span><span>ted</span><span>.</span></div>
		</h1>
		<p>
			Your simple, habit-forming, daily conversation journal to stay connected with the people who
			matter most.
		</p>
	</section>

	<section class="first-entry">
		<h2>
			Make your first entry <svg
				class="curved-arrow"
				viewBox="0 0 100 100"
				fill="none"
				stroke="currentColor"
				stroke-width="12"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M20 30 C 20 30, 50 30, 50 70" />
				<path d="M40 60 L 50 70 L 60 60" />
			</svg>
		</h2>
		<EntryForm onSuccess={() => goto('/entries')} />
	</section>

	<section class="features">
		<ul>
			<li>
				<svg
					class="icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M12 20h9" />
					<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
				</svg>
				<div class="text">
					<span>Record memories</span>
					<p>Quickly log chats to your journal</p>
				</div>
			</li>
			<li>
				<svg
					class="icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
					<line x1="16" y1="2" x2="16" y2="6" />
					<line x1="8" y1="2" x2="8" y2="6" />
					<line x1="3" y1="10" x2="21" y2="10" />
				</svg>
				<div class="text">
					<span>See who matters</span>
					<p>Get visuals on who you talk to and when</p>
				</div>
			</li>
			<li>
				<svg
					class="icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
					<path d="M13.73 21a2 2 0 0 1-3.46 0" />
				</svg>
				<div class="text">
					<span>Get reminders</span>
					<p>Get notified when it's time to reconnect</p>
				</div>
			</li>
		</ul>
	</section>
{/if}

<style>
	h1 {
		margin-top: 0;
	}
	h1 .title {
		font-size: clamp(1rem, calc(14vw), 3.5rem);
		display: block;
		transition: color var(--transition-speed) linear;
		font-family: var(--header-font-family);
		line-height: 1em;
		letter-spacing: -3px;
		color: var(--brandcolor1);
	}

	p {
		max-width: 400px;
	}

	ul {
		margin-top: var(--spacing-large);
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing);
		justify-content: center;
	}

	li {
		width: 100%;
		border-radius: var(--border-radius);
		box-shadow: var(--box-shadow);
		padding: var(--spacing);
		background: var(--color-bright-background);
		list-style: none;
		display: flex;
		gap: var(--spacing);
		align-items: center;
		text-align: center;
	}

	li .icon {
		width: 2.5rem;
		height: 2.5rem;
		color: var(--brandcolor1);
	}

	li .text {
		display: flex;
		flex-direction: column;
		text-align: left;
	}

	li span {
		font-weight: 800;
	}

	li p {
		margin-bottom: 0;
	}

	.first-entry h2 {
		display: flex;
		align-items: center;
		margin-bottom: 0;
	}
	.curved-arrow {
		width: 3rem;
		height: 4rem;
		color: var(--brandcolor1);
		transform: translateY(var(--spacing-small));
	}

	@media (min-width: 632px) {
		ul {
			flex-wrap: nowrap;
		}

		li {
			gap: 0;
			width: 33%;
			flex-direction: column;
		}

		li .icon {
			margin-bottom: var(--spacing);
		}

		li .text {
			text-align: center;
		}
	}
</style>
