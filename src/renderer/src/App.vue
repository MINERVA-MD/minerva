<template>
	<Navbar
		:roomId="roomId ? roomId : ''"
		@newFile="newBlankEditor"
		@createCollabSession="createCollabSession"
		@joinCollabSession="joinCollabSession"
	/>
	<RouterView v-slot="{ Component }">
	  <button v-on:click="getGitHubOAuthToken">Login</button>
		<keep-alive>
			<component
				:is="Component"
				@connectGit="connectGit"
				:gitService="gitService"
				ref="view"
				@selectRepo="selectRepo"
				@useRepo="useRepo"
			/>
		</keep-alive>
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
		connectGit(userInformation: { username: string; token: string }) {
			this.gitService = null;
			this.gitService = new GithubClientService(
				userInformation.username,
				userInformation.token,
			);
		},

	  async getGitHubOAuthToken() {
			this.connectGit({username: 'testminerva', token: '--'})
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
</style>
