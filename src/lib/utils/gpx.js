import { gpx } from '@tmcw/togeojson';

export async function processGpxFiles(files) {
	const tracks = [];

	for (const file of files) {
		try {
			const text = await file.text();
			const parser = new DOMParser();
			const gpxDoc = parser.parseFromString(text, 'text/xml');

			const geoJson = gpx(gpxDoc);

			// Extract tracks from the GeoJSON
			if (geoJson.features) {
				tracks.push(
					...geoJson.features.filter(
						(f) => f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString'
					)
				);
			}
		} catch (error) {
			console.error(`Error processing ${file.name}:`, error);
		}
	}

	return tracks;
}
