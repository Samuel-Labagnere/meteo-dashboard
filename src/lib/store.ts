import { writable, type Writable } from 'svelte/store';

export const search: Writable<string|undefined> = writable();