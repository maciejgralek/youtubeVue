<template>

	<div class="row align-items-center py-3 pt-4 pr-3">
		<div class="col-4 ml-auto border-right">
			<input v-model="state.filter" type="search" class="form-control form-control-sm" placeholder="Filter">
		</div>

		<div class="col-4">
				<input v-model="searchString" type="search" class="form-control form-control-sm" placeholder="">
			<!-- <div class="input&#45;group"> -->
			<!-- 	<input v&#45;model="searchString" type="search" class="form&#45;control form&#45;control&#45;sm" placeholder=""> -->
			<!-- 	<button class="btn btn&#45;secondary btn&#45;sm dropdown&#45;toggle" type="button" data&#45;toggle="dropdown" aria&#45;expanded="false">Type</button> -->
			<!-- 	<ul class="dropdown&#45;menu"> -->
			<!-- 		<li><a class="dropdown&#45;item" href="#">Video</a></li> -->
			<!-- 		<li><a class="dropdown&#45;item" href="#">Playlist</a></li> -->
			<!-- 	</ul> -->
			<!-- </div> -->
		</div>
		<div class="col-auto">
			<button @click="search(searchString)" class="btn btn-primary btn-sm">Search</button>
		</div>

		<!-- <div class="col&#45;3 ml&#45;auto"> -->
		<!-- 	<input v&#45;model="playlistId" type="email" class="form&#45;control form&#45;control&#45;sm" placeholder="Playlist id"> -->
		<!-- </div> -->
		<!-- <div class="col&#45;auto border&#45;right"> -->
		<!-- 	<button @click="addPlaylist(playlistId)" class="btn btn&#45;primary btn&#45;sm">Add Playlist</button> -->
		<!-- </div> -->

		<div class="col-auto ml-auto pr-1">
			<div class="dropdown">
				<i @click="setCompact" class="mdi mdi-playlist-music mdi-24px" id="dropdownMenuButton" data-toggle="dropdown"></i>
				<div class="dropdown-menu" style="width: 500px">
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
					<div class="dropdown-divider p-0"></div>
					<ul class="list-group">
						<li class="list-group-item d-flex border-0">
							<label @click.prevent="setCompact" class="form-check-label">
								Compact view
							</label>
							<input v-model="compactMode" @click="setCompact" class="ml-auto" type="checkbox" id="checkboxCompactMode">
						</li>
						<li class="list-group-item d-flex align-items-center border-0">
							<label @click.prevent="setCompact" class="form-check-label">
								Dark theme
							</label>
							<input v-model="currentTheme" @click="setTheme" true-value="dark" false-value="light" class="ml-auto" type="checkbox" id="checkboxCompactMode">
						</li>
					</ul>
					<!-- <div class="dropdown&#45;divider p&#45;0"></div> -->
					<!-- <ul class="list&#45;group list&#45;group&#45;flush"> -->
					<!-- 	<li v&#45;for="item in savedPlaylists" class="list&#45;group&#45;item list&#45;group&#45;item&#45;action px&#45;3 border&#45;0"> -->
					<!-- 		{{ item.title }} -->
					<!-- 		<i class="mdi mdi&#45;star mdi&#45;icon&#45;addplaylist"></i> -->
					<!-- 	</li> -->
					<!-- 	<template v&#45;for="item in playlists"> -->
					<!-- 		<li v&#45;if="!item.local" class="list&#45;group&#45;item list&#45;group&#45;item&#45;action px&#45;3 border&#45;0"> -->
					<!-- 			{{ item.title }} -->
					<!-- 		</li> -->
					<!-- 	</template> -->
					<!-- </ul> -->
				</div>
			</div>
		</div>
		<!-- <div class="col&#45;auto px&#45;0"> -->
		<!-- 	<i @click="setCompact" class="mdi mdi&#45;view&#45;headline mdi&#45;24px"></i> -->
		<!-- </div> -->
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
		let searchString = ref('');
		let savedPlaylists = ref([]);

		let { 
			playlists,
			addPlaylist, 
			search, 
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
