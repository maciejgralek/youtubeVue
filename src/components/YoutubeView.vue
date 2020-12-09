<template>
  <keep-alive>
    <component v-bind:is="isAboutVisible"></component>	
  </keep-alive>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Youtube from './Youtube.vue'
import About from './About.vue'
import useUI from '../use-UI.js'

export default {
  components: {
    Youtube,
    About,
  },
	setup() {
    let {
      isAboutVisible,
    } = useUI();
		
		return {
		  isAboutVisible,	
		}
	}
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s !important;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0 !important;
}
</style>
