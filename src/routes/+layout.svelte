<script lang="ts">
  import "../app.css";
  import { search } from "$lib/store";

  let searchElement: HTMLInputElement;

  const handleSearch = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && searchElement.value.trim() !== '') {
      $search = searchElement.value.trim();
    }
  };
</script>

<section class="relative">
  <input type="text" class="absolute top-5 left-20 rounded w-1/4 h-10 border px-4 z-[999]"
  placeholder="Rechercher" bind:this={searchElement} on:keydown={handleSearch} />

  <slot />
</section>