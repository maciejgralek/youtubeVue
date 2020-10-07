import { ref } from 'vue'
import YouTubePlayer from 'youtube-player';
import useYoutube from './use-youtube.js'
import useUI from './use-UI.js'
import useStoreSettings from './use-store-settings'

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
let playMode = ref(1);

let { 
	restoreSettings 
} = useStoreSettings('Player', { playMode });

restoreSettings('Player');

let player = YouTubePlayer('video-player', {
	width: _playerDefaultWidth,
	height: _playerDefaultHeight,
});	

player.getVolume().then((res) => {
	volume.value = res;
});

export default function useYoutubePlayer() {
	let { 
		getCommentsRemote,
	} = useYoutube();

	let { 
		showCommentsPause, 
		playerHeight,
	} = useUI();

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

	function loadVideo(video, playlistId) {
		let id;
		if (video.resourceId) {
			id = video.resourceId.videoId;
		}
		else {
			id = video.id.videoId;
		}
		if (playlistId) currentPlaylistId.value = playlistId;
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

	// player events

	window.addEventListener('resize', () => {
		if (playerWindowState.value == 2) {
			setYoutubeWindow(playerWindowState.value);
		}
	})

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
			showCommentsPause.value = true;
		}

		// paused

		if (ev.data == 2) {
			playerState.value = 2;
			showCommentsPause.value = false;
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
		volume,
		playerState,
		playerWindowState,
		// control
		play,
		stop,
		pause,
		togglePlayPause,
		seekTo,
		playMode,
		setVolume,
		loadVideo,
		getTime,
		setYoutubeWindow,
	}
}
