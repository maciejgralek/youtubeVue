import { ref } from 'vue'
import YouTubePlayer from 'youtube-player';
import useYoutube from './use-youtube.js'
import useUI from './use-UI.js'
import useStoreSettings from './use-store-settings'
import {getRandomInteger} from './tools'

const playerStates = {
	UNSTARTED: -1,
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 4,
}

const playerPlaymodes = {
	NEXT: 1,
	SHUFFLE: 2,
	REPEAT: 3,
}

let currentVideo = ref({});
let currentPlaylistId = ref("");
let currentTime = ref(null);
let duration = ref(null);
let playerState = ref(-1);
let playerWindowState = ref(1);
let _playerDefaultRight = 10;
let _playerDefaultBottom = 96;
let _playerDefaultWidth = 320;
let _playerDefaultHeight = 180;
let timer = null;
let volume = ref(0);
let playMode = ref(playerPlaymodes.NEXT);
let loadVideoFunction = null;
let playFunction = null;

let { 
	restoreSettings 
} = useStoreSettings('Player', { playMode });

restoreSettings('Player');

let { 
	getCommentsRemote,
	playlists,
	findPlaylistIndex,
	findVideoIndex,
} = useYoutube();

let { 
	showCommentsPause, 
	playerHeight,
} = useUI();


let player = YouTubePlayer('video-player', {
	width: _playerDefaultWidth,
	height: _playerDefaultHeight,
});	

player.getVolume().then((res) => {
	volume.value = res;
});

function setYoutubeWindow(state) {
	let size;
	if (state == 3) {
		if (playerWindowState.value == 1) 
			size = 2;
		else
			size = 1;
	}
	else {
		size = state;
	}
	if (size == 1) {
		player.getIframe().then(el => {
			el.style.transition = "right 0.3s,bottom 0.3s";
			player.setSize(_playerDefaultWidth, _playerDefaultHeight);
			el.style.right = _playerDefaultRight+"px";
			el.style.bottom = _playerDefaultBottom+"px";
			playerWindowState.value = 1;
		});
	}
	else if (size == 2) {
		let w = document.body.clientWidth/1.8;
		let h = window.innerHeight/1.8;
		let l = (document.body.clientWidth - w)/2
		let t = (window.innerHeight - h)/2 + playerHeight.value/2 + 35;
		player.getIframe().then(el => {
			el.style.transition = "right 0.3s,bottom 0.3s";
			player.setSize(w, h);
			el.style.right = l+"px";
			el.style.bottom = t+"px";
			playerWindowState.value = 2;
		});
	}
}

// EVENTS

window.addEventListener('resize', () => {
	if (playerWindowState.value == 2) {
		setYoutubeWindow(playerWindowState.value);
	}
})

function next() {
	if (playMode.value == playerPlaymodes.NEXT) {
		let playlistIndex = findPlaylistIndex(currentPlaylistId.value);
		let index = findVideoIndex(playlistIndex, currentVideo.value);
		if (index >= playlists.value[playlistIndex].items.length - 1) {
			index = 0;
		}
		else {
			index = index + 1;
		}
		return playlists.value[playlistIndex].items[index].snippet;
	}
	else if (playMode.value == playerPlaymodes.SHUFFLE) {
		let playlistIndex = findPlaylistIndex(currentPlaylistId.value);
		let index = getRandomInteger(0, playlists.value[playlistIndex].items.length - 1);
		return playlists.value[playlistIndex].items[index].snippet;
	}
	else if (playMode.value == playerPlaymodes.REPEAT) {
		return currentVideo.value;
	}
}

player.on('stateChange', ev => {
	if (ev.data == playerStates.PLAYING) {
		player.getDuration().then(time => {
			duration.value = Math.floor(time);
		});
		playerState.value = 1;
		timer = setInterval(() => {
			player.getCurrentTime().then(time => { 
				currentTime.value = time
			});
		}, 100);
		showCommentsPause.value = true;
	}
	if (ev.data == playerStates.PAUSED) {
		playerState.value = 2;
		showCommentsPause.value = false;
	}
	if (ev.data == playerStates.ENDED) {
		playerState.value = 0;
		clearInterval(timer);
		let video = null;
		if (playMode.value == playerPlaymodes.NEXT) {
			video = next();
			loadVideoFunction(video);
			playFunction();
		}
		else if (playMode.value == playerPlaymodes.SHUFFLE) {
			video = next();
			loadVideoFunction(video);
			playFunction();
		}
		else if (playMode.value == playerPlaymodes.REPEAT) {
			playFunction();
		}
		// play next
	}
})

export default function useYoutubePlayer() {
	function play() {
		player.playVideo();
	}

	playFunction = play;

	function stop() {
		player.stopVideo();
		currentVideo.value = null;
	}

	function pause() {
		player.pauseVideo();
	}

	function togglePlayPause() {
		if (playerState.value == 2) {
			play();
		}
		else if (playerState.value == 1) {
			pause();
		}
	}

	function seekTo(seconds) {
		player.seekTo(seconds);
	}

	function setVolume(value) {
		player.setVolume(value).then(() => {
			volume.value = value;
		});
	}

	function loadVideo(video) {
		let id;
		if (video.resourceId) {
			id = video.resourceId.videoId;
		}
		else {
			id = video.id.videoId;
		}
		player.loadVideoById(id).then(() => {
			getCommentsRemote(id, false);
			if (video.resourceId) {
				currentVideo.value = video;
			}
			else {
				currentVideo.value = video.snippet;
			}
		});
	}

	loadVideoFunction = loadVideo;

	function getTime() {
		return player.getCurrentTime();
	}

	return {
		// ref
		currentVideo,
		currentPlaylistId,
		currentTime,
		duration,
		volume,
		playerState,
		playerWindowState,
		// control
		play,
		stop,
		pause,
		togglePlayPause,
		seekTo,
		next,
		playMode,
		setVolume,
		loadVideo,
		getTime,
		setYoutubeWindow,
	}
}
