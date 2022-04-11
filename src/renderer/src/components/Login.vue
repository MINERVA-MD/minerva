<template>
	<button v-on:click="toLoginPage" class="flex items-end">
		<p class="flex items-end text-minerva-gray mr-2" v-if="gitService">
			{{ gitService.username }}
		</p>
		<img
			v-if="!gitService"
			src="/icons/user.svg"
			alt="user icon"
			class="h-8"
		/>
		<img
			v-else
			class="w-8 rounded-full"
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
