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

export default class EditorService {
	doc: Text;

	updates: Update[];

	socket: Socket | null;

	roomId = '';

	view: EditorView;

	vueComponent: any;

	constructor(
		vueComponent: any,
		documentData: { doc: string[]; updates: Update[] },
	) {
		this.doc = Text.of(documentData.doc);
		this.updates = documentData.updates;
		this.vueComponent = vueComponent;
		const documenString = documentData.doc.join('\n');
		this.vueComponent.parsedHTML = marked.parse(documenString);
		this.view = new EditorView();
	}

	generateEditor(doc?: Text) {
		let docText: Text = this.doc;
		if (doc) {
			docText = doc;
		}
		console.log(docText);

		const state = EditorState.create({
			doc: docText,
			extensions: [
				basicSetup,
				markdown(),
				collab({ startVersion: this.updates.length }),
				EditorView.lineWrapping,
				this.editorClient(this.vueComponent),
			],
		});

		const view = new EditorView({
			state,
			parent: document.getElementById('editor-container') || undefined, // document.getElementById('editor'),
		});

		this.view = view;
		return view;
	}

	// setDocumentState(documentData: { doc: string[]; updates: Update[] }) {}

	editorClient(vueComponent: any) {
		const { socket } = this;
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
						console.log(unsentUpdates);

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

	openSocketConnection() {
		// this.socket = io('https://text-sockets.herokuapp.com/');
		return io('http://localhost:8080/');
	}

	socketsCreateNewRoom(roomId: string) {
		this.socket = this.openSocketConnection();
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
			console.log(documentData.doc, this.view.state);
			this.vueComponent.editorService.setDocumentState(documentData);
			if (this.vueComponent.view !== null) {
				this.socket?.on('serverOpUpdate', changes => {
					const deserializedChangeSet = changes.updates.map(
						(u: { updateJSON: any; clientID: string }) => {
							return {
								changes: ChangeSet.fromJSON(u.updateJSON),
								clientID: u.clientID,
							};
						},
					);
					this.view?.dispatch(
						receiveUpdates(this.view.state, deserializedChangeSet),
					);
				});
			}
		});
	}

	socketsJoinRoom(roomId: string) {
		this.roomId = roomId;
		this.view.destroy();

		this.socket?.emit('join', this.roomId);
		this.socket?.on('joined', documentData => {
			console.log(documentData.doc);
			this.generateEditor(Text.of(documentData.doc));
			if (this.vueComponent.view !== null) {
				this.socket?.on('serverOpUpdate', changes => {
					const deserializedChangeSet = changes.updates.map(
						(u: { updateJSON: any; clientID: string }) => {
							return {
								changes: ChangeSet.fromJSON(u.updateJSON),
								clientID: u.clientID,
							};
						},
					);
					this.view?.dispatch(
						receiveUpdates(this.view.state, deserializedChangeSet),
					);
				});
			}
		});
	}

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

	disconnect() {
		this.socket?.close();
	}
}
