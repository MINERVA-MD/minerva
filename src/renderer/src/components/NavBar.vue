<template>
	<header class="flex justify-between w-full mt-4 items-center">
		<RoomId :roomId="roomId" />
		<div class="flex">
			<button
				v-if="gitService?.repo"
				class="bg-green-600 rounded px-2 py-1 text-white mr-6 hover:opacity-80"
				type="button"
				@click="commitChanges"
			>
				commit
			</button>
			<div class="mr-6 flex">
				<Login :gitService="gitService" />
			</div>
			<button
				@click="toggleMenu"
				type="button"
				class="cursor-pointer mr-6 opacity-80 hover:opacity-100"
				id="menu-button"
			>
				<img
					src="/icons/menu.svg"
					class="pointer-events-none"
					alt="menu"
				/>
			</button>
			<div v-if="menuIsOpen === true">
				<Menu
					:gitService="gitService"
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
import GithubClientService from '../services/github-client.service';

export default defineComponent({
	name: 'NavBar',
	props: ['roomId', 'gitService'],
	mounted() {
		this.listenForClicksOutsideMenu();
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
		listenForClicksOutsideMenu() {
			document.addEventListener('click', e => {
				if (
					this.menuIsOpen &&
					e.target !== document.getElementById('menu-button') &&
					!document
						.getElementById('menu')
						?.contains(e.target as HTMLElement)
				) {
					this.menuIsOpen = false;
				}
			});
		},
		commitChanges() {
			this.$emit('commitChanges');
		},
	},
	components: {
		Menu,
		Login,
		RoomId,
	},
	emits: [
		'joinCollabSession',
		'createCollabSession',
		'commitChanges',
		'newFile',
	],
});
</script>
