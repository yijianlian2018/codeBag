(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/search/search"],{"321d":function(e,t,n){},"3a86":function(e,t,n){"use strict";n.r(t);var i=n("4ee1"),r=n("6e2a");for(var a in r)"default"!==a&&function(e){n.d(t,e,function(){return r[e]})}(a);n("e744");var o=n("2877"),s=Object(o["a"])(r["default"],i["a"],i["b"],!1,null,null,null);t["default"]=s.exports},"4ee1":function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement;e._self._c},r=[];n.d(t,"a",function(){return i}),n.d(t,"b",function(){return r})},"6e2a":function(e,t,n){"use strict";n.r(t);var i=n("e80a"),r=n.n(i);for(var a in i)"default"!==a&&function(e){n.d(t,e,function(){return i[e]})}(a);t["default"]=r.a},e744:function(e,t,n){"use strict";var i=n("321d"),r=n.n(i);r.a},e80a:function(e,t,n){"use strict";(function(e,i){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n("2f62");function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),i.forEach(function(t){o(e,t,n[t])})}return e}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s=function(){return Promise.all([n.e("common/vendor"),n.e("components/articleList")]).then(n.bind(null,"29ef"))},c={data:function(){return{SearchString:"",show:!1,HostSearch:[],SearchHistory:[],PageIndex:0,PageSize:20,BeginTime:"",EndTime:"",loading:!0,more:!1,list:[]}},onShareAppMessage:function(){var t=e.getStorageSync("TOKEN"),n=e.getStorageSync("userInfo");if(t)return{title:"易建联共享服务平台",path:"/pages/index/index?server="+n.server_people_id}},computed:a({},(0,r.mapState)(["city"])),components:{articleList:s},onLoad:function(){},onShow:function(){var t=e.getStorageSync("SearchHistory")||[];this.SearchHistory=t},methods:a({},(0,r.mapActions)(["navFilter"]),{onChange:function(e){this.SearchString=e.detail},onClear:function(){this.show=!1},onSearch:function(t){console.log(i(this.SearchString," at pages/index/search/search.vue:88"));var n=this.SearchString.trim(),r=e.getStorageSync("SearchHistory")||[];console.log(i(r," at pages/index/search/search.vue:92")),r.indexOf(n)<0&&(r.lenght>12?(r.pop(),r.unshift(n)):r.unshift(n)),e.setStorageSync("SearchHistory",r),this.show=!0,this.SearchHistory=r,this.loading=!0,this.list=[],this.PageIndex=0,this.getResultList()},del:function(){e.setStorageSync("SearchHistory",[]),this.SearchHistory=[]},clickTag:function(t){var n=e.getStorageSync("SearchHistory")||[];n.lenght>12?(n.pop(),n.unshift(t)):n.unshift(t),e.setStorageSync("SearchHistory",n),this.show=!0,this.SearchString=t,this.SearchHistory=n,this.loading=!0,this.list=[],this.PageIndex=0,this.getResultList()},getResultList:function(){var t=this;this.loading&&(e.showLoading({title:"加载中..."}),this.loading=!1,this.$Fetch({url:"news/getData",data:{pageNum:this.PageIndex,pageSize:this.PageSize,title:this.SearchString,city:this.city},success:function(e){console.log(i(e," at pages/index/search/search.vue:150"));var n=e.lists;n.length>0?(t.list=t.list.concat(n),n.length===t.PageSize?(t.PageIndex++,t.loading=!0,t.more=!0):t.more=!1):t.more=!1}}))}})};t.default=c}).call(this,n("6e42")["default"],n("0de9")["default"])},eecb:function(e,t,n){"use strict";(function(e){n("4ea4"),n("921b");i(n("66fd"));var t=i(n("3a86"));function i(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("6e42")["createPage"])}},[["eecb","common/runtime","common/vendor"]]]);