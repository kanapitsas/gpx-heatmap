<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let tracks = [];

	let mapElement;
	let map;
	let L;
	let trackLayers = [];
	let heatLayer;

	onMount(async () => {
		if (browser) {
			// Dynamically import Leaflet only on the client side
			L = (await import('leaflet')).default;
			await import('leaflet/dist/leaflet.css');

			// Initialize map
			map = L.map(mapElement).setView([0, 0], 2);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors'
			}).addTo(map);

			// Initialize empty heat layer
			heatLayer = L.layerGroup().addTo(map);

			// Initial render of tracks
			updateTracks();
		}
	});

	function updateTracks() {
		if (!map || !L) return;

		// Clear existing layers
		trackLayers.forEach((layer) => layer.remove());
		trackLayers = [];
		heatLayer.clearLayers();

		// Add new tracks
		tracks.forEach((track) => {
			// Add track line
			const trackLine = L.geoJSON(track, {
				style: {
					color: '#0066ff',
					weight: 2,
					opacity: 0.6
				}
			}).addTo(map);
			trackLayers.push(trackLine);

			// Add points to heat layer
			track.geometry.coordinates.forEach((coord) => {
				const circle = L.circle([coord[1], coord[0]], {
					radius: 100,
					color: '#ff0000',
					fillOpacity: 0.1,
					stroke: false
				}).addTo(heatLayer);
			});
		});

		// Fit bounds if we have tracks
		if (tracks.length > 0) {
			const bounds = L.featureGroup(trackLayers).getBounds();
			map.fitBounds(bounds);
		}
	}

	$: if (map && L && tracks) {
		updateTracks();
	}

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div class="map" bind:this={mapElement}></div>

<style>
	.map {
		width: 100%;
		height: 100%;
	}

	:global(.leaflet-container) {
		height: 100%;
	}
</style>
