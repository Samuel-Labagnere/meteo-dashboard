export const getLocation = async (place: string) => {
	const placeQueryReadable = place.replaceAll(' ', '+');
	const baseUrl = 'https://nominatim.openstreetmap.org/search';
	const url = `${baseUrl}?q=${placeQueryReadable}&polygon_geojson=1&format=json`;

	const query = await fetch(url);
	const response = await query.json();

	const geojson = response[0]?.geojson;

	if (geojson) {
		const correctedCoordinates = JSON.parse(
			JSON.stringify(geojson.coordinates).replaceAll(
				/\[([+-]?\d+\.\d+),([+-]?\d+\.\d+)\]/g,
				'[$2,$1]'
			) // Reverts values in their array to fit LatLngExpression
		);
		const result = {
			type: geojson.type,
			coordinates: correctedCoordinates
		};

		return result;
	}

	return response;
};
