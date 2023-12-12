<template lang="">
	<div>
		<h1>This is a test</h1>
	</div>
</template>
<script>
	import axios from 'axios';
	const serverURL = import.meta.env.VITE_SERVER_URL;
	export default {
		methods: {
			async test() {
				const token = localStorage.getItem('access_token');
				const res = await axios.get(`${serverURL}api/test`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
				console.log(res);
			}
		},
		mounted() {
			// this.test();
		}
	};
</script>
<style lang=""></style>
