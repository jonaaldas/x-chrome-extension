import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/index.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import {createClient} from '@supabase/supabase-js';

const options = {
	// You can set your default options here
	position: 'bottom-right',
	timeout: 3048,
	closeOnClick: true,
	pauseOnFocusLoss: true,
	pauseOnHover: true,
	draggable: true,
	draggablePercent: 0.53,
	showCloseButtonOnHover: false,
	hideProgressBar: true,
	closeButton: 'button',
	icon: true,
	rtl: false
};

// Initialize Supabase client
const supabase = createClient(import.meta.env.VITE_SUPABASE_CLIENT_URL, import.meta.env.VITE_SUPABASE_CLIENT_ANON_KEY);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast, options);

app.config.globalProperties.$supabase = supabase;

app.mount('#app');
