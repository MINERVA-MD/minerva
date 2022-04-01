<script lang="ts">
import Editor from './views/Editor.vue';
import { RouterView, RouterLink } from 'vue-router';
import './css/index.css';

export default {
	components: {
		Editor,
	},
};
</script>

<template>
	<RouterView />
</template>

<style>
@import './css/github-markdown.css';
</style>
