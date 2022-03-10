/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { receiveUpdates } from '@codemirror/collab';
import { ChangeSet } from '@codemirror/state';
import type { EditorView } from '@codemirror/view';
import { io, Socket } from 'socket.io-client';
import EditorService from './editor.service';

export default class SocketService {
	socket: Socket;

	roomId: string | null;

	vueComponent: any;

	view: EditorView | null = null;

	constructor(vueComponent: any, roomId?: string | null) {
		// this.socket = io('https://text-sockets.herokuapp.com/');
		this.socket = io('http://localhost:8080/');

		this.vueComponent = vueComponent;

		// new session
		if (!roomId) {
			this.roomId = SocketService.generateRoomId();
			console.log(this.vueComponent.view.state.doc);
			this.view = new EditorService(
				vueComponent,
				{
					doc: this.vueComponent.view.state.doc.toJSON(),
					updates: [],
				},
				this.socket,
			).generateEditor();
			this.vueComponent.view.destroy();
			this.socketsCreateNewRoom();
			// create collab out of existing session
		} else {
			this.roomId = roomId;
			console.log(this.vueComponent.view.state.doc.toJSON());
			this.view = this.vueComponent.view;
			this.socketsJoinRoom();
		}
	}

	socketsCreateNewRoom() {
		this.socket.emit('create', {
			roomId: this.roomId,
			documentData: {
				doc: this.view?.state.doc,
				updates: [],
			},
		});
		this.socket.on('created', documentData => {
			console.log(documentData.updates);
			this.vueComponent.editorService.setDocumentState(documentData);
			if (this.vueComponent.view !== null) {
				this.socket.on('serverOpUpdate', changes => {
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

	socketsJoinRoom() {
		this.socket.emit('join', this.roomId);
		this.socket.on('joined', documentData => {
			this.vueComponent.editorService.setDocumentState(documentData);
			if (this.vueComponent.view !== null) {
				this.socket.on('serverOpUpdate', changes => {
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
		this.socket.close();
	}
}
