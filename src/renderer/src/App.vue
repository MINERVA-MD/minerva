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
</template>

<script lang="ts">
import { RouterView, RouterLink } from 'vue-router';
import { defineComponent } from 'vue-demi';
import './css/index.css';
import Editor from './views/Editor.vue';
import Navbar from './components/NavBar.vue';
import { VueElement } from 'vue-demi';

export default defineComponent({
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
			this.roomId = '';
			(this.$refs.view as any)?.newBlankEditor();
		},
		createCollabSession() {
			this.roomId = (this.$refs.view as any)?.createCollabSession();
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
