<template>
  <div class="playlist-header d-flex align-items-center pl-3 py-2 mb-1" >
    <span class="font-weight-bold">
      {{ playlist.title }} 
      <span class="badge bg-secondary mx-1">
        {{ playlist.items.length }}
      </span>
      <i v-if="playlist.local" class="mdi mdi-star mdi-icon-playlist"></i>
    </span>
    <div class="ml-auto">
      <PlaylistDropdown 
        :playlist="playlist"
        @close-playlist="handleClosePlaylist"
        @reload-playlist="handleReloadPlaylist"
        @save-playlist="handleSavePlaylist"
        @delete-playlist="handleDeletePlaylist"
        @edit-in-youtube="handleEditInYoutube"
      />
    </div>
  </div>

  <div v-scroll="handleScroll" class="playlist p-3">
    <div v-show="playlist.isLoading">
      <div class="d-flex justify-content-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <div v-show="!playlist.filteredItems.length && !playlist.isLoading">
      No items
    </div>
    <ul class="list-unstyled">
      <transition-group name="list" tag="p">
        <li 
          v-for="(item, index) in playlist.filteredItems" 
          :ref="el => { playlist.items.length && (playlist.items[index].snippet.el = el) }"
          @click="handleClickPlaylistItem(item)" 
          :key="item.id"
          :data-tippy-content="item.snippet.title"
          :class="classListPlaylistItem(item)"
          class="playlist-item text-truncate p-1" 
        >
          <img 
            :src="srcThumbnail(item)" 
            :width="thumbnailWidth"
            :height="thumbnailHeight"
            alt=""
            class="pr-2" 
          >
          {{ item.snippet.title }}
        </li>
      </transition-group>
    </ul>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUpdated } from 'vue'
import PlaylistDropdown from './PlaylistDropdown.vue'
import useYoutube from '../use-youtube'
import useYoutubePlayer from '../use-youtube-player'
import useUI from '../use-UI'
import useStore from '../use-store'
import tippy, { followCursor } from 'tippy.js';

export default {
  components: {
    PlaylistDropdown,
  },
  props: {
    playlist: Object,
  },
  setup(props) {

    // COMPOSITION

    let { 
      getPlaylistRemote,
      removePlaylist, 
      move,
      reloadPlaylist,
      showComments,
      savePlaylist,
      deleteSavedPlaylist,
    } = useYoutube();

    let { 
      currentVideo, 
      play,
      loadVideo,
      currentPlaylist,
    } = useYoutubePlayer();

    let {
      thumbnailWidth,
      thumbnailHeight,
    } = useUI();

    let state = useStore();

    // METHODS

    onUpdated(() => {
      tippy('[data-tippy-content]', {
        arrow: true,
        delay: [1000, null],
        placement: 'right',
        plugins: [followCursor],
        followCursor: 'initial',
      });
    })

    function classListPlaylistItem(item) {
      if (!currentVideo.value.resourceId) return;
      return {
        'font-weight-bold': item.snippet == currentVideo.value,
        'playlist-item-play': item.snippet == currentVideo.value,
      }
    } 

    function srcThumbnail(item) {
      return item.snippet.thumbnails.default ? item.snippet.thumbnails.default.url : '';
    }

    function handleScroll(ev) {
      if (ev.target.scrollTop >= ev.target.scrollHeight - ev.target.offsetHeight) {
        getPlaylistRemote(props.playlist, true);
      }
    }

    function handleReloadPlaylist() {
      reloadPlaylist(props.playlist);
    }

    function handleClosePlaylist() {
      removePlaylist(props.playlist);
    }

    function handleEditInYoutube() {
      window.open("http://youtube.com/playlist?list=" + props.playlist.id);
    }

    function handleSavePlaylist() {
      savePlaylist(props.playlist);
    }

    function handleDeletePlaylist() {
      deleteSavedPlaylist(props.playlist);
    }

    function handleClickPlaylistItem(video) {
      if (video.snippet != currentVideo.value) {
        currentPlaylist.value = props.playlist;
        loadVideo(video.snippet);
        play();
      }
    }

    return {
      currentVideo,
      removePlaylist,
      // filteredPlaylist,
      move,
      play,
      handleClickPlaylistItem,
      handleReloadPlaylist,
      handleScroll,
      handleSavePlaylist,
      handleDeletePlaylist,
      handleClosePlaylist,
      handleEditInYoutube,
      thumbnailWidth,
      thumbnailHeight,
      classListPlaylistItem,
      srcThumbnail,
    }
  }
}
</script>

<style scoped lang="scss">
@import '../theme.scss';
@import 'bootstrap/scss/bootstrap.scss';

.playlist {
  max-height: 70vh;
  overflow-y: scroll;
}
.playlist-header {
  font-size: 1.2em;
}
.playlist-item {
  cursor: pointer;
}
.playlist-item:hover {
  cursor: pointer;
  color: $dark;
  background-color: $gray-200;
}
.playlist-item-play {
  color: $dark;
  background-color: $gray-200;
}
.playlist::-webkit-scrollbar-track {
  background-color: var(--scroll-track);
}
.playlist::-webkit-scrollbar {
  width: 8px;
  background-color: var(--scroll);
}
.playlist::-webkit-scrollbar-thumb {
  background-color: var(--scroll-thumb);
}

// MDI

.mdi-dropdown-icon:before {
  font-size: 1.2em;
  line-height: normal;
}
.mdi-icon-playlist:before {
  color: orange;
}

// TRANSITION

.list-enter-active {
  transition: all .3s ease;
}
.list-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.list-enter-from {
  transform: translateX(10px);
  opacity: 0;
}
.list-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
