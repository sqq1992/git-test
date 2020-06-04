import 'assets/css/main.less'
import 'assets/font/iconfont.css'
import 'element-ui/lib/theme-default/index.css'

import App from './App'
// import ElementUI from 'element-ui'
import Vue from 'vue'
import filter from './filter'
import router from './router'
import store from './store'
import http from './api'

// Vue.use(ElementUI);
const name = "sun1992";
Vue.prototype.$http = http;
filter(Vue);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
