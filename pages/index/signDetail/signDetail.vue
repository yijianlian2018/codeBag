<template>
	<view class="page" v-if="act">
		<navigator :url="'../activity/activity?id=' + order.activity_id" class="class">
			<image class="thumbnail" :src="act.img"></image>
			<view class="body">
				<view class="title">{{ act.title }}</view>
				<view class="sub">
					开课时间：
					<text>{{ act.start_time }}~{{ act.end_time }}</text>
				</view>
				<view class="sub">地址：{{ act.activity_where }}</view>
				<view class="sub">举办人：{{ act.admin_user_name }}</view>
			</view>
		</navigator>
		<view style="height:15rpx;background-color:#f7f7f7"></view>
		<!-- 导航 -->

		<navigator url="/pages/map/map" class="navigate">
			<view>活动地点</view>
			<view>
				<van-icon custom-style="margin-right:10rpx;position: relative;top:12rpx" color="#9D9E9E" slot="icon" size="36rpx" name="location-o" />
				<text>{{ act.activity_where }}</text>
			</view>
		</navigator>
		<view style="height:15rpx;background-color:#f7f7f7"></view>
		<!-- 二维码 -->
		<view class="box">
			<view class="title">入场码</view>
			<view class="ewm-box">
				<view class="ewm-title">
					<view class="count">可使用({{ order.people_num }}张)</view>
					<view>有效期至{{ act.end_time }}</view>
				</view>
				<view class="tip">向商家出示二维码或券号即可消费</view>
				<view class="ewm" @tap="previewImage">
					<tki-qrcode cid="qrcode1" ref="qrcode" background="#ffffff" foreground="#000000" pdground="#000000" :size="300" :val="order.code" :onval="true" @result="qrR" />
				</view>
				<view class="num">券号：{{ order.code }}</view>
			</view>
			<button v-if="type===0" class="btn" @tap="doCancal">取消报名</button>
			<button v-if="type===1" class="btn" style="background-color: #C0D8F4;">参会中</button>
			<button v-if="type===2" class="btn" style="background-color: #C0D8F4;">已结束</button>
		</view>
		<view style="height:15rpx;background-color:#f7f7f7"></view>
		<!-- 订单信息 -->
		<view class="box">
			<view class="title">订单信息</view>
			<view class="info">
				<view>
					<text class="label">券号：</text>
					<view>{{ order.code }}</view>
				</view>
				<view>
					<text class="label">姓名：</text>
					<view>{{ order.user_name }}</view>
				</view>
				<view>
					<text class="label">手机号：</text>
					<view>{{ order.mobile }}</view>
				</view>
				<view>
					<text class="label">数量：</text>
					<view>{{ order.people_num }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
export default {
	data() {
		return {
			id:-1,
			order: null,
			act: null,
			ewm: '',
			type:0
		};
	},
	components: { tkiQrcode },
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
		if (opt.id) {
			this.id=opt.id;
			this.$Fetch({
				url: 'activity_list/getDataById',
				data: { id: opt.id },
				success: res => {
					console.log(res);
					this.order = res;
					this.act = res.activity;
					this.$refs.qrcode._makeCode();
					let start=res.activity.start_time.replace(/\-/g,"/");
					let end=res.activity.end_time.replace(/\-/g,"/");
					let now =new Date().getTime()
					if(now<new Date(start).getTime()){
						this.type=0
					}else if(now<=new Date(end).getTime()){
						this.type=1
					}else{
						this.type=2
					}
				}
			});
		}
	},
	methods: {
		qrR(e) {
			console.log(e);
			this.ewm = e;
		},
		previewImage() {
			uni.previewImage({
				urls: [this.ewm]
			});
		},
		doCancal(){
			this.$Fetch({
				url:"activity_list/del",
				data:{id:this.id},
				success:res=>{
					uni.showToast({
						title:"成功取消",
						icon:"success"
					})
					setTimeout(()=>{
						uni.navigateBack({
							
						})
					})
				}
			})
		}
	}
};
</script>

<style lang="scss">
.class {
	padding: 20rpx 30rpx 50rpx;
	display: flex;
	.thumbnail {
		width: 180rpx;
		height: 220rpx;
		margin-right: 20rpx;
	}
	.body {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.title {
			font-weight: bold;
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			.tag {
				width: 50rpx;
			}
		}
		.sub {
			color: #999;
			font-size: 24rpx;
		}
	}
}

.box {
	padding: 30rpx;
	.title {
		color: #999;
		padding-bottom: 20rpx;
		border-bottom: 1px solid #f5f5f5;
	}
	.ewm-box {
		border: 1px solid #f5f5f5;
		box-shadow: 0 10rpx 10rpx #f5f5f5;
		.ewm-title {
			background-color: #f5f5f5;
			padding: 20rpx;
			font-size: 22rpx;
			color: #999;
			font-weight: bold;
			.count {
				font-size: 26rpx;
				color: #333;
			}
		}
		.tip {
			font-size: 22rpx;
			text-align: center;
			color: #999;
			margin-top: 20rpx;
		}
		.ewm {
			display: block;
			width: 300rpx;
			margin: auto;
			padding: 20rpx 0;
		}
		.num {
			text-align: center;
			font-size: 36rpx;
			color: #007bff;
			padding: 30rpx 0;
			font-weight: bold;
			border-top: 1px dashed #f5f5f5;
		}
	}
}

.btn {
	margin-top: 20rpx;
}

.navigate {
	padding: 20rpx 30rpx;
	text {
		color: #999;
		font-size: 22rpx;
	}
}

.box .info {
	padding-top: 20rpx;
	font-size: 28rpx;
	color: #555;
}

.box .info > view {
	display: flex;
	padding: 5rpx 0;
}

.box .info .label {
	width: 200rpx;
	text-align: right;
}
</style>
