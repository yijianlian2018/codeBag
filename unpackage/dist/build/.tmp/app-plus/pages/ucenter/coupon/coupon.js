(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/ucenter/coupon/coupon"],{"9b50":function(t,e,n){"use strict";n.r(e);var i=n("af0c"),o=n("b212");for(var a in o)"default"!==a&&function(t){n.d(e,t,function(){return o[t]})}(a);n("f47b");var u=n("2877"),c=Object(u["a"])(o["default"],i["a"],i["b"],!1,null,"9d0b9426",null);e["default"]=c.exports},a10a:function(t,e,n){"use strict";(function(t){n("4ea4"),n("921b");i(n("66fd"));var e=i(n("9b50"));function i(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("6e42")["createPage"])},af0c:function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=(t._self._c,t.__map(t.list,function(e,n){var i=JSON.stringify(e);return{$orig:t.__get_orig(e),g0:i}}));t.$mp.data=Object.assign({},{$root:{l0:n}})},o=[];n.d(e,"a",function(){return i}),n.d(e,"b",function(){return o})},b212:function(t,e,n){"use strict";n.r(e);var i=n("cdc6"),o=n.n(i);for(var a in i)"default"!==a&&function(t){n.d(e,t,function(){return i[t]})}(a);e["default"]=o.a},cdc6:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n={data:function(){return{item:{},show:!1,more:!1,pageNum:1,pageSize:20,loading:!0,list:[]}},onShareAppMessage:function(){var e=t.getStorageSync("TOKEN"),n=t.getStorageSync("userInfo");if(e)return{title:"易建联共享服务平台",path:"/pages/index/index?server="+n.server_people_id}},onLoad:function(e){this.getList(),e.name&&(this.show=!0,e.coupon&&(this.item=JSON.parse(e.coupon)),t.setNavigationBarTitle({title:e.name}))},onReachBottom:function(){this.getList()},methods:{doCheck:function(t){this.item=t},doChoose:function(){t.$emit("choose",this.item),t.navigateBack({})},getList:function(){var t=this;this.loading&&(this.loading=!1,this.$Fetch({url:"Coupon/user_coupon",data:{pageNum:this.pageNum,pageSize:this.pageSize},success:function(e){e.length>0?(t.list=t.list.concat(e),e.length===t.pageSize?(t.pageNum++,t.loading=!0,t.more=!0):t.more=!1):t.more=!1}}))}}};e.default=n}).call(this,n("6e42")["default"])},d517:function(t,e,n){},f47b:function(t,e,n){"use strict";var i=n("d517"),o=n.n(i);o.a}},[["a10a","common/runtime","common/vendor"]]]);