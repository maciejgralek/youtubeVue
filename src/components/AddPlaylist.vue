<template>
  <div class="row align-items-center py-3 pt-4 pr-3">

    <!-- FILTER -->

    <div class="col-4 ml-auto border-right">
      <input 
        v-model="state.filter" 
        type="search" 
        class="form-control form-control-sm" 
        placeholder="Filter"
      >
    </div>

    <!-- SEARCH -->

    <div class="col-4">
      <input 
        v-model="searchString" 
        type="search" 
        class="form-control form-control-sm" 
      >
    </div>
    <div class="col-auto">
      <!-- <button @click="searchRemote(searchString)" class="btn btn&#45;primary btn&#45;sm">Search</button> -->
      <button @click="" class="btn btn-primary btn-sm">
        Search
      </button>
    </div>

    <!-- PLAYLIST DROPDOWN -->

    <div class="col-auto ml-auto pr-1">
      <div class="dropdown">
        <i class="mdi mdi-playlist-music mdi-24px" id="dropdownMenuButton" data-toggle="dropdown"></i>
        <div class="dropdown-menu dropdown-menu-right" style="width: 500px">
          <div class="row px-3 py-2">
            <div class="col">
              <input 
                v-model="playlistId" 
                type="email" 
                class="form-control 
                form-control-sm" 
                placeholder="Playlist id"
              >
            </div>
            <div class="col-auto">
              <button 
                @click="addPlaylistToPlaylists(playlistId)" 
                class="btn btn-primary btn-sm"
              >
                Add Playlist
              </button>
            </div>
          </div>
          <ul class="list-group">
            <li class="list-group-item d-flex align-items-center border-0">
              <label for="checkboxCompactMode" class="form-check-label">
                Compact view
              </label>
              <input 
                v-model="compactMode" 
                type="checkbox" 
                id="checkboxCompactMode"
                class="ml-auto" 
              >
            </li>
            <li class="list-group-item d-flex align-items-center border-0">
              <label 
                for="checkboxDarkMode" 
                class="form-check-label"
              >
                Dark theme
              </label>
              <input 
                v-model="currentTheme" 
                class="ml-auto" 
                type="checkbox" 
                id="checkboxDarkMode"
              >
            </li>
            <li class="list-group-item d-flex align-items-center border-0">
              <label 
                @click="setTheme" 
                class="form-check-label"
              >
                Overlay opacity
              </label>
              <input 
                v-model.number="overlayOpacity" 
                type="range" 
                class="ml-auto" 
                min="0" 
                max="100" 
                step="10" 
              >
            </li>
            <li class="list-group-item d-flex align-items-center border-0">
              <label 
                @click="setTheme" 
                class="form-check-label"
              >
                Comments durations ({{ commentsDuration }}s)
              </label>
              <input 
                v-model.number="commentsDuration" 
                type="range" 
                class="ml-auto" 
                min="3" 
                max="15" 
                step="1" 
              >
            </li>
            <li class="list-group-item d-flex align-items-center border-0">
                <a href="" data-toggle="modal" data-target="#exampleModal">
                  Export playlists as URL
                </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- EXPORT MODAL -->

  <teleport to="body">
    <Modal>
      <template v-slot:header>
        <h5 class="modal-title" id="exampleModalLabel">Export playlists</h5>
      </template>
      <template v-slot:default>
        <textarea 
          ref="exportRef" 
          :value="exportString" 
          rows="3" 
          class="form-control w-100 mb-2"
        >
        </textarea>
        <a href="" @click.prevent="handleExportCopyToClipboard">
          Copy to clipboard
        </a>
      </template>
    </Modal>
  </teleport>
</template>

<script>
import { ref, onMounted, watchEffect } from 'vue'
import Modal from './Modal.vue'
import useYoutube from '../use-youtube'
import useUI from '../use-UI'
import useStore from '../use-store'

export default {
  components: {
    Modal,
  },
  setup(props, { emit }) {
    let exportRef = ref(null);
    let playlistId = ref('');
    let searchString = ref('');
    let exportString = ref('');
    let appUrl = "https://relaxed-bell-6b8902.netlify.app"

    let { 
      playlists,
      addPlaylistToPlaylists, 
      searchRemote,
      loadPlaylists 
    } = useYoutube();

    let {
      compactMode,
      setCompact,
      currentTheme,
      overlayOpacity,
      commentsDuration,
    } = useUI();

    let state = useStore();

    watchEffect(() => {
      let playlistsId = [];
      for(let playlist of playlists.value) {
        playlistsId.push(playlist.id);   
      }
      exportString.value = `${appUrl}/playlist/${playlistsId.join(',')}`; 
    })

    function handleExportCopyToClipboard() {
      exportRef.value.select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    }

    return {
      exportRef,
      playlistId,
      searchString,
      overlayOpacity,
      state,
      // youtube
      playlists,
      addPlaylistToPlaylists,
      setCompact,
      compactMode,
      currentTheme,
      handleExportCopyToClipboard,
      searchRemote,
      exportString,
      commentsDuration,
    }
  }
}
</script>

<style scoped>
.border-right {
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: var(--border-color) !important;
}

input[type=checkbox] {
  transform: scale(1.2);
}

.mdi-icon-addplaylist:before {
  color: orange;
}
</style>
