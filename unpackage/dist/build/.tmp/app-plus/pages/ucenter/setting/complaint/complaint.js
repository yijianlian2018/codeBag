(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/ucenter/setting/complaint/complaint"],{"45a2":function(t,e,n){"use strict";n.r(e);var a=n("d893"),i=n("92bb");for(var u in i)"default"!==u&&function(t){n.d(e,t,function(){return i[t]})}(u);n("da5c");var o=n("2877"),r=Object(o["a"])(i["default"],a["a"],a["b"],!1,null,"0a7b1f12",null);e["default"]=r.exports},"92bb":function(t,e,n){"use strict";n.r(e);var a=n("faaf"),i=n.n(a);for(var u in a)"default"!==u&&function(t){n.d(e,t,function(){return a[t]})}(u);e["default"]=i.a},ae80:function(t,e,n){"use strict";(function(t){n("4ea4"),n("921b");a(n("66fd"));var e=a(n("45a2"));function a(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("6e42")["createPage"])},d893:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement;t._self._c},i=[];n.d(e,"a",function(){return a}),n.d(e,"b",function(){return i})},da5c:function(t,e,n){"use strict";var a=n("e524"),i=n.n(a);i.a},e524:function(t,e,n){},faaf:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n={data:function(){return{list:[],pageNum:1,pageSize:20,loading:!0,more:!1}},onShareAppMessage:function(){var e=t.getStorageSync("TOKEN"),n=t.getStorageSync("userInfo");if(e)return{title:"易建联共享服务平台",path:"/pages/index/index?server="+n.server_people_id}},onShow:function(){this.list=[],this.pageNum=1,this.loading=!0,this.getList()},onReachBottom:function(){this.getList()},methods:{toDetail:function(e){1===e.status&&t.navigateTo({url:"detail/detail?item="+JSON.stringify(e)})},getList:function(){var t=this;this.$Fetch({url:"advise/getData",data:{pageNum:this.pageNum,pageSize:this.pageSize},debug:!0,success:function(e){var n=e.length;n>0?(t.list=t.list.concat(e),n===t.pageSize?(t.pageNum++,t.loading=!0,t.more=!0):t.more=!1):t.more=!1}})}}};e.default=n}).call(this,n("6e42")["default"])}},[["ae80","common/runtime","common/vendor"]]]);