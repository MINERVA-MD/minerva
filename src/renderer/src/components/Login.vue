<template>
	<button
		v-on:click="toLoginPage"
		class="flex items-end opacity-80 hover:opacity-100 text-minerva-gray font-semi-bold transition-colors duration-100"
	>
		<p class="flex items-end mr-2" v-if="gitService">
			{{ gitService.username }}
		</p>
		<img
			v-if="!gitService"
			src="/icons/user.svg"
			alt="user icon"
			class="w-7"
		/>
		<img
			v-else-if="gitService && gitService.avatarUrl"
			class="w-7 rounded-full"
			:src="gitService.avatarUrl"
			alt="user avatar"
		/>
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
