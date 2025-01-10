<script>
	import Map from '$lib/components/Map.svelte';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { processGpxFiles } from '$lib/utils/gpx';

	let tracks = $state([]);
	let map;
	let progress = $state(0);
	let processing = $state(false);

	async function handleFiles(files) {
		processing = true;
		progress = 0;

		const newTracks = await processGpxFiles(files.detail, (p) => {
			progress = p;
		});

		tracks = [...tracks, ...newTracks];
		processing = false;
	}

	function handleClear() {
		tracks = [];
	}
</script>

<main>
	<div class="controls">
		<FileUpload on:files={handleFiles} />
		<button onclick={handleClear}>Clear All</button>
		<p>{tracks.length} tracks loaded</p>
		<ProgressBar {progress} show={processing} />
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
