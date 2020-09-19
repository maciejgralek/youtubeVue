import { createApp } from 'vue';
import App from './App.vue'
import router from './router'
import { Dropdown } from 'bootstrap'
import '@mdi/font/css/materialdesignicons.css'
// import 'bootstrap/dist/css/bootstrap.min.css'

let app = createApp(App);
app.use(router).mount('#app');

app.directive('scroll', {
  mounted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        el.removeEventListener('scroll', f)
      }
    }
    el.addEventListener('scroll', f)
  }
})

