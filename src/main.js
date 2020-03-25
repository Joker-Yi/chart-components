import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$moment = moment

new Vue({
  render: h => h(App),
}).$mount('#app')
