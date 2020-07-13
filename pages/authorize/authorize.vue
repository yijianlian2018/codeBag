<template>
	<view class="current">
		<view><icon type="info" color="#007bff" size="40" /></view>
		<view class="cur_mid">为了更好地体验，易建联共享服务平台需要获取您的昵称、头像、手机号</view>
		<view>等基本信息授权</view>
		<button v-if="!show" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" class="but_normal" hover-class="but_nor_hover">授权登录</button>
		<button v-else open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="but_normal" hover-class="but_nor_hover">点击授权手机号</button>
		<!-- <button bindtap='test' class='but_normal' hover-class='but_nor_hover'>home</button> -->
	</view>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
	data() {
		return {
			show:false,
			userInfo: null,
			js_code: null,
			encryptedData:null,
			iv:null
		};
	},
	
	computed:{...mapState(['shareMsg'])},
	onLoad() {
		wx.login({
			success: res => {
				console.log('微信登录', res);
				this.js_code = res.code;
			}
		});
	},
	methods: {
		...mapMutations(['setLogin', 'setWxInfo']),
		bindGetUserInfo(e) {
			//点击授权弹窗上面的按钮
			let that = this;
			console.log('bindGetUserInfo-------', e);
			this.show=true
			if (e.detail.userInfo) {
				//用户按了允许授权按钮
				wx.showToast({
					title: '数据加载中',
					icon: 'loading',
					duration: 1000
				});
				this.userInfo = e.detail.userInfo;
				this.encryptedData=e.detail.encryptedData;
				this.iv=e.detail.iv;
				let userInfo = e.detail.userInfo;
				that.setWxInfo(userInfo);
			} else {
				//用户按了拒绝按钮
				wx.showModal({
					title: '警告',
					content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
					showCancel: false,
					confirmText: '返回授权',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击了“返回授权”');
						}
					}
				});
			}
		},
		getPhoneNumber(e) {
			console.log('getPhoneNumber-------', e);
			let that=this;
			if (e.detail.encryptedData) {
				that.$Fetch({
					url: 'login/xiaoLogin',
					data: {
						js_code: that.js_code,
						user_name: that.userInfo.nickName,
						head_img: that.userInfo.avatarUrl,
						encryptedData: that.encryptedData,
						iv: that.iv,
						phone_encryptedData:e.detail.encryptedData,
						phone_iv:e.detail.iv,
						server_people_id:that.shareMsg.server
					},
					success: res => {
						console.log(res);
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
			}else{
				//用户按了拒绝按钮
				wx.showModal({
					title: '警告',
					content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
					showCancel: false,
					confirmText: '返回授权',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击了“返回授权”');
						}
					}
				});
			}
		}
	}
};
</script>

<style lang="scss">
.current {
	padding: 100rpx 30rpx 0;
	text-align: center;
	font-size: 24rpx;
	color: #333;
}
.cur_mid {
	margin: 25rpx 0 30rpx 0;
}
.current button {
	margin-top: 120rpx;
	width: 70%;
}
.but_normal {
	background-color: #007bff;
	color: #fff;
}
.but_nor_hover {
	opacity: 0.8;
}
</style>
