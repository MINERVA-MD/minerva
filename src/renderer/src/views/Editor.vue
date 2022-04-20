<template>
<!--	<splitpanes class="default-theme view-container p-3">-->
<!--		<pane-->
<!--						class="overflow-auto editor-height border-r-2 outline-none border-gray-200 pr-2"-->
<!--						id="editor-container"-->
<!--						size="50" min-size="20" max-size="75"-->
<!--		/>-->

<!--		<pane class="overflow-auto" min-size="20" max-size="75">-->
<!--			<article-->
<!--					class="markdown-body editor-height p-3"-->
<!--					id="parsed-html"-->
<!--					v-html="parsedHTML"-->
<!--			></article>-->
<!--		</pane>-->
<!--	</splitpanes>-->
	<splitpanes class="default-theme view-container p-3">
			<pane>
				<div
						class="overflow-auto editor-height"
						id="editor-container"
				></div>
			</pane>

		<pane>
			<div class="overflow-auto">
				<article
						class="markdown-body editor-height p-3"
						id="parsed-html"
						v-html="parsedHTML"
				></article>
			</div>
		</pane>
	</splitpanes>
</template>

<script lang="ts">
import NavBar from '../components/NavBar.vue';
import EditorService from '../services/editor.service';
import type {EditorView} from '@codemirror/view';
import {defineComponent} from 'vue-demi';
import type {GitRepo} from '@/typings/GitService';
import type {Update} from '@codemirror/collab';
import NotificationLevel from "../Interfaces/NotificationLevel";
import NotificationService from "../services/notification.service";

import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';


export default defineComponent({
	props: ['gitService', 'loadedFile'],
	data(): {
		editorService: EditorService | null;
		view: EditorView | null;
		repos: GitRepo[] | null;
		repoSelect: string;
		repo: string;
		parsedHTML: string;
		roomId: string | null;
	} {
		return {
			editorService: null,
			view: null,
			repos: null,
			repoSelect: '',
			repo: '',
			parsedHTML: '',
			roomId: '',
		};
	},

	mounted() {
		this.view = this.newEditorService();
	},

	methods: {
		async createCollabSession() {
			const docJSON = this.view?.state.doc.toJSON();
			this.view?.destroy();
			this.view = this.newEditorService(true, docJSON?.join('\n'));
			this.roomId = EditorService.generateRoomId();
			this.editorService?.socketsCreateNewRoom(this.roomId);
			NotificationService.notify(
				NotificationLevel.Error,
					'Successfully Created Collaboration Session',
					'Copy and share RoomID to collaborate with others.',
					10

			);
			return this.roomId;
		},

		joinCollabSession(roomId: string) {
			this.roomId = roomId;
			this.view?.destroy();
			this.view = this.newEditorService(true);
			this.editorService?.socketsJoinRoom(this.roomId);
		},

		newEditorFromString(fileContents: string) {
			if (this.view) this.view.destroy();
			this.view = this.newEditorService(false, fileContents);
		},

		newBlankEditor() {
			this.roomId = '';
			if (this.editorService?.socket)
				this.editorService.disconnectSocket();
			this.view?.destroy();
			this.view = this.newEditorService();
		},

		async commitChanges() {
			const editorJSON = this.view?.state.doc.toJSON();
			const editorText = editorJSON?.join('\n');

			await window.ipcRenderer.invoke(
				'commit-changes',
				this.gitService?.repo.name,
				'README.md',
				editorText,
			);
		},

		getEditorContent() {
			return this.editorService?.getEditorContent();
		},

		newEditorService(
			socket = false,
			startDoc: string = '',
			startUpdates: Update[] = [],
		) {
			if (this.view) {
				this.view.destroy();
			}

			const doc = startDoc.split('\n');
			this.editorService = new EditorService(
				this,
				{
					doc: doc,
					updates: startUpdates,
				},
				socket,
			);

			return this.editorService.generateEditor();
		},
	},

	unmounted() {
		if (this.view) this.view.destroy();
	},
	components: {
		NavBar,
	  Splitpanes,
		Pane
	},
});
</script>

<style>
@import '../css/github-markdown.css';
</style>
