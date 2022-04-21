/* eslint-disable global-require */
module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,html}'],
	theme: {
		extend: {
			colors: {
				'minerva-purple': '#5452C1',
				'minerva-gray': '#404040',
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/line-clamp'),
		require('@tailwindcss/aspect-ratio'),
	],
};
