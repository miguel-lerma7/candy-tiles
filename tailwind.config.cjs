/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./index.html', './src/**/*.{html,js,ts,jsx,tsx}'],
	theme: {
		colors: {
			'transparent': 'transparent',
			'current': 'currentColor',
			'black': colors.black,
			'white': colors.white,

			'purple': '#472183',
			'blue': '#4B56D2',
			'light-blue': '#82C3EC',
			'bone': '#F1F6F5',

			'neu-1': '#F5F7FA',
			'neu-2': '#E4E7EB',
			'neu-3': '#CBD2D9',
			'neu-4': '#9AA5B1',
			'neu-5': '#7B8794',
			'neu-6': '#616E7C',
			'neu-7': '#52606D',
			'neu-8': '#3E4C59',
			'neu-9': '#323F4B',
			'neu-10': '#1F2933',
		},

		textFillColor: theme => theme('borderColor'),
		textStrokeColor: theme => theme('borderColor'),
		textStrokeWidth: theme => theme('borderWidth'),
		paintOrder: {
			'fsm': { paintOrder: 'fill stroke markers' },
			'fms': { paintOrder: 'fill markers stroke' },
			'sfm': { paintOrder: 'stroke fill markers' },
			'smf': { paintOrder: 'stroke markers fill' },
			'mfs': { paintOrder: 'markers fill stroke' },
			'msf': { paintOrder: 'markers stroke fill' },
		},

		extend: {
			fontFamily: {
				Roboto: ['Roboto'],
				Poppins: ['Poppins'],
				OpenSans: ["'Open Sans'"],
				Lato: ['Lato'],
				Raleway: ['Raleway'],
				LilyScriptOne: ['Lily Script One'],
				System: [
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Oxygen-Sans',
					'Ubuntu',
					'Cantarell',
					'Helvetica Neue',
					'sans-serif',
				],
			},
			keyframes: {
				fall: {
					'from': { transform: 'translateY(-500px)' },
					'to': { transform: 'translateY(0px)' },
				},
				scaleOscillate: {
					'from': { transform: 'scale(0.95)' },
					'to': { transform: 'scale(1.05)' },
				},
				candyPopFX: {
					'0%': {
						transform: 'scale(0) rotate(0deg)',
						opacity: '0',
					},
					'30%': {
						transform: 'scale(1.3)',
						opacity: '0.5',
					},
					'100%': {
						transform: 'scale(0.5) rotate(90deg)',
						opacity: '0',
					},
				},
			},
			transitionTimingFunction: {
				inSine: 'cubic-bezier(0.12, 0, 0.39, 0)',
				outSine: 'cubic-bezier(0.61, 1, 0.88, 1)',
				inOutSine: 'cubic-bezier(0.37, 0, 0.63, 1)',
				inQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
				outQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
				inOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)',
				inCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',
				outCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
				inOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
				inQuart: 'cubic-bezier(0.5, 0, 0.75, 0)',
				outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
				inOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
				inQuint: 'cubic-bezier(0.64, 0, 0.78, 0)',
				outQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',
				inOutQuint: 'cubic-bezier(0.83, 0, 0.17, 1)',
				inExpo: 'cubic-bezier(0.7, 0, 0.84, 0)',
				outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
				inOutExpo: 'cubic-bezier(0.87, 0, 0.13, 1)',
				inCirc: 'cubic-bezier(0.55, 0, 1, 0.45)',
				outCirc: 'cubic-bezier(0, 0.55, 0.45, 1)',
				inOutCirc: 'cubic-bezier(0.85, 0, 0.15, 1)',
				inBack: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
				outBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
				inOutBack: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
			},
		},
		screens: {
			sm: { max: '640px' },
			md: { max: '768px' },
			lg: { max: '1024px' },
			xl: { max: '1280px' },
		},
	},
	plugins: [require('tailwindcss-text-fill-stroke')],
};
