import { createApp } from 'vue';
import App from './App.vue'
import router from './router'
import "../node_modules/popper.js/dist/popper.min.js"
import { Dropdown } from 'bootstrap'
import { Tooltip } from 'bootstrap'
import '@mdi/font/css/materialdesignicons.css'
// import 'bootstrap/dist/css/bootstrap.min.css'

let app = createApp(App);

app.directive('tooltip', {
	mounted: function(el, binding){
		new Tooltip(el, {
			title: binding.value,
			trigger: 'hover',
		})
	}
})

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

app.use(router).mount('#app');

