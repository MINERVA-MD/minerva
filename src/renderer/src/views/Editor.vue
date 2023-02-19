<template>
	<splitpanes class="default-theme view-container p-3 pl-0">
		<pane size="50" min-size="20" max-size="75">
			<div
				class="overflow-auto editor-height pr-1.5"
				id="editor-container"
			></div>
		</pane>

		<pane size="50" min-size="20" max-size="75">
			<div class="overflow-auto">
				<article
					class="editor-height p-3"
					:class="parserService.className"
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
import type { EditorView } from '@codemirror/view';
import { defineComponent } from 'vue-demi';
import type { GitRepo } from '@/types/GitService';
import type { Update } from '@codemirror/collab';
import NotificationLevel from '../Interfaces/NotificationLevel';
import NotificationService from '../services/notification.service';

import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import type { MarkupParser } from '../services/parsers/markupParser';
import Markdown from '../services/parsers/markdown';
import type { MinervaPreferences } from '@/types/MinervaPreferences';

export default defineComponent({
	props: ['gitService', 'loadedFile', 'parserService', 'config'],
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
		this.view = this.newEditorService(this.parserService);
	},

	watch: {
		parserService: function () {
			this.newEditorFromString(this.getEditorContent() || '');
		},
	},

	methods: {
		async createCollabSession() {
			const docJSON = this.view?.state.doc.toJSON();
			this.view?.destroy();
			this.view = this.newEditorService(
				this.parserService,
				true,
				docJSON?.join('\n'),
			);
			this.roomId = EditorService.generateRoomId();
			this.editorService?.socketsCreateNewRoom(this.roomId);
			NotificationService.notify(
				NotificationLevel.Success,
				'Successfully Created Collaboration Session',
				'Copy and share RoomID to collaborate with others!',
				4,
			);
			return this.roomId;
		},

		async joinCollabSession(roomId: string) {
			this.roomId = roomId;
			this.view?.destroy();
			this.view = this.newEditorService(undefined, true);
			this.editorService?.socketsJoinRoom(this.roomId);
			NotificationService.notify(
				NotificationLevel.Success,
				`Joined Room ${roomId}`,
				'You have joined a collaborative session!',
				3,
			);
		},

		newEditorFromString(fileContents: string) {
			if (this.view) this.view.destroy();
			this.view = this.newEditorService(
				this.parserService,
				false,
				fileContents,
			);
		},

		newBlankEditor() {
			this.roomId = '';
			if (this.editorService?.socket)
				this.editorService.disconnectSocket();
			this.view?.destroy();
			this.view = this.newEditorService(this.parserService);
		},

		async commitChanges() {
			const editorJSON = this.view?.state.doc.toJSON();
			const editorText = editorJSON?.join('\n');

			try {
				const res = await window.ipcRenderer.invoke(
					'commit-changes',
					this.gitService?.repo.name,
					'README.md',
					editorText,
				);
				if (res instanceof Error) throw res;

				NotificationService.notify(
					NotificationLevel.Success,
					`Successfully Committed`,
					`Changes committed and pushed to ${this.gitService?.repo.name}`,
					3,
				);
			} catch (error) {
				NotificationService.notify(
					NotificationLevel.Error,
					`Error Committing Changes`,
					`There was an issue when trying to commit and push, try again.`,
					3,
				);
			}
		},

		getEditorContent() {
			return this.editorService?.getEditorContent();
		},

		newEditorService(
			parserService: MarkupParser = new Markdown(),
			socket = false,
			startDoc: string = '',
			startUpdates: Update[] = [],
		) {
			if (this.view) {
				this.view.destroy();
			}

			const doc = startDoc.split('\n');
			this.editorService = new EditorService(
				parserService,
				this.config,
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
		Pane,
	},
});
</script>

<style>
@import '../css/github-markdown.css';
@import '../css/fountain.css';
</style>
