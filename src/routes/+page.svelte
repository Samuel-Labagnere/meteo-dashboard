<script lang="ts">
  import type { LatLngExpression } from 'leaflet';
  import Leaflet from '$lib/Leaflet.svelte';
  import Marker from '$lib/Marker.svelte';
	import Vector from '$lib/Vector.svelte';
	import { getLocation } from '$lib/openStreetMap';
	import { search } from '$lib/store';

  const initialView: LatLngExpression = [48.864716, 2.349014]; // Paris, France
  // const latLngs: LatLngExpression[] = [
  //   [48.842106, 2.321782], // Montparnasse
  //   [48.853176, 2.368982], // Bastille
  //   [48.882278, 2.337361] // Pigalle
  // ];
  
  let searchedLocation: LatLngExpression | undefined;

  $: if ($search) {
    searchedLocation = undefined;
    getLocation($search).then( response => {
      searchedLocation = [response.lat, response.lon];
    }
    );
  };
</script>

<div class="w-screen h-screen">
  <Leaflet view={initialView} zoom={13}>
    {#if searchedLocation}
      <Marker latLng={searchedLocation} width={40} height={40} />
    {/if}

    <!-- {#if latLngs}
      <Vector {latLngs} color={'blue'} />
    {/if} -->
  </Leaflet>
</div>