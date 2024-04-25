import { type LatLngExpression } from 'leaflet';
import { getContext } from 'svelte';
import L from 'leaflet';

export const zoom = (multipolygon: LatLngExpression[][]) => {
	const { getMap }: { getMap: () => L.Map | undefined } = getContext('map');
	const map = getMap();

	if (map && multipolygon.length > 0) map.flyToBounds(L.latLngBounds(multipolygon.flat()));
};
