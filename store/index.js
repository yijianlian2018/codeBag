import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		isLogin: uni.getStorageSync("TOKEN"),
		userInfo: null,
		city: uni.getStorageSync('city')||"定位中",
		uList: uni.getStorageSync('UList') || [],
		msgNum:0,
		count:1,
		wxInfo:null,
		shareMsg:{}
	},
	mutations: {
		setShareMsg(state,obj){
			state.shareMsg=obj
		},
		setWxInfo(state,info){
			state.wxInfo=info
		},
		setCount(state,num){
			state.count=num
		},
		setLogin(state) {
			state.isLogin = uni.getStorageSync("TOKEN")
		},
		setLogout(state) {
			state.isLogin = false
		},
		setInfo(state, info) {
			state.userInfo = info
		},
		setCity(state, city) {
			state.city = city
		},
		addUlist(state, user) {
			if (state.uList.length === 0) {
				state.uList.push(user);
			} else {
				let add = true;
				for (let item of state.uList) {
					if (item.id === user.id) {
						add = false
					}
				}
				if (add) {
					state.uList.push(user);
				}
			}
			uni.setStorageSync('UList', state.uList);
		},
		delUlist(state, i) {
			state.uList.splice(i, 1);
		},
		updateUlist(state,uList){
			state.uList=uList
		},
		setMsgNum(state,num){
			state.msgNum=num;
			
			if (num > 0) {
				uni.setTabBarBadge({
					index: 1,
					text: num + ''
				});
			} else if (num > 99) {
				uni.setTabBarBadge({
					index: 1,
					text: '99+'
				});
			}else{
				uni.removeTabBarBadge({
					index:1
				})
			}
		}
	},
	actions: {
		navFilter({}, e) {
			let {
				url
			} = e.currentTarget.dataset;
			let token = uni.getStorageSync("TOKEN") || false;
			if (token) {
				uni.navigateTo({
					url: url
				})
			} else {
				uni.showModal({
					title: "提示",
					content: '请先登录！',
					confirmText: '立刻登录',
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}
					}
				})
			}
		}
	}
})

export default store
