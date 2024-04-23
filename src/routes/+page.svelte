<script lang="ts">
  import type { LatLngExpression } from 'leaflet';
  import Leaflet from '$lib/Leaflet.svelte';
  import Marker from '$lib/Marker.svelte';
	import Vector from '$lib/Vector.svelte';

  const initialView: LatLngExpression = [48.864716, 2.349014]; // Paris, France
</script>

<div class="w-screen h-screen">
  <Leaflet view={initialView} zoom={13}>
  <!-- Children -->
  </Leaflet>
</div>