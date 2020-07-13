<template>
	<view class="page">
		<van-tabs color="#007BFF" :border="false" animated sticky v-on:change="onChange">
			<van-tab v-for="(tab, i) in tabs" :key="i" :title="tab.name">
				<block v-if="type === 0"><article-list :list="tab.list" :more="tab.more" /></block>
				<block v-if="type === 1"><activity-list :list="tab.list" :more="tab.more" /></block>
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
			type: 0,
			tabs: []
		};
	},
	components: { articleList, activityList },
	onReachBottom() {
		this.getList();
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
	onShow() {
		this.tabs = [
			{
				name: '资讯',
				url: 'Collect/getNewsData',
				list: [],
				pageNum: 1,
				pageSize: 20,
				loading: true,
				more: false
			},
			{
				name: '活动',
				url: 'Collect/getActivityData',
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
		onChange(e) {
			this.type = e.detail.index;
			if (this.tabs[e.detail.index].list.length === 0) this.getList();
		},
		getList() {
			let tabs = this.tabs;
			console.log(tabs);
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

<style lang="scss"></style>
