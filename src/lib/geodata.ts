import { type LatLngExpression } from 'leaflet';
import { fetchWeatherApi } from 'openmeteo';
import { weather } from '$lib/store';

type GeoData = {
	type: string;
	coordinates: LatLngExpression & LatLngExpression[] & LatLngExpression[][];
};

export const getLocation = async (place: string) => {
	const placeQueryReadable = place.replaceAll(' ', '+');
	const osmBaseUrl = 'https://nominatim.openstreetmap.org/search';
	const osmUrl = `${osmBaseUrl}?q=${placeQueryReadable}&polygon_geojson=1&format=json`;

	const query = await fetch(osmUrl);
	const response = await query.json();

	const geojson = response[0]?.geojson;

	let geoData: GeoData;

	if (geojson) {
		const correctedCoordinates = JSON.parse(
			JSON.stringify(geojson.coordinates).replaceAll(
				/\[([+-]?\d+\.\d+),([+-]?\d+\.\d+)\]/g,
				'[$2,$1]'
			) // Reverts values in their array to fit LatLngExpression
		);
		geoData = {
			type: geojson.type,
			coordinates: correctedCoordinates
		};
	} else {
		const coordinates = JSON.parse(JSON.stringify([response[0].lat, response[0].lon]));
		geoData = {
			type: 'Point',
			coordinates
		};
	}

	const weatherData = await getWeather([response[0].lat, response[0].lon]);
	weather.set(weatherData);

	return geoData;
};

// export const getLocations = async (search: string) => {
// 	const placeQueryReadable = search.replaceAll(' ', '+');
// 	const osmBaseUrl = 'https://nominatim.openstreetmap.org/search';
// 	const osmUrl = `${osmBaseUrl}?q=${placeQueryReadable}&limit=5&format=json`;

// 	const query = await fetch(osmUrl);
// 	const response = await query.json();

// 	return response;
// };

const getWeather = async (coordinates: any) => {
	const currentDate = new Date().toISOString().slice(0, 10);
	const params = {
		latitude: coordinates[0],
		longitude: coordinates[1],
		hourly: 'temperature_2m',
		forecast_days: 2
	};
	const url = 'https://api.open-meteo.com/v1/forecast';
	const responses = await fetchWeatherApi(url, params);

	const range = (start: number, stop: number, step: number) =>
		Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

	const response = responses[0];

	const utcOffsetSeconds = response.utcOffsetSeconds();

	const hourly = response.hourly()!;

	const timeRange = range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
		(t) => new Date((t + utcOffsetSeconds) * 1000)
	);
	const temperature2m = hourly.variables(0)!.valuesArray()!;

	return timeRange.map((time, index) => [time, temperature2m[index]]);
};
