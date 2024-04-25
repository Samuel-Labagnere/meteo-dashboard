<script lang="ts">
	import Leaflet from '$lib/Leaflet.svelte';
	import Marker from '$lib/Marker.svelte';
	import Vector from '$lib/Vector.svelte';
	import { zoom } from '$lib/leafletUtils';
	import { getLocation } from '$lib/geodata';
	import { type LatLngExpression } from 'leaflet';
	import { search } from '$lib/store';
	import Dashboard from '$lib/Dashboard.svelte';
	import Searchbar from '$lib/Searchbar.svelte';
	// import { getLocations } from '$lib/geodata';

	export let data;

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

<div class="w-screen h-screen overflow-hidden{$search ? ' grid grid-rows-2' : ''}">
	<div class="flex flex-col gap-4 p-4">
		<Searchbar cookieData={data} />
		<Dashboard />
	</div>
	<div class="relative w-full h-full">
		<div class="absolute top-0 left-0 w-full h-full">
			<Leaflet view={initialView} zoom={13}>
				{#if searchedLocation}
					{#if searchedLocationType === 'Point'}
						<Marker latLng={searchedLocation} />
					{:else if searchedLocationType === 'Polygon'}
						<Vector latLngs={searchedLocation} color={'blue'} />
					{:else if searchedLocationType === 'MultiPolygon'}
						{#each searchedLocation as location}
							<Vector latLngs={location} color={'blue'} skip />
						{/each}
						{zoom(searchedLocation)}
					{/if}
				{/if}
			</Leaflet>
		</div>
	</div>
</div>
