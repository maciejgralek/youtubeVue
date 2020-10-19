<template>
	<div class="row align-items-center py-3 pt-4 pr-3">
		<div class="col-4 ml-auto border-right">
			<input v-model="state.filter" type="search" class="form-control form-control-sm" placeholder="Filter">
		</div>

		<div class="col-4">
				<input v-model="searchString" type="search" class="form-control form-control-sm" placeholder="">
		</div>

		<div class="col-auto">
			<!-- <button @click="searchRemote(searchString)" class="btn btn&#45;primary btn&#45;sm">Search</button> -->
			<button @click="" class="btn btn-primary btn-sm">Search</button>
		</div>

		<div class="col-auto ml-auto pr-1">
			<div class="dropdown">
				<i class="mdi mdi-playlist-music mdi-24px" id="dropdownMenuButton" data-toggle="dropdown"></i>
				<div class="dropdown-menu dropdown-menu-right" style="width: 500px">
					<div class="row px-3 py-2">
						<div class="col">
							<input v-model="playlistId" type="email" class="form-control form-control-sm" placeholder="Playlist id">
						</div>
						<div class="col-auto">
							<button @click="addPlaylistToPlaylists(playlistId)" class="btn btn-primary btn-sm">
								Add Playlist
							</button>
						</div>
					</div>
					<ul class="list-group">
						<li class="list-group-item d-flex align-items-center border-0">
							<label for="checkboxCompactMode" class="form-check-label">
								Compact view
							</label>
							<input v-model="compactMode" class="ml-auto" type="checkbox" id="checkboxCompactMode">
						</li>
						<li class="list-group-item d-flex align-items-center border-0">
							<label for="checkboxDarkMode" class="form-check-label">
								Dark theme
							</label>
							<input v-model="currentTheme" class="ml-auto" type="checkbox" id="checkboxDarkMode">
						</li>
						<li class="list-group-item d-flex align-items-center border-0">
							<label @click="setTheme" class="form-check-label">
								Overlay opacity
							</label>
							<input v-model.number="overlayOpacity" class="ml-auto" type="range" min="0" max="100" step="10" id="checkboxCompactMode">
						</li>
						<!-- <li class="list&#45;group&#45;item d&#45;flex align&#45;items&#45;center border&#45;0"> -->
						<!-- 		<a href=""> -->
						<!-- 			Export all playlists as URL -->
						<!-- 		</a> -->
						<!-- </li> -->
						<!-- <li class="list&#45;group&#45;item d&#45;flex align&#45;items&#45;center border&#45;0"> -->
						<!-- 		<a href=""> -->
						<!-- 			Export saved playlists as URL -->
						<!-- 		</a> -->
						<!-- </li> -->
					</ul>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
import { ref, onMounted } from 'vue'
import useYoutube from '../use-youtube.js'
import useUI from '../use-UI.js'
import useStore from '../use-store.js'

export default {
	setup(props, { emit }) {
		let playlistId = ref('');
		let searchString = ref('');
		let savedPlaylists = ref([]);

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
		}	= useUI();

		let state = useStore();

		onMounted(() => {
			savedPlaylists.value = loadPlaylists();
		})

		return {
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
			searchRemote,
			savedPlaylists,
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
