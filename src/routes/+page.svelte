<script>
	import Map from '$lib/components/Map.svelte';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import TrackCount from '$lib/components/TrackCount.svelte';
	import { processGpxFiles } from '$lib/utils/gpx';

	let tracks = $state([]);
	let progress = $state(0);
	let processing = $state(false);

	async function handleFiles(files) {
		processing = true;
		progress = 0;

		const newTracks = await processGpxFiles(files, (p) => {
			progress = p;
		});

		tracks = [...tracks, ...newTracks];
		processing = false;
	}

	function clearTracks() {
		tracks = [];
	}
</script>

<main>
	<div class="map-container">
		<Map {tracks} />
	</div>
	<div class="controls">
		<FileUpload onclick={handleFiles} />
		<TrackCount count={tracks.length} onclick={clearTracks} />
	</div>
	<ProgressBar {progress} show={processing} />
</main>

<style>
	main {
		width: 100%;
		height: 100vh;
		position: relative;
	}

	.map-container {
		width: 100%;
		height: 100%;
	}

	.controls {
		position: absolute;
		bottom: 20px;
		left: 20px;
		z-index: 1000;
		display: flex;
		gap: 10px;
	}
</style>
