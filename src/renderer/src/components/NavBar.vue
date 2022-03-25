<template>
	<header class="flex justify-end w-full mt-4">
		<button @click="toggleMenu" type="button" class="cursor-pointer mr-6">
			<img src="/icons/menu.svg" alt="menu" />
		</button>
		<div v-if="menuIsOpen === true">
			<Menu />
		</div>
	</header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
	components: {},
});
</script>
