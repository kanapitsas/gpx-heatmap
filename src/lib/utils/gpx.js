import { gpx } from '@tmcw/togeojson';
import { simplifyTrack } from './simplify';

export async function processGpxFiles(files, progressCallback) {
	const tracks = [];
	let processed = 0;

	for (const file of files) {
		try {
			const text = await file.text();
			const parser = new DOMParser();
			const gpxDoc = parser.parseFromString(text, 'text/xml');

			const geoJson = gpx(gpxDoc);

			if (geoJson.features) {
				const simplifiedTracks = geoJson.features
					.filter((f) => f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString')
					.map((track) => simplifyTrack(track));
				tracks.push(...simplifiedTracks);
			}

			processed++;
			progressCallback((processed / files.length) * 100);
		} catch (error) {
			console.error(`Error processing ${file.name}:`, error);
		}
	}

	return tracks;
}
