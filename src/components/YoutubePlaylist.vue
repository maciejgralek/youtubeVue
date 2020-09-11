<template>
	<div class="rounded">
		<div class="d-flex align-items-center w-100 playlist-header pl-3 py-2 mb-1">
				<!-- <span class="text&#45;light font&#45;weight&#45;bold"> -->
				<span class="font-weight-bold">
					{{ playlist.title }} 
					<span class="badge bg-secondary ml-1">
						{{ playlist.items.length }}
					</span>
				</span>
				<div class="ml-auto">
					<div class="dropdown">
						<i class="mdi mdi-dots-vertical" style="font-size: 1.45em" data-toggle="dropdown"></i>
						<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
							<li class="align-middle">
								<a class="dropdown-item d-flex align-items-center" href="#">
									<i class="mdi mdi-close mdi-24px pr-1"></i>
									Close playlist
								</a>
							</li>
							<li><hr class="dropdown-divider"></li>
							<li>
								<a class="dropdown-item d-flex align-items-center" href="#">
									<i class="mdi mdi-menu-right mdi-24px pr-1"></i>
									Move to right
								</a>
							</li>
							<li>
								<a class="dropdown-item d-flex align-items-center" href="#">
									<i class="mdi mdi-menu-left mdi-24px pr-1"></i>
									Move to left
								</a>
							</li>
							<li><hr class="dropdown-divider"></li>
							<li>
								<a class="dropdown-item d-flex align-items-center" href="#">
									<i class="mdi mdi-youtube mdi-24px pr-1"></i>
									Open in youtube
								</a>
							</li>
							<li>
								<a class="dropdown-item d-flex align-items-center" href="#">
									<i class="mdi mdi-youtube mdi-24px pr-1"></i>
									Edit in youtube
								</a>
							</li>
						</ul>
					</div>
				</div>
		</div>
		<div class="playlist-div playlist">
		<div v-if="!filteredPlaylist.length" class="p-3">
			No items
		</div>
			<!-- <ul v&#45;else class="playlist list&#45;unstyled text&#45;light p&#45;3"> -->
			<ul v-else class="list-unstyled p-3">
				<li 
					v-for="(item, index) in filteredPlaylist" 
					@click="handleClickPlaylistItem(item.snippet)" 
					class="playlist-item text-truncate p-1" 
					:class="{ 'font-weight-bold': item.snippet == currentVideo, 'playlist-item-play': item.snippet == currentVideo}"
					>
					<img 
						:src="item.snippet.thumbnails.default ? item.snippet.thumbnails.default.url : ''" 
						class="pr-2" 
						:width="thumbnailWidth"
						:height="thumbnailHeight"
						alt=""
						>
					{{ item.snippet.title }}
				</li>
			</ul>
		</div>

	</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Icon from './Icon.vue'
import useYoutube from '../use-youtube.js'
import useYoutubePlayer from '../use-youtube-player.js'
import useUI from '../use-UI.js'
import useStore from '../use-store.js'

export default {
	components: {
		Icon
	},
	props: {
		playlist: Object,
		playlistId: String,
	},
	setup(props) {

		// COMPOSITION

		let { 
			removePlaylist, 
			move,
			showComments,
		} = useYoutube();

		let { 
			currentVideo, 
			play,
			loadVideo,
		} = useYoutubePlayer();

		let {
			thumbnailWidth,
			thumbnailHeight,
		}	= useUI();

		let state = useStore();

		// COMPUTED

		let filteredPlaylist = computed(() => {
			let regexp = new RegExp(state.filter, "i");
			return props.playlist.items.filter(item => item.snippet.title.search(regexp) >= 0);
		})

		// METHODS

		function handleClickPlaylistItem(video) {
			if (video != currentVideo.value) {
				loadVideo(video, props.playlistId);
				play();
			}
		}

		return {
			currentVideo,
			removePlaylist,
			filteredPlaylist,
			move,
			play,
			handleClickPlaylistItem,
			thumbnailWidth,
			thumbnailHeight,
		}
	}
}
</script>

<style scoped lang="scss">
@import '../../node_modules/bootstrap/scss/bootstrap.scss';

.playlist-div {
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
	/* background-color: $dark; */
	background-color: $light;
}
.playlist::-webkit-scrollbar {
    width: 8px;
    background-color: #F5F5F5;
}
.playlist::-webkit-scrollbar-thumb {
    background-color: darken($light, 4);
}
.icon {
	cursor: pointer;
}
</style>
