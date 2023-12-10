<template>
	<div id="app">
		<h1>For sale</h1>
		<button @click="checkout(productId)">Buy</button>
	</div>
</template>

<script>
	const url = 'http://localhost:3050';
	import {loadStripe} from '@stripe/stripe-js';
	export default {
		data() {
			return {
				productId: ''
			};
		},
		methods: {
			async fetchProducts() {
				const response = await fetch(`${url}/api/plans`);
				const res = await response.json();
				this.productId = res[0].price_id;
			},

			async checkout(productId) {
				const response = await fetch(`${url}/api/checkout/${productId}`);
				const res = await response.json();
				const id = res.sessionId;

				const stripe = await loadStripe('pk_test_51OJd4LC6aAzfVRCcpkFuiA0z9nvjQwvtk6QqWMXDQjEk1rDDaH5o6RytV0a5ZkFcaUbUyWHw7kIoDLTuyaXDRqsc00gIIi9OxN');
				await stripe.redirectToCheckout({
					sessionId: id
				});
			}
		},
		mounted() {
			this.fetchProducts();
		}
	};
</script>

<style></style>
