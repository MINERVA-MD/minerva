<template id="test">
	Hi 🌮
	<button v-on:click="createCollabSession">Create Collab</button>
	<button v-on:click="joinCollabSession">Join Collab</button>
	<button v-on:click="testGit">Connect Git</button>
	<select name="repos" id="repos" v-model="currentRepo">
		<option default disabled value="">
			{{ gitService ? 'Repositories' : 'No Git Service' }}
		</option>
		<option v-for="repo in repos" :value="repo.name" :key="repo.name">
			{{ repo.name }}
		</option>
	</select>
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
		<div id="parsed-html">
			<!-- {{ this.view.state.doc.toString() }} -->
		</div>
	</div>
</template>

<script lang="ts">
import type { Socket } from 'socket.io-client';
import EditorService from '../services/editor.service';
import SocketService from '../services/socket.service';
import type { EditorView } from '@codemirror/view';
import GithubClientService from '../services/github-client.service';
import { defineComponent } from 'vue-demi';
import type IGitClientService from '../Interfaces/IGitClientService';
import type { GitRepo } from '@/typings/GitService';
import type { Update } from '@codemirror/collab';

export default defineComponent({
	data(): {
		view: EditorView | null;
		socket: Socket | null;
		gitService: IGitClientService | null;
		repos: GitRepo[] | null;
		currentRepo: string;
		parsedHTML: string;
	} {
		return {
			view: null,
			socket: null,
			gitService: null,
			repos: null,
			currentRepo: '',
			parsedHTML: '',
		};
	},

	mounted() {
		this.view = this.newEditorService();
		// listeners
		window.ipcRenderer.on('repos', (event, userRepos) => {
			this.repos = userRepos;
		});
		window.ipcRenderer.on('repo-content', (event, repoContent) => {
			console.log(repoContent);
			this.view = this.newEditorService(repoContent);
		});
	},

	updated() {
		if (this.currentRepo) {
			const url = `https://raw.githubusercontent.com/${this.gitService?.username}/${this.currentRepo}/main/README.md`;
			this.gitService?.getRepoContent(url);
		}
	},

	methods: {
		createCollabSession() {},

		joinCollabSession() {
			if (this.view) {
				this.view.destroy();
				const roomId = '3265';
				const { socket, view } = new SocketService(roomId);
				if (socket) {
					this.socket = socket;
				}
				this.view = view;
			}
		},

		newEditorService(startDoc: string = '', startUpdates: Update[] = []) {
			if (this.view) {
				this.view.destroy();
			}
			const doc = startDoc.split('\n');
			return new EditorService({
				doc: doc,
				updates: startUpdates,
			}).generateEditor();
		},

		testGit() {
			this.gitService = new GithubClientService('testminerva');
		},
	},

	unmounted() {
		if (this.view) this.view.destroy();
	},
});
</script>
