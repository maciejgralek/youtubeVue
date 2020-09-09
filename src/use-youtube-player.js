import { ref } from 'vue'
import YouTubePlayer from 'youtube-player';
import useYoutube from './use-youtube.js'

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

let player = YouTubePlayer('video-player', {
	width: _playerDefaultWidth,
	height: _playerDefaultHeight,
});	

export default function useYoutubePlayer() {
	let { findPlaylistIndex, findVideoIndex, getComments } = useYoutube();

	function play() {
		player.playVideo();
	}

	function stop() {
		player.stopVideo();
		currentVideo.value = null;
	}

	function pause() {
		player.pauseVideo();
	}

	function loadVideo(video, playlistId) {
		let id;
		if (video.resourceId) {
			id = video.resourceId.videoId;
			currentVideo.value = video;
		}
		else {
			id = video.id.videoId;
			currentVideo.value = video.snippet;
		}
		if (playlistId) currentPlaylistId.value = playlistId;
		player.loadVideoById(id);
		getComments(id);
	}

	function getTime() {
		return player.getCurrentTime();
	}

	function setYoutubeWindow(state) {
		let size;
		if (state == 3) {
			if (playerWindowState.value == 1) 
				size = 2;
			else
				size = 1;
		}
		if (size == 1) {
			player.getIframe().then(el => {
				// el.style.transition = "top 2s,right 2s,bottom 2s,left 2s";
				player.setSize(_playerDefaultWidth, _playerDefaultHeight);
				el.style.left = "";
				el.style.top = "";
				el.style.right = _playerDefaultRight+"px";
				el.style.bottom = _playerDefaultBottom+"px";
				playerWindowState.value = 1;
			});
		}
		else if (size == 2) {
			let w = window.innerWidth/2;
			let h = window.innerHeight/2;
			let l = (window.innerWidth - w)/2
			let t = (window.innerHeight - h)/2 - 40
			player.getIframe().then(el => {
				// el.style.transition = "top 2s,right 2s,bottom 2s,left 2s";
				player.setSize(w, h);
				el.style.right = "";
				el.style.bottom = "";
				el.style.left = l+"px";
				el.style.top = t+"px";
				playerWindowState.value = 2;
			});
		}
	}

	// player events

	player.on('stateChange', ev => {
		if (ev.data == 1) {
			player.getDuration().then(time => {
				duration.value = Math.floor(time);
			});
			playerState.value = 1;
			timer = setInterval(() => {
				player.getCurrentTime().then(time => { 
					currentTime.value = time
				});
			}, 100);
		}

		// paused

		if (ev.data == 2) {
			playerState.value = 2;
		}

		if (ev.data == -1 || ev.data == 0) {
			playerState.value = 0;
			clearInterval(timer);
			// play next
		}
	})

	return {
		// ref
		currentVideo,
		currentPlaylistId,
		player,
		currentTime,
		duration,
		playerState,
		playerWindowState,
		// control
		play,
		stop,
		pause,
		loadVideo,
		getTime,
		setYoutubeWindow,
	}
}
