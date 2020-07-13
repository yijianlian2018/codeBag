<template>
	<view class="page">
		<view class="coupon" v-for="(coupon, i) in list" :key="i" @tap="doCheck(coupon)">
			<image class="bg" src="../../../static/coupon.png" mode=""></image>
			<view class="content">
				<view class="num">￥{{ coupon.coupon_money }}</view>
				<view class="body">
					<view>{{ coupon.title }}</view>
					<view class="time" v-if="coupon.start_time">{{ coupon.start_time }}~{{ coupon.end_time }}</view>
				</view>
				<block v-if="show">
					<image v-if="coupon.id === item.id" class="check" src="../../../static/checked.png"></image>
					<image v-else class="check" src="../../../static/unchecked.png"></image>
				</block>
				<block v-else><navigator :url="'../servicer/servicer?coupon=' + JSON.stringify(coupon)" class="use">立即使用</navigator></block>
			</view>
		</view>
		<image v-if="list.length === 0 && !more" class="empty" src="/static/empty.png" mode="widthFix"></image>
		<view class="loading" v-if="more">
			<text>加载中</text>
			<van-loading type="spinner" color="#999" />
		</view>
		<block v-if="show">
			<view style="height: 100rpx;"></view>
			<view class="btn" @tap="doChoose">确认选择</view>
		</block>
	</view>
</template>

<script>
export default {
	data() {
		return {
			item: {},
			show: false,
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
	onLoad(opt) {
		this.getList();
		if (opt.name) {
			this.show = true;
			if (opt.coupon) {
				this.item = JSON.parse(opt.coupon);
			}
			uni.setNavigationBarTitle({
				title: opt.name
			});
		}
	},
	onReachBottom() {
		this.getList();
	},
	methods: {
		doCheck(item) {
			this.item = item;
		},
		doChoose() {
			uni.$emit('choose', this.item);
			uni.navigateBack({});
		},
		getList() {
			if (this.loading) {
				this.loading = false;
				this.$Fetch({
					url: 'Coupon/user_coupon',
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
			.num {
				color: #fff;
				width: 200rpx;
				font-size: 40rpx;
				text-align: center;
			}
			.body {
				flex: 1;
				font-size: 30rpx;
				padding: 0 20rpx;
				.time {
					margin-top: 20rpx;
					color: #999;
					font-size: 20rpx;
				}
			}
			.use {
				margin-right: 50rpx;
				font-size: 22rpx;
				color: #1890ff;
				padding: 5rpx 20rpx;
				border: 1px solid #1890ff;
				border-radius: 100rpx;
			}
			.check {
				width: 35rpx;
				height: 35rpx;
				margin: 0 40rpx 0 20rpx;
			}
		}
	}
	.btn {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
	}
}
</style>
