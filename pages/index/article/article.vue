<template>
	<view class="page" v-if="article">
		<video
			v-if="article.video"
			id="myVideo"
			poster="http://yjl.tao.li4.cn/img/20190921/689209dd76925de70a50e589ffdadbc8.png"
			:src="article.video"
			@error="videoErrorCallback"
			controls
		>
			<!--  #ifdef  MP-WEIXIN -->
			<cover-image @click="back" class="back" :style="{ top: statusBarHeight + 'px' }" src="../../../static/back.png" mode=""></cover-image>
			<!--  #endif -->
		</video>
		<scroll-view @scrolltolower="getCommentList" class="scroll-view" :scroll-y="true">
			<view class="title">{{ article.title }}</view>
			<view class="desc"><uParse v-if="article" :content="article.desc" /></view>

			<view class="author" v-if="author">
				<navigator :url="'../author/author?id=' + author.id + '&attention=' + attention">
					<image class="avatar" v-if="author.head_img" :src="author.head_img" mode=""></image>
					<image class="avatar" v-else src="../../../static/avatar.jpg" mode=""></image>
				</navigator>
				<view class="name">{{ author.user_name }}</view>
				<view class="btn" @tap="doAttention(author.id)">
					<text v-if="attention === 1">取消关注</text>
					<text v-else>关注</text>
				</view>
			</view>

			<view class="tj">相关推荐</view>
			<article-list :list="list" :more="more" />
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
					<van-loading type="spinner" color="#999" />
					<text>加载中</text>
				</view>
			</view>
		</scroll-view>
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
		<uni-popup :show="show" :maskClick="false" type="bottom">
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
						<van-loading type="spinner" color="#999" />
						<text>加载中</text>
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
import { mapState, mapMutations } from 'vuex';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import articleList from '@/components/articleList.vue';
import uParse from '@/components/u-parse/u-parse.vue';
export default {
	data() {
		return {
			timer: null,
			videoContext: null,
			statusBarHeight: 0,
			height: 0,
			id: -1,
			show: false,
			article: null,
			author: null,
			is_collect: 0,
			is_like: 0,
			attention: 0,
			more: false,
			type: 0,
			list: [],
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
			showInput: false,
			showInput1: false,
			content: '',
			content1: '',
			item: null,
			to_user_name: ''
		};
	},
	computed: {
		...mapState(['isLogin', 'userInfo'])
	},
	components: { articleList, uniPopup, uParse },
	onShareAppMessage() {
		let token = uni.getStorageSync('TOKEN');
		let user = uni.getStorageSync('userInfo');
		this.$Fetch({
			url: 'news/share',
			data: { news_id: this.id },
			success: res => {
				let str = res > 0 ? '已分享,砖瓦+' + res : '已分享';
				uni.showToast({
					title: str,
					icon: 'none'
				});
			}
		});
		if (token) {
			return {
				title: '易建联共享服务平台',
				path: '/pages/index/article/article?id=' + this.id + '&server=' + user.server_people_id + '&path=/pages/index/article/article'
			};
		}
	},
	onLoad(opt) {
		let token = uni.getStorageSync('TOKEN');
		let that = this;
		if (!token) {
			this.setShareMsg({
				server: opt.server,
				path: opt.path + '?id=' + opt.id
			});
			uni.redirectTo({
				url: '/pages/login/login'
			});
			return false;
		}
		uni.getSystemInfo({
			success: function(res) {
				that.height = res.windowHeight / 2 + 'px';
				that.statusBarHeight = res.statusBarHeight;
			}
		});
		uni.hideKeyboard();
		if (opt.id) {
			this.timer = setTimeout(() => {
				this.$Fetch({
					url: 'news/read_news',
					data: { id: opt.id },
					success: res => {
						if (res > 0) {
							uni.showToast({
								title: '砖瓦数+' + res,
								icon: 'success'
							});
						}
					}
				});
			}, 5000);
			this.id = opt.id;
			this.$Fetch({
				url: 'news/getDataById',
				data: { id: opt.id },
				success: res => {
					this.article = res;
					this.is_collect = res.is_collect;
					this.is_like = res.is_like;
					this.author = res.adminUser;
					this.attention = res.attention;
					this.type = res.type;
					this.getRecommend();
				}
			});
			this.getCommentList();
		}
	},
	onHide() {
		this.videoContext.pause();
		console.log('页面隐藏了');
		clearTimeout(this.timer);
		this.timer = null;
	},
	onUnload() {
		console.log('页面销毁了');
		this.videoContext.pause();
		clearTimeout(this.timer);
		this.timer = null;
	},
	onReady() {
		this.videoContext = uni.createVideoContext('myVideo');
		setTimeout(() => {
			this.videoContext.play();
		}, 3000);
	},
	methods: {
		...mapMutations(['setShareMsg']),
		videoErrorCallback() {},
		back() {
			uni.navigateBack({});
		},
		doShare() {
			let that = this;
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession', //WXSceneSession”分享到聊天界面，“WXSenceTimeline”分享到朋友圈，“WXSceneFavorite”分享到微信收藏
				type: 5, //0-图文；5-小程序
				imageUrl: '../../static/poster.png',
				title: '欢迎使用易建联APP',
				miniProgram: {
					id: 'gh_4bf03e4d36fb',
					path: '/pages/index/article/article?id=' + this.id + '&server=' + this.userInfo.server_people_id + '&path=/pages/index/article/article',
					webUrl: 'https://uniapp.dcloud.io',
					type: 2
				},
				success: e => {
					console.log('success', e);
					uni.showModal({
						content: '分享成功',
						showCancel: false
					});
					that.$Fetch({
						url: 'news/share',
						data: { news_id: that.id },
						success: res => {
							let str = res > 0 ? '已分享,砖瓦+' + res : '已分享';
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
			if (!this.content.trim()) {
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
					// let comment=this.comment
					let date = new Date();
					let m = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
					let d = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
					let time = date.toTimeString().split(' ')[0];
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
			if (!this.content1.trim()) {
				uni.showModal({
					content: '请输入内容',
					showCancel: false
				});
				return false;
			}
			let parent_id = this.reply.comment.id;
			console.log(parent_id);
			this.$Fetch({
				url: 'Comment/addComment',
				data: {
					parent_id: parent_id,
					to_user_id: this.replyId,
					content: this.content1
				},
				success: res => {
					// let comment=this.comment
					let date = new Date();
					let m = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
					let d = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
					let time = date.toTimeString().split(' ')[0];
					if (this.replyId) {
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
		getRecommend() {
			this.$Fetch({
				url: 'news/get_recommend',
				data: { type: this.type },
				success: res => {
					this.list = res;
				}
			});
		},
		//关注
		doAttention(id) {
			this.$Fetch({
				url: 'Attention/add',
				data: { id: id },
				success: res => {
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
					collect_type: type,
					id_value: this.id
				},
				success: res => {
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
					like_type: type,
					id_value: this.id
				},
				success: res => {
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
			this.show = false;
			this.showInput1 = false;
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
			this.item = item;
			this.getReply(item);
			this.show = true;
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
						this.show = true;
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	#myVideo {
		width: 750rpx;
		height: 421.875rpx;
		/*  #ifdef  APP-PLUS  */
		.back {
			position: absolute;
			top: var(--status-bar-height);
			left: 30rpx;
			width: 50rpx;
			height: 50rpx;
		}
		/*  #endif  */
		/*  #ifdef  MP-WEIXIN */
		.back {
			position: absolute;
			left: 30rpx;
			width: 50rpx;
			height: 50rpx;
		}
		/*  #endif  */
	}
	.scroll-view {
		position: absolute;
		top: 421.875rpx;
		bottom: 100rpx;
		width: 100%;
		.title {
			font-size: 32rpx;
			padding: 30rpx;
		}
		.desc {
			font-size: 28rpx;
			padding: 0 30rpx;
			color: #999999;
		}
		.author {
			border-top: 1px solid #f3f3f3;
			border-bottom: 1px solid #f3f3f3;
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
			.name {
				flex: 1;
			}
			.btn {
				font-size: 26rpx;
				padding: 10rpx 40rpx;
			}
		}
	}
	.comment.popup {
		position: relative;
		.close {
			top: 0;
			left: 0;
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			position: absolute;
			text-align: right;
			z-index: 999;
			image {
				width: 30rpx;
				height: 30rpx;
			}
		}
		.popup-scroll {
			position: absolute;
			top: 100rpx;
			bottom: 0;
			width: 100%;
			left: 0;
			.line {
				border-bottom: 1px solid #dedede;
				text-align: center;
				position: relative;
				top: -20rpx;
				text {
					position: relative;
					top: 20rpx;
					font-size: 24rpx;
					padding: 0 30rpx;
					background-color: #fff;
				}
			}
			.item {
				padding: 0 30rpx;
			}
			.user .body {
				border: none;
			}
			.body .reply-btn {
				background-color: #f3f3f3;
				margin-left: 40rpx;
				border-radius: 50rpx;
				padding: 0 20rpx;
				color: #333;
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
		width: 100%;
		position: fixed;
		z-index: 999;
		bottom: 0;
		left: 0;
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
			.share-btn {
				display: flex;
				align-items: center;
				padding: 0;
				font-size: 30rpx;
				color: #b9b9b9;
				background-color: #fff;
				border: none;
			}
			.share-btn::after {
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
