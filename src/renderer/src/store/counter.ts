/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';

export const useCounterStore = defineStore({
	id: 'counter',
	state: () => ({
		counter: 0,
	}),
	getters: {
		doubleCount: state => state.counter * 2,
	},
	actions: {
		increment() {
			this.counter++;
		},
	},
});
