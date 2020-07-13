<template>
	<view class="page">
		<van-tabs type="card" color="#007BFF" animated sticky v-on:change="onChange">
			<van-tab v-for="(tab, i) in tabs" :key="i" :title="tab.name">
				<view class="order" v-for="(order, k) in tab.list" :key="k">
					<view class="row">
						<view class="oid">订单编号：{{ order.order_sn }}</view>
						<view v-if="order.order_status === 0" class="status">未接单</view>
						<view v-else-if="order.order_status === 1" class="status">已接单</view>
						<view v-else class="status">已完成</view>
					</view>
					<view class="row">
						<view>项目名称：{{ order.project_name }}</view>
						<view>服务人：{{ order.serve_people_name }}</view>
					</view>
					<view class="row">
						<view>项目金额：￥{{ order.project_price }}</view>
						<view>资质：{{ order.qualifications }}</view>
						<!-- <view>代金券地抵扣：{{ order.coupon }}</view> -->
					</view>
					<!-- <view class="row">
						<view>资质：{{ order.qualifications }}</view>
						<view>实付：￥{{ order.order_amount }}</view>
					</view> -->
					<view class="row">
						<view class="time">下单时间：{{ order.create_time }}</view>
						<view v-if="order.end_time" class="time">完成时间：{{ order.end_time }}</view>
						<view v-else class="time">完成时间：未完成</view>
					</view>
				</view>
				<image v-if="tab.list.length === 0 && !more" class="empty" src="/static/empty.png" mode="widthFix"></image>
				<view class="loading" v-if="more">
					<text>加载中</text>
					<van-loading type="spinner" color="#999" />
				</view>
			</van-tab>
		</van-tabs>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: 0,
			tabs: [
				{
					name: '未完成',
					list: [],
					pageNum: 1,
					pageSize: 20,
					loading: true,
					more: false
				},
				{
					name: '已完成',
					list: [],
					pageNum: 1,
					pageSize: 20,
					loading: true,
					more: false
				}
			]
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
		onChange(e) {
			this.type = e.detail.index;
			if (this.tabs[e.detail.index].list.length === 0) this.getList();
		},
		getList() {
			let tabs = this.tabs;
			let type = this.type;
			if (tabs[type].loading) {
				tabs[type].loading = false;
				this.tabs = tabs;
				this.$Fetch({
					url: 'Order/getData',
					data: {
						order_status: (this.type-0)+1,
						pageNum: tabs[type].pageNum,
						pageSize: tabs[type].pageSize
					},
					success: res => {
						console.log(res)
						let len = res.lists.length;
						if (len > 0) {
							tabs[type].list = tabs[type].list.concat(res.lists);
							if (len === tabs[type].pageSize) {
								tabs[type].pageNum++;
								tabs[type].loading = true;
								tabs[type].more = true;
							} else {
								tabs[type].more = false;
							}
						} else {
							tabs[type].more = false;
						}
						this.tabs = tabs;
					}
				});
			}
		}
	}
};
</script>

<style lang="scss">
.page {
	padding: 20rpx 0;
	.van-tabs__scroll--card {
		height: 70rpx;
		padding: 10rpx;
		border-radius: 120rpx;
		border: none;
	}

	.van-tabs--card .van-tabs__wrap {
		height: 60rpx;
	}

	.van-tabs__nav--card .van-tab {
		border: none;
	}

	.van-tabs--card {
		padding-top: 90rpx;
	}

	.van-tab {
		height: 70rpx;
		border-radius: 100rpx;

		.van-tab__title {
			line-height: 70rpx;
		}
	}
	.order {
		margin: 20rpx;
		border-radius: 10rpx;
		border: 1px solid #f7f7f7;
		box-shadow: 5rpx 5rpx 10rpx #dedede;
		padding: 20rpx;
		.row {
			display: flex;
			margin-top: 10rpx;
			font-size: 26rpx;
			view {
				flex: 1;
			}
			.oid {
				font-size: 24rpx;
				color: #999;
			}
			.status {
				color: #1890ff;
				text-align: right;
			}
			.time {
				font-size: 22rpx;
				color: #999;
			}
		}
	}
}
</style>
