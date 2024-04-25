<script lang="ts">
	import { search } from '$lib/store';
	import { onMount } from 'svelte';

	export let cookieData: { address: string };

	let searchElement: HTMLInputElement;

	onMount(async () => {
		if (cookieData.address) {
			searchElement.value = cookieData.address;
			$search = cookieData.address;
		}
	});

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
</script>

<div class="flex items-center gap-5">
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
