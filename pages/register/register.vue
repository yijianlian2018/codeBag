<template>
	<view class="page">
		<view class="login">
			<view class="title">新用户注册</view>
			<form @submit="onSubmit">
				<van-field name="mobile" :value="mobile" v-on:input="onInput" size="large" label="+86" title-width="80rpx" placeholder="请输入手机号" clearable />
				<!-- <van-field name="img" size="large" placeholder="请输入图形码" clearable use-button-slot>
					<image class="imgCode" slot="button" src="../../static/code.jpg"></image>
				</van-field> -->
				<van-field name="city" :value="city" placeholder="请选择城市" size="large" @tap="show=true" readonly is-link/>
				<van-field name="code" size="large" clearable placeholder="请输入验证码" use-button-slot>
					<view @tap="getCode" class="getCode" slot="button">{{ btn }}</view>
				</van-field>
				<van-field name="server_people_id" :value="shareMsg.server" size="large" placeholder="请输入邀请码(选填)" clearable />
				<van-field name="pwd" size="large" placeholder="请输入密码" clearable type="password" />
				<button class="btn" formType="submit">注册</button>
			</form>
			<view class="check">
				<van-radio-group :value="isChecked" @change="onChange">
					<van-radio checked-color="#007BFF" name="1">
						<text style="color:#999;font-size: 24rpx;">注册表示您已阅读并同意</text>
						<text style="text-decoration: underline;color:#999;font-size: 24rpx;">《用户协议》</text>
					</van-radio>
				</van-radio-group>
			</view>
		</view>
		<van-popup position="bottom" :show="show" v-on:close="onClose"><van-area :area-list="list" columns-num="2" title="请选择城市" v-on:cancel="onClose" v-on:confirm="onConfirm"/></van-popup>
	</view>
</template>

<script>
import { mapMutations,mapState } from 'vuex';
import areaList from '@/common/area.js';
export default {
	data() {
		return {
			list:{},
			city:'',
			show:false,
			mobile: '',
			isChecked: '1',
			btn: '获取验证码',
			time: 60,
			timer: null,
			canClick: true,
			loading:true,
			id:''
		};
	},
	computed:{...mapState(['shareMsg'])},
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
		
	},
	onUnload() {
		clearInterval(this.timer);
		this.timer = null;
	},
	onShow() {
		this.list=areaList
	},
	methods: {
		...mapMutations(['setLogin']),
		onClose(){
			this.show=false;
		},
		onConfirm(e){
			console.log(e.detail.values[1].name);
			this.city=e.detail.values[1].name;
			this.show=false;
		},
		onInput(e) {
			this.mobile = e.detail;
		},
		getCode() {
			if (!this.canClick) return false;
			this.canClick = false;
			console.log('获取验证码');
			if (this.time === 60) {
				this.$Fetch({
					url: 'login/code',
					data: { mobile: this.mobile },
					success: res => {
						this.canClick = true;
						uni.showToast({
							title: '发送成功',
							icon: 'success'
						});
						this.timer = setInterval(() => {
							this.time--;
							this.btn = this.time + 's后重新获取';
							if (this.time < 0) {
								clearInterval(this.timer);
								this.timer = null;
								this.time = 60;
								this.btn = '获取验证码';
							}
						}, 1000);
					},
					complete:()=>{
						this.canClick = true;
					}
				});
			}
		},
		onChange() {
			this.isChecked = this.isChecked == 1 ? '0' : '1';
		},
		onSubmit(e) {
			let that = this;
			console.log('提交数据：', e.detail.value);
			let data = e.detail.value;
			if (!data.server_people_id) {
				data.server_people_id = 0;
			}
			console.log('提交数据：', e.detail.value);
			for(let key in data){
				if(key!="server_people_id"&&!data[key]){
					uni.showToast({
						title:"请填写完整信息！",
						icon:"none"
					})
					return false
				}
			}
			if (this.isChecked === '1') {
				this.$Fetch({
					url: 'login/register',
					data: data,
					success: res => {
						uni.setStorage({
							key: 'TOKEN',
							data: res,
							success: function() {
								that.setLogin();
								uni.showToast({
									title: '注册成功',
									icon: 'success'
								});
								if (that.shareMsg.path) {
									setTimeout(() => {
										uni.reLaunch({
											url: that.shareMsg.path
										});
									}, 1500);
								} else {
									setTimeout(() => {
										uni.reLaunch({
											url: '/pages/index/index'
										});
									}, 1500);
								}
							}
						});
					}
				});
			} else {
				uni.showToast({
					title: '未同意用于协议，不可注册！',
					icon: 'none'
				});
			}
		}
	}
};
</script>

<style lang="scss">
.check {
	text-align: center;
	width: 750rpx;
	margin: auto;
	padding: 40rpx 0;
}
</style>
