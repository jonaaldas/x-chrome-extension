import {createApp} from 'vue';
import {createPinia} from 'pinia';

import App from './App.vue';
import router from './router';
import './assets/index.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
const app = createApp(App);
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

app.use(createPinia());
app.use(router);
app.use(Toast, options);

app.mount('#app');
