<template>
	<view></view>
</template>

<script>
	import { mapMutations} from 'vuex';
export default {
	data() {
		return {};
	},
	onLoad(opt) {
		let token = uni.getStorageSync('TOKEN');
		if (token) {
			if (opt.path) {
				uni.redirectTo({
					url: opt.path
				});
			}
		} else {
			this.setShareMsg({
				server: opt.server,
				path: path
			});
			uni.redirectTo({
				url: '/pages/login/login'
			});
		}
	},
	methods: {
		...mapMutations(['setShareMsg'])
	}
};
</script>

<style lang="scss"></style>
