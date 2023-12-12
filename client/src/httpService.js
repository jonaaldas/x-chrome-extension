import axios from 'axios';

const serverUrl = import.meta.env.VITE_SERVER_URL;
console.log('🚀 ~ file: httpService.js:4 ~ serverUrl:', serverUrl);

const http = axios.create({
	baseURL: serverUrl
});

http.interceptors.request.use(
	config => {
		const token = localStorage.getItem('access_token');

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

export default http;
