import Vue from 'vue'
import App from './App.vue'
import * as d3 from "d3"
import histogram from './lib/histogram'
import pie from './lib/pie'

Vue.config.productionTip = false

Vue.use(d3)
Vue.prototype.d3 = d3
Vue.use(histogram)
Vue.use(pie)

new Vue({
  render: h => h(App),
}).$mount('#app')
