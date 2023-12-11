<template lang="">
	<div>
		<div class="mb-6">
			<label for="keys.app_key" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Api Key</label>
			<input
				v-model="keys.app_key"
				type="text"
				id="keys.app_key"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			/>
		</div>
		<div class="mb-6">
			<label for="keys.app_secret" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Api Secret</label>
			<input
				v-model="keys.app_secret"
				type="text"
				id="keys.app_secret"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			/>
		</div>
		<div class="mb-6">
			<label for="keys.access_token" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Access Token</label>
			<input
				v-model="keys.access_token"
				type="text"
				id="keys.access_token"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			/>
		</div>
		<div class="mb-6">
			<label for="keys.access_secret" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Access Secret</label>
			<input
				v-model="keys.access_secret"
				type="text"
				id="default-input"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			/>
		</div>
		<button
			type="button"
			@click="saveKeys()"
			class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
		>
			Save
		</button>
	</div>
</template>
<script>
	const serverURL = import.meta.env.VITE_SERVER_URL;
	import axios from 'axios';
	import {useToast} from 'vue-toastification';
	const toast = useToast();
	export default {
		data() {
			return {
				keys: {
					app_key: '',
					app_secret: '',
					access_token: '',
					access_secret: ''
				},
				loading: false,
				userId: localStorage.getItem('user') || '',
				originalApiKeys: null
			};
		},
		methods: {
			async getKeys(id) {
				const {data} = await axios.put(`${serverURL}api/keys`, {userId: this.userId});
				if (data.success) {
					this.keys = data.data[0];
					this.originalApiKeys = JSON.parse(JSON.stringify(this.keys));
				}
			},
			async saveKeys() {
				let originalApiKeys = {
					app_key: '',
					app_secret: '',
					access_token: '',
					access_secret: ''
				};
				if (this.userId) {
					// Check if any input value has changed
					let hasChanged = false;
					for (const key in this.keys) {
						if (this.keys[key] !== this.originalApiKeys[key]) {
							hasChanged = true;
							break;
						}
					}

					if (!hasChanged) {
						toast.info('No changes to save');
						return;
					}

					const {data} = await axios.post(`${serverURL}api/save`, {userId: this.userId, apiKeys: this.keys});

					console.log('🚀 ~ file: Keys.vue:97 ~ saveKeys ~ data:', data);
					console.log('🚀 ~ file: Keys.vue:97 ~ saveKeys ~ data:12312');
					if (data.success) {
						originalApiKeys = this.keys;
						console.log('🚀 ~ file: Keys.vue:102 ~ saveKeys ~ originalApiKeys:', originalApiKeys);
						toast.success('Keys saved successfully');
					} else {
						toast.error(data.message);
					}
				} else {
					toast.error('Please login to save keys');
					this.$router.push('/login');
				}
			}
		},

		mounted() {
			this.getKeys(this.userId);
		}
	};
</script>
<style lang=""></style>
