<template>
	<button
		v-on:click="toLoginPage"
		class="flex items-center justify-center opacity-80 hover:opacity-100 text-minerva-gray font-semi-bold transition-colors duration-100"
	>
		<p class="flex items-end mr-2" v-if="gitService">
			{{ gitService.username }}
		</p>
		<UserIcon
			class="w-6 h-6"
			v-if="!gitService"
			aria-hidden="true"
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

import { UserIcon} from '@heroicons/vue/outline';
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		UserIcon
	},
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
