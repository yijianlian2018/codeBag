<template>
	<view class="page">
		<view class="item" v-for="(item,i) in list" :key="i">
			<text>{{item.point_name}}</text>
			<view>
				<view>{{item.point_change}}</view>
				<text>{{item.time}}</text>
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
			pageNum: 1,
			pageSize: 20,
			more: false,
			loading: true,
			list: []
		};
	},
	onLoad() {
		this.getList()
	},
	onReachBottom() {
		this.getList()
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
		getList() {
			if (this.loading) {
				this.loading = false;
				this.$Fetch({
					url: 'Points/getPointsList',
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
						}else{
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
	padding: 0 30rpx 30rpx;
	.item {
		padding: 20rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #f3f3f3;
		view {
			text-align: right;
			text {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
}
</style>
