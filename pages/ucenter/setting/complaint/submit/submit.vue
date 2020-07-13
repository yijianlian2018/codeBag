<template>
	<view class="page">
		<form @submit="onSubmit">
			<view class="uni-textarea"><textarea name="content" placeholder-style="color:#999" placeholder="请填写投诉内容" /></view>
			<button formType="submit" class="btn">提交投诉</button>
		</form>
	</view>
</template>

<script>
export default {
	data() {
		return {};
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
	methods: {
		onSubmit(e) {
			this.$Fetch({
				url: 'advise/add',
				data: e.detail.value,
				success: res => {
					uni.showToast({
						title: '提交成功！',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateBack({});
					}, 1500);
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.uni-textarea {
	width: 710rpx;
	padding: 20rpx;
	box-sizing: border-box;
	border-radius: 10rpx;
	margin: auto;
	border: 1px solid #f3f3f3;
	box-shadow: 10rpx 10rpx 15rpx #dedede;
}
.btn {
	width: 700rpx;
	margin: 60rpx auto;
	height: 80rpx;
	font-size: 34rpx;
	border-radius: 10rpx;
}
</style>
