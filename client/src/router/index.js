import {createRouter, createWebHistory} from 'vue-router';
import LandingPageView from '../views/LandingPageView.vue';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'LandingPageView',
			component: LandingPageView
		},
		{
			path: '/register',
			name: 'RegisterView',
			component: RegisterView
		},
		{
			path: '/login',
			name: 'LoginView',
			component: LoginView
		},
		{
			path: '/dashboard',
			name: 'DashboardView',
			component: DashboardView
		}
	]
});

export default router;
