import { type LatLngExpression } from 'leaflet';
import { type WeatherData } from '../type';
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

const getWeather = async (coordinates: LatLngExpression): Promise<WeatherData> => {
	const coordinatesArray: number[] = coordinates as number[];
	const params = {
		latitude: coordinatesArray[0],
		longitude: coordinatesArray[1],
		current: [
			'temperature_2m',
			'relative_humidity_2m',
			'rain',
			'weather_code',
			'wind_speed_10m',
			'wind_direction_10m'
		],
		hourly: ['temperature_2m', 'uv_index'],
		daily: [
			'weather_code',
			'temperature_2m_max',
			'temperature_2m_min',
			'uv_index_max',
			'rain_sum',
			'wind_speed_10m_max',
			'wind_direction_10m_dominant'
		],
		forecast_days: 7
	};
	const url = 'https://api.open-meteo.com/v1/forecast';
	const responses = await fetchWeatherApi(url, params);

	const range = (start: number, stop: number, step: number) =>
		Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

	const response = responses[0];

	const utcOffsetSeconds = response.utcOffsetSeconds();

	const current = response.current()!;
	const hourly = response.hourly()!;
	const daily = response.daily()!;

	const hourlyTimeRange = range(
		Number(hourly.time()),
		Number(hourly.timeEnd()),
		hourly.interval() * 2
	).map((t) => new Date((t + utcOffsetSeconds) * 1000));
	const temperature2m = hourly.variables(0)!.valuesArray()!;
	const dailyTimeRange = range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
		(t) => new Date((t + utcOffsetSeconds) * 1000)
	);

	const getWindDirection = (direction: number) => {
		if ((direction >= 0 && direction < 45) || (direction >= 315 && direction < 360)) {
			return 'Sud';
		} else if (direction >= 45 && direction < 135) {
			return 'Ouest';
		} else if (direction >= 135 && direction < 225) {
			return 'Nord';
		} else {
			return 'Est';
		}
	};

	const weatherData: WeatherData = {
		current: {
			temperature: {
				current: current.variables(0)!.value(),
				max: Math.max(...temperature2m.slice(0, 12)),
				min: Math.min(...temperature2m.slice(0, 12))
			},
			weatherCode: current.variables(3)!.value(),
			humidity: current.variables(1)!.value(),
			rain: current.variables(2)!.value(),
			wind: {
				speed: current.variables(4)!.value(),
				direction: getWindDirection(current.variables(5)!.value())
			},
			uvIndex: hourly.variables(1)!.value()
		},
		hourly: hourlyTimeRange.map((time, index) => [time, temperature2m[index]]),
		daily: dailyTimeRange.map((time, index) => ({
			date: time,
			weatherCode: daily.variables(0)!.valuesArray()![index],
			temperature: {
				max: daily.variables(1)!.valuesArray()![index],
				min: daily.variables(2)!.valuesArray()![index]
			},
			uvIndex: daily.variables(3)!.valuesArray()![index],
			rain: daily.variables(4)!.valuesArray()![index],
			wind: {
				speed: daily.variables(5)!.valuesArray()![index],
				direction: getWindDirection(daily.variables(6)!.valuesArray()![index])
			}
		}))
	};

	return weatherData;
};
