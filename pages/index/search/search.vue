<template>
	<view class="page">
		<van-search :value="SearchString" placeholder="搜索资讯关键词" use-action-slot @change="onChange" v-on:search="onSearch" v-on:clear="onClear">
			<view slot="action" @tap="onSearch">搜索</view>
		</van-search>

		<view class="list" v-if="show"><article-list :list="list" :more="more" /></view>

		<view class="box" v-else>
			<view class="tags">
				<view class="title">
					<text>搜索历史</text>
					<image @tap="del" src="../../../static/del.png"></image>
				</view>
				<view>
					<van-tag @tap="clickTag(item)" v-for="(item, i) in SearchHistory" :key="i" color="#F5F5F5" text-color="#414141" custom-class="tag" size="large">
						{{ item }}
					</van-tag>
				</view>
			</view>
			<!-- <view class="tags van-hairline--top">
				<view class="title"><text>热门搜索</text></view>
				<view>
					<van-tag @tap="clickTag(item)" v-for="(item, i) in HostSearch" :key="i" color="#F5F5F5" text-color="#414141" custom-class="tag" size="large">
						{{ item }}
					</van-tag>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
import articleList from '@/components/articleList.vue';
import { mapActions,mapState } from 'vuex';

export default {
	data() {
		return {
			SearchString: '',
			show: false,
			HostSearch: [],
			SearchHistory: [],
			PageIndex: 0,
			PageSize: 20,
			BeginTime: '',
			EndTime: '',
			loading: true,
			more: false,
			list: []
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
	computed:{...mapState(["city"])},
	components: { articleList },
	onLoad() {
		// this.$Fetch({
		// 	url: 'm_CreateCourse/getSearchHistoryAndHotSearch',
		// 	success: res => {
		// 		console.log(res);
		// 		this.HostSearch = res.HostSearch;
		// 	}
		// });
	},
	onShow() {
		let SearchHistory = uni.getStorageSync('SearchHistory') || [];
		this.SearchHistory = SearchHistory;
	},
	methods: {
		...mapActions(['navFilter']),

		onChange(e) {
			this.SearchString = e.detail;
		},
		onClear() {
			this.show = false;
		},
		onSearch(e) {
			console.log(this.SearchString);
			let kwd = this.SearchString.trim();
			
			let SearchHistory = uni.getStorageSync('SearchHistory') || [];
			console.log(SearchHistory);
			if (SearchHistory.indexOf(kwd) <0) {
				if (SearchHistory.lenght > 12) {
					SearchHistory.pop();
					SearchHistory.unshift(kwd);
				} else {
					SearchHistory.unshift(kwd);
				}
			}
			uni.setStorageSync('SearchHistory', SearchHistory);

			this.show = true;
			this.SearchHistory = SearchHistory;
			this.loading = true;
			this.list = [];
			this.PageIndex = 0;
			this.getResultList();
		},
		del() {
			uni.setStorageSync('SearchHistory', []);
			this.SearchHistory=[]
		},
		//点击标签搜索
		clickTag(kwd) {
			let SearchHistory = uni.getStorageSync('SearchHistory') || [];
			if (SearchHistory.lenght > 12) {
				SearchHistory.pop();
				SearchHistory.unshift(kwd);
			} else {
				SearchHistory.unshift(kwd);
			}
			uni.setStorageSync('SearchHistory', SearchHistory);

			this.show = true;
			this.SearchString = kwd;
			this.SearchHistory = SearchHistory;
			this.loading = true;
			this.list = [];
			this.PageIndex = 0;

			this.getResultList();
		},
		//获取搜索结果列表分页
		getResultList() {
			if (this.loading) {
				uni.showLoading({
					title: '加载中...'
				});
				this.loading = false;
				this.$Fetch({
					url: 'news/getData',
					data: {
						pageNum: this.PageIndex,
						pageSize: this.PageSize,
						title: this.SearchString,
						city: this.city
					},
					success: res => {
						console.log(res);
						let arr = res.lists;
						if (arr.length > 0) {
							this.list = this.list.concat(arr);

							if (arr.length === this.PageSize) {
								this.PageIndex++;
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

<style lang="scss">
.box {
	.tags {
		padding: 30rpx 20rpx;
		margin-bottom: 40rpx;
		.title {
			display: flex;
			justify-content: space-between;
			text {
				color: #3a3a3a;
				font-size: 40rpx;
				font-weight: bold;
			}
			image {
				width: 40rpx;
				height: 40rpx;
			}
		}
		.tag {
			margin-top: 20rpx;
			margin-right: 20rpx;
		}
	}
}
</style>
