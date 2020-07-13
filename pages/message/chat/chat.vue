<template>
	<view>
		<view class="content">
			<scroll-view
				class="msg-list"
				scroll-y="true"
				:scroll-with-animation="scrollAnimation"
				:scroll-top="scrollTop"
				:scroll-into-view="scrollToView"
				@scrolltoupper="loadHistory"
				upper-threshold="50"
			>
				<!-- 加载历史数据waitingUI -->
				<view class="loading" v-if="isHistoryLoading">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<view class="row" v-for="(row, index) in msgList" :key="index" :id="'msg' + index">
					<!-- 自己发出的消息 -->
					<view class="my" v-if="row.user_id == userInfo.id">
						<!-- 左-消息 -->
						<view class="left">
							<!-- 文字消息 -->
							<view class="bubble"><rich-text :nodes="row.content" /></view>
						</view>
						<!-- 右-头像 -->
						<view v-if="userInfo.id==8888888" class="left"><image src="/static/kefu.png"></image></view>
						<view v-else class="right"><image :src="userInfo.head_img"></image></view>
					</view>
					<!-- 别人发出的消息 -->
					<view class="other" v-else>
						<!-- 左-头像 -->
						<view v-if="user.id==8888888" class="left"><image src="/static/kefu.png"></image></view>
						<view v-else class="left"><image :src="user.head_img"></image></view>
						<!-- 右-用户名称-时间-消息 -->
						<view class="right">
							<view class="username">
								<view class="name">{{ user.user_name }}</view>
								<view class="time">{{ row.updata_time }}</view>
							</view>
							<!-- 文字消息 -->
							<view class="bubble"><rich-text :nodes="row.content" /></view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 底部输入栏 -->
		<view class="input-box">
			<view class="textbox">
				<view class="text-mode">
					<view class="box"><textarea auto-height="true" v-model="textMsg" /></view>
				</view>
			</view>
			<view class="send" @tap="sendText"><view class="btn">发送</view></view>
		</view>
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			user: null,
			//文字消息
			textMsg: '',
			//消息列表
			isHistoryLoading: false,
			scrollAnimation: false,
			scrollTop: 0,
			scrollToView: '',
			pageNum: 1,
			pageSize: 20,
			more: true,
			msgList: [],
			myuid: 0,
			msg: null
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
		...mapState(['userInfo', 'uList', 'msgNum'])
	},
	onLoad(opt) {
		if (opt.user) {
			let user = JSON.parse(opt.user);
			let uList = this.uList;
			if (user.user_id) {
				user.id = user.user_id;
			}

			console.log(user.count);
			if (user.count) {
				this.setMsgNum(this.msgNum - user.count);
			}
			for (let item of uList) {
				if (item.id === user.id) {
					item.count = 0;
				}
			}
			this.updateUlist(uList);
			this.user = user;
			uni.setNavigationBarTitle({
				title: user.user_name
			});
			this.getMsgList();
			this.$Fetch({
				url: 'user_chat/NoReadNum',
				success: res => {
					console.log('未读消息', res);
					this.setMsgNum(res);
				}
			});
		}
		//接受消息
		uni.$on('onMessage', msg => {
			if (msg.type === 'text') {
				this.msgList.push(msg);
				console.log(this.msgList.length - 1);
				this.$nextTick(function() {
					// 滚动到底
					this.scrollToView = 'msg' + (this.msgList.length - 1);
				});
			} else if (msg.type === 'outline') {
				uni.showModal({
					content: '对方离线，只能发送一条离线消息',
					showCancel: false
				});
				this.screenMsg(this.msg);
				this.textMsg = '';
				this.msg = null;
			} else if (msg.type === 'success') {
				this.screenMsg(this.msg);
				this.textMsg = '';
				this.msg = null;
			}
		});
	},
	onUnload() {
		uni.$off('onMessage');
	},
	methods: {
		...mapMutations(['addUlist', 'setMsgNum', 'updateUlist']),
		// 接受消息(筛选处理)
		screenMsg(msg) {
			//从长连接处转发给这个方法，进行筛选处理
			uni.hideKeyboard();
			this.msgList.push(msg);
			this.$nextTick(function() {
				// 滚动到底
				this.scrollToView = 'msg' + (this.msgList.length - 1);
			});
		},
		hideDrawer() {
			// uni.hideKeyboard();
		},
		//触发滑动到顶部(加载历史信息记录)
		loadHistory() {
			if (!this.more) {
				return;
			}
			this.more = false;
			this.isHistoryLoading = true; //参数作为进入请求标识，防止重复请求
			this.scrollAnimation = false; //关闭滑动动画
			this.$Fetch({
				url: 'user_chat/getData',
				data: {
					to_user_id: this.user.id,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				},
				success: res => {
					setTimeout(() => {
						if (res.length > 0) {
							this.msgList = res.reverse().concat(this.msgList);
							if (res.length === this.pageSize) {
								this.more = true;
								//这段代码很重要，不然每次加载历史数据都会跳到顶部
								this.$nextTick(function() {
									console.log(this.msgList.length - 1);
									this.scrollToView = 'msg' + res.length; //跳转上次的第一行信息位置
									this.$nextTick(function() {
										this.scrollAnimation = true; //恢复滚动动画
									});
								});
								this.isHistoryLoading = false;
								this.pageNum++;
							} else {
								this.isHistoryLoading = false;
							}
						}
					}, 1500);
				}
			});
		},
		// 加载初始页面消息
		getMsgList() {
			this.more = false;
			this.scrollAnimation = false; //关闭滑动动画
			this.$Fetch({
				url: 'user_chat/getData',
				data: {
					to_user_id: this.user.id,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				},
				success: res => {
					if (res.length > 0) {
						this.msgList = res.reverse().concat(this.msgList);
						if (res.length === this.pageSize) {
							this.more = true;
							this.pageNum++;
						}
						//这段代码很重要，不然每次加载历史数据都会跳到顶部
						this.$nextTick(function() {
							this.scrollToView = 'msg' + (this.msgList.length - 1); //跳转上次的第一行信息位置
							this.$nextTick(function() {
								this.scrollAnimation = true; //恢复滚动动画
							});
						});
					}
				}
			});
		},

		// 发送消息
		sendText() {
			console.log(this.userInfo);
			//实际应用中，此处应该提交长连接，模板仅做本地处理。
			var nowDate = new Date();
			let that = this;
			let msg = {
				content: this.textMsg,
				to_user_id: this.user.id,
				to_user_name:this.user.user_name,
				to_user_img:this.user.head_img,
				user_id: this.userInfo.id,
				user_name:this.userInfo.user_name,
				user_img:this.userInfo.head_img,
				type: 'say'
			};
			if (!this.textMsg.trim()) {
				// uni.hideKeyboard();
				uni.showModal({
					content: '不能发送空白消息',
					showCancel: false
				});
			} else {
				let that = this;
				this.msg = msg;
				uni.sendSocketMessage({
					data: JSON.stringify(msg),
					success: function() {
						that.$Fetch({
							url: 'user_chat/getDataList',
							success: res => {
								that.updateUlist(res);
							}
						});
					}
				});
			}
		},

		discard() {
			return;
		}
	}
};
</script>
<style>
page {
	background-color: #f5f5f5;
}
</style>
<style lang="scss" scoped>
.hidden {
	display: none !important;
}
.input-box {
	width: 98%;
	min-height: 100upx;
	padding: 0 1%;
	background-color: #fff;
	display: flex;
	position: fixed;
	z-index: 20;
	bottom: 0;

	.send {
		flex-shrink: 0;
		width: 100upx;
		height: 100upx;
		margin-left: 20rpx;
		display: flex;
		align-items: center;
		.btn {
			width: 90upx;
			height: 56upx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #1890ff;
			color: #fff;
			border-radius: 6upx;
			font-size: 24upx;
		}
	}
	.textbox {
		width: 100%;
		min-height: 70upx;
		margin-top: 15upx;
		.text-mode {
			width: 100%;
			min-height: 70upx;
			display: flex;
			background-color: #f2f2f2;
			border-radius: 40upx;
			.box {
				width: 100%;
				min-height: 70upx;
				display: flex;
				align-items: center;
				textarea {
					padding: 0 40upx;
					width: 100%;
					font-size: 26rpx;
				}
			}
		}
	}
}
.content {
	width: 100%;
	.msg-list {
		width: 96%;
		padding: 0 2%;
		position: absolute;
		top: 0;
		bottom: 100upx;
		.loading {
			//loading动画
			display: flex;
			justify-content: center;
			@keyframes stretchdelay {
				0%,
				40%,
				100% {
					transform: scaleY(0.6);
				}
				20% {
					transform: scaleY(1);
				}
			}
			.spinner {
				margin: 20upx 0;
				width: 60upx;
				height: 100upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				view {
					background-color: #1890ff;
					height: 50upx;
					width: 6upx;
					border-radius: 6upx;
					animation: stretchdelay 1.2s infinite ease-in-out;
				}
				.rect2 {
					animation-delay: -1.1s;
				}
				.rect3 {
					animation-delay: -1s;
				}
				.rect4 {
					animation-delay: -0.9s;
				}
				.rect5 {
					animation-delay: -0.8s;
				}
			}
		}
		.row {
			&:first-child {
				margin-top: 20upx;
			}
			padding: 20upx 0;
			.my .left,
			.other .right {
				width: 100%;
				display: flex;
				.bubble {
					max-width: 70%;
					min-height: 50upx;
					border-radius: 10upx;
					padding: 15upx 20upx;
					display: flex;
					align-items: center;
					font-size: 32upx;
					word-break: break-word;
				}
			}
			.my .right,
			.other .left {
				flex-shrink: 0;
				width: 80upx;
				height: 80upx;
				image {
					width: 80upx;
					height: 80upx;
					border-radius: 10upx;
				}
			}
			.my {
				width: 100%;
				display: flex;
				justify-content: flex-end;
				.left {
					min-height: 80upx;

					align-items: center;
					justify-content: flex-end;
					.bubble {
						background-color: #1890ff;
						color: #fff;
					}
				}
				.right {
					margin-left: 15upx;
				}
			}
			.other {
				width: 100%;
				display: flex;
				.left {
					margin-right: 15upx;
				}
				.right {
					flex-wrap: wrap;
					.username {
						width: 100%;
						height: 45upx;
						font-size: 24upx;
						color: #999;
						display: flex;
						.name {
							margin-right: 50upx;
						}
					}
					.bubble {
						background-color: #fff;
						color: #333;
					}
				}
			}
		}
	}
}
</style>
