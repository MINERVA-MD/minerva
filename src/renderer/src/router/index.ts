import {
	createRouter,
	createWebHistory,
	createWebHashHistory,
} from 'vue-router';
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
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: GitServiceLogin,
		},
	],
});

export default router;
