<template>
	<view class="page">
		<van-tabs v-if="tabs" color="#007BFF" :border="false" animated sticky v-on:change="onChange">
			<van-tab v-for="(tab, i) in tabs" :key="i" :title="tab.name"><article-list :list="tab.list" :more="tab.more" /></van-tab>
		</van-tabs>
	</view>
</template>

<script>
import { mapState } from 'vuex';
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
			index: 0,
			tabs: null
		};
	},
	computed: { ...mapState(['city']) },
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
		console.log('路由参数：', opt);
		if (opt.type) {
			this.type = opt.type;
			uni.setNavigationBarTitle({
				title: opt.title
			});
			this.getTabs();
		}
	},
	onReachBottom() {
		this.getList();
	},
	methods: {
		onChange(e) {
			this.index = e.detail.index;
			if (this.tabs[e.detail.index].list.length === 0) this.getList();
		},
		getTabs() {
			this.$Fetch({
				url: 'child_type/getData',
				data: { parent_id: this.type },
				success: res => {
					console.log(res);
					let tabs=res.lists;
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
					url: 'news/getData',
					data: {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						type: this.type,
						city: this.city,
						type_child:tabs[type].id
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
		}
	}
};
</script>

<style lang="scss"></style>
