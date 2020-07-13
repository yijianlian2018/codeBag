<template>
	<view class="page">
		<view class="login">
			<form @submit="onSubmit">
				<van-cell-group>
					<van-field size="large" name="mobile" v-on:input="inputMobile" required clearable label="手机号码" placeholder="请输入新手机号码" />
					<van-field name="code" size="large" clearable placeholder="请输入验证码" use-button-slot>
						<view @tap="getCode" class="getCode" slot="button">{{ btn }}</view>
					</van-field>
				</van-cell-group>
				<button formType="submit" class="btn">确认修改</button>
			</form>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			mobile: '',
			code: '',
			timer: null,
			time: 60,
			btn: '获取验证码',
			canClick: true
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
	onUnload() {
		clearInterval(this.timer);
	},
	methods: {
		inputMobile(e) {
			this.mobile = e.detail;
		},
		getCode() {
			if (!this.canClick) return false;
			this.canClick = false;
			console.log('获取验证码');
			if (this.time === 60) {
				this.$Fetch({
					url: 'user/code',
					data: { mobile: this.mobile },
					success: res => {
						console.log(res);
						this.code = res.code;
						this.canClick = true;
						uni.showToast({
							title: '发送成功',
							icon: 'success'
						});
						this.timer = setInterval(() => {
							this.time--;
							this.btn = this.time + 's后重新获取';
							if (this.time < 0) {
								clearInterval(this.timer);
								this.timer = null;
								this.time = 60;
								this.btn = '获取验证码';
							}
						}, 1000);
					}
				});
			}
		},
		onSubmit(e) {
			console.log('提交数据：', e.detail.value);
			let data = e.detail.value;
			console.log(data.code);
			if (data.code == this.code) {
				this.$Fetch({
					url: 'login/change_mobile',
					data: data,
					success: res => {
						setTimeout(() => {
							uni.navigateBack({});
						}, 1500);
						uni.showToast({
							icon: 'success',
							title: '修改成功'
						});
					}
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: '验证码错误'
				});
			}
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
.code {
	font-size: 30rpx;
}
</style>
