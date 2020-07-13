<template>
	<view class="page">
		<van-cell url="mobile/mobile" size="large" title="修改手机号" is-link :value="mobile" />
		<van-cell url="pwd/pwd" size="large" title="修改登录密码" is-link />
		<van-cell url="about/about" size="large" title="关于我们" is-link />
		<!-- <van-cell size="large" @tap="clearCache" title="清除缓存" is-link /> -->
		<van-cell url="complaint/complaint" size="large" title="投诉意见" is-link />
		<van-cell @tap="logOut" size="large" title="退出登录" is-link />
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			mobile: ''
		};
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
		if (opt.mobile) {
			this.mobile = opt.mobile.substr(0, 3) + '****' + opt.mobile.substr(7);
		}
	},
	methods: {
		...mapMutations(['setLogout', 'setInfo']),
		logOut() {
			var that = this;
			uni.showModal({
				title: '提示',
				content: '您确认要退出登录吗？',
				confirmText: '退出',
				success: function(ret) {
					if (ret.confirm) {
						uni.clearStorageSync();
						console.log(uni.getStorageSync('TOKEN'))
						setTimeout(() => {
							that.setLogout();
							uni.reLaunch({
								url: '/pages/index/index'
							});
							uni.closeSocket();
							that.setInfo(null);
						}, 1500);

						uni.showToast({
							title: '安全退出！',
							icon: 'success'
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss"></style>
