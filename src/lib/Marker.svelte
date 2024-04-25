<script lang="ts">
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import L, { type LatLngExpression } from 'leaflet';

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
			const offset: number[] = [-0.0045, 0];
			const latLngAsArray: number[] = latLng as number[];
			let latLngOffset: LatLngExpression | number[] = [];

			for (let i = 0; i < latLngAsArray.length; i++) {
				const sum = latLngAsArray[i] + offset[i];
				latLngOffset.push(sum);
			}

			map.flyTo(latLngOffset as LatLngExpression, 15);
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
