<script>
import { mapMutations } from 'vuex';
import utils from './common/util';
const { safeGet, getLocationUrl } = utils;
export default {
	methods: { ...mapMutations(['setCity']) },
	onLaunch: function() {
		// #ifdef APP-PLUS
		var option = {
			cover: false
		};
		plus.push.addEventListener(
			'receive',
			function(msg) {
				var payload = typeof msg.payload === 'object' ? msg.payload : JSON.parse(msg.payload);
				if (!msg.local) {
					msg.local = true;
					plus.push.createMessage(payload.user_name + '：' + payload.content, JSON.stringify(payload), option);
				}
			},
			false
		);
		plus.push.addEventListener('click', function(msg) {
			var payload = typeof msg.payload === 'object' ? msg.payload : JSON.parse(msg.payload);
			let user = JSON.stringify({
				user_name: payload.to_user_name,
				id: payload.to_user_id,
				head_img: payload.to_user_img
			});
			uni.navigateTo({
				url: '/pages/message/chat/chat?user='+user
			});
		});
		plus.screen.lockOrientation('portrait-primary');
		plus.push.setAutoNotification(true);
		// #endif
		let that = this;
		uni.getLocation({
			type: 'wgs84',
			success: function(res) {
				const { latitude, longitude } = res;
				uni.request({
					url: getLocationUrl(latitude, longitude),
					success: location => {
						const { city, adcode, district } = safeGet(['data', 'result', 'ad_info'], location);
						uni.getStorage({
							key: 'city',
							success: function() {},
							fail: function() {
								that.setCity(city);
								uni.setStorageSync('city', city);
							}
						});
					}
				});
			},
			fail: function() {
				uni.showToast({
					title: '定位失败',
					icon: 'none'
				});
			}
		});
	},
	onShow: function() {
		// console.log('App Show');
	},
	onHide: function() {
		// console.log('App Hide');
	}
};
</script>

<style lang="scss">
@import url('/components/gaoyia-parse/parse.css');
/*每个页面公共css */
.page {
	overflow-x: hidden;
	// padding: 0 30rpx;
	font-size: 30rpx;
	color: #333;
	.status-bar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: transparent;
	}
	.btn {
		text-align: center;
		background-color: #007bff;
		color: #fff;
		border-radius: 10rpx;
	}
	.loading {
		color: #999;
		padding: 30rpx 0;
		text-align: center;
		text {
			margin-right: 20rpx;
		}
	}

	.empty {
		display: block;
		width: 500rpx;
		margin: auto;
	}
	.login {
		padding: 30rpx;
		.title {
			font-size: 44rpx;
			color: #333;
			margin-bottom: 80rpx;
		}
		.imgCode {
			width: 140rpx;
			height: 60rpx;
		}
		.getCode {
			color: #333;
			font-size: 30rpx;
		}
		.navs {
			display: flex;
			justify-content: space-between;
			color: #999;
			padding: 30rpx 0;
		}
		.navs text {
			color: #333;
		}
		.btn {
			margin-top: 60rpx;
			border-radius: 100rpx;
			background-color: #007bff;
			color: #fff;
		}
	}
}
</style>
