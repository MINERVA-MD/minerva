<template>
	<div id="menu">
		<div class="absolute w-12 overflow-hidden inline-block right-3.5 mt-7">
			<div
				class="h-7 w-9 bg-minerva-purple rotate-45 transform origin-bottom-left"
			></div>
		</div>
		<div
			class="absolute bg-minerva-purple w-72 right-4 mt-12 rounded-xl p-4 shadow-lg text-white"
		>
			<button
				@click="newFile"
				class="text-left font-semibold w-full p-2 hover:bg-white/20 rounded transition-all duration-100"
			>
				New File
			</button>
			<!-- <button
					class="text-left font-semibold w-full p-2 hover:bg-white/20 rounded transition-all duration-100"
				>
					Save
				</button> -->
			<RouterLink to="/gitservice">
				<button
					class="text-left font-semibold w-full p-2 hover:bg-white/20 rounded transition-all duration-100"
				>
					Connect to Github
				</button>
			</RouterLink>
			<p class="text-white text-opacity-70 mt-1 text-right text-sm">
				Collaboration
			</p>
			<hr class="mb-3 opacity-70" />
			<button
				@click="createCollabSession"
				class="text-left font-semibold w-full p-2 hover:bg-white/20 rounded transition-all duration-100"
			>
				Create Session
			</button>
			<div class="w-full p-2 flex font-semibold">
				Join Session:
				<input
					class="w-16 px-1 h-7 rounded text-black ml-1"
					type="text"
					v-model="inputRoomId"
					placeholder="ID"
				/>
				<button
					class="px-3 font-semibold ml-3 bg-white text-minerva-purple rounded hover:bg-opacity-90 transition-all duration-100"
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
	data(): {
		inputRoomId: string;
	} {
		return {
			inputRoomId: '',
		};
	},

	methods: {
		newFile() {
			this.$emit('newFile');
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
