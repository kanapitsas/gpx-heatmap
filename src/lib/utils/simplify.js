// Using Ramer-Douglas-Peucker algorithm
function simplifyPoints(points, tolerance) {
	if (points.length <= 2) return points;

	const findPerpendicularDistance = (p, p1, p2) => {
		let A = p[0] - p1[0];
		let B = p[1] - p1[1];
		let C = p2[0] - p1[0];
		let D = p2[1] - p1[1];

		let dot = A * C + B * D;
		let len_sq = C * C + D * D;
		let param = dot / len_sq;

		let xx, yy;

		if (param < 0) {
			xx = p1[0];
			yy = p1[1];
		} else if (param > 1) {
			xx = p2[0];
			yy = p2[1];
		} else {
			xx = p1[0] + param * C;
			yy = p1[1] + param * D;
		}

		let dx = p[0] - xx;
		let dy = p[1] - yy;

		return Math.sqrt(dx * dx + dy * dy);
	};

	let maxDistance = 0;
	let index = 0;
	const end = points.length - 1;

	for (let i = 1; i < end; i++) {
		const distance = findPerpendicularDistance(points[i], points[0], points[end]);
		if (distance > maxDistance) {
			index = i;
			maxDistance = distance;
		}
	}

	if (maxDistance > tolerance) {
		const results1 = simplifyPoints(points.slice(0, index + 1), tolerance);
		const results2 = simplifyPoints(points.slice(index), tolerance);
		return [...results1.slice(0, -1), ...results2];
	} else {
		return [points[0], points[end]];
	}
}

export function simplifyTrack(track, tolerance = 0.0005) {
	const coordinates = track.geometry.coordinates;
	const simplified = simplifyPoints(coordinates, tolerance);
	return {
		...track,
		geometry: {
			...track.geometry,
			coordinates: simplified
		}
	};
}
