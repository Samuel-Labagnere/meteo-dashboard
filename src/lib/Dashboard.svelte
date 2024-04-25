<script lang="ts">
	import chartSkeleton from '$lib/assets/chartSkeleton.svg?raw';
  import { weather } from '$lib/store';
	import { drawChart } from './weatherChart';

	let chart: string | undefined;

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

  $: if ($weather) {
		chart = drawChart()?.outerHTML;
	}
</script>

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