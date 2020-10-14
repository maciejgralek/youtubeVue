import { ref, onMounted, shallowRef } from 'vue'
import axios from 'axios'
import {createUrl} from './tools.js'

// let googleApiRemote = 'http://localhost:3000/youtubevue/'
let googleApiRemote = 'https://youtube-vue-server.herokuapp.com/youtubevue/'

let playlists = ref([]);
let channelPlaylists = ref([]);
let searchRes = ref([]);
let comments = ref([]);
let commentsNextPageToken = null;
let searchNextPageToken = null;
let searchLast = "";


// YOUTUBE API

async function getPlaylistRemote(playlist, nextPage) {
	if (nextPage && !playlist.nextPageToken) return;

	let query = {
		id: playlist.id,
	}
	if (nextPage && playlist.nextPageToken) {
		query.nextPageToken = playlist.nextPageToken;
	}
	let queryUrl = createUrl(googleApiRemote + 'playlist?', query);

	playlist.nextPageToken = null;

	let res = await axios.get(queryUrl);

	let regexp = /[0-9]?[0-9]?:?[0-9]?[0-9]:[0-9][0-9]/ig;
	for(let video of res.data.items) {
		video.snippet.el = ref(null);
		video.snippet.description = video.snippet.description.replace(regexp, match => {
			return '<a href="">' + match + '</a>';
		});
	}

	if (nextPage) {
		playlist.items = playlist.items.concat(res.data.items.filter(item => 
			item.snippet.title != "Private video"
		));
	}
	else {
		playlist.items.value = res.data.items.filter(item => 
			item.snippet.title != "Private video"
		);
		_getPlaylistPropertiesRemote(playlist);
	}

	playlist.nextPageToken = res.data.nextPageToken;
}

async function _getPlaylistPropertiesRemote(playlist) {
	let query = {
		id: playlist.id,
	}

	let queryUrl = createUrl(googleApiRemote + 'playlists?', query);

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

async function getCommentsRemote(videoId, nextPage) {
	if (nextPage && !commentsNextPageToken) return;

	let query = {
		id: videoId,
	}
	if (nextPage && commentsNextPageToken) {
		query.nextPageToken = commentsNextPageToken;
	}
	let queryUrl = createUrl(googleApiRemote + 'comments?', query);
	try {
		let res = await axios.get(queryUrl);
		if (nextPage && commentsNextPageToken) {
			comments.value = comments.value.concat(res.data.items);
		}
		else {
			comments.value = res.data.items;
		}
		commentsNextPageToken = res.data.nextPageToken;
	}
	catch (err) {
		comments.value = [];
	}
}

async function searchRemote(value, nextPage) {
	searchLast = nextPage ? searchLast : value;
	let query = {
		q: searchLast,
	}
	if (nextPage && searchNextPageToken) {
		query.nextPageToken = searchNextPageToken;
	}
	let queryUrl = createUrl(googleApiRemote + 'search?', query);

	let res = await axios.get(queryUrl);
	if (nextPage) {
		searchRes.value = searchRes.value.concat(res.data.items.filter(item => item.id.kind == "youtube#video"));
	}
	else {
		searchRes.value = res.data.items.filter(item => item.id.kind == "youtube#video");
	}
	searchNextPageToken = res.data.nextPageToken;
}

function addPlaylist(id, local) {
	let playlist = {
		id: id,
		local: local || 0,
		title: ref(""),
		channel: '',
		items: ref([]),
		nextPageToken: null,
		isLoading: ref(false),
	}
	getPlaylistRemote(playlist);
	return playlist;
}

function addPlaylistToPlaylists(id, local) {
	let playlist = addPlaylist(id, local);
	playlists.value.push(playlist);
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
	playlists.value[index] = reloadedPlaylist;
}

function removeSearch() {
	searchRes.value = [];
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

function findVideoIndex(playlist, video) {
	return playlist.items.findIndex(item => item.snippet == video);
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
	playlist.local = 1;
}

function deleteSavedPlaylist(playlist) {
	let savedPlaylists = loadPlaylists();
	let index = savedPlaylists.findIndex(item => item.id == playlist.id);
	if (index != -1) {
		savedPlaylists.splice(index, 1);
		savedPlaylists = JSON.stringify(savedPlaylists, ['id', 'title'], 1);
		localStorage.setItem('playlists', savedPlaylists);
	}
	playlist.local = 0;
}

function loadPlaylists() {
	let pl = localStorage.getItem('playlists');
	pl = JSON.parse(pl);
	return pl || [];
}

export default function useYoutube() {
	return {
		playlists,
		getPlaylistRemote,
		addPlaylistToPlaylists,
		addSavedPlaylists,
		getChannelPlaylists,
		addUrlPlaylists,
		removePlaylist,
		removeSearch,
		move,
		reloadPlaylist,
		searchRemote,
		searchRes,
		comments,
		getCommentsRemote,
		findVideoElement,
		findPlaylistIndex,
		findVideoIndex,
		// local
		savePlaylist,
		loadPlaylists,
		deleteSavedPlaylist,
	}

}
