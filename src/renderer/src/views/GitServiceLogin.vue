<template>
	<RouterLink class="text-minerva-purple" to="/">Back to editor</RouterLink>
	<div class="flex flex-col w-96 space-y-4 mx-auto">
		<input
			type="text"
			placeholder="Username"
			name="username"
			id="username"
			class="border border-gray-300 rounded p-2"
			v-model="username"
		/>
		<input
			type="text"
			name="token"
			placeholder="Token"
			id="token"
			class="border border-gray-300 rounded p-2"
			v-model="token"
		/>
		<p class="text-red-500">{{ error }}</p>
		<button
			class="bg-minerva-purple p-2 text-white rounded hover:opacity-90 transition-all duration-100"
			v-on:click="connectGit"
		>
			Connect Git
		</button>
		<div
			v-if="gitService && repos?.length !== 0"
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
		connectGit() {
			//if (this.username.length !== 0 || this.token.length !== 0) {
			this.repos = null;
			this.$emit('connectGit', {
				username: this.username,
				token: this.token,
			});
			this.$nextTick(() => this.getRepos());
			//} else {
			this.error = 'No fields can be empty';
			//	}
		},
		async getRepos() {
			try {
				this.error = '';
				this.repos = await this.gitService.getRepoList();
				if (this.repos?.length === 0) {
					this.error =
						'There was a problem pulling user repositories. Check that you are using a valid username and token.';
				}
			} catch (error) {
				console.log(error);
			}
		},
		useRepo() {
			this.$emit('useRepo');
		},
	},
	emits: ['connectGit', 'selectRepo', 'useRepo'],
});
</script>
