<template>
	<view class="page">
		<view class="login">
			<view class="title">绑定手机号</view>
			<form @submit="onSubmit">
				<van-field name="mobile" :value="mobile" v-on:input="onInput" size="large" label="+86" title-width="80rpx" placeholder="请输入手机号" clearable />
				<van-field name="code" size="large" clearable placeholder="请输入验证码" use-button-slot>
					<view @tap="getCode" class="getCode" slot="button">{{ btn }}</view>
				</van-field>
				<block v-if="show">
					<van-field name="server_people_id" size="large" placeholder="请输入邀请码(选填)" clearable />
					<van-field name="password" size="large" placeholder="请输入密码" clearable type="password" />
				</block>
				<button class="btn" formType="submit">绑定</button>
			</form>
			<view class="check">
				<van-radio-group :value="isChecked" @change="onChange">
					<van-radio checked-color="#007BFF" name="1">
						<text style="color:#999;font-size: 24rpx;">注册表示您已阅读并同意</text>
						<text style="text-decoration: underline;color:#999;font-size: 24rpx;">《用户协议》</text>
					</van-radio>
				</van-radio-group>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			show:false,
			mobile: '',
			isChecked: '1',
			btn: '获取验证码',
			time: 60,
			timer: null,
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
	computed: { ...mapState(['wxInfo']) },
	onUnload() {
		clearInterval(this.timer);
		this.timer = null;
	},
	methods: {
		...mapMutations(['setLogin']),
		onInput(e) {
			this.mobile = e.detail;
		},
		getCode() {
			if (!this.canClick) return false;
			this.canClick = false;
			console.log('获取验证码');
			if (this.time === 60) {
				this.$Fetch({
					url: 'login/wxCode',
					data: {
						mobile: this.mobile,
						open_id: this.wxInfo.openId,
						user_name: this.wxInfo.nickName,
						head_img: this.wxInfo.avatarUrl
					},
					success: res => {
						if(res==="请输入密码"){
							uni.showToast({
								title: '请填写密码！',
								icon: 'none'
							});
							this.show=true;
						}
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
					},
					complete: () => {
						this.canClick = true;
					}
				});
			}
		},
		onChange() {
			this.isChecked = this.isChecked == 1 ? '0' : '1';
		},
		onSubmit(e) {
			let that = this;
			console.log('提交数据：', e.detail.value);
			let data = e.detail.value;
			if (!data.server_people_id) {
				data.server_people_id = 0;
			}
			if (this.isChecked === '1') {
				this.$Fetch({
					url: 'login/wxBoundMobile',
					data: data,
					success: res => {
						uni.setStorage({
							key: 'TOKEN',
							data: res,
							success: function() {
								that.setLogin();
								uni.showToast({
									title: '绑定成功！',
									icon: 'success'
								});
								setTimeout(() => {
									uni.reLaunch({
										url: '/pages/index/index'
									});
								}, 1500);
							}
						});
					}
				});
			} else {
				uni.showToast({
					title: '未同意用于协议，不可注册！',
					icon: 'none'
				});
			}
		}
	}
};
</script>

<style lang="scss">
.check {
	text-align: center;
	width: 750rpx;
	margin: auto;
	padding: 40rpx 0;
}
</style>
