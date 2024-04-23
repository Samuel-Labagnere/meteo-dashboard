<script lang="ts">
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import L from 'leaflet';

	export let latLngs: L.LatLngExpression[];
  export let color: string = 'red';

	let polygon: L.polygon | undefined;
	let polygonElement: HTMLElement;

	const { getMap }: { getMap: () => L.Map | undefined } = getContext('map');
	const map = getMap();

	setContext('layer', {
		getLayer: () => polygon
	});

	onMount(() => {
		if (map) {
      polygon = L.polygon(latLngs, {color}).addTo(map);
      map.flyToBounds(polygon.getBounds());
		}
	});

	onDestroy(() => {
		polygon?.remove();
	});
</script>

<div bind:this={polygonElement}>
	{#if polygon}
		<slot />
	{/if}
</div>