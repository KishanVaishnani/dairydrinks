import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VTooltip from 'v-tooltip'

Vue.use(Vuelidate)
Vue.use(Vuetify)
Vue.use(VTooltip)
Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
