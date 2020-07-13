<template>
	<view class="page">
		<!-- #ifdef APP-PLUS -->
		<view class="status-bar"></view>
		<view class="title">
			<view @tap="navFilter" :data-url="'./setting/setting?mobile=' + userInfo.mobile"><image class="icon" src="../../static/setting.png" mode=""></image></view>
			<image @tap="showShare" class="icon" src="../../static/share.png" mode=""></image>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<van-nav-bar :border="false"><image @tap="navFilter" slot="left" data-url="./setting/setting" class="icon" src="../../static/setting.png" mode=""></image></van-nav-bar>
		<!-- #endif -->
		<view class="user">
			<navigator v-if="userInfo" url="info/info">
				<image v-if="userInfo.head_img" class="avatar" :src="userInfo.head_img" mode=""></image>
				<image v-else class="avatar" src="../../static/avatar.jpg" mode=""></image>
			</navigator>

			<image v-else class="avatar" src="../../static/avatar.jpg" mode=""></image>
			<view class="info">
				<block v-if="userInfo">
					<view v-if="userInfo.user_name" class="name">{{ userInfo.user_name }}</view>
					<navigator url="info/info" v-else class="name">暂无昵称</navigator>
					<view v-if="userInfo.sign" class="signature">{{ userInfo.sign }}</view>
					<navigator url="info/info" v-else class="signature">点击设置个人信息</navigator>
				</block>
				<block v-else>
					<navigator url="../login/login" class="name">点击登录</navigator>
					<view class="signature">登录APP体验更多功能</view>
				</block>
			</view>
		</view>
		<view class="list">
			<van-cell size="large" :center="true" is-link title="我的关注" @tap="navFilter" data-url="./attention/attention">
				<image slot="icon" src="../../static/attention.png" class="icon"></image>
			</van-cell>
			<van-cell size="large" :center="true" is-link title="我的订单" @tap="navFilter" data-url="./order/order">
				<image slot="icon" src="../../static/order.png" class="icon"></image>
			</van-cell>
			<van-cell size="large" :center="true" is-link title="我的砖瓦" @tap="navFilter" data-url="./integral/integral">
				<image slot="icon" src="../../static/integral.png" class="icon"></image>
			</van-cell>
			<van-cell size="large" :center="true" is-link title="我的收藏" @tap="navFilter" data-url="./collection/collection">
				<image slot="icon" src="../../static/collection.png" class="icon"></image>
			</van-cell>
			<!-- <van-cell size="large" :center="true" is-link title="我的代金券" @tap="navFilter" data-url="./coupon/coupon">
				<image slot="icon" src="../../static/ticket.png" class="icon"></image>
			</van-cell> -->
			<van-cell size="large" :center="true" is-link title="活动报名" @tap="navFilter" data-url="./activity/activity">
				<image slot="icon" src="../../static/activity.png" class="icon"></image>
			</van-cell>
			<van-cell size="large" :center="true" is-link title="我的服务人" @tap="navFilter" data-url="./servicer/servicer">
				<image slot="icon" src="../../static/servicer.png" class="icon"></image>
			</van-cell>
			<van-cell size="large" :center="true" is-link title="平台资质" @tap="navFilter" data-url="./serviceType/serviceType">
				<image slot="icon" src="../../static/service_type.png" class="icon"></image>
			</van-cell>
		</view>
		<view :class="{ popup: true, show: show }" @touchmove.stop.prevent="clear">
			<view class="content">
				<view class="close"><image @tap="closePopup" src="../../static/close.png" mode=""></image></view>
				<view>
					<view class="text">分享至</view>
					<view class="share-box">
						<view @tap="doShare('WXSceneSession')">
							<image class="icon" src="../../static/wechat.png" mode=""></image>
							<view class="share-name">微信好友</view>
						</view>
						<!-- <view @tap="doShare('WXSenceTimeline')">
							<image class="icon" src="../../static/friend.png" mode=""></image>
							<view class="share-name">朋友圈</view>
						</view> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
