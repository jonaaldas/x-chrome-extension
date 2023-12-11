<template>
	<nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
		<div class="px-3 py-3 lg:px-5 lg:pl-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center justify-start rtl:justify-end">
					<button
						data-drawer-target="logo-sidebar"
						data-drawer-toggle="logo-sidebar"
						aria-controls="logo-sidebar"
						type="button"
						class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
					>
						<span class="sr-only">Open sidebar</span>
						<svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path
								clip-rule="evenodd"
								fill-rule="evenodd"
								d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
							></path>
						</svg>
					</button>
					<a href="https://flowbite.com" class="flex ms-2 md:me-24">
						<img src="../assets//img/tweet.png" class="h-8 me-3" alt="FlowBite Logo" />
						<span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Very Fancy Name</span>
					</a>
				</div>
				<div class="flex items-center">
					<div class="flex items-center ms-3">
						<div>
							<button
								type="button"
								class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
								aria-expanded="false"
								data-dropdown-toggle="dropdown-user"
							>
								<span class="sr-only">Open user menu</span>
								<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 18">
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M7 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-2 3h4a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"
									/>
								</svg>
							</button>
						</div>
						<div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
							<div class="px-4 py-3" role="none">
								<p class="text-sm text-gray-900 dark:text-white" role="none">Neil Sims</p>
								<p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">neil.sims@flowbite.com</p>
							</div>
							<ul class="py-1" role="none">
								<li>
									<a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
										Dashboard
									</a>
								</li>
								<li>
									<a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
										Settings
									</a>
								</li>
								<li>
									<a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
										Earnings
									</a>
								</li>
								<li>
									<a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
										Sign out
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>

	<aside
		id="logo-sidebar"
		class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
		aria-label="Sidebar"
	>
		<div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
			<ul class="space-y-2 font-medium">
				<li>
					<div @click="changeTab('keys')" class="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
						<span class="ms-3">API Keys</span>
					</div>
				</li>
				<li>
					<div @click="changeTab('account')" class="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
						<span class="flex-1 ms-3 whitespace-nowrap">Account</span>
					</div>
				</li>
				<li>
					<div @click="logout()" class="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
						<span class="flex-1 ms-3 whitespace-nowrap">Log Out</span>
					</div>
				</li>
			</ul>
		</div>
	</aside>

	<div class="mt-20 p-4 sm:ml-64">
		<Account v-if="tab == 'account'" />
		<Keys v-if="tab == 'keys'" />
	</div>
</template>
<script>
	import axios from 'axios';
	const serverURL = import.meta.env.VITE_SERVER_URL;
	import Account from '../components/Dashboard/Account.vue';
	import Keys from '../components/Dashboard/Keys.vue';
	export default {
		data() {
			return {
				tab: 'keys'
			};
		},
		components: {
			Account,
			Keys
		},
		methods: {
			changeTab(tab) {
				this.tab = tab;
			},
			async logout() {
				const res = await axios.post(`${serverURL}api/logout`);
				if (res.data.success) {
					localStorage.clear();
					this.$router.push('/login');
				}
			}
		}
	};
</script>
<style></style>
