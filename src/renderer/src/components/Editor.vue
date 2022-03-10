<template id="test">
	<button v-on:click="newBlankEditor">New</button>
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
	<span v-if="roomId"> room id: {{ roomId }} </span>
	<br />
	<br />
	<div
		class="view-container"
		style="display: grid; grid-template-columns: 1fr 1fr"
	>
		<div
			id="editor-container"
			style="border-right: 1px lightgray solid; height: 90vh"
		></div>
		<div
			class="markdown-body light-scheme"
			id="parsed-html"
			v-html="parsedHTML"
		></div>
	</div>
</template>

<script lang="ts">
import type { Socket } from 'socket.io-client';
import EditorService from '../services/editor.service';
import type { EditorView } from '@codemirror/view';
import GithubClientService from '../services/github-client.service';
import { defineComponent } from 'vue-demi';
import type IGitClientService from '../Interfaces/IGitClientService';
import type { GitRepo } from '@/typings/GitService';
import type { Update } from '@codemirror/collab';

export default defineComponent({
	data(): {
		editorService: EditorService | null;
		view: EditorView | null;
		gitService: IGitClientService | null;
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

		// listeners
		window.ipcRenderer.on('repos', (event, userRepos) => {
			this.repos = userRepos;
		});
		window.ipcRenderer.on('repo-content', (event, repoContent) => {
			if (this.view) this.view.destroy();
			this.view = this.newEditorService(this, repoContent);
		});
	},

	updated() {
		if (this.repoSelect !== this.repo) {
			this.repo = this.repoSelect;
			const url = `https://raw.githubusercontent.com/${this.gitService?.username}/${this.repo}/main/README.md`;
			this.gitService?.getRepoContent(url);
		}
	},

	methods: {
		createCollabSession() {
			//this.socketService = new SocketService(this);
			this.roomId = EditorService.generateRoomId();
			this.editorService?.socketsCreateNewRoom(this.roomId);
		},

		joinCollabSession() {
			if (!this.editorService?.socket) {
				this.editorService?.openSocketConnection();
			}
			this.roomId = this.inputRoomId;
			this.editorService?.socketsJoinRoom(this.roomId);
			this.inputRoomId = '';
		},

		newEditorService(
			component: any,
			startDoc: string = '',
			startUpdates: Update[] = [],
		) {
			if (this.view) {
				this.view.destroy();
			}
			const doc = startDoc.split('\n');
			this.editorService = new EditorService(component, {
				doc: doc,
				updates: startUpdates,
			});

			return this.editorService.generateEditor();
		},

		connectGit() {
			this.gitService = new GithubClientService('testminerva');
		},

		newBlankEditor() {
			this.roomId = '';
			this.view?.destroy();
			this.view = this.newEditorService(this);
			this.socketService?.disconnect();
			this.socketService = null;
		},
	},

	unmounted() {
		if (this.view) this.view.destroy();
	},
});
</script>
