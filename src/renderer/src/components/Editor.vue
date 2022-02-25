<template id="test">
	Hi 🌮
	<button v-on:click="startCollabSession"> Collab Session</button>
	<br>
	<br>
</template>

<script lang="ts">
import { io, Socket } from 'socket.io-client';
import EditorService from '../services/editor.service';
import SocketService from '../services/socket.service';
import type { EditorView } from '@codemirror/view';

export default {
	data(): {view: EditorView,
	socket: Socket} {
		return {
			view: this.newEditorService(),
			socket: io(''),
		};
	},

	methods: {
		startCollabSession() {
			this.view.destroy();
			const roomId = "3265";
			const {socket, view} = new SocketService(roomId);
			if (socket) {
				this.socket = socket;
			}
			this.view = view;
		},
		
		newEditorService () {
			const editor = new EditorService().generateEditor()
			return editor;
		}
	},

	unmounted() {
		this.view.destroy();
	}

};
</script>
