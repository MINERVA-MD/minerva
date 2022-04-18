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
				<label for="repos">Select a Repo:</label>
				<select
					name="repos"
					id="repos"
					v-model="repoSelect"
					class="border border-gray-300 rounded p-2"
				>
					<option default disabled value="">
						{{
							gitService
								? gitService.userRepositories?.length === 0
									? 'Error Fetching Repos'
									: 'Repositories'
								: 'No Git Service'
						}}
					</option>
					<option
						v-for="repo in gitService.userRepositories"
						:value="repo"
						:key="repo.name"
					>
						{{ repo.name }}
					</option>
				</select>
				<button
					type="button"
					class="bg-slate-800 text-white p-2 rounded"
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
import { RouterLink } from 'vue-router';

export default defineComponent({
	setup() {},
	props: ['gitService'],
	data(): {
		repos: GitRepo[] | null;
		repo: GitRepo | null;
		repoSelect: GitRepo | null;
		username: String;
		token: string;
		error: string;
	} {
		return {
			repos: null,
			repo: null,
			repoSelect: null,
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
		login() {
			this.repos = null;
			this.$emit('login');
		},
		logout() {
			this.$emit('logout');
		},
		useRepo() {
			if (this.repo !== null) {
				console.log(this.repo);
				this.$emit('useRepo');
			} else {
				this.error = 'must select a repo';
			}
		},
	},
	emits: ['login', 'logout', 'selectRepo', 'useRepo'],
});
</script>
