import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import MainContent from './vue-components/main_content.vue'
import Utils from './js/utils.js'

Vue.use(VueResource);
Vue.use(VueRouter);

export let router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/:channel?',
      name: 'mainContent',
      component: MainContent
    }
  ],
});

new Vue({
  router,
  template: `
    <div>
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app');

