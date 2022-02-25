import { io, Socket } from 'socket.io-client';

export default class SocketService {
	socket: Socket;

	roomId: string;

	constructor(roomId: string) {
		this.socket = io('https://text-sockets.herokuapp.com/');
		this.roomId = roomId;
		this.socket.emit('join', roomId);
	}

	joinRoom(roomId: string) {
		this.roomId = roomId;
		this.socket.emit('join', roomId);
	}

	disconnect() {
		this.socket.close();
	}
}
