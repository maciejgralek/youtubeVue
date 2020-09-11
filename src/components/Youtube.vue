<template>
	<transition name="fade">
		<div v-if="playerWindowState == 2" class="backdrop"></div>
	</transition>

	<AddPlaylist @set-columns="setColumns" />

	<div class="row g-4 pt-1" :class="'row-cols-' + columns">
		<div v-if="searchRes.length" class="col border-right">
			<YoutubeSearch :items="searchRes"></YoutubeSearch>
		</div>

		<div 
			v-for="(playlist, index) in playlists" 
			class="col text-left bg-light text-body border-right"
			>
			<YoutubePlaylist :playlist="playlist" :playlistId="playlist.id"/>
		</div>
	</div>

	<YoutubeComments v-show="comments.length && showComments && showCommentsPause"></YoutubeComments>

	<div style="min-height: 90px"></div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import AddPlaylist from './AddPlaylist.vue'
import YoutubePlaylist from './YoutubePlaylist.vue'
import YoutubeSearch from './YoutubeSearch.vue'
import useYoutube from '../use-youtube.js'
import useYoutubePlayer from '../use-youtube-player.js'
import YoutubeComments from './YoutubeComments.vue'
import useUI from '../use-UI.js'
import axios from 'axios'

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
			loadPlaylistsRequest,
			searchRes,
			comments,
		} = useYoutube();

		let {
			playerWindowState,
		} = useYoutubePlayer();

		let {
			showComments,
			showCommentsPause,
		} = useUI();

		// METHODS

		onMounted(() => {
			if (playlistRequest) {
				loadPlaylistsRequest(playlistRequest);
			}
		})

		function setColumns(value) {
			columns.value = value;
		}

		return {
			playlists,
			columns,
			setColumns,
			searchRes,
			playerWindowState,
			comments,
			showComments,
			showCommentsPause,
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.backdrop {
    position: fixed;
    left: 0;
    top: 0;
		width: 100%;
    height: 100%;
    background: #000000;
		opacity: 0.3;
		pointer-events: none;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .7s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
