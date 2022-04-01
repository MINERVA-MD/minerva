<template>
	<header class="flex justify-between w-full mt-4 items-center">
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
		<div class="menu">
			<button
				@click="toggleMenu"
				type="button"
				class="cursor-pointer mr-6 hover:opacity-70"
			>
				<img src="/icons/menu.svg" alt="menu" />
			</button>
			<div v-if="menuIsOpen === true">
				<Menu
					@newFile="newFile"
					@createCollabSession="createCollabSession"
					@joinSession="joinSession"
				/>
			</div>
		</div>
	</header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Menu from './Menu.vue';

export default defineComponent({
	name: 'NavBar',
	props: {
		roomId: String,
	},
	data(): {
		menuIsOpen: boolean;
		copied: boolean;
	} {
		return {
			menuIsOpen: false,
			copied: false,
		};
	},
	methods: {
		toggleMenu() {
			if (this.menuIsOpen === false) {
				this.menuIsOpen = true;
			} else {
				this.menuIsOpen = false;
			}
		},
		newFile() {
			this.$emit('newFile');
		},
		createCollabSession() {
			this.$emit('createCollabSession');
		},
		joinSession(roomId: string) {
			console.log(roomId);
			this.$emit('joinCollabSession', roomId);
		},
		copyRoomIdToClipboard() {
			navigator.clipboard.writeText(this.roomId ? this.roomId : '');
			setTimeout(() => {
				this.copied = false;
			}, 2000);
			this.copied = true;
		},
	},
	components: {
		Menu,
	},
});
</script>
