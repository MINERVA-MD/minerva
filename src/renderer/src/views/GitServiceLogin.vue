<template>
	<RouterLink class="text-minerva-purple" to="/">Back to editor</RouterLink>
	<div class="flex flex-col w-96 space-y-4 mx-auto">
		<button
			class="bg-minerva-purple p-2 text-white rounded hover:opacity-90 transition-all duration-100"
			v-on:click="connectGit"
		>
			Connect Git
		</button>
		<div class="flex flex-col space-y-4">
			<select
				name="repos"
				id="repos"
				v-model="repoSelect"
				class="border border-gray-300 rounded py-2"
			>
				<option default disabled value="">
					{{ gitService ? 'Repositories' : 'No Git Service' }}
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
		{{ this.gitService }}
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
	} {
		return {
			repos: null,
			repo: '',
			repoSelect: '',
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
			this.repos = null;
			this.$emit('connectGit', {
				username: 'testminerva',
				token: 'ghp_test',
			});
			this.$nextTick(() => this.getRepos());
		},
		async getRepos() {
			try {
				this.repos = await this.gitService.getRepoList();
			} catch (error) {
				console.log(error);
			}
			return this.gitService;
		},
		useRepo() {
			this.$emit('useRepo');
		},
	},
	emits: ['connectGit', 'selectRepo', 'useRepo'],
});
</script>
