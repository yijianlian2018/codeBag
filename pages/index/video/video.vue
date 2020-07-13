<template>
	<view>
		<video
			v-if="src"
			id="myVideo"
			poster="http://yjl.tao.li4.cn/img/20190921/689209dd76925de70a50e589ffdadbc8.png"
			:src="src"
			:direction="-90"
			@error="videoErrorCallback"
			@fullscreenchange="fullscreenchange"
			controls
		>
		</video>
	</view>
</template>

<script>
export default {
	data() {
		return {
			videoContext: null,
			src: null
		};
	},
	onLoad(opt) {
		if (opt.src) {
			this.src = opt.src;
		}
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
	onReady() {
		this.videoContext = uni.createVideoContext('myVideo');
		this.videoContext.requestFullScreen();
	},
	methods: {
		videoErrorCallback() {},
		fullscreenchange(event) {
			let { fullScreen, direction } = event.detail;
			if (!fullScreen) {
				uni.navigateBack({});
			}
		}
	}
};
</script>

<style lang="scss" scoped>

</style>
