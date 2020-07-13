<template>
	<view class="page">
		<van-cell v-for="(item, i) in list" :key="i" size="large" :center="true" :title="item.user_name">
			<navigator slot="icon" :url="'/pages/index/author/author?attention=1&id=' + item.id">
				<image v-if="item.head_img" :src="item.head_img" class="icon"></image>
				<image v-else src="../../../static/avatar.jpg" class="icon"></image>
			</navigator>
			<navigator slot="right-icon" :url="'/pages/message/chat/chat?user=' + JSON.stringify(item)">
				<van-button custom-class="btn" type="primary" size="small">私信</van-button>
			</navigator>
		</van-cell>
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
	onShow() {
		this.more= false;
		this.pageNum= 1;
		this.pageSize= 20;
		this.loading= true;
		this.list= [];
		this.getList();
	},
	onReachBottom() {
		this.getList();
	},
	methods: {
		getList() {
			if (this.loading) {
				this.loading = false;
				this.$Fetch({
					url: 'Attention/getData',
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

<style lang="scss">
.page {
	.icon {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50rpx;
		margin-right: 30rpx;
	}
	.btn {
		background-color: #007bff;
		border-color: #007bff;
	}
}
</style>
