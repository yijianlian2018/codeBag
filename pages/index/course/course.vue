<template>
	<view class="page" v-if="course">
		<!-- <image class="banner" :src="course.banner" mode="widthFix"></image> -->
		<video v-if="list.length > 0" id="myVideo" poster="http://yjl.tao.li4.cn/img/20190921/689209dd76925de70a50e589ffdadbc8.png" :src="url" @error="videoErrorCallback" controls></video>
		<scroll-view class="scroll-view" :scroll-y="true" :style="{ height: scrollHeight }">
			<view class="content">
				<view class="intro">
					<view>简介</view>
					<view class="text">{{ course.brief }}</view>
				</view>
				<view @tap="show(item.url)" class="item" v-for="(item, i) in list" :key="i">
					<image src="../../../static/play.png" mode=""></image>
					<view>第{{ i + 1 }}节 {{ item.name }}</view>
					<text>{{ item.time|toTime }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id:-1,
			videoContext:null,
			scrollHeight: 0,
			course: null,
			list: [],
			url: ''
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
	filters:{
		toTime(str){
			let s=str%60;
			let m=parseInt((str%3600)/60)>9?parseInt((str%3600)/60):"0"+parseInt((str%3600)/60);
			let h=parseInt(str/3600)>9?parseInt(str/3600):"0"+parseInt(str/3600);
			return h+':'+m+':'+s
		}
	},
	onLoad(opt) {
		this.videoContext = uni.createVideoContext('myVideo');
		let _this = this;
		uni.getSystemInfo({
			success: function(res) {
				let videoH = uni.upx2px(421.875);
				_this.scrollHeight = res.windowHeight - res.statusBarHeight - videoH + 'px';
			}
		});
		if (opt.id) {
			this.id=opt.id;
			this.$Fetch({
				url: 'training/getDataById',
				data: { id: this.id },
				success: res => {
					this.course = res;
					this.list = res.item_list;
					this.url = res.item_list[0].url;
				}
			});
		}
	},
	onPullDownRefresh() {
		this.$Fetch({
			url: 'training/getDataById',
			data: { id: this.id },
			success: res => {
				this.course = res;
				this.list = res.item_list;
				this.url = res.item_list[0].url;
			}
		});
	},
	methods: {
		show(url) {
			this.url = url;
		},
		videoErrorCallback() {}
	}
};
</script>

<style lang="scss" scoped>
.page {
	.banner {
		width: 750rpx;
	}
	#myVideo {
		width: 750rpx;
		height: 421.875rpx;
		.back {
			position: absolute;
			top: var(--status-bar-height);
			left: 30rpx;
			width: 50rpx;
			height: 50rpx;
		}
	}
	.scroll-view {
		.content {
			padding: 30rpx;
			.intro {
				margin-bottom: 30rpx;
				.text {
					color: #666;
					font-size: 26rpx;
				}
			}
			.item {
				padding: 20rpx 0;
				border-top: 1px solid #f4f4f4;
				display: flex;
				align-items: center;
				image {
					width: 45rpx;
					height: 45rpx;
					margin-right: 20rpx;
				}
				view {
					flex: 1;
					font-size: 32rpx;
					font-weight: bold;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				text {
					color: #999;
					margin-right: 20rpx;
				}
			}
		}
	}
}
</style>
