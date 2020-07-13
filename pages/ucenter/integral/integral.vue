<template>
	<view class="page">
		<view class="box">
			<image class="bg" src="../../../static/bg.png" mode=""></image>
			<view class="info">
				<view class="item">
					<view class="label">累计总砖瓦数</view>
					<view class="total">{{info.all_points||0}}</view>
				</view>
				<view class="list">
					<view>
						<view class="label">今日新增砖瓦数</view>
						<view class="total">{{info.day_points||0}}</view>
					</view>
					<view>
						<view class="label">本月总砖瓦数</view>
						<view class="total">{{info.month_points||0}}</view>
					</view>
					<view>
						<view class="label">可用砖瓦数</view>
						<view class="total">{{info.surplus||0}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="rules">
			<view class="title">砖瓦说明</view>
			<view class="rule" v-for="(item,i) in rules" :key="i"><text></text>{{item.name}}得{{item.point}}砖瓦</view>
			<!-- <view class="rule"><text></text>砖瓦可兑换代金券</view> -->
		</view>
		<!-- <navigator url="../getCoupon/getCoupon" class="btn">兑换代金券</navigator> -->
		<!--  #ifdef  MP-WEIXIN -->
		<navigator url="../record/record" class="btn">查看明细</navigator>
		<!--  #endif -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			info:{},
			rules:[]
		};
	},
	onNavigationBarButtonTap(e) {
		uni.navigateTo({
			url: '../record/record'
		});
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
		this.$Fetch({
			url:"Points/getDataById",
			success:res=>{
				this.info=res;
				this.rules=res.lists
			}
		})
	}
};
</script>

<style lang="scss" scoped>
.page {
	.box {
		position: relative;
		.bg {
			width: 750rpx;
			height: 521rpx;
		}
		.info {
			position: absolute;
			top: 0;
			left: 0;
			width: 750rpx;
			height: 521rpx;
			padding: 30rpx;
			box-sizing: border-box;
			color: #fff;
			.item {
				padding: 20rpx 0;
				border-bottom: 1px solid #c0d8f4;
				.total {
					font-size: 60rpx;
				}
			}
			.label {
				color: #c0d8f4;
			}
			.list{
				display: flex;
				flex-wrap:wrap;
				>view{
					margin-top: 40rpx;
					width: 50%;
					.total {
						font-size: 50rpx;
					}
				}
			}
		}
	}
	.rules{
		padding: 60rpx 30rpx 30rpx;
		.title{
			font-size: 34rpx;
			margin-bottom: 30rpx;
		}
		.rule{
			display: flex;
			align-items: center;
			font-size: 24rpx;
			line-height: 50rpx;
			color:#666;
			text{
				width: 10rpx;
				height: 10rpx;
				border-radius: 10rpx;
				margin-right: 20rpx;
				background-color: #007AFF;
			}
		}
		
	}
	.btn {
		position: fixed;
		width: 710rpx;
		height:80rpx;
		left: 20rpx;
		bottom: 20rpx;
		line-height: 80rpx;
		background-color: #007bff;
		color: #fff;
		border-radius: 100rpx;
	}
}
</style>
