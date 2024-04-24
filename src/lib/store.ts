import { writable, type Writable } from 'svelte/store';

export const search: Writable<string | undefined> = writable();
export const weather: Writable<any[] | undefined> = writable();
