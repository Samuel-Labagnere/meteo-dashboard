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

<section class="relative">
	<input
		type="text"
		class="absolute top-5 left-20 rounded w-1/4 h-10 border px-4 z-[999]"
		placeholder="Rechercher"
		bind:this={searchElement}
		on:keydown={handleSearch}
	/>

	<slot />
</section>