const token = uni.getStorageSync('TOKEN');
export default {
	data() {
		return {
			show: false,
			info: null
		};
	},
	computed: {
		...mapState(['isLogin', 'userInfo'])
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
	onLoad() {
		
	},
	onShow() {},
	methods: {
		...mapActions(['navFilter']),
		showShare() {
			uni.hideTabBar({});
			this.show = true;
		},
		closePopup() {
			this.show = false;
			uni.showTabBar({});
		},
		clear() {},
		async doShare(type) {
			let path='/pages/index/index'
			if(this.userInfo){
				path='/pages/index/index?server=' + this.userInfo.server_people_id
			}
			uni.share({
				provider: 'weixin',
				scene: type, //WXSceneSession”分享到聊天界面，“WXSenceTimeline”分享到朋友圈，“WXSceneFavorite”分享到微信收藏
				type: 5, //0-图文；5-小程序
				imageUrl:'../../static/poster.png',
				title: '欢迎使用易建联APP',
				miniProgram: {
					id:'gh_4bf03e4d36fb',
					path:path,
					webUrl:'https://uniapp.dcloud.io',
					type:0 //0-正式版；12体验版
				},
				success: e => {
					console.log('success', e);
					uni.showModal({
						content: '分享成功',
						showCancel: false
					});
				},
				fail: e => {
					console.log('fail', e);
					// uni.showModal({
					// 	content: e.errMsg,
					// 	showCancel:false
					// })
				},
				complete: function() {
					console.log('分享操作结束!');
				}
			});
			this.show = false;
			uni.showTabBar({});
		},
		compress() {
			//压缩图片 图文分享要求分享图片大小不能超过20Kb
			console.log('开始压缩');
			let img = '../../static/daily.png';
			return new Promise(res => {
				var localPath = plus.io.convertAbsoluteFileSystem(img.replace('file://', ''));
				console.log('after' + localPath);
				// 压缩size
				plus.io.resolveLocalFileSystemURL(
					localPath,
					entry => {
						entry.file(file => {
							// 可通过entry对象操作图片
							console.log('getFile:' + JSON.stringify(file));
							if (file.size > 20480) {
								// 压缩后size 大于20Kb
								plus.zip.compressImage(
									{
										src: img,
										dst: img.replace('.jpg', '2222.jpg').replace('.JPG', '2222.JPG'),
										width: '10%',
										height: '10%',
										quality: 1,
										overwrite: true
									},
									event => {
										console.log('success zip****' + event.size);
										let newImg = img.replace('.jpg', '2222.jpg').replace('.JPG', '2222.JPG');
										res(newImg);
									},
									function(error) {
										uni.showModal({
											content: '分享图片太大,需要请重新选择图片!',
											showCancel: false
										});
									}
								);
							}
						});
					},
					e => {
						console.log('Resolve file URL failed: ' + e.message);
						uni.showModal({
							content: '分享图片太大,需要请重新选择图片!',
							showCancel: false
						});
					}
				);
			});
		}
	}
};
</script>

<style lang="scss">
.page {
	overflow: hidden;
	.icon {
		width: 40rpx;
		height: 40rpx;
	}
	/*  #ifdef  APP-PLUS  */
	.title {
		padding: 30rpx;
	}
	/*  #endif  */
	.title {
		width: 690rpx;
		margin: auto;
		justify-content: space-between;
		// justify-content: flex-end;
		align-items: center;
		display: flex;
	}
	.user {
		width: 690rpx;
		margin: 0 auto 60rpx;
		align-items: center;
		display: flex;
		.avatar {
			width: 150rpx;
			height: 150rpx;
			border-radius: 75rpx;
			margin-right: 30rpx;
		}
		.info {
			flex: 1;
			.name {
				font-size: 45rpx;
				font-weight: bold;
			}
			.signature {
				font-size: 28rpx;
				color: #666;
			}
		}
	}
	.list {
		width: 690rpx;
		overflow: hidden;
		margin: 0 auto 60rpx;
		border: 1px solid #f7f7f7;
		border-radius: 20rpx;
		box-shadow: 10rpx 20rpx 30rpx #f7f7f7;

		.icon {
			width: 50rpx;
			height: 50rpx;
			margin-right: 30rpx;
		}
	}
	.popup.show {
		bottom: 0;
		transition: all 0.5s;
	}
	.popup {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		bottom: -2000rpx;
		transition: all 0.5s;
		.content {
			position: absolute;
			bottom: 0;
			width: 100%;
			background-color: #fff;
			.close {
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				padding: 0 30rpx;
				box-sizing: border-box;
				text-align: right;
				z-index: 999;
				image {
					width: 30rpx;
					height: 30rpx;
				}
			}
			.text {
				text-align: center;
				color: #077fff;
				padding: 15rpx 0;
			}
			.share-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				text-align: center;
				> view {
					width: 50%;
					.icon {
						width: 100rpx;
						height: 100rpx;
					}
					.share-name {
						margin: 15rpx 0 40rpx;
					}
				}
			}
		}
	}
}
</style>
