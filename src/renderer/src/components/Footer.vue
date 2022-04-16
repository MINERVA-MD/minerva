<template>
	<div
		class="flex items-center px-4 absolute bottom-0 w-full h-5 bg-gray-200 text-gray-500 text-xs"
	>
		<div v-if="gitService" class="flex">
			<img class="w-3.5 mr-1" src="/icons/git.svg" alt="git icon" />
			{{ gitService.repo?.name }}
		</div>
		<div v-else-if="loadedFile" class="flex">
			<img class="w-3.5 mr-1" src="/icons/folder.svg" alt="git icon" />
			{{ loadedFile }}
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	// take in props for file or repo connected... whether git is connected, etc
	setup() {},
	props: ['gitService', 'loadedFile'],
});
</script>
