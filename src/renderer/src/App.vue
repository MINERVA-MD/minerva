<template>
	<Navbar
		:roomId="roomId ? roomId : ''"
		:gitService="gitService"
		:loadedFile="loadedFile"
		@newFile="newBlankEditor"
		@saveFile="saveFile"
		@saveAsFile="saveAsFile"
		@loadFile="loadFile"
		@createCollabSession="createCollabSession"
		@joinCollabSession="joinCollabSession"
		@commitChanges="commitChanges"
	/>
	<RouterView v-slot="{ Component }">
		<transition name="fade">
			<keep-alive>
				<component
					:is="Component"
					:gitService="gitService"
					:loadedFile="loadedFile"
					ref="view"
					@login="login"
					@logout="logout"
					@selectRepo="selectRepo"
					@useRepo="useRepo"
				/>
			</keep-alive>
		</transition>
	</RouterView>
	<Footer :gitService="gitService" :loadedFile="loadedFile" />
	<TemplatePickerModal v-if="isModalOpen" @selectTemplate="selectTemplate"/>
</template>

<script lang="ts">
import { ref } from 'vue';
import './css/index.css';
import { defineComponent } from 'vue-demi';
import { RouterView, RouterLink } from 'vue-router';

import GithubClientService from './services/github-client.service';
import Editor from './views/Editor.vue';
import Navbar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import type { GitRepo } from '@/typings/GitService';
import TemplatePickerModal from './components/TemplatePickerModal.vue';
import NotificationService from './services/notification.service';
import NotificationLevel from './Interfaces/NotificationLevel';

let isModalOpen = ref(false)

export default defineComponent({
	components: {
	  TemplatePickerModal,
		Notification,
		Navbar,
		Editor,
		Footer,
	},

	data(): {
		roomId: string | null;
		gitService: GithubClientService | null;
		repo: GitRepo | null;
		loadedFile: string | null
	} {
		return {
			roomId: '',
			gitService: null,
			repo: null,
			loadedFile: null
		};
	},
	created() {
		this.$router.push('/');
	},
	mounted() {
		this.menuListener();
	},

	setup() {
		return {
			isModalOpen
		}
	},

	methods: {
		newBlankEditor() {
			this.$router.push('/');
			setTimeout(() => {
				this.roomId = '';
				(this.$refs.view as any)?.newBlankEditor();
			}, 1);
			this.loadedFile = null;
			this.gitService?.clearRepo();
		},

		async saveFile() {
			try {
				const editorData = (this.$refs.view as any)?.getEditorContent();
				if (this.loadedFile) {
					await window.ipcRenderer.invoke(
						'saveFile',
						this.loadedFile,
						editorData,
					);
					NotificationService.notify(
						NotificationLevel.Success,
						`File Saved`,
						``,
						2,
					);
				} else {
					await this.saveAsFile();
				}
			} catch (error) {}
		},

		async saveAsFile() {
			try {
				const editorData = (this.$refs.view as any)?.getEditorContent();
				const loaded = await window.ipcRenderer.invoke(
					'saveAsFile',
					editorData,
				);
				if (loaded) {
					this.loadedFile = loaded;
					NotificationService.notify(
						NotificationLevel.Success,
						`File Saved`,
						``,
						2,
					);
				}
			} catch (error) {}
		},

		async loadFile() {
			const file = await window.ipcRenderer.invoke('loadFile');
			this.loadedFile = file.path;

			(this.$refs.view as any)?.newEditorFromString(file.content);
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
			try {
				this.connectGit();
				await this.gitService?.authorize();
			} catch (error) {
				NotificationService.notify(
					NotificationLevel.Error,
					`Log In Failed`,
					``,
					3,
				);
			}
		},

		async logout() {
			try {
				await this.gitService?.logout();
				this.gitService = null;
			} catch (error) {}
		},

		selectRepo(repo: GitRepo) {
			this.repo = repo;
		},

		async useRepo() {
			try {
				await this.$router.push('/');
				await this.gitService?.cloneSelectedRepo();
				const fileContents: string | Error =
					await this.gitService?.getReadMeContents();
				if (fileContents instanceof Error) throw fileContents;
				(this.$refs.view as any).newEditorFromString(fileContents);

				NotificationService.notify(
					NotificationLevel.Success,
					`Cloned Repo <strong>${this.repo?.name}</strong>`,
					``,
					2,
				);
			} catch (error) {
				// logic to handle template modal
		  NotificationService.notify(
			  NotificationLevel.Warning,
			  `Cloned Repo <strong>${this.repo?.name}</strong> has no README.`,
			  `Select a template from the popup to get started. You can click cancel anytime to start with an empty README.`,
			  4,
		  );
					isModalOpen.value = true;
			}
		},

		commitChanges() {
			(this.$refs.view as any)?.commitChanges();
		},

		menuListener() {
			window.ipcRenderer.on('menu-new', () => {
				this.newBlankEditor();
			});
			window.ipcRenderer.on('menu-open', () => {
				this.loadFile();
			});
			window.ipcRenderer.on('menu-save', () => {
				this.saveFile();
			});
			window.ipcRenderer.on('menu-saveAs', () => {
				this.saveAsFile();
			});
		},
	  selectTemplate(md: string) {
			(this.$refs.view as any).newEditorFromString(md);
			NotificationService.notify(
				NotificationLevel.Success,
				`Successfully added README to <strong>${this.repo?.name}</strong>.`,
				``,
				4,
			);
	  }
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
