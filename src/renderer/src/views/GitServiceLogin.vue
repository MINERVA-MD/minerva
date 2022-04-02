<template>
	<RouterLink class="text-minerva-purple" to="/">Back to editor</RouterLink>
	<div>
		<button
			class="bg-minerva-purple px-2 py-1 text-white rounded hover:opacity-90 transition-all duration-100"
			v-on:click="connectGit"
		>
			Connect Git
		</button>
		<select
			name="repos"
			id="repos"
			v-model="repoSelect"
			class="border rounded py-1"
		>
			<option default disabled value="">
				{{ gitService ? 'Repositories' : 'No Git Service' }}
			</option>
			<option v-for="repo in repos" :value="repo.name" :key="repo.name">
				{{ repo.name }}
			</option>
		</select>
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
		repoSelect: string;
	} {
		return {
			repos: null,
			repoSelect: '',
		};
	},
	mounted() {},
	async updated() {
		if (this.gitService !== null && this.repos?.length === 0) {
			try {
				await this.getRepos();
			} catch (error) {
				console.log(error);
			}
		}
	},
	methods: {
		connectGit() {
			this.repos = null;
			this.$emit('connectGit', {
				username: 'testminerva',
				token: 'ghp_test',
			});
		},
		async getRepos() {
			try {
				this.repos = await this.gitService.getRepoList();
			} catch (error) {
				console.log(error);
			}
			return this.gitService;
		},
	},
	emits: ['connectGit'],
});
</script>
