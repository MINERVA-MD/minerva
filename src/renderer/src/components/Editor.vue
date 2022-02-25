<template id="test">
	Hi 🌮
	<button>Collab Session</button>
</template>

<script lang="ts">
import { io } from 'socket.io-client';
import EditorService from '../services/editor.service';

export default {
	data() {
		return {
			view: new EditorService().generateEditor(),
		};
	},

	methods: {},

	unmounted() {},
};
</script>
