/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			zIndex: {
				top: '999'
			},
			maxWidth: {
				100: '32rem'
			}
		}
	},
	plugins: []
};
