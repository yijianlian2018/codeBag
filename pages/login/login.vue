<template>
	<view class="page">
		<view class="login">
			<view class="title">欢迎，请登录</view>
			<form @submit="onSubmit">
				<van-field name="mobile" title-width="80rpx" size="large" label="+86" placeholder="请输入手机号" clearable />
				<van-field name="pwd" size="large" placeholder="请输入密码" clearable type="password" />
				<view class="navs">
					<navigator url="../getPwd/getPwd">忘记密码</navigator>
					<navigator url="../register/register">
						还没有账号？
						<text>注册</text>
					</navigator>
				</view>
				<button class="btn" formType="submit">登录</button>
			</form>
		</view>
		<view class="wechat" v-if="isWXAppInstalled">
			<view>第三方登录</view>
			<view hover-class="on-hover">
				<!--  #ifdef  MP-WEIXIN -->
				<image @tap="xiaoLogin" src="../../static/wechat.png" mode=""></image>
				<!--  #endif -->
				<!-- #ifdef APP-PLUS -->
				<image @tap="wxLogin" src="../../static/wechat.png" mode=""></image>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
	data() {
		return {
			isWXAppInstalled: true
		};
	},
	computed: {
		...mapState(['shareMsg'])
	},
	onLoad() {
		let platform = uni.getSystemInfoSync().platform;
		// #ifdef APP-PLUS
		if (platform === 'ios') {
			let WXApi = plus.ios.import('WXApi');
			this.isWXAppInstalled = WXApi.isWXAppInstalled();
		}
		// #endif
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
		...mapMutations(['setLogin', 'setWxInfo','setInfo']),
		getUserInfo() {
			this.$Fetch({
				url: 'user/getDataById',
				success: res => {
					this.setInfo(res);
					uni.setStorageSync('userInfo', res);
				}
			});
		},
		onSubmit(e) {
			let that = this;
			let data = e.detail.value;
			console.log('提交数据：', e.detail.value);
			for (let key in data) {
				if (!data[key]) {
					uni.showToast({
						title: '用户名或密码不能为空！',
						icon: 'none'
					});
					return false;
				}
			}
			this.$Fetch({
				url: 'login/doit',
				data: data,
				success: res => {
					uni.setStorage({
						key: 'TOKEN',
						data: res,
						success: function() {
							that.setLogin();
							uni.showToast({
								title: '登录成功',
								icon: 'success'
							});
							if (that.shareMsg.path) {
								setTimeout(() => {
									uni.reLaunch({
										url: that.shareMsg.path
									});
								}, 1500);
							} else {
								setTimeout(() => {
									uni.reLaunch({
										url: '/pages/index/index'
									});
								}, 1500);
							}
						}
					});
				}
			});
		},
		wxLogin() {
			let that = this;
			uni.login({
				provider: 'weixin',
				success: loginRes => {
					uni.getUserInfo({
						provider: 'weixin',
						lang: 'zh_CN',
						success: infoRes => {
							that.setWxInfo(infoRes.userInfo);
							that.$Fetch({
								url: 'login/wxLogin',
								data: { open_id: infoRes.userInfo.unionid },
								success: res => {
									uni.setStorage({
										key: 'TOKEN',
										data: res,
										success: function() {
											that.setLogin();
											uni.showToast({
												title: '登录成功',
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
						}
					});
				}
			});
		},
		xiaoLogin() {
			uni.showLoading({
				mask: true,
				title: '登录中···'
			});
			let that = this;
			wx.getSetting({
				success(res) {
					if (!res.authSetting['scope.userInfo']) {
						uni.navigateTo({
							url: '/pages/authorize/authorize'
						});
					} else {
						wx.login({
							success: res => {
								wx.getUserInfo({
									withCredentials: true,
									success: ret => {
										that.$Fetch({
											url: 'login/xiaoLogin',
											data: {
												js_code: res.code,
												user_name: ret.userInfo.nickName,
												head_img: ret.userInfo.avatarUrl,
												encryptedData: ret.encryptedData,
												iv: ret.iv,
												server_people_id: that.shareMsg.server
											},
											success: res => {
												uni.setStorage({
													key: 'TOKEN',
													data: res,
													success: function() {
														that.setLogin();
														uni.showToast({
															title: '登录成功',
															icon: 'success'
														});
														if (that.shareMsg.path) {
															setTimeout(() => {
																uni.reLaunch({
																	url: that.shareMsg.path
																});
															}, 1500);
														} else {
															setTimeout(() => {
																uni.reLaunch({
																	url: '/pages/index/index'
																});
															}, 1500);
														}
													}
												});
											}
										});
									}
								});
							}
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.wechat {
	text-align: center;
	view {
		margin: 70rpx auto;
		color: #999;
		font-size: 24rpx;
	}
	.on-hover {
		opacity: 0.8;
	}
	image {
		width: 120rpx;
		height: 120rpx;
	}
}
</style>
