<template>
	<view class="page">
		<swiper class="banner" autoplay>
			<swiper-item v-for="(item, i) in banner" :key="i">
				<navigator v-if="item.url" :url="'video/video?src=' + item.url"><image class="image" :src="item.img" mode="widthFix"></image></navigator>
				<image class="image" :src="item.img" mode="widthFix"></image>
			</swiper-item>
		</swiper>
		<view class="search">
			<navigator url="citys/citys" class="loaction">
				<text>{{ city }}</text>
				<image src="/static/pulldown.png" mode=""></image>
			</navigator>
			<view class="line">|</view>
			<view @tap="navFilter" data-url="search/search" class="input">
				<image src="/static/search.png"></image>
				<view>请输入搜索内容.</view>
			</view>
		</view>
		<view class="nav">
			<view @tap="navFilter" data-url="articleList/articleList?title=文化信息&type=0" class="item">
				<image class="icon" src="/static/culture.png"></image>
				<view>文化信息</view>
			</view>
			<view @tap="navFilter" data-url="articleList/articleList?title=行业信息&type=1" class="item">
				<image class="icon" src="/static/hangye.png"></image>
				<view>行业信息</view>
			</view>
			<view @tap="navFilter" data-url="articleList/articleList?title=业务知识&type=2" class="item">
				<image class="icon" src="/static/yewu.png"></image>
				<view>业务知识</view>
			</view>
			<view @tap="navFilter" data-url="articleList/articleList?title=证照信息&type=3" class="item">
				<image class="icon" src="/static/zhengjian.png"></image>
				<view>证照信息</view>
			</view>
		</view>
		<view class="nav">
			<view @tap="navFilter" data-url="actList/actList" class="item bg"><image mode="widthFix" src="/static/daily.png"></image></view>
			<view @tap="navFilter" data-url="articleList/articleList?title=企业文化&type=4" class="item bg"><image mode="widthFix" src="/static/qiye.png"></image></view>
			<view @tap="navFilter" data-url="courseList/courseList" class="item bg"><image mode="widthFix" src="/static/worker.png"></image></view>
		</view>
		<view class="title">
			<image src="/static/tuijian.png" mode=""></image>
			<text>资质展示</text>
		</view>
		<swiper class="swiper" autoplay>
			<swiper-item v-for="(item, i) in zizhi" :key="i"><image @tap="previewImage(i)" class="image" :src="item.img" mode="aspectFit"></image></swiper-item>
		</swiper>
		<view class="title">
			<image src="/static/tuijian.png" mode=""></image>
			<text>推荐资讯</text>
		</view>
		<article-list :list="list" />
		<navigator class="buy" url="/pages/ucenter/servicer/servicer"><image src="../../static/buy.png" mode=""></image></navigator>
	</view>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import articleList from '@/components/articleList.vue';
