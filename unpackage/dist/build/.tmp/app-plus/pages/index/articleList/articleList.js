(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/articleList/articleList"],{1974:function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement;t._self._c},r=[];n.d(e,"a",function(){return i}),n.d(e,"b",function(){return r})},"7c88":function(t,e,n){"use strict";n.r(e);var i=n("1974"),r=n("d57f");for(var a in r)"default"!==a&&function(t){n.d(e,t,function(){return r[t]})}(a);var o=n("2877"),u=Object(o["a"])(r["default"],i["a"],i["b"],!1,null,null,null);e["default"]=u.exports},d57f:function(t,e,n){"use strict";n.r(e);var i=n("eda0"),r=n.n(i);for(var a in i)"default"!==a&&function(t){n.d(e,t,function(){return i[t]})}(a);e["default"]=r.a},dd7e:function(t,e,n){"use strict";(function(t){n("4ea4"),n("921b");i(n("66fd"));var e=i(n("7c88"));function i(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("6e42")["createPage"])},eda0:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=n("2f62");function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){a(t,e,n[e])})}return t}function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var o=function(){return Promise.all([n.e("common/vendor"),n.e("components/articleList")]).then(n.bind(null,"29ef"))},u={data:function(){return{type:-1,more:!1,pageNum:1,pageSize:20,loading:!0,list:[]}},computed:r({},(0,i.mapState)(["city"])),components:{articleList:o},onShareAppMessage:function(){var e=t.getStorageSync("TOKEN"),n=t.getStorageSync("userInfo");if(e)return{title:"易建联共享服务平台",path:"/pages/index/index?server="+n.server_people_id}},onLoad:function(e){e.type&&(this.type=e.type,t.setNavigationBarTitle({title:e.title}),this.getList())},onReachBottom:function(){this.getList()},onPullDownRefresh:function(){this.more=!1,this.pageNum=1,this.pageSize=20,this.loading=!0,this.list=[],this.getList()},methods:{getList:function(){var t=this;this.loading&&(this.loading=!1,this.$Fetch({url:"news/getData",data:{pageNum:this.pageNum,pageSize:this.pageSize,type:this.type,city:this.city},success:function(e){var n=e.lists;n.length>0?(t.list=t.list.concat(n),n.length===t.pageSize?(t.pageNum++,t.loading=!0,t.more=!0):t.more=!1):t.more=!1}}))}}};e.default=u}).call(this,n("6e42")["default"])}},[["dd7e","common/runtime","common/vendor"]]]);