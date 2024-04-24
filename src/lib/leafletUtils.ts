import { type LatLngExpression } from 'leaflet';
import { getContext } from 'svelte';
import { search, weather } from '$lib/store';
import { drawChart } from './weatherChart';
import L from 'leaflet';

export const zoom = (multipolygon: LatLngExpression[][]) => {
	const { getMap }: { getMap: () => L.Map | undefined } = getContext('map');
	const map = getMap();

	if (map && multipolygon.length > 0) map.flyToBounds(L.latLngBounds(multipolygon.flat()));
};

export const createToolTip = () => {
	let searchContent: any;
	let weatherData: any;

	search.subscribe((value) => (searchContent = value));
	weather.subscribe((value) => (weatherData = value));

	const toolTipStartDiv = `<div class="max-w-100 px-4 pt-4 text-wrap pointer-events-auto">`;
	const toolTipEndDiv = `</div>`;
	const baseText = `<h1 class="text-xl mb-4">Météo de ${searchContent}</h1>`;
	const startDiv = `<div class="flex gap-2 pb-4 overflow-x-scroll">`;
	const endDiv = `</div>`;
	let finalText: string = toolTipStartDiv + baseText;

	finalText += drawChart()?.outerHTML;

	finalText += startDiv;
	weatherData.forEach((data: any, index: number) => {
		finalText += `
    <div class="flex flex-col items-center${index < weatherData.length - 1 ? ' border-r pr-2' : ''}">
    <p>${Number(data[1]).toFixed(2)}°C</p>
    <p class="font-bold">${new Date(data[0]).getHours()}:00</p>
    </div>
    `;
	});
	finalText += endDiv + toolTipEndDiv;

	return finalText;
};