export default {
	data() {
		return {
			banner: [{ img: require('../../static/banner.png') }],
			zizhi: [],
			type: 1,
			more: false,
			pageNum: 1,
			pageSize: 10,
			loading: true,
			list: [],
			imgList:[]
		};
	},
	computed: {
		...mapState(['isLogin', 'userInfo', 'city', 'uList', 'msgNum', 'count'])
	},
	components: { articleList },
	onShareAppMessage() {
		let user = uni.getStorageSync('userInfo');
		if (uni.getStorageSync('TOKEN')) {
			return {
				title: '易建联共享服务平台',
				path: '/pages/index/index?server=' + user.server_people_id
			};
		}
	},
	onLoad(opt) {
		this.$Fetch({
			url: 'picture/getData',
			success: res => {
				this.zizhi = res.picture;
				for(let item of res.picture){
					this.imgList.push(item.img)
				}
				if (res.banner.length > 0) this.banner = res.banner;
			}
		});
		this.getList();
		if (opt.server) {
			this.setShareMsg({ server: opt.server });
		}
		let that = this;
		if (uni.getStorageSync('TOKEN')) {
			console.log(uni.getStorageSync('TOKEN'));
			this.$Fetch({
				url: 'user/getDataById',
				success: res => {
					this.setInfo(res);
					uni.setStorageSync('userInfo', res);

					uni.connectSocket({
						url: 'wss://yjl.tao.li4.cn:8282'
					});
					uni.onSocketOpen(function(ret) {

						// #ifdef APP-PLUS
						var cid = plus.push.getClientInfo().clientid;
						uni.sendSocketMessage({
							data: JSON.stringify({
								type: 'bind',
								user_id: res.id,
								user_child_getui: cid
							}),
							success: function() {
							}
						});
						// #endif
						//#ifdef  MP-WEIXIN
						uni.sendSocketMessage({
							data: JSON.stringify({
								type: 'bind',
								user_id: res.id
							}),
							success: function() {
								console.log('发送成功');
							}
						});
						// #endif
						uni.onSocketMessage(function(ret) {
							that.$Fetch({
								url: 'user_chat/getDataList',
								success: res => {
									that.updateUlist(res);
								}
							});
							let msg = JSON.parse(ret.data);
							uni.$emit('onMessage', msg);
							if (msg.type === 'text') {
								that.setMsgNum(that.msgNum + 1);

								let uList = that.uList;
								for (let item of uList) {
									if (item.id === msg.user_id) {
										if (item.count) {
											item.count++;
										} else {
											item.count = 1;
										}
									}
								}
								that.updateUlist(uList);
								// #ifdef APP-PLUS
								var option = {
									cover: false
								};
								var pages = getCurrentPages();
								var url = pages[pages.length - 1].route;
								if (url !== 'pages/message/chat/chat') {
									plus.push.createMessage(msg.user_name + '：' + msg.content, ret.data, option);

									plus.push.addEventListener('click', function(msg) {
										let data = JSON.parse(msg.payload);
										data.id = data.user_id;
										data.head_img = data.user_head_img;
										uni.switchTab({
											// url: '/pages/message/chat/chat?user=' + JSON.stringify(data)
											url: '/pages/message/message'
										});
									});
								}
								// #endif
							}
						});
					});
					uni.onSocketClose(function(ret) {
						if (uni.getStorageSync('TOKEN')) {
							// uni.showToast({
							// 	title: '服务器连接异常！重连中···',
							// 	icon: 'none'
							// });
							uni.connectSocket({
								url: 'wss://yjl.tao.li4.cn:8282'
							});
						}
					});
					uni.onSocketError(function(ret) {
						if (uni.getStorageSync('TOKEN')) {
							// uni.showToast({
							// 	title: '服务器连接异常！重连中···',
							// 	icon: 'none'
							// });
							uni.connectSocket({
								url: 'wss://yjl.tao.li4.cn:8282'
							});
						}
					});

					this.$Fetch({
						url: 'user_chat/NoReadNum',
						success: res => {
							this.setMsgNum(res);
						}
					});
					this.$Fetch({
						url: 'user_chat/getNoRead',
						success: res => {
							let uList = this.uList;
							for (let item of res) {
								for (let i in uList) {
									if (item.user_id === uList[i].id) {
										let user = uList[i];
										user.content = item.content;
										user.count = item.count;
										uList[i] = user;
									}
								}
							}
							this.updateUlist(uList);
						}
					});
				}
			});
		}
	},
	onReachBottom() {
		this.getList();
	},
	onPullDownRefresh() {
		this.$Fetch({
			url: 'picture/getData',
			success: res => {
				this.zizhi = res.picture;
				for(let item of res.picture){
					this.imgList.push(item.img)
				}
				if (res.banner.length > 0) this.banner = res.banner;
			}
		});
		this.getList();
	},
	methods: {
		...mapMutations(['setInfo', 'updateUlist', 'setMsgNum', 'setCount', 'setShareMsg']),
		...mapActions(['navFilter']),
		previewImage(i) {
			uni.previewImage({
				current:i,
				urls: this.imgList
			});
		},
		getList() {
			if (this.loading) {
				this.loading = false;
				this.$Fetch({
					url: 'news/recommend',
					data: {
						pageNum: this.pageNum,
						pageSize: this.pageSize
					},
					success: res => {
						let arr = res.lists;
						if (arr.length > 0) {
							this.list = this.list.concat(arr);
							if (arr.length === this.pageSize) {
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
	}
};
</script>

<style lang="scss" scoped>
.page {
	.banner {
		width: 750rpx;
		height: 360rpx;
		.image {
			width: 100%;
			height: 100%;
		}
	}
	.search {
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		width: 640rpx;
		height: 100rpx;
		padding: 0 30rpx;
		background-color: #fff;
		border: 1px solid #dedede;
		box-shadow: 0 10px 10px #dedede;
		border-radius: 12rpx;
		margin: -50rpx auto 0;
		.loaction {
			display: flex;
			align-items: center;
			image {
				width: 30rpx;
				height: 30rpx;
			}
		}
		.line {
			color: #c8c7c7;
			margin: 0 30rpx;
		}
		.input {
			flex: 1;
			display: flex;
			align-items: center;
			color: #c8c7c7;
			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 30rpx;
			}
		}
	}
	.nav {
		display: flex;
		justify-content: space-between;
		padding: 40rpx 30rpx 0;
		.item {
			position: relative;
			text-align: center;
			.icon {
				width: 100rpx;
				height: 100rpx;
			}
		}
		.bg {
			width: 31.5%;
			image {
				width: 100%;
			}
		}
	}
	.title {
		padding: 30rpx 30rpx 0;
		display: flex;
		align-items: center;
		image {
			width: 40rpx;
			height: 40rpx;
			margin-right: 20rpx;
		}
		text {
			font-weight: bold;
		}
	}
	.swiper {
		width: 690rpx;
		height: 500rpx;
		margin: 30rpx auto;
		.image {
			width: 100%;
			height: 100%;
		}
	}
	.buy {
		margin: auto;
		width: 709rpx;
		height: 178rpx;
		margin-bottom: 50rpx;
		image {
			width: 709rpx;
			height: 178rpx;
		}
	}
}
</style>
