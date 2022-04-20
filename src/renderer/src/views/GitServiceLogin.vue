<template>
	<div>
		<RouterLink class="ml-6 text-minerva-purple" to="/"
			>Back to editor</RouterLink
		>

		<div class="flex flex-col w-96 space-y-4 mx-auto mt-32">
			<button
				v-if="!gitService?.username"
				class="bg-minerva-purple p-2 text-white rounded hover:opacity-90 transition-all duration-100 text-lg"
				v-on:click="login"
			>
				Login
			</button>
			<button
				v-else
				class="bg-minerva-purple p-2 text-white rounded hover:opacity-90 transition-all duration-100 text-lg"
				v-on:click="logout"
			>
				logout
			</button>
			<p class="text-red-500">{{ error }}</p>
			<div
				v-if="
					gitService &&
					gitService.userRepositories &&
					gitService?.userRepositories.length > 0
				"
				class="flex flex-col space-y-4"
			>
				<Listbox as="div" v-model="repoSelect">
					<ListboxLabel
						class="block text-sm font-medium text-gray-700"
					>
						User Repositories
					</ListboxLabel>
					<div class="mt-1 relative">
						<ListboxButton
							class="relative hover:cursor-pointer min-h-[42px] w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						>
							<div v-if="repoSelect">
								<span class="flex items-center">
									<img
										:src="repoSelect.avatar"
										alt=""
										class="flex-shrink-0 h-6 w-6 rounded-full"
									/>
									<span class="ml-3 block truncate">{{
										repoSelect.name
									}}</span>
								</span>
							</div>
							<span
								class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
							>
								<SelectorIcon
									class="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</span>
						</ListboxButton>

						<transition
							leave-active-class="transition ease-in duration-100"
							leave-from-class="opacity-100"
							leave-to-class="opacity-0"
						>
							<ListboxOptions
								class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
							>
								<ListboxOption
									as="template"
									v-for="repo in gitService.userRepositories"
									:key="repo.id"
									:value="repo"
									v-slot="{ active, selected }"
								>
									<li
										:class="[
											active
												? 'text-white bg-indigo-600'
												: 'text-gray-900',
											'cursor-default select-none relative py-2 pl-3 pr-9',
										]"
									>
										<div class="flex items-center">
											<img
												:src="repo.avatar"
												alt=""
												class="flex-shrink-0 h-6 w-6 rounded-full"
											/>
											<span
												:class="[
													selected
														? 'font-semibold'
														: 'font-normal',
													'ml-3 block truncate',
												]"
											>
												{{ repo.name }}
											</span>
										</div>

										<span
											v-if="selected"
											:class="[
												active
													? 'text-white'
													: 'text-indigo-600',
												'absolute inset-y-0 right-0 flex items-center pr-4',
											]"
										>
											<CheckIcon
												class="h-5 w-5"
												aria-hidden="true"
											/>
										</span>
									</li>
								</ListboxOption>
							</ListboxOptions>
						</transition>
					</div>
				</Listbox>
				<button
					type="button"
					:disabled="repoSelect == undefined"
					v-bind:class="getCloneRepoBtnClass()"
					@click="useRepo"
				>
					Clone Repo
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import type { GitRepo } from '@/typings/GitService';
import { defineComponent } from 'vue';
import {
	Listbox,
	ListboxButton,
	ListboxLabel,
	ListboxOption,
	ListboxOptions,
} from '@headlessui/vue';
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid';
import NotificationService from '../services/notification.service';
import NotificationLevel from '../Interfaces/NotificationLevel';

export default defineComponent({
	components: {
		Listbox,
		ListboxButton,
		ListboxLabel,
		ListboxOption,
		ListboxOptions,
		CheckIcon,
		SelectorIcon,
	},
	setup() {},
	props: ['gitService'],
	data(): {
		repos: GitRepo[] | null;
		repo: GitRepo | undefined;
		repoSelect: GitRepo | undefined;
		username: String;
		token: string;
		error: string;
	} {
		return {
			repos: null,
			repo: undefined,
			repoSelect: undefined,
			username: '',
			token: '',
			error: '',
		};
	},
	async updated() {
		if (this.repoSelect !== this.repo && this.gitService) {
			this.repo = this.repoSelect;
			this.gitService.repo = this.repo;
			this.$emit('selectRepo', this.repo);
		}
	},
	methods: {
		getCloneRepoBtnClass() {
			if (this.repoSelect == undefined) {
				return 'bg-gray-300 text-white p-2 rounded cursor-not-allowed';
			}
			return 'bg-slate-800 text-white p-2 rounded';
		},
		login() {
			this.repos = null;
			this.$emit('login');
		},
		logout() {
			this.$emit('logout');
		},
		useRepo() {
			if (this.repo !== undefined) {
				this.$emit('useRepo');
			} else {
				NotificationService.notify(
					NotificationLevel.Error,
					'Clone Failed',
					'A repo must be selected in order to clone.',
					5,
				);
			}
		},
	},
	emits: ['login', 'logout', 'selectRepo', 'useRepo'],
});
</script>
