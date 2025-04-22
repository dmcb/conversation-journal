<script lang="ts">
	import EntryForm from './EntryForm.svelte';

	export let onAdd: (name: string) => boolean;
</script>

<section class="add-entry">
	<h2>Who have you talked to today?</h2>
	<EntryForm {onAdd} />
</section>
