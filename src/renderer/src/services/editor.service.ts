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
import { marked } from 'marked';

export default class EditorService {
	doc: Text;

	updates: Update[];

	socket: Socket | null;

	view: EditorView | null = null;

	vueComponent: any;

	constructor(
		vueComponent: any,
		documentData: { doc: string[]; updates: Update[] },
		socket: Socket | null = null,
	) {
		this.doc = Text.of(documentData.doc);
		this.updates = documentData.updates;
		this.socket = socket;
		this.vueComponent = vueComponent;
		const documenString = documentData.doc.join('\n');
		this.vueComponent.parsedHTML = marked.parse(documenString);
	}

	generateEditor(vueComponent: any) {
		const state = EditorState.create({
			doc: this.doc,
			extensions: [
				basicSetup,
				markdown(),
				collab({ startVersion: this.updates.length }),
				EditorView.lineWrapping,
				this.editorClient(vueComponent, this.socket),
			],
		});

		const view = new EditorView({
			state,
			parent: document.getElementById('editor-container') || undefined, // document.getElementById('editor'),
		});

		this.view = view;
		return view;
	}

	// parseMD(test: string) {
	// 	const md = parse(test);
	// 	return md;
	// }

	editorClient(vueComponent: any, socket: Socket | null) {
		let plugin;
		if (socket !== null) {
			plugin = ViewPlugin.define(view => ({
				update(editorUpdate) {
					if (editorUpdate.docChanged) {
						// update parser
						const doc = view.state.doc.toJSON();
						const documentString = doc.join('\n');
						// eslint-disable-next-line no-param-reassign
						vueComponent.parsedHTML = marked.parse(documentString);

						// send updates to server
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
		} else {
			plugin = ViewPlugin.define(view => ({
				update(editorUpdate) {
					if (editorUpdate.docChanged) {
						const doc = view.state.doc.toJSON();
						const documentString = doc.join('\n');
						// eslint-disable-next-line no-param-reassign
						vueComponent.parsedHTML = marked.parse(documentString);
					}
				},
			}));
		}
		return plugin;
	}
}
