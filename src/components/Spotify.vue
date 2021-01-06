<template>
	<div class="rounded">
		
	</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useYoutube from '../use-youtube.js'
import useYoutubePlayer from '../use-youtube-player.js'
import useUI from '../use-UI.js'
import axios from 'axios'
import { createUrl } from '../tools.js'

export default {
	setup(props) {
    let clientId = '9913b1c9730a485090db34513d4b3d3a';
    let redirectUri = 'http://localhost:8080/spotify';
    // let herokuRemote = 'https://youtube-vue-server.herokuapp.com/spotifyvue/'
    let herokuRemote = 'http://localhost:3000/spotifyvue/login'
    let route = useRoute();

    let query = {
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
    }

    let queryUrl = createUrl('https://accounts.spotify.com/authorize?', query);

    if (!route.query.code) {
      window.location.href = queryUrl;
    }
    else {
      axios.get(herokuRemote + '?code=' + route.query.code);
    }
		
		return {
			
		}
	}
}
</script>

<style scoped>

</style>
