<template>
  <div class="row align-items-center py-3 pt-4 pe-3">

    <!-- FILTER -->

    <div class="col-4 ms-auto border-right">
      <input 
        @input="debounceFilterInput"
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
      <!-- <button @click="handleSearch" class="btn btn&#45;primary btn&#45;sm"> -->
      <button @click="" class="btn btn-primary btn-sm">
        Search
      </button>
    </div>

    <!-- PLAYLIST DROPDOWN -->

    <div class="col-auto ms-auto pe-1">
      <div class="dropdown">
        <i 
          data-bs-toggle="dropdown"
          class="mdi mdi-playlist-music mdi-24px" 
        ></i>
        <div class="dropdown-menu dropdown-menu-right" style="width: 300px">
          <div class="px-3 py-2">
            <input 
              v-model="playlistId" 
              type="email" 
              class="form-control 
              form-control-sm" 
              placeholder="Playlist id"
            >
          </div>
          <div class="d-flex w-100 pe-3">
            <button 
              @click="addPlaylistToPlaylists(playlistId)" 
              class="btn btn-primary btn-sm ms-auto"
            >
              Add Playlist
            </button>
          </div>
          <hr class="dropdown-divider mt-3">
          <ul class="list-group">
            <li class="list-group-item d-flex align-items-center border-0">
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
            <li class="list-group-item d-flex align-items-center border-0">
              <label 
                for="checkboxDarkMode" 
                class="form-check-label"
              >
                Dark theme
              </label>
              <input 
                v-model="darkTheme" 
                class="ms-auto" 
                type="checkbox" 
                id="checkboxDarkMode"
              >
            </li>
            <li class="list-group-item d-flex align-items-center border-0">
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
            <li class="list-group-item d-flex align-items-center border-0">
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
            <li class="list-group-item d-flex align-items-center border-0">
              <a href="" data-bs-toggle="modal" data-bs-target="#exportModal">
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
        <h5 class="modal-title" id="exampleModalLabel">
          Export playlists
        </h5>
      </template>
      <template v-slot:default>
        <textarea 
          ref="exportEl" 
          :value="exportString" 
          rows="3" 
          class="form-control w-100 mb-3"
        >
        </textarea>
        <ul class="list-group mb-3">
          <li 
            v-for="(playlist, index) in playlists"
            class="list-group-item d-flex align-items-center border-0"
          >
            <label 
              :for="'checkboxPlaylistExport' + index" 
              class="form-check-label"
            >
              <span>
                {{ playlist.title }}
                <i 
                  v-show="playlist.local" 
                  class="mdi mdi-star mdi-icon-orange"
                ></i>
              </span>
            </label>
            <input 
              v-model="playlist.isExported" 
              :id="'checkboxPlaylistExport' + index" 
              type="checkbox" 
              class="ms-auto" 
            >
          </li>
        </ul>
        <a 
          href="" 
          @click.prevent="handleExportCopyToClipboard"
        >
          Copy to clipboard
        </a>
      </template>
    </Modal>
  </teleport>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import Modal from './Modal.vue'
import useYoutube from '../use-youtube'
import useUI from '../use-UI'
import useStore from '../use-store'
import { debounce } from 'lodash'

export default {
  components: {
    Modal,
  },
  setup(props) {
    let exportEl = ref(null);
    let playlistId = ref('');
    let searchString = ref('');
    let appUrl = "https://ytplay.netlify.app"

    let { 
      playlists,
      addPlaylistToPlaylists, 
      searchRemote,
      loadPlaylists 
    } = useYoutube();

    let {
      compactMode,
      setCompact,
      darkTheme,
      overlayOpacity,
      commentsDuration,
    } = useUI();

    let state = useStore();

    let exportString = computed(() => {
      let playlistsId = playlists.value
        .filter(item => item.isExported)
        .map(item => item.id)
      return `${appUrl}/playlist/${playlistsId.join(',')}`
    });

    let debounceFilterInput = debounce(e => {
      state.filter = e.target.value;
    }, 200)

    function handleSearch() {
      searchRemote(searchString.value);
    }

    function handleExportCopyToClipboard() {
      exportEl.value.select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    }

    return {
      exportEl,
      playlistId,
      searchString,
      overlayOpacity,
      state,
      // youtube
      playlists,
      addPlaylistToPlaylists,
      setCompact,
      compactMode,
      darkTheme,
      handleExportCopyToClipboard,
      searchRemote,
      exportString,
      commentsDuration,
      handleSearch,
      debounceFilterInput,
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

.dropdown-menu .form-control {
  background: var(--background)
}

input[type=checkbox] {
  transform: scale(1.25);
}

.mdi-icon-orange:before {
  color: orange;
}
</style>
