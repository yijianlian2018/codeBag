<template>
	<view class="page">
		<view class="login">
			<view class="title">忘记密码</view>
			<form @submit="onSubmit">
				<van-field name="mobile" :value="mobile" v-on:input="onInput" size="large" label="+86" title-width="80rpx" placeholder="请输入手机号" clearable />
				<!-- <van-field name="img" size="large" placeholder="请输入图形码" clearable use-button-slot>
					<image class="imgCode" slot="button" src="../../static/code.jpg"></image>
				</van-field> -->
				<van-field name="code" size="large" clearable placeholder="请输入验证码" use-button-slot>
					<view @tap="getCode" class="getCode" slot="button">{{ btn }}</view>
				</van-field>
				<van-field name="pwd" size="large" placeholder="请输入新密码" clearable type="password" />

				<button class="btn" formType="submit">确认修改</button>
			</form>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			mobile: '',
			timer: null,
			time: 60,
			btn: '获取验证码',
			canClick: true
		};
	},
	onShareAppMessage() {
		let token = uni.getStorageSync('TOKEN');
		let user = uni.getStorageSync('userInfo');
		if (token) {
			return {
				title: '易建联共享服务平台',
				path: '/pages/index/index?server=' + user.server_people_idple_id
			};
		}
	},
	onUnload() {
		clearInterval(this.timer);
	},
	methods: {
		onInput(e){
			this.mobile=e.detail
		},
		onSubmit(e) {
			console.log('提交数据：', e.detail.value);
			let data=e.detail.value;
			console.log('提交数据：', e.detail.value);
			for(let key in data){
				if(!data[key]){
					uni.showToast({
						title:"用户名或密码不能为空！",
						icon:"none"
					})
					return false
				}
			}
			this.$Fetch({
				url:"login/forget_pwd",
				data:e.detail.value,
				success:res=>{
					uni.showToast({
						title:"修改成功",
						icon:"success"
					})
					setTimeout(()=>{uni.navigateBack()},1000)
					
				}
			})
		},
		getCode() {
			if (!this.canClick) return false;
			this.canClick = false;
			if (this.time === 60) {
				console.log(this.mobile)
				this.$Fetch({
					url: 'login/code',
					data:{mobile:this.mobile},
					success: res => {
						uni.showToast({
							title: '发送成功',
							icon: 'success'
						});
						this.canClick = true;
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
		}
	}
};
</script>

<style lang="less"></style>
