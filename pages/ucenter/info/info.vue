<template>
	<view class="page">
		<form @submit="submitInfo" @reset="formReset">
			<input style="display:none" name="id" v-model="info.id" />
			<van-cell-group>
				<input style="display:none" name="head_img" v-model="head_img" />
				<van-cell size="large" @tap="chooseImage" :center="true" title="头像" is-link><image class="avatar" :src="avatar" /></van-cell>
				<van-field name="user_name" :value="info.user_name" size="large" clearable label="昵称" placeholder="请填写昵称" />
				<van-field name="sign" :value="info.sign" size="large" label="签名" placeholder="不超过20字" />
				<van-field @tap="show = true" :value="info.city" name="city"  placeholder="请选择城市" label="地区" size="large" readonly is-link />
				<van-field name="address" :center="true" :value="info.address" label="详细地址" type="textarea" placeholder="请输入详细地址" autosize/>
			</van-cell-group>
			<button formType="submit" class="btn">提交资料</button>
		</form>
		<van-popup position="bottom" :show="show" v-on:close="onClose">
			<van-area :area-list="list" columns-num="2" title="请选择城市" v-on:cancel="onClose" v-on:confirm="onConfirm" />
		</van-popup>
	</view>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import areaList from '@/common/area.js';
export default {
	data() {
		return {
			list: {},
			city: '',
			show: false,
			avatar: '',
			head_img: '',
			info: null
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
	computed: {
		...mapState(['userInfo'])
	},
	onLoad() {
		this.list = areaList;
		this.getInfo();
	},
	methods: {
		...mapMutations(['setInfo']),
		onClose() {
			this.show = false;
		},
		onConfirm(e) {
			this.info.city = e.detail.values[1].name;
			this.show = false;
		},
		getInfo() {
			this.$Fetch({
				url: 'user/getDataById',
				success: res => {
					this.info = res;
					this.avatar = res.head_img;

					this.setInfo(this.info);
				}
			});
		},
		//提交用户信息
		submitInfo: function(e) {
			this.$Fetch({
				url: 'user/edit',
				data: e.detail.value,
				success: res => {
					uni.showToast({
						title: '提交成功',
						icon: 'success'
					});
					this.getInfo();
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1500);
				}
			});
		},
		//选择头像
		chooseImage() {
			var that = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['album', 'camera'],
				success(res) {
					// tempFilePath可以作为img标签的src属性显示图片
					const tempFilePath = res.tempFilePaths[0];

					that.avatar = tempFilePath;
					uni.showLoading({
						title: '上传中...'
					});
					that.$UploadFile({
						url: 'Upload/images',
						filePath: tempFilePath,
						name: 'file',
						success: ret => {
							uni.showToast({
								title: '上传成功',
								icon: 'success'
							});
							that.head_img = ret;
						}
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	padding: 15rpx 0;

	.btn {
		width: 710rpx;
		margin: 100rpx auto 50rpx;
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 100rpx;
		background-color: #eee;
	}
}
</style>
