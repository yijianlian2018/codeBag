<template>
	<view class="list">
		<view @tap="navFilter" :data-url="'/pages/index/article/article?id=' + item.id" class="item" v-for="(item, i) in list" :key="i">
			<view class="image">
				<image :src="item.img" class="img"></image>
				<image class="icon" src="/static/video.png"></image>
			</view>

			<view class="body">
				<view class="title">{{ item.title }}</view>
				<view class="row">
					<view>{{ item.create_time }}</view>
					<view>{{ item.user_name }}</view>
				</view>
				<view class="row">
					<view>
						<image src="/static/comment.png"></image>
						<text>{{ item.comment_num | getNum }}</text>
					</view>
					<view>
						<image src="/static/heart.png"></image>
						<text>{{ item.like_num_int | getNum }}</text>
					</view>
					<view>
						<image class="eye" src="/static/view.png"></image>
						<text>{{ item.click_num | getNum }}</text>
					</view>
				</view>
			</view>
		</view>
		<image v-if="list.length === 0 && !more" class="empty" src="/static/empty.png" mode="widthFix"></image>
		<view class="loading" v-if="more">
			<van-loading type="spinner" color="#999" />
			<text>加载中</text>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
export default {
	props: ['list', 'more'],
	data() {
		return {};
	},
	filters: {
		getNum(num) {
			return num > 1000 ? num / 1000 + 'k' : num;
		}
	},
	methods: { ...mapActions(['navFilter']) }
};
</script>

<style lang="scss" scoped>
.list {
	padding: 30rpx 30rpx 0;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	.item {
		width: 330rpx;
		margin-bottom: 40rpx;
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 10rpx 10rpx 30rpx #f3f3f3;
		.image {
			position: relative;
			width: 330rpx;
			.icon {
				width: 50rpx;
				height: 35rpx;
				position: absolute;
				top: 10rpx;
				left: 10rpx;
			}
			.img {
				width: 330rpx;
				height: 300rpx;
			}
		}
		.body {
			padding: 20rpx;
			.title {
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.row {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #b9b9b9;
				font-size: 25rpx;
				margin-top: 20rpx;
				view {
					display: flex;
					align-items: center;
					image {
						width: 30rpx;
						height: 28rpx;
						margin-right: 10rpx;
					}
					.eye {
						width: 33rpx;
						height: 26rpx;
					}
				}
			}
		}
	}
}
</style>
