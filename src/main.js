import { createApp } from 'vue';
import App from './App.vue'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
import { Dropdown } from 'bootstrap'
import tippy, {followCursor} from 'tippy.js';
import 'tippy.js/dist/tippy.css';

let app = createApp(App);

app.directive('tippy', {
	mounted: function(el, binding) {
		let placement = binding.modifiers.right ? 'right' :
			binding.modifiers.left ? 'left' :
			binding.modifiers.top ? 'top' :
			binding.modifiers.bottom ? 'bottom' : 'top';

		tippy(el, {
			content: binding.value,
			offset: [0, 20],
		});	
	},
	unmounted: function(el, binding) {
	}
})

app.directive('tippy-player', {
	mounted: function(el, binding) {
		let placement = binding.modifiers.right ? 'right' :
			binding.modifiers.left ? 'left' :
			binding.modifiers.top ? 'top' :
			binding.modifiers.bottom ? 'bottom' : 'top';

		tippy(el, {
			allowHTML: true,
			interactive: true,
			maxWidth: "none",
			content: binding.value,
		});	
	},
	unmounted: function(el, binding) {
	}
})

app.directive('tippy-progress', {
	mounted: function(el, binding) {
		el.tippyProgress = tippy(el, {
			followCursor: 'horizontal',
			hideOnClick: false,
			plugins: [followCursor],
			content: binding.value,
		});	
	},
	unmounted: function(el, binding) {
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

