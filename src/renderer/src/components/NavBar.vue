<template>
	<div class="navbar">
		<IconMenu />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IconMenu from './icons/IconMenu.vue';

export default defineComponent({
	name: 'NavBar',
	components: {
		IconMenu,
	},
});
</script>

<style>
.navbar {
	width: 100%;
	display: flex;
	justify-content: flex-end;
}
</style>
