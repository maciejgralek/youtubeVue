import { ref, onMounted, shallowRef } from 'vue'
import axios from 'axios'
import createUrl from './tools.js'

let googleApiUrl = 'https://www.googleapis.com/youtube/v3/'
let apiKey = 'AIzaSyCVH7XmPcXi3HW0OjtDCQ2h2VDtlf6EE4o'
let googleApiPlaylistItems = googleApiUrl + 'playlistItems?';
let googleApiPlaylists = googleApiUrl + 'playlists?';
let googleApiCommentThreads = googleApiUrl + 'commentThreads?';

let playlists = ref([]);
let channelPlaylists = ref([]);
let searchRes = ref([]);
let comments = ref([]);
let commentsNextPageToken = null;
let searchNextPageToken = null;
let searchLast = "";

export default function useYoutube() {

	// YOUTUBE API

	async function getPlaylistAll(playlist, id) {
		let query = {
			part: 'snippet',
			playlistId: id,
			key: apiKey,
			maxResults: 50,
		}
		let queryUrl = createUrl(googleApiPlaylistItems, query);

		let res = await axios.get(queryUrl);
		playlist.items.value = res.data.items.filter(item => 
			item.snippet.title != "Private video"
		);

		while (res.data.nextPageToken) {
			query.pageToken = res.data.nextPageToken;
			queryUrl = createUrl(googleApiPlaylistItems, query);

			res = await axios.get(queryUrl);
			playlist.items.value = playlist.items.value.concat(res.data.items.filter(item => 
				item.snippet.title != "Private video"
			));
		}
		_getPlaylistProperties(playlist, id);
	}

	async function getPlaylist(playlist, nextPage) {
		if (nextPage && !playlist.nextPageToken) return;

		let query = {
			part: 'snippet',
			playlistId: playlist.id,
			key: apiKey,
			maxResults: 50,
		}
		if (nextPage && playlist.nextPageToken) {
			query.pageToken = playlist.nextPageToken;
		}
		let queryUrl = createUrl(googleApiPlaylistItems, query);

		playlist.nextPageToken = null;

		let res = await axios.get(queryUrl);

		if (nextPage) {
			playlist.items = playlist.items.concat(res.data.items.filter(item => 
				item.snippet.title != "Private video"
			));
		}
		else {
			playlist.items.value = res.data.items.filter(item => 
				item.snippet.title != "Private video"
			);
			_getPlaylistProperties(playlist);
		}

		playlist.nextPageToken = res.data.nextPageToken;
	}

	async function _getPlaylistProperties(playlist) {
		let query = {
			part: 'snippet',
			id: playlist.id,
			key: apiKey,
		}

		let queryUrl = createUrl(googleApiPlaylists, query);

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
		let queryUrl = createUrl(googleApiPlaylists, query);
		let res = await axios.get(queryUrl);
		channelPlaylists = res.data.items;
		for (let i of channelPlaylists) {
			addPlaylist(i.id, i.snippet.title)
		}
	}

	async function getComments(videoId, nextPage) {
		if (nextPage && !commentsNextPageToken) return;

		let query = {
			part: 'snippet',
			videoId: videoId,
			key: apiKey,
			maxResults: 50,
		}
		if (nextPage && commentsNextPageToken) {
			query.nextPageToken = commentsNextPageToken;
		}
		let queryUrl = createUrl(googleApiCommentThreads, query);
		let res = await axios.get(queryUrl);
		if (nextPage && commentsNextPageToken) {
			comments.value = comments.value.concat(res.data.items);
		}
		else {
			comments.value = res.data.items;
		}
		commentsNextPageToken = res.data.nextPageToken;
	}

	function addPlaylist(id, local) {
		let playlist = {
			id: id,
			local: local || 0,
			title: ref(""),
			channel: '',
			items: ref([]),
			nextPageToken: null,
		}
		getPlaylist(playlist);
		return playlist;
	}

	function addSavedPlaylists() {
		let pl = loadPlaylists();
		for (let p of pl) {
			let playlist = addPlaylist(p.id, true);
			playlists.value.push(playlist);
		}
	}

	function addUrlPlaylists(request) {
		for (let i of request) {
			let playlist = addPlaylist(i);
			playlists.value.push(playlist);
		}
	}

	function removePlaylist(playlist) {
		let index = playlists.value.indexOf(playlist);
		playlists.value.splice(index, 1);
	}

	function reloadPlaylist(playlist) {
		let index = findPlaylistIndex(playlist.id);
		let reloadedPlaylist = addPlaylist(playlist.id)
		playlists.value.splice(index, 1, reloadedPlaylist);
	}

	async function search(value, nextPage) {
		searchLast = nextPage ? searchLast : value;
		let query = {
			part: 'snippet',
			q: searchLast,
			key: apiKey,
			maxResults: 50,
		}
		if (nextPage && searchNextPageToken) {
			query.pageToken = searchNextPageToken;
		}
		let queryUrl = createUrl(googleApiUrl+'search?', query);

		let res = await axios.get(queryUrl);
		if (nextPage) {
			searchRes.value = searchRes.value.concat(res.data.items.filter(item => item.id.kind == "youtube#video"));
		}
		else {
			searchRes.value = res.data.items.filter(item => item.id.kind == "youtube#video");
		}
		searchNextPageToken = res.data.nextPageToken;
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

	function deleteSavedPlaylist(playlist) {
		let savedPlaylists = loadPlaylists();
		let index = savedPlaylists.findIndex(item => item.id == playlist.id);
		if (index != -1) {
			savedPlaylists.splice(index, 1);
			savedPlaylists = JSON.stringify(savedPlaylists, ['id', 'title'], 1);
			localStorage.setItem('playlists', savedPlaylists);
		}
	}

	function loadPlaylists() {
		let pl = localStorage.getItem('playlists');
		pl = JSON.parse(pl);
		return pl || [];
	}

	return {
		playlists,
		getPlaylist,
		addPlaylist,
		addSavedPlaylists,
		getChannelPlaylists,
		addUrlPlaylists,
		removePlaylist,
		move,
		reloadPlaylist,
		search,
		searchRes,
		comments,
		getComments,
		findVideoElement,
		findPlaylistIndex,
		findVideoIndex,
		// local
		savePlaylist,
		loadPlaylists,
		deleteSavedPlaylist,
	}

}
