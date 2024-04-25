<script lang="ts">
	import chartSkeleton from '$lib/assets/chartSkeleton.svg?raw';
  import { weather } from '$lib/store';
	import { drawChart } from './weatherChart';
  import cloudy from './assets/cloudy.png';
  import umbrella from './assets/umbrella.svg?raw';

	let chart: string | undefined;
  let forecast: boolean = false;

  const getWeatherDate = (date: string) => new Date(date).toLocaleDateString('fr', { weekday: 'long', day: 'numeric', month: 'long' });

  $: if ($weather) {
		chart = drawChart()?.outerHTML;
    console.log($weather);
	}
</script>

{#if $weather}
  {#if forecast}
    <div class="grid grid-cols-6 gap-2.5 font-semibold text-white w-full h-full">
      {#each $weather.daily.slice(1, $weather.daily.length) as daily}
        <div class="flex flex-col gap-5 bg-blue-400 w-full h-full p-2.5">
          <p class="capitalize">{ getWeatherDate(daily.date) }</p>
          <div class="flex justify-around items-center">
            <img src={cloudy} alt="Temps nuageux" class="w-16" />
            <div class="flex flex-col justify-center items-center">
              <p class="text-2xl">{ Number(daily.temperature.max).toFixed() }<span class="text-base">°C</span></p>
              <p>{ Number(daily.temperature.min).toFixed() }<span class="text-xs">°C</span></p>
            </div>
          </div>
          <p class="text-center text-lg">
            { Number(daily.wind.speed).toFixed() }<span class="text-sm">km/h</span>
            { daily.wind.direction }
          </p>
          <div class="flex justify-around">
            <div class="flex items-center gap-2.5">
              {@html umbrella}
              <p class="text-lg">
                { 
                  Number(daily.rain).toFixed() 
                }<span class="text-sm">%</span></p>
            </div>
            <p class="text-lg">UV { Number(daily.uvIndex).toFixed(1) }</p>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="grid grid-cols-2 gap-2.5 w-full h-full">
      <div class="grid grid-cols-4 gap-2.5 font-semibold text-white">
        <div class="flex flex-col flex-initial bg-blue-400 p-2.5">
          <p>Température</p>
          <p class="flex-auto flex justify-center items-center text-2xl">
            { 
              Number($weather.current.temperature.current).toFixed() 
            }<span class="text-sm">°C</span>
          </p>
        </div>
        <div class="flex flex-col flex-initial bg-blue-400 p-2.5">
          <p>Température haute</p>
          <p class="flex-auto flex justify-center items-center text-2xl">
            { 
              Number($weather.current.temperature.max).toFixed() 
            }<span class="text-sm">°C</span>
          </p>
        </div>
        <div class="flex flex-col flex-initial bg-blue-400 p-2.5">
          <p>Température basse</p>
          <p class="flex-auto flex justify-center items-center text-2xl">
            { 
              Number($weather.current.temperature.min).toFixed() 
            }<span class="text-sm">°C</span>
          </p>
        </div>
        <div class="flex flex-col flex-initial bg-blue-400 p-2.5">
          <p>Ambiance</p>
          <div class="flex-auto flex justify-center items-center text-2xl">
            <img src={cloudy} alt='Temps nuageux' class="w-16" />
          </div>
        </div>
        <div class="flex flex-col flex-initial bg-blue-400 p-2.5">
          <p>Humidité</p>
          <p class="flex-auto flex justify-center items-center text-2xl">
            { 
              Number($weather.current.humidity).toFixed() 
            }<span class="text-sm">%</span>
          </p>
        </div>
        <div class="flex flex-col flex-initial bg-blue-400 p-2.5">
          <p>Pluie</p>
          <p class="flex-auto flex justify-center items-center text-2xl">
            { 
              Number($weather.current.rain).toFixed(1) 
            }<span class="text-sm">mm</span>
          </p>
        </div>
        <div class="flex flex-col flex-initial bg-blue-400 p-2.5">
          <p>Vent</p>
          <div class="flex-auto flex flex-col justify-center items-center text-2xl">
            <p>
              { 
                Number($weather.current.wind.speed).toFixed() 
              }<span class="text-sm">km/h</span>
            </p>
            <p>
              { $weather.current.wind.direction }
            </p>
          </div>
        </div>
        <div class="flex flex-col flex-initial bg-blue-400 p-2.5">
          <p>Indice UV</p>
          <p class="flex-auto flex justify-center items-center text-2xl">
            { 
              Number($weather.current.uvIndex).toFixed(1) 
            }<span class="text-sm">°C</span>
          </p>
        </div>
      </div>
      {@html chart}
    </div>
  {/if}

  <div class="flex gap-2.5 mx-auto">
    <button class="btn{forecast ? '' : ' active'}" on:click={() => forecast = false}>Aujourd'hui</button>
    <button class="btn{forecast ? ' active' : ''}" on:click={() => forecast = true}>À venir</button>
  </div>
{/if}