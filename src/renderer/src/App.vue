<template>
	<Navbar
		:roomId="roomId ? roomId : ''"
		@newFile="newBlankEditor"
		@createCollabSession="createCollabSession"
		@joinCollabSession="joinCollabSession"
	/>
	<RouterView v-slot="{ Component }">
		<component :is="Component" ref="view" />
	</RouterView>
	<Footer />
</template>

<script lang="ts">
import { RouterView, RouterLink } from 'vue-router';
import { defineComponent } from 'vue-demi';
import './css/index.css';
import type GithubClientService from './services/github-client.service';
import Editor from './views/Editor.vue';
import Navbar from './components/NavBar.vue';
import Footer from './components/Footer.vue';

export default defineComponent({
	components: {
		Navbar,
		Editor,
		Footer,
	},
	data(): {
		roomId: string | null;
		gitService: GithubClientService | null;
	} {
		return {
			roomId: '',
			gitService: null,
		};
	},
	methods: {
		newBlankEditor() {
			this.roomId = '';
			(this.$refs.view as any)?.newBlankEditor();
		},
		async createCollabSession() {
			this.roomId = await (this.$refs.view as any)?.createCollabSession();
		},
		joinCollabSession(roomId: string) {
			this.roomId = roomId;
			(this.$refs.view as any)?.joinCollabSession(roomId);
		},
	},
});
</script>

<style>
@import './css/github-markdown.css';
</style>
