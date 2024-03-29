/* eslint-disable no-plusplus */
/* eslint-disable import/no-relative-packages */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { EditorState, basicSetup, EditorView } from '@codemirror/basic-setup';
import {
	sendableUpdates,
	collab,
	getSyncedVersion,
	type Update,
	receiveUpdates,
} from '@codemirror/collab';
import { markdown } from '@codemirror/lang-markdown';
import { Text } from '@codemirror/text';
import { ViewPlugin } from '@codemirror/view';
import { io, Socket } from 'socket.io-client';
import { marked } from 'marked';
import { ChangeSet } from '@codemirror/state';
import { vim, Vim } from '@replit/codemirror-vim';
import type { MinervaPreferences } from '../../../types/MinervaPreferences';

import type { MarkupParser } from './parsers/markupParser';

export const MINERVA_LOCAL_SOCKET_SERVER_URL = 'http://localhost:8080/';
export const MINERVA_SOCKET_SERVER_URL = 'https://text-sockets.herokuapp.com/';

export default class EditorService {
	doc: Text;

	updates: Update[];

	socket: Socket | null;

	roomId = '';

	view: EditorView;

	vueComponent: any;

	parserService: MarkupParser;

	config: MinervaPreferences;

	constructor(
		parserService: MarkupParser,
		config: MinervaPreferences,
		vueComponent: any,
		documentData: { doc: string[]; updates: Update[] },
		socket: boolean,
	) {
		this.parserService = parserService;
		this.config = config;
		this.doc = Text.of(documentData.doc);
		this.updates = documentData.updates;
		this.vueComponent = vueComponent;
		const documentString = documentData.doc.join('\n');
		this.vueComponent.parsedHTML = parserService.parse(documentString);
		this.view = new EditorView();
		if (socket) {
			this.socket = this.openSocketConnection();
		} else {
			this.socket = null;
		}
	}

	generateEditor(doc?: Text, updates?: Update[]) {
		let docText: Text = this.doc;
		if (doc) {
			docText = doc;
		}

		let version: number = this.updates.length;
		if (updates) {
			version = updates.length;
		}

		const state = EditorState.create({
			doc: docText,
			extensions: [
				...this.getEditorSettingsFromConfig(),
				basicSetup,
				markdown(),
				collab({ startVersion: version }),
				EditorView.lineWrapping,
				this.editorClient(this.vueComponent, this.socket),
			],
		});

		const view = new EditorView({
			state,
			parent: document.getElementById('editor-container') || undefined,
		});

		this.view = view;
		return view;
	}

	editorClient(vueComponent: any, socket: Socket | null) {
		let plugin;
		if (socket !== null) {
			plugin = ViewPlugin.define(view => ({
				update: editorUpdate => {
					if (editorUpdate.docChanged) {
						// update parser
						const doc = view.state.doc.toJSON();
						const documentString = doc.join('\n');
						// eslint-disable-next-line no-param-reassign
						vueComponent.parsedHTML =
							this.parserService.parse(documentString);

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
				update: editorUpdate => {
					if (editorUpdate.docChanged) {
						const doc = view.state.doc.toJSON();
						const documentString = doc.join('\n');
						// eslint-disable-next-line no-param-reassign
						vueComponent.parsedHTML =
							this.parserService.parse(documentString);
					}
				},
			}));
		}
		return plugin;
	}

	openSocketConnection() {
		return io(MINERVA_SOCKET_SERVER_URL);
		// return io(MINERVA_LOCAL_SOCKET_SERVER_URL);
	}

	socketsCreateNewRoom(roomId: string) {
		this.roomId = roomId;
		this.doc = this.view.state.doc;

		this.socket?.emit('create', {
			roomId: this.roomId,
			documentData: {
				doc: this.view.state.doc,
				updates: [],
			},
		});

		this.socket?.on('created', documentData => {
			this.socket?.on('serverOpUpdate', changes => {
				const deserializedChangeSet = changes.updates.map(
					(u: { updateJSON: any; clientID: string }) => {
						return {
							changes: ChangeSet.fromJSON(u.updateJSON),
							clientID: u.clientID,
						};
					},
				);

				this.view?.update([
					receiveUpdates(this.view.state, deserializedChangeSet),
				]);
			});
		});
	}

	socketsJoinRoom(roomId: string) {
		this.view.destroy();
		this.roomId = roomId;

		this.socket?.emit('join', this.roomId);
		this.socket?.on('joined', documentData => {
			this.view = this.generateEditor(
				Text.of(documentData.doc),
				documentData.updates,
			);
			this.vueComponent.view = this.view;
			const documentString = documentData.doc.join('\n');
			this.vueComponent.parsedHTML = marked.parse(documentString);

			this.socket?.on('serverOpUpdate', changes => {
				const deserializedChangeSet = changes.updates.map(
					(u: { updateJSON: any; clientID: string }) => {
						return {
							changes: ChangeSet.fromJSON(u.updateJSON),
							clientID: u.clientID,
						};
					},
				);
				this.view?.update([
					receiveUpdates(this.view.state, deserializedChangeSet),
				]);
			});
		});
	}

	// TODO: Pull this out into Util Class
	static generateRoomId() {
		let result = '';
		const roomIdLength = 5;
		const characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < roomIdLength; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * charactersLength),
			);
		}
		return result;
	}

	getEditorContent() {
		return this.view.state.doc.toJSON().join('\n');
	}

	disconnectSocket() {
		this.socket?.close();
	}

	getEditorSettingsFromConfig() {
		const preferences = [];

		if (this.config?.editor?.vimMode) {
			preferences.push(vim({ status: true }));
		}

		return preferences;
	}
}
