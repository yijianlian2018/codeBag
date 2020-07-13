import Vue from 'vue'
import App from './App'
import HTTP from '@/common/fetch.js'
import store from './store'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$store = store;
Vue.prototype.$Fetch = HTTP.Fetch;
Vue.prototype.$UploadFile = HTTP.UploadFile;
// Vue.prototype.$Socket = socket;

const app = new Vue({
	store,
	...App
})
app.$mount()
