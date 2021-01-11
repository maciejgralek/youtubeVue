<template>
  <div class="row g-4 pt-1 ps-md-2 me-4 me-md-0 row-cols-lg-3">
    <div 
      class="col playlist"
    >
      <SpotifyPlaylist :playlist="playlist" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SpotifyPlaylist from './SpotifyPlaylist.vue'
import useYoutube from '../use-youtube.js'
import useYoutubePlayer from '../use-youtube-player.js'
import useUI from '../use-UI.js'
import useSpotify from '../use-spotify'
import axios from 'axios'
import { createUrl } from '../tools.js'

export default {
  components: {
    SpotifyPlaylist,
  },
  setup(props) {

    let route = useRoute();
    let { 
      authorizeUser,
      accessToken,
      playlist,
      getPlaylist,
      refreshToken,
      getAccessToken,
    } = useSpotify();

    let cookie = document.cookie
      .split('; ')
      .map(item => item.split('='));
    cookie = Object.fromEntries(cookie);

    if (cookie.refreshToken) {
      refreshToken.value = cookie.refreshToken;
      getAccessToken()
    }
    else {
      if (!route.query.access_token) {
        authorizeUser();
      }
      else {
        accessToken.value = route.query.access_token;
        refreshToken.value = route.query.refresh_token;
        document.cookie = "refreshToken=" + route.query.refresh_token;
      }
    }

    return {
      playlist,
    }
  }
}
</script>

<style scoped>
.playlist {
  text-align: left;
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: var(--border-color);
}
</style>
