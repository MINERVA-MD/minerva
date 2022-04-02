import { createRouter, createWebHistory } from 'vue-router';
import Editor from '../views/Editor.vue';
import GitServiceLogin from '../views/GitServiceLogin.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Editor,
		},
		{
			path: '/gitservice',
			name: 'gitservice',
			component: GitServiceLogin,
		},
	],
});

export default router;
