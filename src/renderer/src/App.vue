<template>
	<Navbar
		:roomId="roomId ? roomId : ''"
		@newFile="newBlankEditor"
		@createCollabSession="createCollabSession"
		@joinCollabSession="joinCollabSession"
	/>
	<RouterView v-slot="{ Component }">
		<transition name="fade">
			<component
				:is="Component"
				@login="login"
				:gitService="gitService"
				ref="view"
				@selectRepo="selectRepo"
				@useRepo="useRepo"
			/>
		</transition>
	</RouterView>
	<Footer />
</template>

<script lang="ts">
import { RouterView, RouterLink } from 'vue-router';
import { defineComponent } from 'vue-demi';
import './css/index.css';
import GithubClientService from './services/github-client.service';
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
		repo: string;
	} {
		return {
			roomId: '',
			gitService: null,
			repo: '',
		};
	},
	created() {
		this.$router.push('/');
	},
	mounted() {},
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
		connectGit() {
			this.gitService = null;
			this.gitService = new GithubClientService();
		},

		async login() {
			this.connectGit();
			await this.gitService?.authorize();
		},

		selectRepo(repo: string) {
			this.repo = repo;
		},
		async useRepo() {
			await this.$router.push('/');
			const fileContents = await this.gitService?.getReadMeContents();
			(this.$refs.view as any).newEditorFromGit(fileContents);
		},
	},
});
</script>

<style>
@import './css/github-markdown.css';

.fade-enter-from {
	opacity: 0%;
}
.fade-leave-to {
	opacity: 0%;
}
.fade-enter-active {
	transition: all 0.2s ease-in;
}
</style>
