<template>

	<div class="row align-items-center py-3 pt-4 pr-3">
		<div class="col-4 ml-auto border-right">
			<input v-model="state.filter" type="search" class="form-control form-control-sm" placeholder="Filter">
		</div>

		<div class="col-4">
				<input v-model="searchString" type="search" class="form-control form-control-sm" placeholder="">
		</div>

		<div class="col-auto">
			<button @click="searchRemote(searchString)" class="btn btn-primary btn-sm">Search</button>
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
							<button @click="addPlaylist(playlistId)" class="btn btn-primary btn-sm">
								Add Playlist
							</button>
						</div>
					</div>
					<ul class="list-group">
						<li class="list-group-item d-flex align-items-center border-0">
							<label @click="setCompact" class="form-check-label">
								Compact view
							</label>
							<input v-model="compactMode" @click="setCompact" class="ml-auto" type="checkbox" id="checkboxCompactMode">
						</li>
						<li class="list-group-item d-flex align-items-center border-0">
							<label @click="setTheme" class="form-check-label">
								Dark theme
							</label>
							<input v-model="currentTheme" @click="setTheme" true-value="dark" false-value="light" class="ml-auto" type="checkbox" id="checkboxCompactMode">
						</li>
						<li class="list-group-item d-flex align-items-center border-0">
								<a href="">
									Export all playlists as URL
								</a>
						</li>
						<li class="list-group-item d-flex align-items-center border-0">
								<a href="">
									Export saved playlists as URL
								</a>
						</li>
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
import Icon from './Icon.vue'

export default {
	components: {
		Icon,
	},
	setup(props, { emit }) {
		let playlistId = ref('PL6KKV5307aucIh814g2_yPUztUhLGCPbt');
		let searchString = ref('pearl jam');
		let savedPlaylists = ref([]);

		let { 
			playlists,
			addPlaylist, 
			search, 
			searchRemote,
			loadPlaylists 
		} = useYoutube();

		let {
			compactMode,
			setCompact,
			setTheme,
			currentTheme,
		}	= useUI();

		let state = useStore();

		onMounted(() => {
			savedPlaylists.value = loadPlaylists();
		})

		function setColumns(value) {
			emit('set-columns', value)
		}

		return {
			playlistId,
			searchString,
			state,
			// youtube
			playlists,
			addPlaylist,
			setColumns,
			setCompact,
			setTheme,
			compactMode,
			currentTheme,
			search,
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
