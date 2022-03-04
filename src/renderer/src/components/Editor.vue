<template id="test">
	Hi 🌮
	<button v-on:click="newBlankEditor">New</button>
	<button v-on:click="createCollabSession">Create Collab</button>
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
		socketService: SocketService | null;
		gitService: IGitClientService | null;
		repos: GitRepo[] | null;
		repoSelect: string;
		repo: string;
		parsedHTML: string;
	} {
		return {
			view: null,
			socketService: null,
			gitService: null,
			repos: null,
			repoSelect: '',
			repo: '',
			parsedHTML: '',
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
		createCollabSession() {},

		joinCollabSession() {
			this.view?.destroy();
			if (!this.socketService) {
				const roomId = '3265';
				this.socketService = new SocketService(this, roomId);
				this.view = this.socketService.getView();
			}
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
			return new EditorService(component, {
				doc: doc,
				updates: startUpdates,
			}).generateEditor();
		},

		connectGit() {
			this.gitService = new GithubClientService('testminerva');
		},

		newBlankEditor() {
			this.view?.destroy();
			this.view = this.newEditorService(this);
		},
	},

	unmounted() {
		if (this.view) this.view.destroy();
	},
});
</script>
