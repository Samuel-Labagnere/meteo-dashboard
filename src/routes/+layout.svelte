<script lang="ts">
	import '../app.css';
	import { search } from '$lib/store';
	import { onMount } from 'svelte';

	export let data;

	let searchElement: HTMLInputElement;

	onMount(async () => {
		if (data.address) {
			searchElement.value = data.address;
			$search = data.address;
		}
	});

	const handleSearch = (event: KeyboardEvent) => {
		const value = searchElement.value.trim();
		if (event.key === 'Enter' && value !== '') {
			$search = value;
			document.cookie = `address=${value}`;
		}
	};
</script>

<svelte:head>
	<title>Dashboard Météo</title>
	<meta name="description" content="Un dashboard météo réalisé pour Favoreat Design" />
	<meta name="robots" content="noindex nofollow" />
	<html lang="fr" />
</svelte:head>

<section class="relative">
	<input
		type="text"
		id="searchbar"
		placeholder="Rechercher"
		bind:this={searchElement}
		on:keydown={handleSearch}
	/>

	<slot />
</section>
