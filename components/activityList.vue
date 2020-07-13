<template>
	<view class="list">
		<navigator :url="type==1?'/pages/index/activity/activity?id=' + item.activity_id:'/pages/index/activity/activity?id=' + item.id" class="item" v-for="(item, i) in list" :key="i">
			<image class="img" v-if="item.img" :src="item.img" mode=""></image>
			<image class="img" v-else src="../static/acticle.jpg" mode=""></image>
			<view class="body">
				<view class="title">{{ item.title }}</view>
				<view class="time">
					<image src="/static/date.png" mode="widthFix"></image>
					{{ item.start_time }}
				</view>
				<view class="location">
					<image src="/static/location.png" mode="widthFix"></image>
					{{ item.city }}
				</view>
			</view>
		</navigator>
		<image v-if="list.length === 0 && !more" class="empty" src="/static/empty.png" mode="widthFix"></image>
		<view class="loading" v-if="more">
			<van-loading type="spinner" color="#999" />
			<text>加载中</text>
		</view>
	</view>
</template>

<script>
export default {
	props: ['list', 'more','type'],
	data() {
		return {};
	},
};
</script>

<style lang="scss" scoped>
.list {
	.item {
		display: flex;
		width: 690rpx;
		height: 240rpx;
		margin: 30rpx auto 30rpx;
		border-radius: 15rpx;
		border: 1px solid #f7f7f7;
		box-shadow: 0 10rpx 15rpx #dedede;
		overflow: hidden;
		background-color: #fff;
		.body {
			flex: 1;
			padding: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.title {
				font-size: 32rpx;
				font-weight: bold;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.time,
			.location {
				color: #b9b9b9;
				font-size: 24rpx;
				display: flex;
				align-items: center;
				image {
					width: 30rpx;
					margin-right: 10rpx;
				}
			}
		}
		.img {
			width: 240rpx;
			height: 240rpx;
		}
	}
}
</style>
