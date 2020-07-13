<template>
	<view class="page">
		<van-tabs :active="type" color="#007BFF" :border="false" animated v-on:change="onChange" sticky>
			<van-tab v-for="(tab, i) in tabs" :key="i" :title="tab.name">
				<block v-if="type === 0">
					<!-- <van-swipe-cell v-for="(item, k) in tab.list" :key="k" :right-width="80">
						<view class="msg" @tap="doClick(item)">
							<view class="icon">
								<view v-if="item.is_read === 0" class="dot"></view>
								<image class="icon" src="../../static/bell.png" mode=""></image>
							</view>
							<view class="body">
								<view class="title">
									<text class="text">{{ item.title }}</text>
									<text class="time">{{ item.time }}</text>
								</view>
								<view class="desc">{{ item.content }}</view>
							</view>
						</view>
						<view @tap="del(item.id, k)" class="del" slot="right">删除</view>
					</van-swipe-cell> -->
					<block v-for="(item, k) in tab.list" :key="k">
						<view class="msg" @tap="doClick(item)">
							<view class="icon">
								<view v-if="item.is_read === 0" class="dot"></view>
								<image class="icon" src="../../static/bell.png" mode=""></image>
							</view>
							<view class="body">
								<view class="title">
									<text class="text">{{ item.title }}</text>
									<text class="time">{{ item.time }}</text>
								</view>
								<view class="desc">{{ item.content }}</view>
							</view>
						</view>
					</block>
				</block>
				<block v-else>
					<view  v-if="token&&user.id!=8888888" @tap="jump({ user_name: '客服', id: 8888888, head_img: '/static/kefu.png' })" class="msg">
						<view class="icon">
							<view v-if="item.count && item.count > 0" class="dot"></view>
							<image v-else class="icon" src="/static/kefu.png" mode=""></image>
						</view>
						<view class="body">
							<view class="title">
								<text>客服</text>
								<text class="time">{{ item.time }}</text>
							</view>
							<view class="desc">{{ item.content }}</view>
						</view>
					</view>
					<view v-if="token" @tap="jump(item)" v-for="(item, k) in uList" :key="k" class="msg">
						<view class="icon">
							<view v-if="item.count && item.count > 0" class="dot"></view>
							<image v-if="item.head_img" class="icon" :src="item.head_img" mode=""></image>
							<image v-else class="icon" src="../../static/avatar.jpg" mode=""></image>
						</view>
						<view class="body">
							<view class="title">
								<text>{{ item.user_name }}</text>
								<text class="time">{{ item.time }}</text>
							</view>
							<view class="desc">{{ item.content }}</view>
						</view>
					</view>
				</block>
				<view class="loading" v-if="tab.more">
					<text>加载中</text>
					<van-loading type="spinner" color="#999" />
				</view>
			</van-tab>
		</van-tabs>
		<navigator v-if="!token" class="login" url="/pages/login/login">请先登录</navigator>
	</view>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
export default {
	data() {
		return {
			user: uni.getStorageSync('userInfo'),
			token: null,
			type: 0,
			tabs: [
				{
					name: '通知',
					url: 'Message/getDataList',
					list: [],
					pageNum: 1,
					pageSize: 20,
					loading: true,
					more: false
				},
				{
					name: '消息',
					url: 'user_chat/getDataList',
					list: [],
					pageNum: 1,
					pageSize: 20,
					loading: true,
					more: false
				}
			]
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
	computed: { ...mapState(['uList', 'msgNum']) },
	onLoad(opt) {
		const token = uni.getStorageSync('TOKEN');
		if (token) this.getList();
		if (opt.user) {
			console.log(opt.user);
		}
	},
	onShow() {
		this.user= uni.getStorageSync('userInfo')
		this.token = uni.getStorageSync('TOKEN');
	},
	onReachBottom() {
		this.getList();
	},
	onPullDownRefresh() {
		this.tabs = [
			{
				name: '通知',
				url: 'Message/getDataList',
				list: [],
				pageNum: 1,
				pageSize: 20,
				loading: true,
				more: false
			},
			{
				name: '消息',
				url: 'user_chat/getDataList',
				list: [],
				pageNum: 1,
				pageSize: 20,
				loading: true,
				more: false
			}
		];
		this.getList();
	},
	methods: {
		...mapMutations(['updateUlist', 'setMsgNum']),
		...mapActions(['navFilter']),
		jump(item) {
			if (!item.id) {
				item.id = item.user_id;
			}
			// console.log(item.count)
			// this.setMsgNum(this.msgNum -item.count);
			// item.count=0;
			// this.updateUlist(this.uList);
			uni.navigateTo({
				url: 'chat/chat?user=' + JSON.stringify(item)
			});
		},
		doClick(item) {
			if (item.type === 0) {
				uni.navigateTo({
					url: 'detail/detail?id=' + item.id
				});
				item.is_read = 1;
			}
		},
		del(id, k) {
			this.$Fetch({
				url: 'Message/del_message',
				data: { id: id },
				success: res => {
					let tabs = this.tabs;
					tabs[this.type].list.splice(k, 1);
					this.tabs = tabs;
				}
			});
		},
		onChange(e) {
			this.type = e.detail.index;
			const token = uni.getStorageSync('TOKEN');
			if (token) {
				if (this.tabs[e.detail.index].list.length === 0) {
					this.tabs[e.detail.index].loading = true;
					this.getList();
				}
			}
		},
		getList() {
			let tabs = this.tabs;
			let type = this.type;
			if (tabs[type].loading) {
				tabs[type].loading = false;
				this.tabs = tabs;
				this.$Fetch({
					url: tabs[type].url,
					data: {
						pageNum: tabs[type].pageNum,
						pageSize: tabs[type].pageSize
					},
					success: res => {
						let len = res.length;
						if (len > 0) {
							tabs[type].list = tabs[type].list.concat(res);
							if (len === tabs[type].pageSize) {
								tabs[type].pageNum++;
								tabs[type].loading = true;
								tabs[type].more = true;
							} else {
								tabs[type].more = false;
							}
						} else {
							tabs[type].more = false;
						}
						this.tabs = tabs;
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	.login {
		text-align: center;
		margin-top: 60rpx;
		color: #007aff;
	}
	.msg {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #f7f7f7;
		padding: 30rpx;
		.icon {
			position: relative;
			width: 100rpx;
			height: 100rpx;
			margin-right: 20rpx;
			border-radius: 10rpx;
			.dot {
				position: absolute;
				z-index: 10;
				right: 10rpx;
				width: 20rpx;
				height: 20rpx;
				background-color: red;
				border-radius: 10rpx;
			}
		}
		.body {
			width: 560rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 32rpx;
				.text {
					flex: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.time {
					width: 260rpx;
					font-size: 24rpx;
					color: #999;
				}
			}
			.desc {
				width: 100%;
				font-size: 26rpx;
				color: #999;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
	.del {
		width: 80px;
		height: 100%;
		background-color: red;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}
}
</style>
