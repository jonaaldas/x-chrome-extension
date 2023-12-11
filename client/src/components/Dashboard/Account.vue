<template lang="">
	<div>
		<div class="mb-6">
			<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
			<input
				type="email"
				id="email"
				v-model="email"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="john.doe@company.com"
			/>
		</div>

		<div class="mb-6">
			<label for="twitterUsername" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">twitterUsername address</label>
			<input
				type="twitterUsername"
				id="twitterUsername"
				v-model="twitterUsername"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="username"
			/>
		</div>

		<!-- <button
			type="submit"
			class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>
			Submit
		</button> -->
	</div>
</template>
<script>
	import axios from 'axios';
	import {useToast} from 'vue-toastification';
	const toast = useToast();
	const serverURL = import.meta.env.VITE_SERVER_URL;
	export default {
		data() {
			return {
				email: '',
				twitterUsername: '',
				token: localStorage.getItem('access_token')
			};
		},
		methods: {
			async getAccountData() {
				try {
					const {data} = await axios.put(`${serverURL}api/user`, {token: this.token});
					if (data.success) {
						this.email = data.data.user.email;
					}
				} catch (error) {
					console.log('🚀 ~ file: Account.vue:38 ~ getAccountData ~ error:', error);
					toast.error('Error getting account data');
				}
			},
			async getTwitterUsername() {
				try {
					const {data} = await axios.put(`${serverURL}api/username`, {token: this.token});
					if (data.success) {
						this.twitterUsername = data.data.data.username;
					}
				} catch (error) {
					console.log('🚀 ~ file: Account.vue:38 ~ getAccountData ~ error:', error);
					toast.error('Error getting account data');
				}
			},
			init() {
				try {
					this.getAccountData();
					this.getTwitterUsername();
				} catch (error) {
					console.log('🚀 ~ file: Account.vue:38 ~ getAccountData ~ error:', error);
					toast.error('Error getting account data');
				}
			}
		},
		mounted() {
			this.init();
		}
	};
</script>
<style lang=""></style>
