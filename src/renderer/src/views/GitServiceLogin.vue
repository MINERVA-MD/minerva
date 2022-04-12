<template>
	<div>
		<RouterLink class="text-minerva-purple" to="/"
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
				v-if="gitService && repos && repos?.length > 0"
				class="flex flex-col space-y-4"
			>
				<select
					name="repos"
					id="repos"
					v-model="repoSelect"
					class="border border-gray-300 rounded p-2"
				>
					<option default disabled value="">
						{{
							gitService
								? repos?.length === 0
									? 'Error Fetching Repos'
									: 'Repositories'
								: 'No Git Service'
						}}
					</option>
					<option
						v-for="repo in repos"
						:value="repo.name"
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
		repo: string;
		repoSelect: string;
		username: string;
		token: string;
		error: string;
	} {
		return {
			repos: null,
			repo: '',
			repoSelect: '',
			username: '',
			token: '',
			error: '',
		};
	},
	mounted() {},
	async updated() {
		if (this.repoSelect !== this.repo && this.gitService) {
			this.repo = this.repoSelect;
			this.gitService.repo = this.repo;
			await this.gitService.cloneSelectedRepo();
			//
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
			this.$emit('useRepo');
		},
	},
	emits: ['login', 'logout', 'selectRepo', 'useRepo'],
});
</script>
