<template>
	<button v-on:click="toLoginPage">
		<img src="/icons/user.svg" alt="user icon" class="h-8" />
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	data(): {} {
		return {};
	},
	props: ['gitService'],
	methods: {
		toLoginPage() {
			this.$router.push('/gitservice');
		},
	},
});
</script>
