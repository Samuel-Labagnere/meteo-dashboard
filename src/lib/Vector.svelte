<script lang="ts">
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import { createToolTip } from './leafletUtils';
	import L from 'leaflet';

	export let latLngs: L.LatLngExpression[];
	export let color: string = 'red';
	export let skip: boolean = false;
	export let showTooltip: boolean = false;

	let polygon: L.Polygon | undefined;

	const { getMap }: { getMap: () => L.Map | undefined } = getContext('map');
	const map = getMap();

	setContext('layer', {
		getLayer: () => polygon
	});

	onMount(() => {
		if (map) {
			polygon = L.polygon(latLngs, { color }).addTo(map);

			if (!skip) map.flyToBounds(polygon.getBounds());
			if (showTooltip)
				polygon.bindTooltip(createToolTip(), { permanent: true, className: 'tooltip' });
		}
	});

	onDestroy(() => {
		polygon?.remove();
	});
</script>

<div>
	{#if polygon}
		<slot />
	{/if}
</div>
