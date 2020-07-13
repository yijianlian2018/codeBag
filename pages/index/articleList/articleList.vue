<template>
	<view class="page"><article-list :list="list" :more="more" /></view>
</template>

<script>
	import {mapState } from 'vuex';
import articleList from '@/components/articleList.vue';
export default {
	data() {
		return {
			type: -1,
			more: false,
			pageNum: 1,
			pageSize: 20,
			loading: true,
			list: [],
		};
	},
	computed:{...mapState(["city"])},
	components: { articleList },
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
		if (opt.type) {
			this.type = opt.type;
			uni.setNavigationBarTitle({
				title: opt.title
			});
			this.getList();
		}
	},
	onReachBottom() {
		this.getList();
	},
	onPullDownRefresh() {
		this.more=false;
		this.pageNum= 1;
		this.pageSize= 20;
		this.loading= true;
		this.list=[];
		this.getList();
	},
	methods: {
		getList() {
			if (this.loading) {
				this.loading = false;
				this.$Fetch({
					url: 'news/getData',
					data: {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						type: this.type,
						city: this.city
					},
					success: res => {
						let arr=res.lists;
						if (arr.length > 0) {
							this.list = this.list.concat(arr);
							if (arr.length === this.pageSize) {
								this.pageNum++;
								this.loading = true;
								this.more = true;
							} else {
								this.more = false;
							}
						}else{
							this.more = false;
						}
					}
				});
			}
		}
	}
};
</script>

<style lang="scss"></style>
