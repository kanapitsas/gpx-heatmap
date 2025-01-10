<script>
	import Map from '$lib/components/Map.svelte';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import { processGpxFiles } from '$lib/utils/gpx';

	let tracks = [];
	let map; // Reference to Map component

	async function handleFiles(files) {
		const newTracks = await processGpxFiles(files);
		tracks = [...tracks, ...newTracks];
	}

	function handleClear() {
		tracks = [];
	}
</script>

<main>
	<div class="controls">
		<FileUpload on:files={(e) => handleFiles(e.detail)} />
		<button on:click={handleClear}>Clear All</button>
		<p>{tracks.length} tracks loaded</p>
	</div>

	<div class="map-container">
		<Map bind:this={map} {tracks} />
	</div>
</main>

<style>
	main {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.controls {
		padding: 1rem;
	}

	.map-container {
		flex: 1;
		min-height: 0;
	}
</style>
