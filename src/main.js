import { createApp } from 'vue';
import App from './App.vue'
import router from './router'
import "../node_modules/popper.js/dist/popper.min.js"
import { Dropdown } from 'bootstrap'
import { Tooltip, Popover } from 'bootstrap'
import '@mdi/font/css/materialdesignicons.css'
// import 'bootstrap/dist/css/bootstrap.min.css'

let app = createApp(App);

app.directive('tooltip', {
	mounted: function(el, binding) {
		let placement = binding.modifiers.right ? 'right' :
			binding.modifiers.left ? 'left' :
			binding.modifiers.top ? 'top' :
			binding.modifiers.bottom ? 'bottom' : 'top';

		let tooltip = new Tooltip(el, {
			title: binding.value,
			trigger: 'hover',
			placement: placement,
			offset: '0,15',
		})
		el.tooltipVue = tooltip;
	},
	beforeUnmount: function(el, binding) {
		el.tooltipVue.hide();
	}
})

app.directive('popover-player', {
	mounted: function(el, binding) {
		let placement = binding.modifiers.right ? 'right' :
			binding.modifiers.left ? 'left' :
			binding.modifiers.top ? 'top' :
			binding.modifiers.bottom ? 'bottom' : 'top';

		let popover = new Popover(el, {
			container: 'body',
			html: true,
			content: binding.value,
			placement: placement,
		})
		el.popoverVue = popover;
	},
	unmounted: function(el, binding) {
		el.popoverVue.hide();
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

