import { ref, onMounted } from 'vue'
import axios from 'axios'
import createUrl from './tools.js'

let googleApiUrl = 'https://www.googleapis.com/youtube/v3/'
let apiKey = 'AIzaSyCVH7XmPcXi3HW0OjtDCQ2h2VDtlf6EE4o'

let playlists = ref([]);
let channelPlaylists = ref([]);
let searchRes = ref([]);
let comments = ref([]);

export default function useYoutube() {

	// YOUTUBE API

	async function getPlaylist(playlist, id) {
		let query = {
			part: 'snippet',
			playlistId: id,
			key: apiKey,
			maxResults: 50,
		}
		let queryUrl = createUrl(googleApiUrl+'playlistItems?', query);

		let res = await axios.get(queryUrl);
		playlist.items.value = res.data.items.filter(item => 
			item.snippet.title != "Private video"
		);

		while (res.data.nextPageToken) {
			query.pageToken = res.data.nextPageToken;
			queryUrl = createUrl(googleApiUrl+'playlistItems?', query);

			res = await axios.get(queryUrl);
			playlist.items.value = playlist.items.value.concat(res.data.items.filter(item => 
				item.snippet.title != "Private video"
			));
		}
		_getPlaylistProperties(playlist, id);
	}

	async function _getPlaylistProperties(playlist, id) {
		let query = {
			part: 'snippet',
			id: id,
			key: apiKey,
		}

		let queryUrl = createUrl(googleApiUrl+'playlists?', query);

		let res = await axios.get(queryUrl);
		playlist.title.value = res.data.items[0].snippet.title;
	}

	async function getChannelPlaylists(id) {
		let query = {
			part: 'snippet',
			channelId: id,
			key: apiKey,
			maxResults: 50,
		}
		let queryUrl = createUrl(googleApiUrl+'playlists?', query);
		let res = await axios.get(queryUrl);
		channelPlaylists = res.data.items;
		for (let i of channelPlaylists) {
			addPlaylist(i.id, i.snippet.title)
		}
	}

	async function getComments(videoId) {
		let query = {
			part: 'snippet',
			videoId: videoId,
			key: apiKey,
			maxResults: 50,
		}
		let queryUrl = createUrl(googleApiUrl+'commentThreads?', query);
		let res = await axios.get(queryUrl);
		comments.value = res.data.items;
	}

	function addPlaylist(id, local) {
		let playlist = {
			id: id,
			local: local || 0,
			title: ref([]),
			items: ref([]),
		}
		getPlaylist(playlist, id);
		playlists.value.push(playlist);
		// savePlaylists();
	}

	function addSavedPlaylists() {
		let pl = loadPlaylists();
		for (let p of pl) {
			addPlaylist(p.id, true);
		}
	}

	function removePlaylist(playlist) {
		let index = playlists.value.indexOf(playlist);
		playlists.value.splice(index, 1);
		savePlaylists();
	}

	async function search(value) {
		let query = {
			part: 'snippet',
			q: value,
			key: apiKey,
			maxResults: 50,
		}
		let queryUrl = createUrl(googleApiUrl+'search?', query);

		let res = await axios.get(queryUrl);
		searchRes.value = res.data.items.filter(item => item.id.kind == "youtube#video");
	}

	function move(playlist, dir) {
		let index = playlists.value.indexOf(playlist);
		if ((index == 0 && dir == -1) || (index == playlists.value.length && dir == 1)) return;
		let to = index + dir;
		let i = playlists.value.splice(index, 1);
		playlists.value.splice(to, 0, i[0]);
	}

	function findPlaylistIndex(id) {
		return playlists.value.findIndex(item => item.id == id)
	}

	function findVideoIndex(playlistIndex, video) {
		return playlists.value[playlistIndex].items.findIndex(item => item.snippet == video);
	}

	function findVideoElement(video) {
		for (let i of playlists.value) {
			let index = i.items.findIndex(item => item.snippet == video);
		}
	}

	// LOCAL STORAGE

	function savePlaylist(playlist) {
		let savedPlaylists = loadPlaylists();
		if (!savedPlaylists.some(item => item.id == playlist.id)) {
			savedPlaylists.push(playlist);
			savedPlaylists = JSON.stringify(savedPlaylists, ['id', 'title'], 1);
			localStorage.setItem('playlists', savedPlaylists);
		}
	}

	function savePlaylists() {
		let pl = JSON.stringify(playlists.value, ['id', 'title'], 1);
		localStorage.setItem('playlists', pl);
	}

	function loadPlaylists() {
		let pl = localStorage.getItem('playlists');
		pl = JSON.parse(pl);
		return pl || [];
	}

	function loadPlaylistsRequest(request) {
		for (let i of request) {
			addPlaylist(i);
		}
	}

	return {
		playlists,
		getPlaylist,
		addPlaylist,
		addSavedPlaylists,
		getChannelPlaylists,
		loadPlaylists,
		loadPlaylistsRequest,
		removePlaylist,
		move,
		search,
		searchRes,
		findVideoElement,
		findPlaylistIndex,
		findVideoIndex,
		getComments,
		comments,
	}

}
