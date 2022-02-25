<template id="test">
	Hi 🌮
	<button v-on:click="startCollabSession"> Collab Session</button>
</template>

<script lang="ts">
import { io, Socket } from 'socket.io-client';
import EditorService from '../services/editor.service';
import SocketService from '../services/socket.service';

export default {
	data() {
		return {
			view: this.newEditorService(),
			socket: io(''),
			test: 'asd',
		};
	},

	methods: {
		startCollabSession() {
			const roomId = "3265";
			const {socket}	= new SocketService(roomId);
			if (socket) {
				this.socket = socket;
			}
		},
		
		newEditorService () {
			this.view = null;
			new EditorService().generateEditor()
		}
	},

};
</script>
