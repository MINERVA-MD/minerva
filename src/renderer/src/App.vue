<template>
	<Navbar
		:roomId="roomId ? roomId : ''"
		@newFile="newBlankEditor"
		@createCollabSession="createCollabSession"
		@joinCollabSession="joinCollabSession"
		:gitService="gitService"
	/>
	<RouterView v-slot="{ Component }">
		<transition name="fade">
			<keep-alive>
				<component
					:is="Component"
					:gitService="gitService"
					ref="view"
					@login="login"
					@logout="logout"
					@selectRepo="selectRepo"
					@useRepo="useRepo"
					@commitChanges="commitChanges"
				/>
			</keep-alive>
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
import type { GitRepo } from '@/typings/GitService';

export default defineComponent({
	components: {
		Navbar,
		Editor,
		Footer,
	},
	data(): {
		roomId: string | null;
		gitService: GithubClientService | null;
		repo: GitRepo | null;
	} {
		return {
			roomId: '',
			gitService: null,
			repo: null,
		};
	},
	created() {
		this.$router.push('/');
	},
	mounted() {},
	methods: {
		newBlankEditor() {
			this.$router.push('/');
			setTimeout(() => {
				this.roomId = '';
				(this.$refs.view as any)?.newBlankEditor();
			}, 1);
			this.gitService?.clearRepo();
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

		async logout() {
			await this.gitService?.logout();
			this.gitService = null;
		},

		selectRepo(repo: GitRepo) {
			this.repo = repo;
		},

		async useRepo() {
			await this.$router.push('/');
			await this.gitService?.cloneSelectedRepo();
			const fileContents = await this.gitService?.getReadMeContents();
			(this.$refs.view as any).newEditorFromGit(fileContents);
		},

		commitChanges() {
			(this.$refs.view as any)?.commitChanges();
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
