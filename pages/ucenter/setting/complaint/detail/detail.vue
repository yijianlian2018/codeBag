<template>
	<view class="page">
		<view class="title">反馈问题:</view>
		<view class="content">{{item.content}}</view>
		<view class="reply">
		<view class="title">回复:</view>
		<view class="content">{{item.result}}</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				item:null
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
			if(opt.item){
				console.log(JSON.parse(opt.item))
				this.item=JSON.parse(opt.item)
			}
		}
	}
</script>

<style lang="scss" scoped>
.page{
	padding: 0 30rpx;
	.title{
		margin: 15rpx 0;
		font-size: 26rpx;
	}
	.reply{
		margin-top: 40rpx;
		background-color: #f7f7f7;
		padding: 20rpx;
	}
}
</style>
