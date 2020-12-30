<template>
  <div class="panel position-fixed top-0 end-0">
    <div class="d-flex justify-content-end w-100">
      <button 
        @click="handleCloseSideBar"
        type="button" 
        class="btn-close btn-close-white m-3" 
        aria-label="Close">
      </button>
    </div>
    <ul class="px-4">
      <li class="d-flex align-items-center py-2">
        <label for="checkboxCompactMode" class="form-check-label">
          Compact view
        </label>
        <input 
          v-model="compactMode" 
          type="checkbox" 
          id="checkboxCompactMode"
          class="ms-auto" 
        >
      </li>
      <li class="d-flex align-items-center py-2">
        <label 
          for="checkboxDarkMode" 
          class="form-check-label"
        >
          Dark theme
        </label>
        <input 
          v-model="darkTheme" 
          class="ms-auto"  py-2
          type="checkbox" 
          id="checkboxDarkMode"
        >
      </li>
      <li class="d-flex align-items-center py-2">
        <label 
          class="form-check-label pe-4"
        >
          Overlay opacity
        </label>
        <input 
          v-model.number="overlayOpacity" 
          type="range" 
          class="ms-auto" 
          min="0" 
          max="100" 
          step="10" 
        >
      </li>
      <li class="d-flex align-items-center py-2">
        <label 
          class="form-check-label pe-4"
        >
          Comments duration ({{ commentsDuration }}s)
        </label>
        <input 
          v-model.number="commentsDuration" 
          type="range" 
          class="ms-auto" 
          min="3" 
          max="15" 
          step="1" 
        >
      </li>
      <li class="d-flex align-items-center py-2">
        <a href="" data-bs-toggle="modal" data-bs-target="#exportModal">
          Export playlists as URL
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import useUI from '../use-UI.js'

export default {
	setup(props) {
    let { 
      toggleSidePanel, 
      compactMode,
      setCompact,
      darkTheme,
      overlayOpacity,
      commentsDuration,
    } = useUI();
		
    function handleCloseSideBar() {
      toggleSidePanel()
    }

		return {
      compactMode,
      setCompact,
      darkTheme,
      overlayOpacity,
      commentsDuration,
		  handleCloseSideBar,
		}
	}
}
</script>

<style scoped>
.panel {
  width: 30em;
  height: 100vh;
  background-color: #343a40;
  -webkit-box-shadow: -10px 0px 12px -12px rgba(0,0,0,0.5);
  -moz-box-shadow: -10px 0px 12px -12px rgba(0,0,0,0.5);
  box-shadow: -10px 0px 12px -12px rgba(0,0,0,0.5);
  z-index: 1200;
}

input[type=checkbox] {
  transform: scale(1.25);
}
</style>
