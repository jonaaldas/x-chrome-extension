<template lang="">
	<section class="bg-gray-50 dark:bg-gray-900">
		<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
			<a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
				<img class="w-8 h-8 mr-2" src="../assets/img/tweet.png" alt="logo" />
				Very fancy name
			</a>
			<div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Log in</h1>
					<div class="space-y-4 md:space-y-6">
						<div>
							<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
							<input
								type="email"
								name="email"
								id="email"
								v-model="user.email"
								class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="name@company.com"
								required=""
							/>
						</div>
						<div>
							<label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
							<input
								type="password"
								name="password"
								id="password"
								v-model="user.password"
								placeholder="••••••••"
								class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								required=""
							/>
						</div>

						<button
							@click="login"
							class="w-full btn-primary bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
						>
							Log in
						</button>
						<p class="text-sm font-light text-gray-500 dark:text-gray-400">
							Don't have an account?
							<router-link to="/register" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Register</router-link>
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
<script>
	import axios from 'axios';
	const serverURL = import.meta.env.VITE_SERVER_URL;
	export default {
		data() {
			return {
				user: {
					email: '',
					password: ''
				},
				saveInStorage: {}
			};
		},
		methods: {
			async login() {
				const {data} = await axios.post(`${serverURL}api/login`, this.user);

				console.log('🚀 ~ file: LogInView.vue:70 ~ login ~ data:', data.data);
				if (data.success) {
					let saveInStorage = {
						access_token: data.data.session.access_token,
						refresh_token: data.data.session.refresh_token,
						user: data.data.user.id
					};
					this.saveToken(saveInStorage);
					this.$router.push({name: 'DashboardView'});
				} else {
					alert(res.data.message);
				}
			},
			saveToken(token) {
				for (let key in token) {
					localStorage.setItem(key, token[key]);
				}
			}
		}
	};
</script>
<style lang=""></style>

<!-- session
: 
access_token
: 
"eyJhbGciOiJIUzI1NiIsImtpZCI6IjAyNVkvMUxRMjBOSVZVVlUiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzAyODQ1NDM0LCJpYXQiOjE3MDIyNDA2MzQsImlzcyI6Imh0dHBzOi8vemVuZ2l0bGdkcGt6Z2VnYmZ0a24uc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjAyYTcwMjdlLTEzYjctNDQzYy04ZGU5LTQ4ZTlkNTAzNTU1NyIsImVtYWlsIjoibWVAam9uYXRoYW5hbGRhcy5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTcwMjI0MDYzNH1dLCJzZXNzaW9uX2lkIjoiNTZjZmJkMTgtYjhiMy00YzVjLWI1OGItZGEzZDhhM2JmM2Q4In0.AnjH1FeEzsoogERy8XM1fGnUmetIrAwb_rdGg57UHGI"
expires_at
: 
1702845434
expires_in
: 
604800
refresh_token
: 
"P7JH_lavImh83aK11bAVCQ"
token_type
: 
"bearer"
user
: 
{id: '02a7027e-13b7-443c-8de9-48e9d5035557', aud: 'authenticated', role: 'authenticated', email: 'me@jonathanaldas.com', email_confirmed_at: '2023-11-30T01:24:53.674315Z', …}
[[Prototype]]
: 
Object
user
: 
app_metadata
: 
{provider: 'email', providers: Array(1)}
aud
: 
"authenticated"
confirmed_at
: 
"2023-11-30T01:24:53.674315Z"
created_at
: 
"2023-11-30T01:24:53.671695Z"
email
: 
"me@jonathanaldas.com"
email_confirmed_at
: 
"2023-11-30T01:24:53.674315Z"
id
: 
"02a7027e-13b7-443c-8de9-48e9d5035557"
identities
: 
[{…}]
last_sign_in_at
: 
"2023-12-10T20:37:14.306592517Z"
phone
: 
""
role
: 
"authenticated"
updated_at
: 
"2023-12-10T20:37:14.308051Z"
user_metadata
: 
{} -->
