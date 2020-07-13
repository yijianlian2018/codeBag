<template>
	<view class="page">
		<view class="user">
			<image class="avatar" v-if="info.head_img" :src="info.head_img" mode=""></image>
			<image class="avatar" v-else src="../../../static/avatar.jpg" mode=""></image>
			<view class="body">
				<view class="num">
					<view>{{ info.news_count }}</view>
					<view class="label">资讯</view>
				</view>
				<view class="num">
					<view>{{ info.activity_count }}</view>
					<view class="label">活动</view>
				</view>
			</view>
			<navigator class="btn" :url="'/pages/message/chat/chat?user=' + JSON.stringify(info)">私信</navigator>
			<view class="btn" @tap="doAttention()">
				<text v-if="attention === 1">取消关注</text>
				<text v-else>关注</text>
			</view>
		</view>
		<view class="name">{{ info.user_name }}</view>
		<view class="signature">{{ info.sign }}</view>
		<van-tabs color="#007BFF" :border="false" animated sticky v-on:change="onChange">
			<van-tab v-for="(tab, i) in tabs" :key="i" :title="tab.name">
				<block v-if="type === 0"><article-list :list="tab.list" :more="tab.more" /></block>
				<block v-if="type === 1"><activity-list :list="tab.list" :more="tab.more" type="id" /></block>
			</van-tab>
		</van-tabs>
	</view>
</template>

<script>
import articleList from '@/components/articleList.vue';
import activityList from '@/components/activityList.vue';
export default {
	data() {
		return {
			id: -1,
			info: null,
			type: 0,
			attention: 0,
			tabs: [
				{
					name: '资讯',
					url: 'admin_user/getAdminUserNews',
					list: [],
					pageNum: 1,
					pageSize: 20,
					loading: true,
					more: false
				},
				{
					name: '活动',
					url: 'admin_user/getAdminActivity',
					list: [],
					pageNum: 1,
					pageSize: 20,
					loading: true,
					more: false
				}
			]
		};
	},
	components: { articleList, activityList },
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
			this.id = opt.id;
			this.attention = opt.attention - 0;
			this.$Fetch({
				url: 'admin_user/getDataById',
				data: { id: opt.id },
				success: res => {
					console.log(res)
					this.info = res;
				}
			});
			this.getList();
		}
	},
	onReachBottom() {
		this.getList();
	},
	methods: {
		onChange(e) {
			this.type = e.detail.index;
			if (this.tabs[e.detail.index].list.length === 0) this.getList();
		},
		//关注
		doAttention() {
			this.$Fetch({
				url: 'Attention/add',
				data: { id: this.id },
				success: res => {
					this.attention = res.success;
					let str = res.success === 1 ? '已关注,砖瓦+' + res.point : '已取消关注';
					uni.showToast({
						title: str,
						icon: 'none'
					});
				}
			});
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
						id: this.id,
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
	.user {
		border-top: 1px solid #f3f3f3;
		padding: 30rpx;
		margin: 30rpx 0;
		display: flex;
		align-items: center;
		.avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50rpx;
			margin-right: 30rpx;
		}
		.body {
			flex: 1;
			justify-content: space-around;
			display: flex;
			margin-right: 20rpx;
			.num {
				text-align: center;
				.label {
					margin-top: 10rpx;
					font-size: 24rpx;
					color: #666;
				}
			}
		}
		.btn {
			font-size: 24rpx;
			padding: 13rpx 40rpx;
			margin-left: 10rpx;
		}
	}
	.name {
		padding: 0 30rpx;
		font-size: 44rpx;
		font-weight: bold;
		color: #000;
	}
	.signature {
		padding: 10rpx 30rpx;
		font-size: 26rpx;
		color: #666;
	}
}
</style>
