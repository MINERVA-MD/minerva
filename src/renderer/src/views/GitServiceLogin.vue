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
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';
import type GithubClientService from '../services/github-client.service';

export default defineComponent({
	setup() {},
	data(): {
		gitService: GithubClientService | null;
	} {
		return {
			gitService: null,
		};
	},
});
</script>
