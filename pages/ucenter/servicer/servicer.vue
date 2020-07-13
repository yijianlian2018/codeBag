<template>
	<view class="page">
		<view class="item" v-if="server">
			<image v-if="server.head_img" slot="icon" :src="server.head_img" class="avatar"></image>
			<image v-else slot="icon" src="../../../static/avatar.jpg" class="avatar"></image>
			<view class="body">
				<view class="name">{{ server.user_name }}</view>
				<view class="desc">{{ server.mobile }}</view>
			</view>
			<view class="btn" @tap="show = true">下单</view>
		</view>
		<uni-popup :show="show" :maskClick="false" type="bottom">
			<view class="close"><image @tap="show = false" src="../../../static/close.png" mode=""></image></view>
			<form @submit="onSubmit">
				<input name="server_people_id" type="text" v-model="server.id" style="display: none;" />
				<van-field name="project_name" size="large" label="项目名称" title-width="180rpx" placeholder="请输入项目名称" clearable />
				<van-field name="project_price" size="large" label="金额" title-width="180rpx" placeholder="请输入金额" clearable />
				<van-cell size="large" title-width="180rpx" title="资质">
					<!-- <input name="IsZc" v-model="IsZc" type="text" style="display:none" /> -->
					<view slot="right-icon" class="check-box">
						<view class="check-item" v-for="(item, i) in list" :key="i" @tap="checkType(item.id)">
							<text>{{ item.qua_name }}</text>
							<image v-if="type.indexOf(item.id)>-1" class="check" src="../../../static/checked.png"></image>
							<image v-else class="check" src="../../../static/unchecked.png"></image>
						</view>
					</view>
				</van-cell>
				<!-- <van-cell size="large" title-width="180rpx" title="可用代金券" :value="coupon?'抵扣￥'+coupon.coupon_money:'请选择'" is-link :url="'../coupon/coupon?name=选择代金券?coupon='+JSON.stringify(coupon)" /> -->
				<button class="btn" formType="submit">确认下单</button>
			</form>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
	data() {
		return {
			coupon:null,
			show: false,
			type: [],
			list: [],
			server: null
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
	components: { uniPopup },
	onLoad(opt) {
		this.getServer();
		if(opt.coupon){
			console.log(opt.coupon)
			this.coupon=JSON.parse(opt.coupon);
		}
		this.getServerType();
		uni.$on("choose",data=>{
			this.coupon=data;
		})
	},
	methods: {
		getServer() {
			this.$Fetch({
				url: 'serve_people/getDataById',
				success: res => {
					if (res) this.server = res;
				}
			});
		},
		getServerType() {
			this.$Fetch({
				url: 'Qualifications/getData',
				data: { pageNum: 1, pageSize: 10 },
				success: res => {
					let arr = res.lists;
					if (arr.length > 0) {
						this.list = arr;
					}
				}
			});
		},
		checkType(type) {
			let i = this.type.indexOf(type);
			if(i>-1){
				this.type.splice(i,1)
			}else{
				this.type.push(type)
			}
		},
		onSubmit(e) {
			let data=e.detail.value;
			data.qualifications=this.type;
			if(this.coupon){
				data.user_coupon_id=this.coupon.id;
			}
			
			console.log('提交数据：', data)
			this.$Fetch({
				url: 'Order/add',
				data: data,
				success: res => {
					this.show=false;
					uni.showToast({
						title:"下单成功",
						icon:"success"
					})
					setTimeout(()=>{
						uni.redirectTo({
							url:"/pages/ucenter/order/order"
						})
					},1500)
				}
			});
		}
	}
};
</script>

<style lang="scss">
.page {
	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1px solid #f4f4f4;
		.avatar {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50rpx;
			margin-right: 30rpx;
		}
		.body {
			height: 90rpx;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		.btn {
			font-size: 26rpx;
			padding: 10rpx 40rpx;
		}
	}
	.close {
		padding: 30rpx;
		text-align: right;
		image {
			width: 30rpx;
			height: 30rpx;
		}
	}
	.check-box {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		color: #999999;

		.check-item {
			display: flex;
			align-items: center;
			.check {
				width: 35rpx;
				height: 35rpx;
				margin: 0 20rpx;
			}
		}
	}
}
</style>
