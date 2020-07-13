<template>
	<view class="page"><activity-list :list="list" :more="more" type="0"/></view>
</template>

<script>
import activityList from '@/components/activityList.vue';
export default {
	data() {
		return {
			more: false,
			pageNum: 1,
			pageSize: 20,
			loading: true,
			list: []
		};
	},
	components: { activityList },
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
		this.getList();
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
					url: 'activity/getData',
					data: {
						pageNum: this.pageNum,
						pageSize: this.pageSize
					},
					success: res => {
						console.log(res);
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

<style lang="scss" scoped></style>
