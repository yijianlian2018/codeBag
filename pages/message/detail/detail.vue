<template>
	<view class="page"><uParse v-if="info" :content="info.desc" /></view>
</template>

<script>
import uParse from '@/components/u-parse/u-parse.vue'
export default {
	data() {
		return {
			info: null
		};
	},
	components: {
		uParse
	},
	onShareAppMessage() {
		let token = uni.getStorageSync('TOKEN');
		let user = uni.getStorageSync('userInfo');
		if (token) {
			return {
				title: '易建联共享服务平台',
				path: '/pages/index/index?server=' + user.server_people_id
			};
		}
	},
	onLoad(opt) {
		if (opt.id) {
			this.$Fetch({
				url: 'Message/getDataById',
				data: { id: opt.id },
				success: res => {
					this.info = res;
					uni.setNavigationBarTitle({
						title: res.title
					});
					this.$Fetch({
						url: 'Message/read_message',
						data: { id: opt.id },
						success: ret => {
							console.log(ret);
						}
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	padding: 30rpx;
}
</style>
