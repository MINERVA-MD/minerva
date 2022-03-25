<template>
	<header class="flex justify-end w-full mt-4">
		<div>
			<button
				@click="toggleMenu"
				type="button"
				class="cursor-pointer mr-6 hover:opacity-70"
			>
				<img src="/icons/menu.svg" alt="menu" />
			</button>
			<div v-if="menuIsOpen === true">
				<Menu />
			</div>
		</div>
	</header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Menu from './Menu.vue';

export default defineComponent({
	name: 'NavBar',
	data(): {
		menuIsOpen: boolean;
	} {
		return {
			menuIsOpen: false,
		};
	},
	methods: {
		toggleMenu() {
			if (this.menuIsOpen === false) {
				this.menuIsOpen = true;
			} else {
				this.menuIsOpen = false;
			}
		},
	},
	components: {
		Menu,
	},
});
</script>
