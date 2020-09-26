<template>
	<transition name="fade">
		<div v-if="playerWindowState == 2" class="backdrop"></div>
	</transition>

	<AddPlaylist @set-columns="setColumns" />

	<div class="row g-4 pt-1" :class="'row-cols-' + columns">
		<div v-if="searchRes.length" class="col border-right">
			<YoutubeSearch :items="searchRes" />
		</div>

		<div 
			v-for="(playlist, index) in playlists" 
			class="col text-left playlist"
			>
			<YoutubePlaylist :playlist="playlist" :playlistId="playlist.id"/>
		</div>
	</div>

	<transition name="fade-comment" mode="out-in">
		<YoutubeComments v-show="comments.length && showComments && showCommentsPause" />
	</transition>

	<div :style="{'min-height': playerHeight + 20 + 'px'}"></div>
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
		} = useUI();

		// METHODS

		onMounted(() => {
			addSavedPlaylists();
			if (playlistRequest) {
				addUrlPlaylists(playlistRequest);
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
			playerHeight,
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

.playlist {
	border-right-width: 1px;
	border-right-style: solid;
	border-right-color: var(--border-color);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .7s !important;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-comment-enter-active, .fade-comment-leave-active {
  transition: opacity .3s !important;
}
.fade-comment-enter-from, .fade-comment-leave-to {
  opacity: 0;
}
</style>
