<template>
	<view class="page">
		<uParse v-if="content" :content="content" />
		<image v-else class="empty" src="/static/empty.png" mode="widthFix"></image>
	</view>
</template>

<script>
import uParse from '@/components/u-parse/u-parse.vue';
export default {
	data() {
		return {
			content: ''
		};
	},
	components: {
		uParse
	},
	onLoad(opt) {
		if (opt.content) {
			console.log(opt.content);
			this.content = opt.content;
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	padding: 30rpx;
}
</style>
