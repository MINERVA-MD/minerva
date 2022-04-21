<template>
	<div class="text-right mr-4">
		<Menu as="div" class="relative inline-block text-left">
			<div>
				<MenuButton
						class="inline-flex justify-center w-full px-4 py-2 opacity-80 hover:opacity-100 text-minerva-gray font-semi-bold transition-colors duration-100"
				>
					<DotsVerticalIcon
							class="w-6 h-6"
							aria-hidden="true"
					/>
				</MenuButton>
			</div>

			<transition
					enter-active-class="transition duration-100 ease-out"
					enter-from-class="transform scale-95 opacity-0"
					enter-to-class="transform scale-100 opacity-100"
					leave-active-class="transition duration-75 ease-in"
					leave-from-class="transform scale-100 opacity-100"
					leave-to-class="transform scale-95 opacity-0"
			>
				<MenuItems
						class="absolute right-0 w-60 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
				>
					<div class="px-1 py-1">
						<MenuItem v-slot="{ active }">
							<button
					  		 @click="newFile"
									:class="[
                  'group flex rounded-md items-center hover:bg-gray-400/20 transition-all duration-100 justify-between w-full px-2 py-2 text-sm',
                ]"
							>
									<span class="flex">
										<DocumentAddIcon
												:active="active"
												class="w-5 h-5 mr-2 text-minerva-purple text-opacity-80"
												aria-hidden="true"
										/>
												New
									</span>

								<span class="text-gray-400"
								>{{ isMacOs ? '⌘' : 'Ctrl + ' }}N</span
								>
							</button>
						</MenuItem>
						<MenuItem v-slot="{ active }">
							<button
					  			@click="loadFile"
				  				:class="[
										'group flex rounded-md items-center hover:bg-gray-400/20 transition-all duration-100 justify-between w-full px-2 py-2 text-sm',
                	]"
							>
									<span class="flex">
										<FolderOpenIcon
												:active="active"
												class="w-5 h-5 mr-2 text-minerva-purple text-opacity-80"
												aria-hidden="true"
										/>
										  Open
									</span>

								<span class="text-gray-400"
								>{{ isMacOs ? '⌘' : 'Ctrl + ' }}O</span
								>
							</button>
						</MenuItem>
					</div>
					<div class="px-1 py-1">
						<MenuItem v-slot="{ active }">
							<button
					  			@click="saveFile"
				  				:class="[
										'group flex rounded-md items-center hover:bg-gray-400/20 transition-all duration-100 justify-between w-full px-2 py-2 text-sm',
                	]"
							>
									<span class="flex">
										<SaveIcon
												:active="active"
												class="w-5 h-5 mr-2 text-minerva-purple text-opacity-80"
												aria-hidden="true"
										/>
											Save
									</span>
									<span class="text-gray-400"
									>{{ isMacOs ? '⌘' : 'Ctrl + ' }}S</span
									>
							</button>
						</MenuItem>
						<MenuItem v-slot="{ active }">
							<button
					  			@click="saveAsFile"
				  				:class="[
										'group flex rounded-md items-center hover:bg-gray-400/20 transition-all duration-100 justify-between w-full px-2 py-2 text-sm',
                	]"
							>
									<span class="flex">
										<SaveAsIcon
												:active="active"
												class="w-5 h-5 mr-2 text-minerva-purple text-opacity-80"
												aria-hidden="true"
										/>
											Save as
									</span>
									<span class="text-gray-400"
									>{{ isMacOs ? '⇧ + ⌘' : '⇧ + Ctrl + ' }}S</span
									>
							</button>
						</MenuItem>
					</div>
					<div class="px-1 py-1">
						<MenuItem v-slot="{ active }">
							<RouterLink
					  			to="/gitservice"
				  				:class="[
										'group flex rounded-md items-center hover:bg-gray-400/20 transition-all duration-100 w-full px-2 py-2 text-sm',
                	]"
							>
								<svg
										:active="active"
										role="img"
										class="w-5 h-5 mr-2 text-minerva-purple text-opacity-80"
										aria-hidden="true"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
								>
									<title>
										GitHub
									</title>
									<path
											d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
									/>
								</svg>
								{{
												gitService
														? gitService.username
																? 'Sign out of Github'
																: 'Connect to Github'
														: 'Connect to Github'
								}}
							</RouterLink>
						</MenuItem>
			  		<p class="text-gray-400 mt-3 mr-2 text-right text-sm">Collaboration</p>
					</div>

					<div class="px-1 py-1">
						<MenuItem v-slot="{ active }">
							<button
					  			@click="createCollabSession"
				  				:class="[
										'group flex rounded-md items-center hover:bg-gray-400/20 transition-all duration-100 w-full px-2 py-2 text-sm',
                	]"
							>
								<UserGroupIcon
										:active="active"
										class="w-5 h-5 mr-2 text-minerva-purple text-opacity-80"
										aria-hidden="true"
								/>
								Create Session
							</button>
						</MenuItem>
						<div class="w-full p-2 flex font-semibold items-center">
							Join:
							<input
									class="w-16 px-2 h-7 rounded text-minerva-gray ml-2 border border-gray-300 text-sm"
									type="text"
									v-model="inputRoomId"
									placeholder="ID"
							/>
							<MenuItem
											as="button"
									class="px-3 py-1 font-semibold ml-3 bg-minerva-purple text-white rounded hover:bg-opacity-90 transition-all duration-100"
									@click="joinSession(inputRoomId)"
							>
								Join
							</MenuItem>
						</div>
					</div>

				</MenuItems>
			</transition>
		</Menu>
	</div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';

import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import {
	SaveIcon,
	SaveAsIcon,
	DocumentAddIcon,
	FolderOpenIcon,
	UserGroupIcon,
		DotsVerticalIcon
} from '@heroicons/vue/solid';



export default defineComponent({
	components: {
	  SaveIcon,
	  SaveAsIcon,
	  DocumentAddIcon,
	  FolderOpenIcon,
	  UserGroupIcon,
	  DotsVerticalIcon,
	  Menu, MenuButton, MenuItems, MenuItem
  },
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
