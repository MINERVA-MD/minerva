/* eslint-disable import/no-relative-packages */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { EditorState, basicSetup, EditorView } from '@codemirror/basic-setup';
import {
	sendableUpdates,
	collab,
	getSyncedVersion,
	type Update,
} from '@codemirror/collab';
import { markdown } from '@codemirror/lang-markdown';
import { Text } from '@codemirror/text';
import { ViewPlugin } from '@codemirror/view';
import type { Socket } from 'socket.io-client';

export default class EditorService {
	doc: Text;

	updates: Update[];

	socket: Socket | null;

	view: EditorView | null = null;

	constructor(
		documentData: { doc: string[]; updates: Update[] },
		socket: Socket | null = null,
	) {
		this.doc = Text.of(documentData.doc);
		this.updates = documentData.updates;
		this.socket = socket;
	}

	generateEditor() {
		const state = EditorState.create({
			doc: this.doc,
			extensions: [
				basicSetup,
				markdown(),
				collab({ startVersion: this.updates.length }),
				EditorView.lineWrapping,
				this.editorClient(this.socket),
			],
		});

		const view = new EditorView({
			state,
			parent: document.body,
		});

		this.view = view;
		return view;
	}

	// parseMD(test: string) {
	// 	const md = parse(test);
	// 	return md;
	// }

	editorClient(socket: Socket | null) {
		if (socket !== null) {
			const plugin = ViewPlugin.define(view => ({
				update(editorUpdate) {
					if (editorUpdate.docChanged) {
						const unsentUpdates = sendableUpdates(view.state).map(
							u => {
								const serializedUpdate = {
									updateJSON: u.changes.toJSON(),
									clientID: u.clientID,
								};

								return serializedUpdate;
							},
						);

						socket.emit('clientOpUpdate', {
							version: getSyncedVersion(view.state),
							updates: unsentUpdates,
						});
					}
				},
			}));
			return plugin;
		}
		return ViewPlugin.define(view => ({}));
	}
}
