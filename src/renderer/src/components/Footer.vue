<template>
	<div
		class="flex items-center justify-between px-4 absolute bottom-0 w-full h-5 bg-gray-200 text-gray-500 text-xs"
	>
		<div class="">
			<div v-if="gitService && gitService.repo" class="flex">
				{{ `@${gitService.repo?.ownerLogin}` }}
				<GitIcon />
				{{ gitService.repo?.name }}
			</div>
			<div v-else-if="loadedFile" class="flex items-center">
				<FolderIcon />
				{{ loadedFile }}
			</div>
		</div>
		<select
			:value="target"
			class="h-full py-0 text-xs bg-transparent border-none"
		>
			<option value="markdown">markdown</option>
			<option value="fountain">fountain</option>
		</select>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GitIcon from './svgs/GitIcon.vue';
import FolderIcon from './svgs/FolderIcon.vue';

export default defineComponent({
	// take in props for file or repo connected... whether git is connected, etc
	setup() {},
	props: ['gitService', 'loadedFile', 'target'],
	components: { GitIcon, FolderIcon },
	methods: {},
});
</script>
