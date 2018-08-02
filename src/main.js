// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'lib-flexible'
import Vue from 'vue'
// import 'babel-polyfill'
import vueResourse from 'vue-resource'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
Vue.use(MintUI);
import router from './router'
import store from './store/store'
import Vuex from 'vuex'
import FastClick from 'fastclick'

FastClick.attach(document.body);

Vue.use(Vuex)

import 'swiper/dist/css/swiper.css';
import 'swiper';

import 'lib-flexible/flexible.js';

/*导入axios*/
import axios from 'axios';
Vue.prototype.$http = axios;

Vue.config.productionTip = false

Vue.use(vueResourse)
    // 使用轮播组件
    // Vue.use(VueAwesomeSwiper);
    /* eslint-disable no-new */

/*使用了axios配置*/
// axios.defaults.timeout = 500000
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// axios.defaults.baseURL = 'http://119.23.25.170:8088/api/' //1.1
// axios.defaults.withCredentials = true

new Vue({
    el: '#app',
    data: {
        eventHub: new Vue()
    },
    router,
    store,
    components: { App },
    template: '<App/>',
    created() {
        store.eventHub = this;
    }
})