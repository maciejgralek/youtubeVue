<template>
	<div class="rounded">
		<div class="d-flex align-items-center w-100 playlist-header pl-3 py-2 mb-1">
				<!-- <span class="text&#45;light font&#45;weight&#45;bold"> -->
				<span class="font-weight-bold">
					Search
					<span class="badge bg-secondary ml-1">
						{{ items.length }}
					</span>
				</span>
				<div class="ml-auto">
					<div class="dropdown">
						<Icon data-toggle="dropdown" class="" name="dots" width="1.2em" height="1.2em" fill="#303030"/>
						<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
							<li><a class="dropdown-item" href="#">Close search</a></li>
						</ul>
					</div>
				</div>
		</div>
		<div class="playlist-div playlist">
			<ul class="list-unstyled p-3">
				<li 
					v-for="(item, index) in items" 
					@click="handleClickPlaylistItem(item)" 
					class="playlist-item text-truncate p-1" 
					:class="{ 'font-weight-bold': item.snippet == currentVideo, 'playlist-item-play': item.snippet == currentVideo}"
					>
					<img 
						:src="item.snippet.thumbnails.default ? item.snippet.thumbnails.default.url : ''" 
						class="pr-2" 
						width="80" 
						height="50" 
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
import useStore from '../use-store.js'

export default {
	components: {
		Icon
	},
	props: {
		items: Array,
	},
	setup(props) {

		// COMPOSITION

		let { 
			removePlaylist, 
			move 
		} = useYoutube();

		let { 
			currentVideo, 
			play,
			loadVideo,
		} = useYoutubePlayer();

		let state = useStore();

		// COMPUTED

		let filteredPlaylist = computed(() => {
			let regexp = new RegExp(state.filter, "i");
			return props.playlist.items.filter(item => item.snippet.title.search(regexp) >= 0);
		})

		// METHODS

		function handleClickPlaylistItem(video) {
			if (video != currentVideo.value) {
				loadVideo(video);
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
