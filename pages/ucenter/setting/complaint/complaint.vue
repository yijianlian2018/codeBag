<template>
	<view class="page">
		<view @tap="toDetail(item)" class="item" v-for="(item, i) in list" :key="i">
			<view class="body">
				<view class="que">{{ item.content }}</view>
				<view class="time">{{ item.add_time }}</view>
			</view>
			<text class="status red" v-if="item.status === 0">未处理</text>
			<text class="status green" v-else>已处理</text>
		</view>
		<image v-if="list === 0 && !more" class="empty" src="/static/empty.png" mode="widthFix"></image>
		<view class="loading" v-if="more">
			<text>加载中</text>
			<van-loading type="spinner" color="#999" />
		</view>
		<view class="btn-box"><navigator class="btn" url="submit/submit">我要投诉</navigator></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			pageNum: 1,
			pageSize: 20,
			loading: true,
			more: false
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
	onShow() {
		this.list = [];
		this.pageNum = 1;
		this.loading = true;
		this.getList();
	},
	onReachBottom() {
		this.getList();
	},
	methods: {
		toDetail(item) {
			if (item.status === 1) {
				uni.navigateTo({
					url: 'detail/detail?item=' + JSON.stringify(item)
				});
			}
		},
		getList() {
			this.$Fetch({
				url: 'advise/getData',
				data: {
					pageNum: this.pageNum,
					pageSize: this.pageSize
				},
				success: res => {
					let len = res.length;
					if (len > 0) {
						this.list = this.list.concat(res);
						if (len === this.pageSize) {
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
};
</script>

<style lang="scss" scoped>
.item {
	display: flex;
	align-items: center;
	padding: 30rpx;
	.body {
		flex: 1;
		.time {
			color: #999;
			font-size: 26rpx;
		}
	}
	.status {
		width: 120;
		text-align: center;
		&.red {
			color: red;
		}
		&.green {
			color: green;
		}
	}
}
.btn-box {
	position: fixed;
	bottom: 0;
	padding: 30rpx 0;
	background-color: #fff;
	width: 100%;
	.btn {
		width: 700rpx;
		margin: auto;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 34rpx;
		border-radius: 10rpx;
	}
}
</style>
