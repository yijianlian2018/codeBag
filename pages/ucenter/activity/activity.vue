<template>
	<view class="page">
		<van-tabs color="#007BFF" animated sticky v-on:change="onChange">
			<van-tab v-for="(tab, i) in tabs" :key="i" :title="tab.name"><activity-list :list="tab.list" :more="tab.more" type="1" /></van-tab>
		</van-tabs>
	</view>
</template>

<script>
import activityList from '@/components/activityList.vue';
export default {
	data() {
		return {
			type: 0,
			tabs: [
				{
					name: '未开始',
					list: [],
					pageNum: 1,
					pageSize: 20,
					loading: true,
					more: false
				},
				{
					name: '已完成',
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
	components: { activityList },

	onLoad() {
		this.getList();
	},
	onReachBottom() {
		this.getList();
	},
	methods: {
		onChange(e) {
			this.type = e.detail.index;
			if (this.tabs[e.detail.index].list.length === 0) {
				this.tabs[e.detail.index].loading = true;
				this.getList();
			}
		},
		getList() {
			let tabs = this.tabs;
			let type = this.type;
			if (tabs[type].loading) {
				tabs[type].loading = false;
				this.tabs = tabs;
				this.$Fetch({
					url: 'activity_list/getData',
					data: {
						type: this.type,
						pageNum: tabs[type].pageNum,
						pageSize: tabs[type].pageSize
					},
					success: res => {
						console.log(res);
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
