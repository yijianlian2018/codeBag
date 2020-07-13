<template>
	<view class="page" v-if="activity">
		<swiper class="banner" autoplay>
			<swiper-item v-for="(item, i) in activity.img" :key="i"><image class="image" :src="item" mode="widthFix"></image></swiper-item>
		</swiper>
		<view class="sign-box">
			<view class="title">{{ activity.title }}</view>
			<view class="row">
				<view>
					<image src="../../../static/comment.png" mode="widthFix"></image>
					<text>{{ activity.comment_num }}</text>
				</view>
				<view>
					<image src="../../../static/heart.png" mode="widthFix"></image>
					<text>{{ activity.like_num_int }}K</text>
				</view>
				<view>
					<image src="../../../static/view.png" mode="widthFix"></image>
					<text>{{ activity.click_num }}K</text>
				</view>
			</view>
			<view class="row">时间：{{ activity.start_time }}至{{ activity.end_time }}</view>
			<view class="row">地址：{{ activity.activity_where }}</view>
			<view class="row">
				<view>已报名{{ activity.people_num }}人</view>
				<view>剩余{{ activity.activity_num - activity.people_num }}个名额</view>
			</view>
			<block v-if="type === 0">
				<view v-if="is_baoming === 0" @tap="show = true" class="btn">我要报名</view>
				<navigator v-else :url="'../signDetail/signDetail?id=' + is_baoming" class="btn">已报名，点击查看</navigator>
			</block>
			<block v-if="type === 1">
				<view class="btn" v-if="is_baoming === 0">活动已开始</view>
				<navigator v-else :url="'../signDetail/signDetail?id=' + is_baoming" class="btn">已报名，点击查看</navigator>
			</block>
			<block v-if="type === 2">
				<view class="btn" v-if="is_baoming === 0">活动已结束</view>
				<navigator v-else :url="'../signDetail/signDetail?id=' + is_baoming" class="btn">已报名，点击查看</navigator>
			</block>
		</view>
		<view class="author">
			<navigator :url="'../author/author?id=' + author.id + '&attention=' + attention">
				<image class="avatar" v-if="author.head_img" :src="author.head_img" mode=""></image>
				<image class="avatar" v-else src="../../../static/avatar.jpg" mode=""></image>
			</navigator>
			<view class="body">
				<view class="name">{{ author.user_name }}</view>
				<view class="renzh">
					<image src="../../../static/vip.png" mode="widthFix"></image>
					企业认证
				</view>
			</view>
			<navigator class="btn" :url="'/pages/message/chat/chat?user=' + JSON.stringify(author)">私信</navigator>
			<view class="btn" @tap="doAttention(author.id)">
				<text v-if="attention === 1">取消关注</text>
				<text v-else>关注</text>
			</view>
		</view>

		<!-- 评论 -->
		<view class="comment">
			<view class="more">
				<view>精彩评论</view>
				<image src="../../../static/next.png" mode=""></image>
			</view>
			<view v-for="(item, i) in comment.list" :key="i" class="item">
				<view class="user" @tap="showPopup(item)">
					<image v-if="item.head_img" class="avatar" :src="item.head_img" mode=""></image>
					<image v-else class="avatar" src="../../../static/avatar.jpg" mode=""></image>
					<view class="body">
						<view class="info">
							<view>
								<view class="name">{{ item.user_name }}</view>
								<view class="time">
									{{ item.create_time }}
									<text v-if="item.children_num" class="children-num">{{ item.children_num }}回复</text>
								</view>
							</view>
						</view>
						<view class="content">
							<text>{{ item.content }}</text>
							<view v-if="item.children" class="reply">{{ item.children.user_name }}：{{ item.children.content }}</view>
						</view>
					</view>
				</view>
				<view class="zan-box" @tap="addCommentLike(item, i)">
					<image v-if="item.is_like === 1" class="icon" src="../../../static/zan_foc.png" mode=""></image>
					<image v-else class="icon" src="../../../static/zan.png" mode=""></image>
					<text>{{ item.like_num }}</text>
				</view>
			</view>
			<view class="loading" v-if="comment.more">
				<text>加载中</text>
				<van-loading type="spinner" color="#999" />
			</view>
		</view>
		<view class="footer">
			<view @tap="showInput = true" class="write">
				<image class="icon" src="../../../static/write.png" mode=""></image>
				<text>写评论</text>
			</view>
			<block v-if="showInput">
				<input class="input" placeholder="请输入内容" type="text" v-model="content" />
				<text @tap="send">发送</text>
			</block>
			<view v-else class="action">
				<view @tap="doZan(0)">
					<image v-if="is_like === 1" class="icon" src="../../../static/zan_foc.png" mode=""></image>
					<image v-else class="icon" src="../../../static/zan.png" mode=""></image>
					<text>点赞</text>
				</view>
				<!--  #ifdef  MP-WEIXIN -->
				<button class="share-btn" open-type="share">
					<image class="icon" src="../../../static/share.png" mode=""></image>
					<text>分享</text>
				</button>
				<!--  #endif -->
				<!-- #ifdef APP-PLUS -->
				<view @tap="doShare">
					<image class="icon" src="../../../static/share.png" mode=""></image>
					<text>分享</text>
				</view>
				<!-- #endif -->
				<view @tap="doCollect(0)">
					<image v-if="is_collect === 1" class="icon" src="../../../static/star_foc.png" mode=""></image>
					<image v-else class="icon" src="../../../static/star.png" mode=""></image>
					<text>收藏</text>
				</view>
			</view>
		</view>
		<!-- 报名弹窗 -->
		<uni-popup :show="show" :maskClick="false" type="bottom">
			<view class="close"><image @tap="show = false" src="../../../static/close.png" mode=""></image></view>
			<form @submit="onSubmit">
				<input name="activity_id" type="text" v-model="id" style="display: none;" />
				<van-field name="user_name" size="large" label="姓名" title-width="130rpx" placeholder="请输入姓名" clearable />
				<van-field name="mobile" size="large" label="手机" title-width="130rpx" placeholder="请输入手机号" clearable />
				<van-cell size="large" title="人数" title-width="130rpx">
					<view slot="right-icon"><van-stepper name="people_num" min="1" :max="max" :integer="true" bind:change="onChange" /></view>
				</van-cell>
				<button class="btn" formType="submit">确认报名</button>
			</form>
		</uni-popup>
		<!-- 评论弹窗 -->
		<uni-popup :show="pl" :maskClick="false" type="bottom">
			<view class="comment popup" :style="{ height: height }">
				<view class="close"><image @tap="closePopup" src="../../../static/close.png" mode=""></image></view>
				<scroll-view @scrolltolower="getReply(item)" class="popup-scroll" scroll-y="true">
					<view class="item">
						<view class="user">
							<image v-if="reply.comment.head_img" class="avatar" :src="reply.comment.head_img" mode=""></image>
							<image v-else class="avatar" src="../../../static/avatar.jpg" mode=""></image>
							<view class="body">
								<view class="info">
									<view>
										<view class="name">{{ reply.comment.user_name }}</view>
										<view class="time">{{ reply.comment.create_time }}</view>
									</view>
								</view>
								<view class="content">
									{{ reply.comment.content }}
									<text @tap="doReply(null)" class="reply-btn">回复</text>
								</view>
							</view>
						</view>
						<view class="zan-box" @tap="addCommentLike(reply.comment, i)">
							<image v-if="reply.comment.is_like === 1" class="icon" src="../../../static/zan_foc.png" mode=""></image>
							<image v-else class="icon" src="../../../static/zan.png" mode=""></image>
							<text>{{ reply.comment.like_num }}</text>
						</view>
					</view>
					<view class="line"><text>全部回复</text></view>
					<view v-for="(item, i) in reply.list" :key="i" class="item">
						<view class="user">
							<image v-if="item.head_img" class="avatar" :src="item.head_img" mode=""></image>
							<image v-else class="avatar" src="../../../static/avatar.jpg" mode=""></image>
							<view class="body">
								<view class="info">
									<view>
										<view v-if="item.to_user_name" class="name">{{ item.user_name }}回复{{ item.to_user_name }}</view>
										<view v-else class="name">{{ item.user_name }}</view>
										<view class="time">{{ item.create_time }}</view>
									</view>
								</view>
								<view class="content">
									{{ item.content }}
									<text @tap="doReply(item.user_id, item.user_name)" class="reply-btn">回复</text>
								</view>
							</view>
						</view>
						<view class="zan-box" @tap="addCommentLike(item, i)">
							<image v-if="item.is_like === 1" class="icon" src="../../../static/zan_foc.png" mode=""></image>
							<image v-else class="icon" src="../../../static/zan.png" mode=""></image>
							<text>{{ item.like_num }}</text>
						</view>
					</view>
					<view class="loading" v-if="reply.more">
						<text>加载中</text>
						<van-loading type="spinner" color="#999" />
					</view>
				</scroll-view>
			</view>
			<view class="footer fixed" v-if="showInput1">
				<input class="input" placeholder="请输入内容" type="text" v-model="content1" />
				<text @tap="send1">发送</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
	data() {
		return {
			type: 0,
			id: -1,
			activity: null,
			author: null,
			attention: 0,
			is_collect: 0,
			is_like: 0,
			is_baoming: 0,
			max: 1,
			height: 0,
			show: false,
			pl: false,
			comment: {
				pageNum: 1,
				pageSize: 10,
				list: [],
				loading: true,
				more: false
			},
			reply: {
				comment: {},
				pageNum: 1,
				pageSize: 10,
				list: [],
				loading: true,
				more: false
			},
			replyId: -1,
			to_user_name: '',
			showInput: false,
			showInput1: false,
			content: '',
			content1: ''
		};
	},
	computed: {
		...mapState(['isLogin', 'userInfo'])
	},
	components: { uniPopup },
	onShareAppMessage() {
		let token = uni.getStorageSync('TOKEN');
		let user = uni.getStorageSync('userInfo');
		this.$Fetch({
			url: 'activity/share',
			data: { activity_id: this.id },
			success: res => {
				let str = res>0 ? '已分享,砖瓦+' + res : '已分享';
				uni.showToast({
					title: str,
					icon: 'none'
				});
			}
		});
		if (token) {
			return {
				title: '易建联共享服务平台',
				path: '/pages/index/activity/activity?id='+this.id+'&server=' + user.server_people_id+'&path=/pages/index/activity/activity'
			};
		}
	},
	onLoad(opt) {
		let token = uni.getStorageSync('TOKEN');
		let that = this;
		if (!token){
			this.setShareMsg({
				server: opt.server,
				path: opt.path+'?id='+opt.id
			});
			uni.redirectTo({
				url: '/pages/login/login'
			});
			return false
		}
		uni.getSystemInfo({
			success: function(res) {
				that.height = res.windowHeight / 2 + 'px';
			}
		});
		console.log('活动ID=', opt.id);
		if (opt.id) {
			this.id = opt.id;
			this.getActivity(opt.id);
			this.getCommentList();
		}
	},
	onReachBottom() {
		this.getCommentList();
	},
	onShow() {
		if (this.id > -1) {
			this.getActivity(this.id);
		}
	},
	methods: {
		videoErrorCallback() {},
		doShare() {
			let that=this;
			uni.share({
				provider: 'weixin',
				scene: "WXSceneSession", //WXSceneSession”分享到聊天界面，“WXSenceTimeline”分享到朋友圈，“WXSceneFavorite”分享到微信收藏
				type: 5, //0-图文；5-小程序
				imageUrl:'../../static/poster.png',
				title: '欢迎使用易建联APP',
				miniProgram: {
					id:'gh_4bf03e4d36fb',
					path:'/pages/index/activity/activity?id='+this.id+'&server=' + this.userInfo.server_people_id+'&path=/pages/index/activity/activity',
					webUrl:'https://uniapp.dcloud.io',
					type:2
				},
				success: e => {
					console.log('success', e);
					that.$Fetch({
						url: 'activity/share',
						data: { activity_id: that.id },
						success: res => {
							let str = res>0 ? '已分享,砖瓦+' + res : '已分享';
							uni.showToast({
								title: str,
								icon: 'none'
							});
						}
					});
				},
				fail: e => {
					console.log('fail', e);
				},
				complete: function() {
					console.log('分享操作结束!');
				}
			});
		},
		//评论
		send() {
			if(!this.content.trim()){
				uni.showModal({
					content: '请输入内容',
					showCancel: false
				});
				return false;
			}
			this.$Fetch({
				url: 'Comment/add',
				data: {
					comment_type: 0,
					id_value: this.id,
					content: this.content
				},
				success: res => {
					console.log(res);
					// let comment=this.comment
					let date = new Date();
					let m = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
					let d = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
					let time = date.toTimeString().split(' ')[0];
					console.log(time);
					this.comment.list.unshift({
						user_id: this.userInfo.id,
						user_name: this.userInfo.user_name,
						content: this.content,
						create_time: date.getFullYear() + '-' + m + '-' + d + ' ' + time,
						like_num: 0,
						head_img: this.userInfo.head_img,
						children: null,
						children_num: 0,
						is_like: 0
					});
					this.content = '';
					uni.hideKeyboard();
					this.showInput = false;
				}
			});
		},
		doReply(id, user_name) {
			this.showInput1 = true;
			this.replyId = id;
			this.to_user_name = user_name;
		},
		send1() {
			if(!this.content1.trim()){
				uni.showModal({
					content: '请输入内容',
					showCancel: false
				});
				return false;
			}
			let parent_id = this.reply.comment.id;
			this.$Fetch({
				url: 'Comment/addComment',
				data: {
					parent_id: parent_id,
					to_user_id: this.replyId,
					content: this.content1
				},
				success: res => {
					console.log(res);
					// let comment=this.comment
					let date = new Date();
					let m = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
					let d = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
					let time = date.toTimeString().split(' ')[0];
					console.log(time);
					if (this.replyId) {
						console.log('回复评论');
						this.reply.list.unshift({
							user_id: this.userInfo.id,
							user_name: this.userInfo.user_name,
							content: this.content1,
							create_time: date.getFullYear() + '-' + m + '-' + d + ' ' + time,
							like_num: 0,
							head_img: this.userInfo.head_img,
							is_like: 0,
							to_user_name: this.to_user_name
						});
					} else {
						console.log('回复回复');
						this.reply.list.unshift({
							user_id: this.userInfo.id,
							user_name: this.userInfo.user_name,
							content: this.content1,
							create_time: date.getFullYear() + '-' + m + '-' + d + ' ' + time,
							like_num: 0,
							head_img: this.userInfo.head_img,
							is_like: 0,
							to_user_name: this.to_user_name
						});
					}

					this.content1 = '';
					uni.hideKeyboard();
					this.showInput1 = false;
				}
			});
		},
		getActivity(id) {
			this.$Fetch({
				url: 'activity/getDataById',
				data: { id: id },
				success: res => {
					console.log(res);
					this.activity = res;
					this.author = res.adminUser;
					this.attention = res.attention;
					this.is_collect = res.is_collect;
					this.is_like = res.is_like;
					this.is_baoming = res.is_baoming;
					this.max = res.activity_num - res.people_num;
					let start = res.start_time.replace(/\-/g, '/');
					let end = res.end_time.replace(/\-/g, '/');
					let now = new Date().getTime();
					if (now < new Date(start).getTime()) {
						this.type = 0;
					} else if (now <= new Date(end).getTime()) {
						this.type = 1;
					} else {
						this.type = 2;
					}
				}
			});
		},
		//关注
		doAttention(id) {
			console.log('关注', id);
			this.$Fetch({
				url: 'Attention/add',
				data: { id: id },
				success: res => {
					console.log(res);
					this.attention = res.success;
					let str = res.success === 1 ? '已关注,砖瓦+' + res.point : '已取消关注';
					uni.showToast({
						title: str,
						icon: 'none'
					});
				}
			});
		},
		//收藏
		doCollect(type) {
			this.$Fetch({
				url: 'Collect/add',
				data: {
					collect_type: 1,
					id_value: this.id
				},
				success: res => {
					console.log(res);
					this.is_collect = res.success;
					let str = res.success === 1 ? '已收藏,砖瓦+' + res.point : '已取消收藏';
					uni.showToast({
						title: str,
						icon: 'none'
					});
				}
			});
		},
		//文章点赞
		doZan(type) {
			this.$Fetch({
				url: 'user_like/add',
				data: {
					like_type: 1,
					id_value: this.id
				},
				success: res => {
					console.log(res);
					this.is_like = res.success;
					let str = res.success === 1 ? '已点赞,砖瓦+' + res.point : '已取消点赞';
					uni.showToast({
						title: str,
						icon: 'none'
					});
				}
			});
		},
		//获取评论列表
		getCommentList() {
			let data = this.comment;
			if (data.loading) {
				data.loading = false;
				this.comment = data;
				this.$Fetch({
					url: 'Comment/getData',
					data: {
						comment_type: 0,
						id_value: this.id,
						pageNum: data.pageNum,
						pageSize: data.pageSize
					},
					success: res => {
						let arr = res.lists;
						if (arr.length > 0) {
							data.list = data.list.concat(arr);
							if (arr.length === data.pageSize) {
								data.pageNum++;
								data.loading = true;
								data.more = true;
							} else {
								data.more = false;
							}
						} else {
							data.more = false;
						}
						this.comment = data;
					}
				});
			}
		},
		//评论点赞
		addCommentLike(item, index) {
			this.$Fetch({
				url: 'Comment/addCommentLike',
				data: { id: item.id },
				success: res => {
					item.is_like = res;
					if (res === 1) {
						item.like_num++;
					} else {
						item.like_num--;
					}
				}
			});
		},
		closePopup() {
			this.pl = false;
			this.reply = {
				comment: {},
				pageNum: 1,
				pageSize: 10,
				list: [],
				loading: true,
				more: false
			};
		},
		showPopup(item) {
			this.getReply(item);
			this.pl = true;
		},
		getReply(item) {
			let data = this.reply;
			data.comment = item;
			this.reply = data;
			if (data.loading) {
				data.loading = false;
				this.reply = data;
				this.$Fetch({
					url: 'Comment/getComment',
					data: {
						id: item.id,
						pageNum: data.pageNum,
						pageSize: data.pageSize
					},
					success: res => {
						let len = res.length;
						if (len > 0) {
							data.list = data.list.concat(res);
							if (len === data.pageSize) {
								data.pageNum++;
								data.loading = true;
								data.more = true;
							} else {
								data.more = false;
							}
						} else {
							data.more = false;
						}
						this.reply = data;
						this.pl = true;
					}
				});
			}
		},
		onSubmit(e) {
			console.log('提交数据：', e.detail.value);
			this.$Fetch({
				url: 'activity_list/add',
				data: e.detail.value,
				success: res => {
					console.log(res);
					uni.navigateTo({
						url: '../success/success?id=' + res
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	padding-bottom: 140rpx;
	.banner {
		width: 750rpx;
		height: 360rpx;
		.image {
			width: 100%;
			height: 100%;
		}
	}
	.sign-box {
		position: relative;
		z-index: 10;
		width: 690rpx;
		padding: 40rpx;
		margin: -60rpx auto 30rpx;
		box-sizing: border-box;
		border-radius: 15rpx;
		border: 1px solid #f7f7f7;
		background-color: #fff;
		box-shadow: 10rpx 10rpx 15rpx #f3f3f3;
		.row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;
			color: #b9b9b9;
			font-size: 26rpx;
			view {
				font-size: 24rpx;
				display: flex;
				align-items: center;
				image {
					width: 26rpx;
					margin-right: 10rpx;
				}
			}
		}
		.btn {
			margin-top: 30rpx;
			height: 80rpx;
			line-height: 80rpx;
		}
	}
	.author {
		border-bottom: 15rpx solid #f7f7f7;
		padding: 30rpx;
		margin: 30rpx 0;
		display: flex;
		align-items: center;
		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50rpx;
			margin-right: 30rpx;
		}
		.body {
			flex: 1;
			.renzh {
				margin-top: 10rpx;
				font-size: 22rpx;
				display: flex;
				align-items: center;
				color: #007bff;
				image {
					width: 25rpx;
					margin-right: 10rpx;
				}
			}
		}
		.btn {
			margin-left: 20rpx;
			font-size: 26rpx;
			padding: 10rpx 40rpx;
		}
	}
	.close {
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		text-align: right;
		image {
			width: 30rpx;
			height: 30rpx;
		}
	}
	.comment.popup {
		position: relative;
		.close {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
		}
		.popup-scroll {
			position: absolute;
			top: 100rpx;
			bottom: 0;
			width: 100%;
			left: 0;
			.item {
				padding: 0 30rpx;
			}
			.line {
				border-bottom: 1px solid #dedede;
				text-align: center;
				text {
					position: relative;
					top: 20rpx;
					font-size: 24rpx;
					padding: 0 30rpx;
					background-color: #fff;
				}
			}
			.user .body {
				border: none;
				.reply-btn {
					background-color: #f3f3f3;
					margin-left: 40rpx;
					border-radius: 50rpx;
					padding: 0 20rpx;
					color: #333;
				}
			}
		}
	}
	.comment {
		padding: 0 30rpx;
		.more {
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #000;
			image {
				width: 30rpx;
				height: 30rpx;
			}
		}
		.item {
			display: flex;
			align-items: flex-start;
			margin-top: 20rpx;
			.user {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				.avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50rpx;
					margin-right: 30rpx;
				}
				.body {
					flex: 1;
					color: #666;
					padding-bottom: 20rpx;
					border-bottom: 1px solid #f1f1f1;
					font-size: 26rpx;
					.info {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.time {
							color: #999;
							font-size: 22rpx;
							.children-num {
								background-color: #f3f3f3;
								margin-left: 40rpx;
								border-radius: 50rpx;
								padding: 0 20rpx;
								color: #333;
							}
						}
					}
					.content {
						margin-top: 20rpx;
						.reply {
							background-color: #f1f1f1;
							border-radius: 8rpx;
							margin-top: 10rpx;
							padding: 10rpx;
						}
					}
				}
			}
			.zan-box {
				display: flex;
				align-items: center;
				.icon {
					width: 30rpx;
					height: 30rpx;
					margin-right: 10rpx;
				}
			}
		}
	}
	.tj {
		padding: 0 30rpx 20rpx;
	}
	.footer.fixed {
		.input {
			flex: 1;
			background-color: #f5f5f5;
			border-radius: 100rpx;
			padding: 0 20rpx;
			margin-right: 20rpx;
			color: #333;
		}
	}
	.footer {
		position: fixed;
		z-index: 20;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		padding: 0 30rpx;
		border-top: 1px solid #f3f3f3;
		box-sizing: border-box;
		background-color: #fff;
		color: #b9b9b9;
		font-size: 26rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.icon {
			width: 35rpx;
			height: 35rpx;
			margin-right: 10rpx;
			margin-left: 20rpx;
		}
		.write {
			display: flex;
			align-items: center;
			.icon {
				width: 40rpx;
				height: 40rpx;
			}
		}
		.action {
			display: flex;
			justify-content: space-between;
			align-items: center;
			view {
				display: flex;
				align-items: center;
			}
			.share-btn{
				display: flex;
				align-items: center;
				padding: 0;
				font-size: 30rpx;
				color:#b9b9b9;
				background-color: #fff;
				border:none
			}
			.share-btn::after{
				display: none;
			}
		}
		.input {
			width: 440rpx;
			background-color: #f5f5f5;
			border-radius: 100rpx;
			padding: 0 20rpx;
			color: #333;
		}
	}
}
</style>
