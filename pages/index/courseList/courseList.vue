<template>
	<view class="page">
		<van-tabs v-if="tabs" color="#007BFF" :border="false" animated sticky v-on:change="onChange">
			<van-tab v-for="(tab, i) in tabs" :key="i" :title="tab.name">
				<navigator :url="'../course/course?id=' + item.id" class="course" v-for="(item, i) in tab.list" :key="i">
					<image class="bg" v-if="item.banner" :src="item.banner"></image>
					<image class="bg" v-else src="../../../static/banner.png"></image>
					<view class="info">
						<view>
							<view class="title">{{ item.title }}</view>
							<view class="num">共{{ item.item }}节</view>
							<view class="desc">{{ item.brief }}</view>
						</view>
					</view>
				</navigator>
				<image v-if="tab.list.length === 0 && !tab.more" class="empty" src="/static/empty.png" mode="widthFix"></image>
				<view class="loading" v-if="tab.more">
					<text>加载中</text>
					<van-loading type="spinner" color="#999" />
				</view>
			</van-tab>
		</van-tabs>
	</view>
</template>

<script>
export default {
	data() {
		return {
			more: false,
			pageNum: 1,
			pageSize: 20,
			loading: true,
			list: [],
			tabs:null,
			index:0
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
	onLoad() {
		// this.getList1();
		this.getTabs()
	},
	onReachBottom() {
		// this.getList1();
		this.getList();
	},
	onPullDownRefresh() {
		this.more=false;
		this.pageNum= 1;
		this.pageSize= 20;
		this.loading= true;
		this.list=[];
		this.tabs=null;
		this.index=0;
		this.getTabs();
	},
	methods: {
		onChange(e) {
			this.index = e.detail.index;
			if (this.tabs[e.detail.index].list.length === 0) this.getList();
		},
		getTabs() {
			this.$Fetch({
				url: 'child_type/getData',
				success: res => {
					let tabs=res;
					for (let item of tabs) {
						item.more = false;
						item.pageNum = 1;
						item.pageSize = 20;
						item.loading = true;
						item.list = [];
					}
					this.tabs=tabs;
					this.getList()
				}
			});
		},
		getList() {
			let tabs = this.tabs;
			let type = this.index;
			if (tabs[type].loading) {
				tabs[type].loading = false;
				this.tabs = tabs;
				this.$Fetch({
					url: 'training/getData',
					data: {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						type:tabs[type].id
					},
					success: res => {
						let len = res.lists.length;
						if (len > 0) {
							tabs[type].list = tabs[type].list.concat(res.lists);
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
		},
		getList1() {
			if (this.loading) {
				this.loading = false;
				this.$Fetch({
					url: 'training/getData',
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
	padding-bottom: 30rpx;
	.course {
		position: relative;
		overflow: hidden;
		width: 690rpx;
		margin-left: 30rpx;
		margin-top: 30rpx;
		border-radius: 15rpx;
		.bg {
			border-radius: 15rpx;
			width: 690rpx;
			height: 240rpx;
		}
		.info {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			top: 0;
			left: 0;
			width: 690rpx;
			height: 240rpx;
			padding: 0 60rpx;
			border-radius: 15rpx;
			box-sizing: border-box;
			text-align: center;
			background-color: rgba(0, 0, 0, 0.6);
			color: #fff;
			.title {
				font-size: 32rpx;
				font-weight: bold;
			}
			.num {
				font-size: 26rpx;
			}
			.desc {
				font-size: 26rpx;
			}
		}
	}
}
</style>
