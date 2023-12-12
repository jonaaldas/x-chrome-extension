<template lang="">
	<div>
		<h1>This is a test</h1>
	</div>
</template>
<script>
	export default {
		methods: {
			async test() {
				const res = await this.$http.get('api/test');
				console.log(res);
			}
		},
		mounted() {
			this.test();
		}
	};
</script>
<style lang=""></style>
