(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/login/login"],{"0aa0":function(e,t,n){},4006:function(e,t,n){"use strict";(function(e){n("4ea4"),n("921b");o(n("66fd"));var t=o(n("5711"));function o(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("6e42")["createPage"])},5711:function(e,t,n){"use strict";n.r(t);var o=n("aed7"),s=n("83f1");for(var i in s)"default"!==i&&function(e){n.d(t,e,function(){return s[e]})}(i);n("6b0f");var a=n("2877"),u=Object(a["a"])(s["default"],o["a"],o["b"],!1,null,"39d40f23",null);t["default"]=u.exports},"6b0f":function(e,t,n){"use strict";var o=n("0aa0"),s=n.n(o);s.a},"83f1":function(e,t,n){"use strict";n.r(t);var o=n("86a5"),s=n.n(o);for(var i in o)"default"!==i&&function(e){n.d(t,e,function(){return o[e]})}(i);t["default"]=s.a},"86a5":function(e,t,n){"use strict";(function(e,o){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=n("2f62");function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},o=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),o.forEach(function(t){a(e,t,n[t])})}return e}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var u={data:function(){return{isWXAppInstalled:!0}},computed:i({},(0,s.mapState)(["shareMsg"])),onLoad:function(){var t=e.getSystemInfoSync().platform;if("ios"===t){var n=plus.ios.import("WXApi");this.isWXAppInstalled=n.isWXAppInstalled()}},onShareAppMessage:function(){var t=e.getStorageSync("TOKEN"),n=e.getStorageSync("userInfo");if(t)return{title:"易建联共享服务平台",path:"/pages/index/index?server="+n.server_people_id}},methods:i({},(0,s.mapMutations)(["setLogin","setWxInfo","setInfo"]),{getUserInfo:function(){var t=this;this.$Fetch({url:"user/getDataById",success:function(n){t.setInfo(n),e.setStorageSync("userInfo",n)}})},onSubmit:function(t){var n=this,s=t.detail.value;for(var i in console.log(o("提交数据：",t.detail.value," at pages/login/login.vue:76")),s)if(!s[i])return e.showToast({title:"用户名或密码不能为空！",icon:"none"}),!1;this.$Fetch({url:"login/doit",data:s,success:function(t){e.setStorage({key:"TOKEN",data:t,success:function(){n.setLogin(),e.showToast({title:"登录成功",icon:"success"}),n.shareMsg.path?setTimeout(function(){e.reLaunch({url:n.shareMsg.path})},1500):setTimeout(function(){e.reLaunch({url:"/pages/index/index"})},1500)}})}})},wxLogin:function(){var t=this;e.login({provider:"weixin",success:function(n){e.getUserInfo({provider:"weixin",lang:"zh_CN",success:function(n){t.setWxInfo(n.userInfo),t.$Fetch({url:"login/wxLogin",data:{open_id:n.userInfo.unionid},debug:!0,success:function(n){e.setStorage({key:"TOKEN",data:n,success:function(){t.setLogin(),e.showToast({title:"登录成功",icon:"success"}),setTimeout(function(){e.reLaunch({url:"/pages/index/index"})},1500)}})}})}})}})},xiaoLogin:function(){e.showLoading({mask:!0,title:"登录中···"});var t=this;wx.getSetting({success:function(n){n.authSetting["scope.userInfo"]?wx.login({success:function(n){console.log(o("微信登录",n," at pages/login/login.vue:173")),wx.getUserInfo({withCredentials:!0,success:function(s){t.$Fetch({url:"login/xiaoLogin",data:{js_code:n.code,user_name:s.userInfo.nickName,head_img:s.userInfo.avatarUrl,encryptedData:s.encryptedData,iv:s.iv,server_people_id:t.shareMsg.server},debug:!0,success:function(n){console.log(o(n," at pages/login/login.vue:189")),e.setStorage({key:"TOKEN",data:n,success:function(){t.setLogin(),e.showToast({title:"登录成功",icon:"success"}),t.shareMsg.path?setTimeout(function(){e.reLaunch({url:t.shareMsg.path})},1500):setTimeout(function(){e.reLaunch({url:"/pages/index/index"})},1500)}})}})}})}}):e.navigateTo({url:"/pages/authorize/authorize"})}})}})};t.default=u}).call(this,n("6e42")["default"],n("0de9")["default"])},aed7:function(e,t,n){"use strict";var o=function(){var e=this,t=e.$createElement;e._self._c},s=[];n.d(t,"a",function(){return o}),n.d(t,"b",function(){return s})}},[["4006","common/runtime","common/vendor"]]]);