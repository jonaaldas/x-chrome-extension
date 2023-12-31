import {createRouter, createWebHistory} from 'vue-router';
import LandingPageView from '../views/LandingPageView.vue';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import {createClient} from '@supabase/supabase-js';
import Test from '../views/Test.vue';
const supabase = createClient(import.meta.env.VITE_SUPABASE_CLIENT_URL, import.meta.env.VITE_SUPABASE_CLIENT_ANON_KEY);

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
			component: DashboardView,
			meta: {requiresAuth: true}
		},
		{
			path: '/test',
			name: 'Test',
			component: Test,
			meta: {requiresAuth: true}
		}
	]
});

const getUser = async next => {
	const {data} = await supabase.auth.getSession();
	if (!data.session) {
		next('/login');
	} else {
		next();
	}
};

router.beforeEach((to, from, next) => {
	if (to.meta.requiresAuth) {
		getUser(next);
	} else {
		next();
	}
});

export default router;
