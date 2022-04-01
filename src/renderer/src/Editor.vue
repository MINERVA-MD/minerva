<template>
	<NavBar
		:roomId="roomId"
		@newFile="newBlankEditor"
		@createCollabSession="createCollabSession"
	/>
	<!-- <button v-on:click="newBlankEditor">New</button>
	<button v-on:click="createCollabSession">Create Collab</button>
	<input type="text" v-model="inputRoomId" placeholder="room id" />
	<button v-on:click="joinCollabSession">Join Collab</button>
	<button v-on:click="connectGit">Connect Git</button>
	<select name="repos" id="repos" v-model="repoSelect">
		<option default disabled value="">
			{{ gitService ? 'Repositories' : 'No Git Service' }}
		</option>
		<option v-for="repo in repos" :value="repo.name" :key="repo.name">
			{{ repo.name }}
		</option>
	</select>
	<button
		type="button"
		style="background-color: green; color: white"
		v-on:click="commitChanges"
	>
		commit
	</button> -->
	<div class="view-container grid grid-cols-2 gap-2 p-3">
		<div
			class="overflow-auto editor-height border-r-2 outline-none border-gray-200 pr-2"
			id="editor-container"
		></div>
		<div class="overflow-auto">
			<article
				class="markdown-body editor-height p-3"
				id="parsed-html"
				v-html="parsedHTML"
			></article>
		</div>
	</div>
</template>

<script lang="ts">
import NavBar from './components/NavBar.vue';
import EditorService from './services/editor.service';
import type { EditorView } from '@codemirror/view';
import GithubClientService from './services/github-client.service';
import { defineComponent } from 'vue-demi';
import type IGitClientService from './Interfaces/IGitClientService';
import type { GitRepo } from '@/typings/GitService';
import type { Update } from '@codemirror/collab';

export default defineComponent({
	data(): {
		editorService: EditorService | null;
		view: EditorView | null;
		gitService: GithubClientService | null;
		repos: GitRepo[] | null;
		repoSelect: string;
		repo: string;
		parsedHTML: string;
		inputRoomId: string;
		roomId: string | null;
	} {
		return {
			editorService: null,
			view: null,
			gitService: null,
			repos: null,
			repoSelect: '',
			repo: '',
			parsedHTML: '',
			inputRoomId: '',
			roomId: '',
		};
	},

	mounted() {
		this.view = this.newEditorService(this);
		// instantiate listener method that listens for main events from menu options
	},

	async updated() {
		if (this.repoSelect !== this.repo && this.gitService) {
			this.repo = this.repoSelect;
			this.gitService.repo = this.repo;

			await this.gitService.cloneSelectedRepo();
			const fileContents = await this.gitService.getReadMeContents();

			if (this.view) this.view.destroy();
			this.view = this.newEditorService(this, false, fileContents);
		}
	},

	methods: {
		listen() {
			// listen for menu events here
		},

		createCollabSession() {
			const docJSON = this.view?.state.doc.toJSON();
			this.view?.destroy();
			this.view = this.newEditorService(this, true, docJSON?.join('\n'));
			this.roomId = EditorService.generateRoomId();
			this.editorService?.socketsCreateNewRoom(this.roomId);
		},

		joinCollabSession() {
			this.view?.destroy();
			this.view = this.newEditorService(this, true);
			this.roomId = this.inputRoomId;
			this.editorService?.socketsJoinRoom(this.roomId);
			this.inputRoomId = '';
		},

		newEditorService(
			component: any,
			socket = false,
			startDoc: string = '',
			startUpdates: Update[] = [],
		) {
			if (this.view) {
				this.view.destroy();
			}

			const doc = startDoc.split('\n');
			this.editorService = new EditorService(
				component,
				{
					doc: doc,
					updates: startUpdates,
				},
				socket,
			);

			return this.editorService.generateEditor();
		},

		async connectGit() {
			this.gitService = new GithubClientService(
				'testminerva',
				'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',
			);
			this.repos = await this.gitService.getRepoList();
		},

		async commitChanges() {
			const editorJSON = this.view?.state.doc.toJSON();
			const editorText = editorJSON?.join('\n');

			await window.ipcRenderer.invoke(
				'commit-changes',
				this.repo,
				'README.md',
				editorText,
			);
		},

		newBlankEditor() {
			this.roomId = '';
			if (this.editorService?.socket)
				this.editorService.disconnectSocket();
			this.view?.destroy();
			this.view = this.newEditorService(this);
		},
	},

	unmounted() {
		if (this.view) this.view.destroy();
	},
	components: { NavBar },
});
</script>
