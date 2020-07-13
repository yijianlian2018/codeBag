<template>
	<view class="page">
		<view class="login">
			<form @submit="onSubmit">
				<van-cell-group>
					<van-field size="large" name="old_password" type="password" required clearable label="旧密码" placeholder="请输入旧登录密码" />
					<van-field size="large" name="password" type="password" required clearable label="新密码" placeholder="请输入新登录密码" />
				</van-cell-group>
				<button formType="submit" class="btn">确认修改</button>
			</form>
		</view>
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
		onSubmit: function(e) {
			console.log('form发生了submit事件，携带数据为：', e.detail.value);
			this.$Fetch({
				url: 'user/edit',
				data: e.detail.value,
				success: res => {
					uni.showToast({
						title: '修改成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1500);
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.btn {
	width: 700rpx;
	margin: 60rpx auto;
	height: 80rpx;
	font-size: 34rpx;
	border-radius: 10rpx;
}
</style>
