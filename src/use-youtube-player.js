import { ref } from 'vue'
import YouTubePlayer from 'youtube-player';
import useYoutube from './use-youtube'
import useUI from './use-UI'
import useStoreSettings from './use-store-settings'
import { getRandomInteger } from './tools'

export const playerStates = {
	UNSTARTED: -1,
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 4,
}

export const playerPlaymodes = {
	NEXT: 1,
	SHUFFLE: 2,
	REPEAT: 3,
}

let _playerDefaultRight = 12;
let _playerDefaultBottom = 90;
let _playerDefaultWidth = 320;
let _playerDefaultHeight = 180;
let _timer = null;
let currentVideo = ref({});
let currentPlaylist = ref(null);
let currentTime = ref(null);
let duration = ref(null);
let playerState = ref(-1);
let playerWindowState = ref(1);
let volume = ref(0);
let isMuted = ref(false);
let playMode = ref(playerPlaymodes.NEXT);

let { 
	restoreSettings 
} = useStoreSettings('Player', { playMode });

restoreSettings();

let { 
	getCommentsRemote,
	comments,
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

player.getIframe().then(el => {
  el.style.right = _playerDefaultRight+"px";
  el.style.bottom = _playerDefaultBottom+"px";
});

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

function toggleMute() {
	if (!isMuted.value) {
		player.mute();
		isMuted.value = true;
	}
	else {
		player.unMute();
		isMuted.value = false;
	}
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
		comments.value = [];
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

function prev() {
	if (playMode.value == playerPlaymodes.NEXT) {
		let index = findVideoIndex(currentPlaylist.value, currentVideo.value);
		if (index < 0) {
			index = 0;
		}
		else {
			index -= 1;
		}
		return currentPlaylist.value.items[index].snippet;
	}
	else if (playMode.value == playerPlaymodes.SHUFFLE) {
		let index = getRandomInteger(0, currentPlaylist.value.items.length - 1);
		return currentPlaylist.value.items[index].snippet;
	}
	else if (playMode.value == playerPlaymodes.REPEAT) {
		return currentVideo.value;
	}
}

function next() {
	if (playMode.value == playerPlaymodes.NEXT) {
		let index = findVideoIndex(currentPlaylist.value, currentVideo.value);
		if (index >= currentPlaylist.value.items.length - 1) {
			index = 0;
		}
		else {
			index += 1;
		}
		return currentPlaylist.value.items[index].snippet;
	}
	else if (playMode.value == playerPlaymodes.SHUFFLE) {
		let index = getRandomInteger(0, currentPlaylist.value.items.length - 1);
		return currentPlaylist.value.items[index].snippet;
	}
	else if (playMode.value == playerPlaymodes.REPEAT) {
		return currentVideo.value;
	}
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

// EVENTS

window.addEventListener('resize', () => {
	if (playerWindowState.value == 2) {
		setYoutubeWindow(playerWindowState.value);
	}
})

player.on('stateChange', ev => {
	if (ev.data == playerStates.PLAYING) {
		player.getDuration().then(time => {
			duration.value = Math.floor(time);
		});
		playerState.value = playerStates.PLAYING;
		_timer = setInterval(() => {
			player.getCurrentTime().then(time => { 
				currentTime.value = time
			});
		}, 100);
		showCommentsPause.value = true;
	}
	if (ev.data == playerStates.PAUSED) {
		playerState.value = playerStates.PAUSED;
		showCommentsPause.value = false;
	}
	if (ev.data == playerStates.ENDED) {
		playerState.value = playerStates.ENDED;
		clearInterval(_timer);
		let video = null;
		if (playMode.value == playerPlaymodes.NEXT) {
			video = next();
			video.el.scrollIntoView({ block: 'center' });
			loadVideo(video);
			play();
		}
		else if (playMode.value == playerPlaymodes.SHUFFLE) {
			video = next();
			video.el.scrollIntoView({ block: 'center' });
			loadVideo(video);
			play();
		}
		else if (playMode.value == playerPlaymodes.REPEAT) {
			play();
		}
		// play next
	}
})

export default function useYoutubePlayer() {
	return {
		// ref
		currentVideo,
		currentPlaylist,
		currentTime,
		duration,
		volume,
		isMuted,
		playerState,
		playerWindowState,
		// control
		play,
		stop,
		pause,
		togglePlayPause,
		seekTo,
		prev,
		next,
		playMode,
		setVolume,
		toggleMute,
		loadVideo,
		getTime,
		setYoutubeWindow,
	}
}
