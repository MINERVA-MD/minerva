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
			<Menu
				:gitService="gitService"
				:loadedFile="loadedFile"
				@newFile="newFile"
				@saveFile="saveFile"
				@saveAsFile="saveAsFile"
				@loadFile="loadFile"
				@createCollabSession="createCollabSession"
				@joinSession="joinSession"
			/>
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
	props: ['roomId', 'gitService', 'loadedFile'],
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
		  this.menuIsOpen = false;
			this.$emit('newFile');
		},
		saveFile() {
			this.menuIsOpen = false;
			this.$emit('saveFile');
		},
		saveAsFile() {
		  this.menuIsOpen = false;
			this.$emit('saveAsFile');
		},
		loadFile() {
			this.menuIsOpen = false;
			this.$emit('loadFile');
		},
		createCollabSession() {
			this.menuIsOpen = false;
			this.$emit('createCollabSession');
		},
		joinSession(roomId: string) {
			this.menuIsOpen = false;
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
			this.menuIsOpen = false;
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
		'saveFile',
		'saveAsFile',
		'loadFile',
	],
});
</script>
