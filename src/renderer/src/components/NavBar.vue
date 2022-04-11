<template>
	<header class="flex justify-between w-full mt-4 items-center">
		<RoomId :roomId="roomId" />
		<div class="flex">
			<div class="mr-6 flex">
				<p></p>
				<Login />
			</div>
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
import Login from './Login.vue';
import RoomId from './RoomId.vue';

export default defineComponent({
	name: 'NavBar',
	props: {
		roomId: String,
	},
	data(): {
		menuIsOpen: boolean;
	} {
		return {
			menuIsOpen: false,
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
			this.$emit('joinCollabSession', roomId);
		},
	},
	components: {
		Menu,
		Login,
		RoomId,
	},
	emits: ['joinCollabSession', 'createCollabSession', 'newFile'],
});
</script>
