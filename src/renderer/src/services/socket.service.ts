/* eslint-disable @typescript-eslint/no-explicit-any */
import { receiveUpdates } from '@codemirror/collab';
import { ChangeSet } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { io, Socket } from 'socket.io-client';
import EditorService from './editor.service';

export default class SocketService {
	socket: Socket;

	roomId: string;

	view: EditorView;

	constructor(roomId: string) {
		// /this.socket = io('https://text-sockets.herokuapp.com/');
		this.view = new EditorView();

		this.socket = io('http://localhost:8080/');
		this.roomId = roomId;
		this.socket.emit('join', roomId);
		this.socket.on('joined', documentData => {
			const editor = new EditorService(documentData, this.socket);
			this.view = editor.generateEditor();

			if (this.view !== null) {
				this.socket.on('serverOpUpdate', changes => {
					const deserializedChangeSet = changes.updates.map(
						(u: { updateJSON: any; clientID: string }) => {
							return {
								changes: ChangeSet.fromJSON(u.updateJSON),
								clientID: u.clientID,
							};
						},
					);
					this.view.dispatch(
						receiveUpdates(this.view.state, deserializedChangeSet),
					);
				});
			}
		});
	}

	getView() {
		if (this.view) {
			return this.view;
		}
		return false;
	}

	disconnect() {
		this.socket.close();
	}

	// listen() {
	// 	this.socket.on('joined', documentData => {});
	// }
}
