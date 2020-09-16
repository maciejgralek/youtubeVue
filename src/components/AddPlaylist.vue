<template>

	<div class="row align-items-center py-3">
		<div class="col-3 border-right">
			<input v-model="state.filter" type="search" class="form-control form-control-sm" placeholder="Filter">
		</div>

		<div class="col ml-auto">
			<input v-model="searchString" type="search" class="form-control form-control-sm" placeholder="">
		</div>
		<div class="col-auto border-right">
			<button @click="search(searchString)" class="btn btn-primary btn-sm">Search</button>
		</div>

		<!-- <div class="col&#45;3 ml&#45;auto"> -->
		<!-- 	<input v&#45;model="playlistId" type="email" class="form&#45;control form&#45;control&#45;sm" placeholder="Playlist id"> -->
		<!-- </div> -->
		<!-- <div class="col&#45;auto border&#45;right"> -->
		<!-- 	<button @click="addPlaylist(playlistId)" class="btn btn&#45;primary btn&#45;sm">Add Playlist</button> -->
		<!-- </div> -->

		<div class="col-auto ml-auto border-left pr-1">
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
					<ul class="list-group list-group-flush px-3">
						<li v-for="item in savedPlaylists" class="list-group-item px-0 border-0">
							{{ item.title }}
							<i class="mdi mdi-star mdi-icon-addplaylist"></i>
						</li>
						<template v-for="item in playlists">
							<li v-if="!item.local" class="list-group-item px-0 border-0">
								{{ item.title }}
							<i class="mdi mdi-star" style="color: #909090"></i>
							</li>
						</template>
					</ul>
				</div>
			</div>
		</div>
		<div class="col-auto pr-3">
			<i @click="setCompact" class="mdi mdi-view-headline mdi-24px"></i>
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
		let searchString = ref('');
		let savedPlaylists = ref([]);

		let { 
			playlists,
			addPlaylist, 
			search, 
			loadPlaylists 
		} = useYoutube();

		let {
			setCompact,
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
			search,
			savedPlaylists,
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
