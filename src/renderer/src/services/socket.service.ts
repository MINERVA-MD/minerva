/* eslint-disable @typescript-eslint/no-explicit-any */
import { receiveUpdates } from '@codemirror/collab';
import { ChangeSet } from '@codemirror/state';
import { io, Socket } from 'socket.io-client';
import EditorService from './editor.service';

export default class SocketService {
	socket: Socket;

	roomId: string;

	vueComponent: any;

	constructor(vueComponent: any, roomId: string) {
		// this.socket = io('https://text-sockets.herokuapp.com/');
		this.socket = io('http://localhost:8080/');

		this.vueComponent = vueComponent;
		// perhaps split this constructor into two funcs, one for join and one for create
		this.roomId = roomId;
		this.socket.emit('join', roomId);
		this.socket.on('joined', documentData => {
			// this should be for joining not creating since creating should take in
			// current doc state
			const editor = new EditorService(
				vueComponent,
				documentData,
				this.socket,
			);
			this.vueComponent.view = editor.generateEditor(vueComponent);

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
					vueComponent.view.dispatch(
						receiveUpdates(
							vueComponent.view.state,
							deserializedChangeSet,
						),
					);
				});
			}
		});
	}

	getView() {
		if (this.vueComponent.view) return this.vueComponent.view;
		return false;
	}

	disconnect() {
		this.socket.close();
	}

	// listen() {
	// 	this.socket.on('joined', documentData => {});
	// }
}
