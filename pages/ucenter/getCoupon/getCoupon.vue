<template>
	<view class="page">
		<view class="coupon" v-for="(coupon, i) in list" :key="i" @tap="getCoupon(coupon, i)">
			<image class="bg" src="../../../static/coupon.png" mode=""></image>
			<view class="content">
				<view class="head">
					<text>代金券</text>
					<text class="num">(剩余{{ coupon.num }})</text>
				</view>
				<view class="body">
					<view>{{ coupon.title }}</view>
					<view class="price">
						<text>金额：￥{{ coupon.coupon_money }}</text>
						<text>积分：{{ coupon.points }}</text>
					</view>
					<view class="time" v-if="coupon.start_time">{{ coupon.start_time }}~{{ coupon.end_time }}</view>
				</view>
			</view>
		</view>
		<image v-if="list.length === 0 && !more" class="empty" src="/static/empty.png" mode="widthFix"></image>
		<view class="loading" v-if="more">
			<text>加载中</text>
			<van-loading type="spinner" color="#999" />
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			more: false,
			pageNum: 1,
			pageSize: 20,
			loading: true,
			list: []
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
	onLoad() {
		this.getList();
	},
	onReachBottom() {
		this.getList();
	},
	methods: {
		getCoupon(item, i) {
			this.$Fetch({
				url: 'Coupon/getCoupon',
				data: { id: item.id },
				success: res => {
					item.num = item.num - 1;
					if (item.num === 0) {
						this.list.splice(i, 1);
					}
					uni.showModal({
						content: '兑换成功',
						confirmText: '继续兑换',
						cancelText: '返回',
						success: function(ret) {
							if (ret.cancel) {
								uni.navigateBack({});
							}
						}
					});
				}
			});
		},
		getList() {
			if (this.loading) {
				this.loading = false;
				this.$Fetch({
					url: 'Coupon/getData',
					data: { pageNum: this.pageNum, pageSize: this.pageSize },
					success: res => {
						if (res.length > 0) {
							this.list = this.list.concat(res);
							if (res.length === this.pageSize) {
								this.pageNum++;
								this.loading = true;
								this.more = true;
							} else {
								this.more = false;
							}
						} else {
							this.more = false;
						}
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	.coupon {
		position: relative;
		margin: 30rpx auto;
		width: 730rpx;
		height: 220rpx;
		.bg {
			width: 730rpx;
			height: 220rpx;
		}
		.content {
			position: absolute;
			top: 0;
			left: 0;
			width: 730rpx;
			height: 220rpx;
			display: flex;
			align-items: center;
			.head {
				color: #fff;
				width: 200rpx;
				padding-left: 20rpx;
				font-size: 40rpx;
				text-align: center;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				align-items: center;
				.num {
					font-size: 26rpx;
				}
			}
			.body {
				flex: 1;
				font-size: 30rpx;
				padding: 0 40rpx 0 20rpx;
				.price {
					margin-top: 20rpx;
					color: #999;
					font-size: 24rpx;
					display: flex;
					justify-content: space-between;
				}
				.time {
					margin-top: 20rpx;
					color: #999;
					font-size: 20rpx;
				}
			}
		}
	}
}
</style>
