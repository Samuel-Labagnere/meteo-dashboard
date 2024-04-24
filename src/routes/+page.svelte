<script lang="ts">
	import Leaflet from '$lib/Leaflet.svelte';
	import Marker from '$lib/Marker.svelte';
	import Vector from '$lib/Vector.svelte';
	import { zoom } from '$lib/leafletUtils';
	import { getLocation } from '$lib/geodata';
	import { search, weather } from '$lib/store';
	import { onMount } from 'svelte';
	import { drawChart } from '$lib/weatherChart.js';
	import { type LatLngExpression } from 'leaflet';
	import chartSkeleton from '$lib/assets/chartSkeleton.svg?raw';
	// import { getLocations } from '$lib/geodata';

	export let data;

	let searchElement: HTMLInputElement;

	onMount(async () => {
		if (data.address) {
			searchElement.value = data.address;
			$search = data.address;
		}
	});

	const initialView: LatLngExpression = [48.864716, 2.349014]; // Paris, France

	let searchedLocationType: string | undefined;
	let searchedLocation: (LatLngExpression & LatLngExpression[] & LatLngExpression[][]) | undefined;
	let chart: string | undefined;

	const handleSearch = (event: KeyboardEvent) => {
		const value = searchElement.value.trim();
		if (event.key === 'Enter' && value !== '') {
			$search = value;
			document.cookie = `address=${encodeURIComponent(value)}`;
		}
	};

	const handleInput = async () => {
		// const value = searchElement.value.trim();
		// const response = await getLocations(value);
	};

	const getWeatherDate = (date: string) => {
		const weatherDate = new Date(date);
		return (
			weatherDate.getDate() +
			' ' +
			weatherDate.toLocaleString('fr', { month: 'short' }) +
			' ' +
			weatherDate.getHours()
		);
	};

	$: if ($search) {
		searchedLocation = undefined;
		getLocation($search).then((response) => {
			searchedLocationType = response.type;
			searchedLocation = response.coordinates;
		});
	}

	$: if ($weather) {
		chart = drawChart()?.outerHTML;
	}
</script>

<div class="w-screen h-screen overflow-hidden grid grid-rows-2">
	<div class="flex flex-col h-full gap-4 p-4">
		<div class="flex items-center gap-2">
			<h1 class="text-xl">Dashboard Météo</h1>
			<input
				type="text"
				id="searchbar"
				placeholder="Rechercher votre adresse"
				bind:this={searchElement}
				on:keydown={handleSearch}
				on:input={handleInput}
			/>
		</div>

		<div class="grid grid-cols-2 gap-2 h-full">
			{#if $weather}
				<div class="flex gap-2 justify-around flex-wrap h-full overflow-y-auto">
					{#each $weather as someWeather}
						<div class="flex flex-col items-center min-w-fit">
							<p>{Number(someWeather[1]).toFixed(2)}°C</p>
							<p class="font-semibold">{getWeatherDate(someWeather[0])}:00</p>
						</div>
					{/each}
				</div>
				{@html chart}
			{:else}
				<p>Veuillez chercher une adresse pour en connaître la météo.</p>
				{@html chartSkeleton}
			{/if}
		</div>
	</div>
	<div class="relative w-full h-full">
		<div class="absolute top-0 left-0 w-full h-full">
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
	</div>
</div>
