<script lang="ts">
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import L from 'leaflet';
	import { createToolTip } from './leafletUtils';

	export let latLng: L.LatLngExpression;

	let marker: L.Marker | undefined;

	const { getMap }: { getMap: () => L.Map | undefined } = getContext('map');
	const map = getMap();

	setContext('layer', {
		getLayer: () => marker
	});

	onMount(() => {
		if (map) {
			marker = L.marker(latLng).addTo(map);
			map.flyTo(latLng);
		}
	});

	onDestroy(() => {
		marker?.remove();
		marker = undefined;
	});
</script>

<div>
	{#if marker}
		<slot />
	{/if}
</div>
