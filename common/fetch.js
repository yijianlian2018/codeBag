/* 
 @url 请求路径
 @data 请求参数
 @method 请求方法
 @ShowLoading 是否显示加载提示
 @ShowMsg 是否显示提示语
 */
// const baseURL = "http://www.yijianlian.com/index.php/api/"; //本地服务器
const baseURL = "https://yjl.tao.li4.cn/index.php/api/"; //测试服务器
export default {
	Fetch: function(opt) {
		const TOKEN = uni.getStorageSync('TOKEN');
		// console.log(TOKEN)
		opt = opt || {};
		opt.debug = opt.debug || false;
		opt.url = opt.url || '';
		opt.data = opt.data || null;
		opt.method = opt.method || 'POST';
		opt.header = opt.header || {
			"X-Requested-With": "XMLHttpRequest",
			'Content-Type': 'application/json;charset=UTF-8',
			'Accept': 'application/json'
		};
		if (TOKEN) {
			opt.header.Token = TOKEN
		}
		opt.success = opt.success || function() {};
		opt.fail = opt.fail || function() {
			if (opt.ShowLoading) {
				setTimeout(()=>{
					uni.hideLoading();
				},1500)
				
			}
			uni.stopPullDownRefresh();
			uni.showToast({
				icon: 'none',
				title: '请稍后重试'
			});
		};
		opt.complete = opt.complete || function() {
			setTimeout(()=>{
				uni.hideLoading();
			},1500)
			uni.stopPullDownRefresh()
		};
		if (opt.debug) {
			console.log(opt.data)
		}

		uni.request({
			url: baseURL + opt.url,
			data: opt.data,
			method: opt.method,
			header: opt.header,
			dataType: 'json',
			success: function(res) {
				if (opt.debug) {
					console.log(res)
				}

				if (res.statusCode === 200) {
					if (res.data.code === 200) {
						opt.success(res.data.data);
					} else if (res.data.code === 300) {
						uni.closeSocket();
						uni.showModal({
							title: '提示',
							content: '登录失效',
							cancelText: '返回首页',
							confirmText: '重新登录',
							success: function(ret) {
								uni.removeStorage({
									key: 'TOKEN',
									success: function(res) {
										if (ret.confirm) {
											uni.navigateTo({
												url: '/pages/login/login'
											});

										} else if (ret.cancel) {
											uni.reLaunch({
												url: '/pages/index/index',
											});
										}

									}
								});

							}
						});

					} else if (res.data.code === 201) {
						//#ifdef MP-WEIXIN
						opt.success(res.data);
						//#endif
						uni.navigateTo({
							url: "/pages/wxLogin/wxLogin"
						})
					} else {
						if (res.data.msg) {
							console.log(res.data.msg)
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}

				} else {
					uni.showToast({
						title: '服务器错误，请稍后重试',
						icon: 'none'
					})

				}
			},
			fail: function() {
				opt.fail()
			},
			complete: function() {
				opt.complete()
			}
		})
	},
	UploadFile: function(opt) {
		const TOKEN = uni.getStorageSync('TOKEN');
		const Lang = uni.getStorageSync('lang');
		opt = opt || {};
		opt.debug = opt.debug || false;
		opt.url = opt.url || '';
		opt.header = opt.header || {
			'Accept': 'application/json',
			'X-Version': 'V1',
			'XX-token': TOKEN,
		};
		opt.filePath = opt.filePath || null; //要上传文件资源的路径。   
		opt.name = opt.name || null; //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容 
		opt.filePath = opt.filePath || null;
		opt.formData = opt.formData || null;
		opt.success = opt.success || function() {};
		uni.showLoading({
			title: "上传中..."
		})

		uni.uploadFile({
			header: opt.header,
			url: baseURL + opt.url,
			filePath: opt.filePath,
			name: opt.name,
			formData: opt.formData,
			success: function(res) {
				var data = JSON.parse(res.data);
				if (opt.debug) {
					console.log(data)
				}
				if (res.statusCode === 200) {
					uni.hideLoading();
					if (data.code == 200) {
						opt.success(data.data);
					}else if (data.code == 300) {
						uni.closeSocket();
						uni.showModal({
							title: '提示',
							content: '登录失效',
							cancelText: '返回首页',
							confirmText: '重新登录',
							success: function(ret) {
								uni.removeStorage({
									key: 'TOKEN',
									success: function(res) {
										if (ret.confirm) {
											uni.navigateTo({
												url: '/pages/login/login'
											});

										} else if (ret.cancel) {
											uni.reLaunch({
												url: '/pages/index/index',
											});
										}

									}
								});

							}
						});
					} else {
						uni.showToast({
							title: data.msg,
							icon: 'none'
						})
					}
				} else {
					uni.showToast({
						title: '未知错误请稍后重试',
						icon: 'none'
					})
				}
			},
			fail: function() {
				uni.showToast({
					icon: 'none',
					title: '请稍后重试'
				});
			}

		})

	}
}
