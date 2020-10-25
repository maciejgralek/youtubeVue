<template>
  <transition name="fade">
    <div 
      v-if="playerWindowState == 2" 
      class="backdrop" 
      :style="{ opacity: (100-overlayOpacity)/100 }"
    >
    </div>
  </transition>

  <AddPlaylist />

  <div class="row g-4 pt-1" :class="'row-cols-lg-' + columns">
    <div v-if="searchRes.length" class="col search">
      <YoutubeSearch :items="searchRes" />
    </div>

    <div 
      v-for="(playlist, index) in playlists" 
      class="col text-left playlist"
    >
      <YoutubePlaylist :playlist="playlist"/>
    </div>
  </div>

  <transition name="fade-comment" mode="out-in">
    <YoutubeComments v-show="comments.length && showComments && showCommentsPause" />
  </transition>

  <div :style="styleBottomMargin">
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import AddPlaylist from './AddPlaylist.vue'
import YoutubePlaylist from './YoutubePlaylist.vue'
import YoutubeSearch from './YoutubeSearch.vue'
import useYoutube from '../use-youtube'
import useYoutubePlayer from '../use-youtube-player'
import YoutubeComments from './YoutubeComments.vue'
import useUI from '../use-UI'

export default {
  components: {
    AddPlaylist,
    YoutubePlaylist,
    YoutubeSearch,
    YoutubeComments,
  },
  props: {
    params: String,
  },
  setup(props) {

    // DATA

    let columns = ref(3);
    let playlistRequest = null;

    if (props.params) {
      playlistRequest = props.params.split(',');
    }

    // COMPOSITION

    let { 
      playlists, 
      loadPlaylists,
      addUrlPlaylists,
      addSavedPlaylists,
      searchRes,
      comments,
    } = useYoutube();

    let {
      playerWindowState,
    } = useYoutubePlayer();

    let {
      showComments,
      showCommentsPause,
      playerHeight,
      overlayOpacity,
    } = useUI();

    // METHODS

    onMounted(() => {
      addSavedPlaylists();
      if (playlistRequest) {
        addUrlPlaylists(playlistRequest);
      }
    })

    let styleBottomMargin = computed(() => {
      return { 
        'min-height': playerHeight + 20 + (showComments.value && showCommentsPause.value ? 150 : 0) + 'px' 
      }
    })

    return {
      playlists,
      columns,
      searchRes,
      playerWindowState,
      comments,
      showComments,
      showCommentsPause,
      playerHeight,
      overlayOpacity,
      styleBottomMargin,
    }
  }
}
</script>

<style scoped>
.backdrop {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #000000;
    pointer-events: none;
    z-index: 1000;
}

.search {
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: var(--border-color);
}

.playlist {
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: var(--border-color);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .7s !important;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0 !important;
}

.fade-comment-enter-active, .fade-comment-leave-active {
  transition: opacity .3s !important;
}
.fade-comment-enter-from, .fade-comment-leave-to {
  opacity: 0 !important;
}
</style>
