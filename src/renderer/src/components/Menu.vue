<template>
	<div id="menu">
		<div
			class="absolute border bg-white border-gray-300 w-56 right-4 mt-10 rounded-xl p-4 shadow-lg text-minerva-gray text-sm"
		>
			<button
				@click="newFile"
				class="text-left font-semibold w-full p-2 hover:bg-gray-400/20 rounded transition-all duration-100 flex justify-between"
			>
				New
				<span class="text-gray-400"
					>{{ isMacOs ? '⌘' : 'Ctrl + ' }}N</span
				>
			</button>
			<button
				class="text-left font-semibold w-full p-2 hover:bg-gray-400/20 rounded transition-all duration-100 flex justify-between"
				@click="loadFile"
			>
				Open
				<span class="text-gray-400"
					>{{ isMacOs ? '⌘' : 'Ctrl + ' }}O</span
				>
			</button>
			<button
				class="text-left font-semibold w-full p-2 hover:bg-gray-400/20 rounded transition-all duration-100 flex justify-between"
				@click="saveFile"
				:disabled="loadedFile === null"
			>
				Save
				<span class="text-gray-400"
					>{{ isMacOs ? '⌘' : 'Ctrl + ' }}S</span
				>
			</button>
			<button
				class="text-left font-semibold w-full p-2 hover:bg-gray-400/20 rounded transition-all duration-100 flex justify-between"
				@click="saveAsFile"
			>
				Save as
				<span class="text-gray-400"
					>{{ isMacOs ? '⇧ + ⌘' : '⇧ + Ctrl + ' }}S</span
				>
			</button>
			<RouterLink to="/gitservice">
				<button
					class="text-left font-semibold w-full p-2 hover:bg-gray-400/20 rounded transition-all duration-100"
				>
					{{
						gitService
							? gitService.username
								? 'Sign out of Github'
								: 'Connect to Github'
							: 'Connect to Github'
					}}
				</button>
			</RouterLink>
			<p class="text-gray-400 mt-3 text-right text-sm">Collaboration</p>
			<hr class="mb-3 opacity-70" />
			<button
				@click="createCollabSession"
				class="text-left font-semibold w-full p-2 hover:bg-gray-400/20 rounded transition-all duration-100"
			>
				Create Session
			</button>
			<div class="w-full p-2 flex font-semibold items-center">
				Join:
				<input
					class="w-16 px-2 h-7 rounded text-minerva-gray ml-2 border border-gray-300 text-sm"
					type="text"
					v-model="inputRoomId"
					placeholder="ID"
				/>
				<button
					class="px-3 py-1 font-semibold ml-3 bg-minerva-purple text-white rounded hover:bg-opacity-90 transition-all duration-100"
					@click="joinSession(inputRoomId)"
				>
					Join
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';

export default defineComponent({
	props: ['gitService', 'loadedFile'],
	data(): {
		inputRoomId: string;
		isMacOs: boolean;
	} {
		return {
			inputRoomId: '',
			isMacOs: navigator?.userAgent.toLowerCase().includes('mac'),
		};
	},

	methods: {
		newFile() {
			this.$emit('newFile');
		},
		saveFile() {
			this.$emit('saveFile');
		},
		saveAsFile() {
			this.$emit('saveAsFile');
		},
		loadFile() {
			this.$emit('loadFile');
		},
		createCollabSession() {
			this.$emit('createCollabSession');
		},
		joinSession(roomId: string) {
			this.$emit('joinSession', roomId);
		},
	},
});
</script>
