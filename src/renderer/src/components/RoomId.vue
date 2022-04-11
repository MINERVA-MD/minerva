<template>
	<div class="ml-6 flex items-center">
		<span v-if="roomId" class="font-semibold text-minerva-gray">
			Room ID:</span
		>
		<button
			v-if="roomId"
			class="bg-minerva-purple text-white py-0.5 px-2 rounded ml-2 flex hover:opacity-90 duration-100 transition-all items-center"
			@click="copyRoomIdToClipboard"
		>
			{{ roomId }}
			<img
				class="ml-2 opacity-50 h-5"
				src="/icons/copy.svg"
				alt="copy icon"
			/>
		</button>
		<span v-if="copied" class="font-semibold ml-2 text-gray-500">{{
			copied ? 'copied!' : ''
		}}</span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: ['roomId'],
	data(): {
		copied: boolean;
	} {
		return {
			copied: false,
		};
	},
	methods: {
		copyRoomIdToClipboard() {
			navigator.clipboard.writeText(this.roomId ? this.roomId : '');
			setTimeout(() => {
				this.copied = false;
			}, 2000);
			this.copied = true;
		},
	},
});
</script>
