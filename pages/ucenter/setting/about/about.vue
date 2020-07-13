<template>
	<view class="page"><uParse v-if="info" :content="info" /></view>
</template>

<script>
import uParse from '@/components/u-parse/u-parse.vue'
export default {
	data() {
		return {
			info: null
		};
	},
	components: {
		uParse
	},
	onLoad() {
		this.$Fetch({
			url: 'about_us/getData',
			success: res => {
				this.info = res;
			}
		});
	}
};
</script>

<style lang="scss" scoped>
.page {
	padding: 30rpx;
}
</style>
