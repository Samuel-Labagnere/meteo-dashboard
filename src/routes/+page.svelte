<script lang="ts">
	import Leaflet from '$lib/Leaflet.svelte';
	import Marker from '$lib/Marker.svelte';
	import Vector from '$lib/Vector.svelte';
	import { zoom } from '$lib/leafletUtils';
	import { getLocation } from '$lib/geodata';
	import { search } from '$lib/store';
	import { type LatLngExpression } from 'leaflet';

	const initialView: LatLngExpression = [48.864716, 2.349014]; // Paris, France

	let searchedLocationType: string | undefined;
	let searchedLocation: (LatLngExpression & LatLngExpression[] & LatLngExpression[][]) | undefined;

	$: if ($search) {
		searchedLocation = undefined;
		getLocation($search).then((response) => {
			searchedLocationType = response.type;
			searchedLocation = response.coordinates;
		});
	}
</script>

<div class="w-screen h-screen">
	<Leaflet view={initialView} zoom={13}>
		{#if searchedLocation}
			{#if searchedLocationType === 'Point'}
				<Marker latLng={searchedLocation} />
			{:else if searchedLocationType === 'Polygon'}
				<Vector latLngs={searchedLocation} color={'blue'} showTooltip />
			{:else if searchedLocationType === 'MultiPolygon'}
				{#each searchedLocation as location, index}
					<Vector latLngs={location} color={'blue'} skip showTooltip={index === 0} />
				{/each}
				{zoom(searchedLocation)}
			{/if}
		{/if}
	</Leaflet>
</div>
