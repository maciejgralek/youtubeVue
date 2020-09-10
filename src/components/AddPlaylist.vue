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

		<div class="col-3 ml-auto">
			<input v-model="playlistId" type="email" class="form-control form-control-sm" placeholder="Playlist id">
		</div>
		<div class="col-auto">
			<button @click="addPlaylist(playlistId)" class="btn btn-primary btn-sm">Add Playlist</button>
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

		let { addPlaylist, search } = useYoutube();

		let {
			setCompact,
		}	= useUI();

		let state = useStore();

		function setColumns(value) {
			emit('set-columns', value)
		}

		return {
			playlistId,
			searchString,
			state,
			// youtube
			addPlaylist,
			setColumns,
			setCompact,
			search,
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
