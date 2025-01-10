<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function handleChange(event) {
		const files = Array.from(event.target.files);
		if (files.length > 0) {
			dispatch('files', files);
			event.target.value = ''; // Reset input
		}
	}
</script>

<div class="upload">
	<input type="file" accept=".gpx" multiple on:change={handleChange} />
</div>

<style>
	.upload {
		display: inline-block;
	}
</style>
