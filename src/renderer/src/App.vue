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
	<RouterView v-if="config" v-slot="{ Component }">
		<transition name="fade">
			<keep-alive>
				<component
					:is="Component"
					:gitService="gitService"
					:loadedFile="loadedFile"
					:parserService="parserService"
					:config="config"
					ref="view"
					@login="login"
					@logout="logout"
					@selectRepo="selectRepo"
					@useRepo="useRepo"
				/>
			</keep-alive>
		</transition>
	</RouterView>
	<Footer
		:gitService="gitService"
		:loadedFile="loadedFile"
		:parserService="parserService"
		@changeTarget="changeTarget"
	/>
	<TemplatePickerModal
		v-if="isModalOpen"
		:isModalOpen="isModalOpen"
		@selectTemplate="selectTemplate"
	/>
</template>

<script lang="ts">
import './css/index.css';
import { defineComponent } from 'vue-demi';
import { RouterView, RouterLink } from 'vue-router';

import GithubClientService from './services/github-client.service';
import Editor from './views/Editor.vue';
import Navbar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import type { GitRepo } from '@/types/GitService';
import type { MinervaPreferences } from '../../types/MinervaPreferences';
import TemplatePickerModal from './components/TemplatePickerModal.vue';
import NotificationService from './services/notification.service';
import NotificationLevel from './Interfaces/NotificationLevel';
import type { MarkupParser } from './services/parsers/markupParser';
import Markdown from './services/parsers/markdown';
import type { Target } from './services/parsers/markupParser';
import Fountain from './services/parsers/fountain';

export default defineComponent({
	components: {
		TemplatePickerModal,
		Notification,
		Navbar,
		Editor,
		Footer,
	},

	data(): {
		config: MinervaPreferences | null;
		roomId: string | null;
		gitService: GithubClientService | null;
		parserService: MarkupParser;
		repo: GitRepo | null;
		loadedFile: string | null;
		isModalOpen: boolean;
	} {
		return {
			config: null,
			roomId: '',
			gitService: null,
			parserService: new Markdown(),
			repo: null,
			loadedFile: null,
			isModalOpen: false,
		};
	},
	created() {
		this.$router.push('/');
	},

	async beforeMount() {
		this.config = await window.ipcRenderer.invoke('get-config');
	},

	mounted() {
		this.listeners();
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
			const file: { path: string; content: string } =
				await window.ipcRenderer.invoke('loadFile');
			this.loadedFile = file.path;

			(this.$refs.view as any)?.newEditorFromString(file.content);
			const fileExtension = this.loadedFile?.split('.').pop();

			switch (fileExtension) {
				case 'md':
					this.changeTarget('markdown');
					break;
				case 'fountain':
					this.changeTarget('fountain');
					break;
				default:
					break;
			}
		},

		changeTarget(target: Target) {
			switch (target) {
				case 'markdown':
					this.parserService = new Markdown();
					break;
				case 'fountain':
					this.parserService = new Fountain();
					break;

				default:
					break;
			}
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
				NotificationService.notify(
					NotificationLevel.Info,
					`Cloning repo...`,
					``,
					60,
				);
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
				this.isModalOpen = true;

				NotificationService.notify(
					NotificationLevel.Success,
					``,
					``,
					0.001,
				);
			}
		},

		commitChanges() {
			(this.$refs.view as any)?.commitChanges();
		},

		listeners() {
			// menu
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

			// global listeners
			window.ipcRenderer.on(
				'global-openWith',
				(_, fileHandle: { path: string; content: string }) => {
					(this.$refs.view as any)?.newEditorFromString(
						fileHandle.content,
					);
					this.loadedFile = fileHandle.path;
				},
			);

			// debug
			window.ipcRenderer.on('debug-log', (_, content: any) => {
				console.log(content);
			});
		},
		async selectTemplate(md: string) {
			(this.$refs.view as any).newEditorFromString(md);
			await window.ipcRenderer.invoke(
				'use-template',
				md,
				this.gitService?.repo?.name,
			);
			NotificationService.notify(
				NotificationLevel.Success,
				`Successfully added README to <strong>${this.repo?.name}</strong>.`,
				``,
				2,
			);
		},
	},
});
</script>

<style>
@import './css/github-markdown.css';
@import './css/fountain.css';

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
