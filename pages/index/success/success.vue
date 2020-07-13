<template>
	<view class="page">
		<image class="icon" src="../../../static/success.png" mode="widthFix"></image>
		<view class="tip">报名成功！</view>
		<navigator class="nav" :url="'../signDetail/signDetail?id='+id">查看报名</navigator>
		<navigator class="nav full" open-type="switchTab" url="/pages/index/index">返回首页</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:-1
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
			this.id=opt.id
		}
	}
</script>

<style lang="scss" scoped>
.page{
	text-align: center;
	.icon{
		width: 200rpx;
		margin: 60rpx 0;
	}
	.tip{
		margin-bottom: 250rpx;
		font-size: 50rpx;
		color:#077FFF
	}
	.nav{
		width: 540rpx;
		height: 70rpx;
		margin: 60rpx auto;
		text-align: center;
		line-height: 70rpx;
		color:#077FFF;
		border:1px solid #077FFF;
		border-radius: 40rpx;
	}
	.nav.full{
		background-color: #EDF6FF;
		border-color: #EDF6FF;
	}
}
</style>
