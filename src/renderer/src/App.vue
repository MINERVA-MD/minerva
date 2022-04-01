<template>
	<Navbar
		:roomId="roomId"
		@newFile="newBlankEditor"
		@createCollabSession="createCollabSession"
		@joinCollabSession="joinCollabSession"
	/>
	<RouterView v-slot="{ Component }">
		<component :is="Component" ref="view" />
	</RouterView>
</template>

<script lang="ts">
import { RouterView, RouterLink } from 'vue-router';
import './css/index.css';
import Editor from './views/Editor.vue';
import Navbar from './components/NavBar.vue';

export default {
	components: {
		Navbar,
		Editor,
	},
	data(): {} {
		return {};
	},
	methods: {
		newBlankEditor() {
			if (this.$refs.view.newBlankEditor) {
				this.$refs.view.newBlankEditor();
			}
		},
	},
};
</script>

<style>
@import './css/github-markdown.css';
</style>
