<template>
	<view class="page">
		<van-cell v-for="(item, i) in list" :key="i" size="large" :center="true" is-link :title="item.qua_name" @tap="navFilter" :data-url="'detail/detail?content='+item.desc" />
		<image v-if="list.length === 0 && !more" class="empty" src="/static/empty.png" mode="widthFix"></image>
		<view class="loading" v-if="more">
			<text>加载中</text>
			<van-loading type="spinner" color="#999" />
		</view>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
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
	methods: {
		...mapActions(['navFilter']),
		getList() {
			if (this.loading) {
				this.loading = false;
				this.$Fetch({
					url: 'Qualifications/getData',
					data: { pageNum: this.pageNum, pageSize: this.pageSize },
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

<style lang="scss">
.page {
}
</style>
