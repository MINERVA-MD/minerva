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
import { VueElement } from 'vue-demi';

export default {
	components: {
		Navbar,
		Editor,
	},
	data(): {
		roomId: string | null;
	} {
		return {
			roomId: '',
		};
	},
	methods: {
		newBlankEditor() {
			if ((this.$refs.view as any).newBlankEditor) {
				this.roomId = '';
				(this.$refs.view as any).newBlankEditor();
			}
		},
		createCollabSession() {
			if ((this.$refs.view as any).createCollabSession)
				this.roomId = (this.$refs.view as any).createCollabSession();
		},
		joinCollabSession(roomId: string) {
			if ((this.$refs.view as any).joinCollabSession) {
				this.roomId = roomId;
				(this.$refs.view as any).joinCollabSession(roomId);
			}
		},
	},
};
</script>

<style>
@import './css/github-markdown.css';
</style>
