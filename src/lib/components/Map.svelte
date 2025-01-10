<script>
	import { browser } from '$app/environment';

	let { tracks = [] } = $props();

	let mapElement = $state();
	let map = $state();
	let L = $state();
	let trackLayers = [];
	let heatLayer;

	async function initializeMap() {
		if (!browser || !mapElement) return;

		const leaflet = await import('leaflet');
		const leafletHeat = await import('leaflet.heat');
		await import('leaflet/dist/leaflet.css');

		L = leaflet.default;
		map = L.map(mapElement).setView([0, 0], 2);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors'
		}).addTo(map);

		// Adjusted heatmap settings
		heatLayer = L.heatLayer([], {
			radius: 15, // Smaller radius
			blur: 20, // More blur
			maxZoom: 16, // Higher maxZoom for better scale independence
			minOpacity: 0.3, // Minimum opacity
			max: 0.3, // Lower max value to reduce intensity
			gradient: {
				0.2: 'rgba(0,0,255,0.4)',
				0.4: 'rgba(0,255,0,0.4)',
				0.6: 'rgba(255,255,0,0.4)',
				0.8: 'rgba(255,0,0,0.4)'
			}
		}).addTo(map);

		// Update radius based on zoom level
		map.on('zoomend', () => {
			const currentZoom = map.getZoom();
			const newRadius = Math.max(5, 25 - currentZoom); // Adjust radius based on zoom
			heatLayer.setOptions({ radius: newRadius });
		});
	}

	function renderTracks() {
		if (!map || !L) return;

		// Clear existing layers
		trackLayers.forEach((layer) => layer.remove());
		trackLayers = [];

		const heatPoints = [];

		tracks.forEach((track) => {
			// Thicker, more visible track lines
			const trackLine = L.geoJSON(track, {
				style: {
					color: '#0066ff',
					weight: 2.5, // Increased line weight
					opacity: 0.4, // Slightly increased opacity
					smoothFactor: 1.5 // Smooths the line a bit
				}
			}).addTo(map);
			trackLayers.push(trackLine);

			// Reduced point intensity for heatmap
			track.geometry.coordinates.forEach((coord) => {
				heatPoints.push([coord[1], coord[0], 0.05]); // Reduced intensity per point
			});
		});

		if (heatLayer) {
			heatLayer.setLatLngs(heatPoints);
		}

		if (tracks.length > 0) {
			const bounds = L.featureGroup(trackLayers).getBounds();
			map.fitBounds(bounds);
		}
	}

	// Initialize map when element is available
	$effect(() => {
		if (mapElement) {
			initializeMap();
		}
	});

	// Update tracks when they change
	$effect(() => {
		if (map && L && tracks) {
			renderTracks();
		}
	});

	// Cleanup on destroy
	$effect(() => {
		return () => {
			if (map) {
				map.remove();
			}
		};
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
