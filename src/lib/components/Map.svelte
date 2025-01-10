<script>
	import { browser } from '$app/environment';

	let { tracks = [] } = $props();

	let mapElement = $state();
	let map = $state();
	let L = $state();
	let trackGroup;
	let heatLayer;

	async function initializeMap() {
		if (!browser || !mapElement) return;

		const leaflet = await import('leaflet');
		const leafletHeat = await import('leaflet.heat');
		await import('leaflet/dist/leaflet.css');

		L = leaflet.default;
		map = L.map(mapElement).setView([0, 0], 2);

		// Base layers
		const baseLayers = {
			OpenStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors'
			}),
			OpenTopoMap: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenTopoMap contributors'
			})
		};

		// Add default base layer
		baseLayers['OpenStreetMap'].addTo(map);

		// Initialize overlay layers
		trackGroup = L.featureGroup().addTo(map);

		heatLayer = L.heatLayer([], {
			radius: 15,
			blur: 20,
			maxZoom: 16,
			minOpacity: 0.3,
			max: 0.3,
			gradient: {
				0.2: 'rgba(0,0,255,0.4)',
				0.4: 'rgba(0,255,0,0.4)',
				0.6: 'rgba(255,255,0,0.4)',
				0.8: 'rgba(255,0,0,0.4)'
			}
		}).addTo(map);

		// Add layer controls with fixed pane
		const overlayLayers = {
			Tracks: trackGroup,
			Heatmap: heatLayer
		};

		L.control
			.layers(baseLayers, overlayLayers, {
				position: 'topright',
				collapsed: false // Keep the control always expanded
			})
			.addTo(map);

		// Update radius based on zoom level
		map.on('zoomend', () => {
			const currentZoom = map.getZoom();
			const newRadius = Math.max(5, 25 - currentZoom);
			if (map.hasLayer(heatLayer)) {
				// Only update if layer is visible
				heatLayer.setOptions({ radius: newRadius });
			}
		});

		// Add event handler for overlay changes
		map.on('overlayadd overlayremove', (e) => {
			if (e.type === 'overlayadd') {
				e.layer.bringToFront();
			}
		});
	}

	function renderTracks() {
		if (!map || !L) return;

		// Clear existing tracks
		trackGroup.clearLayers();

		const heatPoints = [];

		tracks.forEach((track) => {
			// Create track lines
			const trackLine = L.geoJSON(track, {
				style: {
					color: '#0066ff',
					weight: 2.5,
					opacity: 0.4,
					smoothFactor: 1.5
				}
			});

			trackGroup.addLayer(trackLine);

			// Add heat points
			track.geometry.coordinates.forEach((coord) => {
				heatPoints.push([coord[1], coord[0], 0.05]);
			});
		});

		if (heatLayer) {
			heatLayer.setLatLngs(heatPoints);
		}

		if (tracks.length > 0) {
			map.fitBounds(trackGroup.getBounds());
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
		transition: opacity 0.3s ease;
	}

	/* Fade in map when loaded */
	:global(.leaflet-container) {
		height: 100%;
		opacity: 0;
		animation: fadeIn 0.5s ease forwards;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
