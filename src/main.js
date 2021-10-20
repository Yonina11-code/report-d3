import Vue from 'vue'
import App from './App.vue'
import * as d3 from "d3"
import histogram from './lib/histogram'

Vue.config.productionTip = false

Vue.use(d3)
Vue.prototype.d3 = d3
Vue.use(histogram)

new Vue({
  render: h => h(App),
}).$mount('#app')
