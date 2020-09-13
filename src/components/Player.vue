<template>
	<div ref="playerRef" class="player w-100 p-2">
		<div class="row align-items-center py-0">
			<div class="col-auto border-right border-secondary pr-1">
				<i v-if="playerState == 2 || playerState == -1" @click="actionPlay" class="mdi mdi-play mdi-36px" style="line-height: normal"></i>
				<i v-else @click="actionPause" class="mdi mdi-pause mdi-36px" style="line-height: normal"></i>
			</div>

			<div class="col-auto border-right border-secondary">
				<span class="timer text-dark font-weight-bold mx-3">
					{{ formatedTime }} - {{ durationTime }}
				</span>
			</div>

			<div class="col-auto">
				<transition name="fade" mode="out-in">
					<span @click="scrollToCurrentVideo" :key="currentVideo.title" class="font-weight-bold mx-3">
						{{ currentVideo.title }}
					</span>
				</transition>
			</div>

			<div class="col-auto ml-auto mr-1">
				<i v-if="showComments" @click="setComments" class="mdi mdi-comment-outline mdi-player-icon-mini"></i>
				<i v-else @click="setComments" class="mdi mdi-comment-remove-outline mdi-player-icon-mini"></i>
				<i v-if="playerWindowState == 1" @click="handleYoutubeWindowClick" class="mdi mdi-square-rounded-outline mdi-player-icon"></i>
				<i v-else @click="handleYoutubeWindowClick" class="mdi mdi-arrow-top-left-thick mdi-player-icon"></i>
			</div>
		</div>
		<div class="row">
			<div class="col mx-1">
				<div @mousemove="handleMouseMoveProgress" @click="handleClickProgress" class="progress bg-secondary my-2">
					<div 
						class="progress-bar bg-danger" 
						role="progressbar" 
						style="pointer-events: none"
						:style="{'width': (currentTime/duration) * 100 +'%'}" 
						aria-valuenow="0" 
						aria-valuemin="0" 
						aria-valuemax="100">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Icon from './Icon.vue'
import useYoutubePlayer from '../use-youtube-player.js'
import useYoutube from '../use-youtube.js'
import useUI from '../use-UI.js'

export default {
	components: {
		Icon
	},
	setup(props) {

		// DATA

		let playerRef = ref(null);

		// COMPOSITION

		let { 
			currentVideo, 
			currentTime, 
			duration, 
			playerState, 
			playerWindowState,
			play, 
			stop, 
			pause,
			seekTo,
			getTime,
			setYoutubeWindow,
		} = useYoutubePlayer();

		let { 
			findVideoElement,
		} = useYoutube();

		let { 
			setPlayerHeight,
			showComments,
			setComments,
		} = useUI();

		// COMPUTED

		let durationTime = computed(() => {
			let hours = Math.trunc((Math.floor(duration.value) / 60 / 60) % 60);
			let minutes = Math.trunc((duration.value / 60) % 60);
			let seconds = duration.value % 60;
			hours > 0 ? (hours = hours < 10 ? '0' + hours : hours) : '';
			minutes = minutes < 10 ? '0' + minutes : minutes;
			seconds = seconds < 10 ? '0' + seconds : seconds;
			return (hours ? hours + ':' : '') + minutes + ':' + seconds;
		})

		let formatedTime = computed(() => {
			if (currentTime.value == undefined) currentTime.value = 0;
			let hours = Math.trunc((Math.floor(currentTime.value) / 60 / 60) % 60);
			let minutes = Math.trunc((Math.floor(currentTime.value) / 60) % 60);
			let seconds = Math.floor(currentTime.value) % 60;
			hours = hours < 10 ? '0' + hours : hours;
			minutes = minutes < 10 ? '0' + minutes : minutes;
			seconds = seconds < 10 ? '0' + seconds : seconds;
			return hours + ':' + minutes + ':' + seconds;
		})

		// METHODS

		onMounted(() => {
			setPlayerHeight(playerRef.value.clientHeight);
		})

		function actionPlay() {
			play(currentVideo.value);
		}

		function actionPause() {
			pause();
		}

		function handleYoutubeWindowClick() {
			setYoutubeWindow(3);
		}

		function handleClickProgress(ev) {
			if (!currentVideo.value) return;
			let w = ev.target.clientWidth;
			let seconds = ((ev.x - ev.target.offsetLeft)/w) * duration.value;
			console.log(ev, seconds)
			seekTo(seconds);
		}

		function handleMouseMoveProgress(ev) {
			let w = ev.target.clientWidth;
		}

		function scrollToCurrentVideo() {
			findVideoElement(currentVideo.value);
		}

		return {
			playerRef,
			// youtube player
			currentVideo,
			currentTime,
			formatedTime,
			durationTime,
			duration,
			playerState,
			playerWindowState,
			actionPlay,
			actionPause,
			handleYoutubeWindowClick,
			handleMouseMoveProgress,
			handleClickProgress,
			scrollToCurrentVideo,
			showComments,
			setComments,
		}
	}
}
</script>

<style scoped>
.player {
	position: fixed;
	bottom: 0px;
	-webkit-box-shadow: 0px -7px 12px -11px rgba(0,0,0,0.6);
	-moz-box-shadow: 0px -7px 12px -11px rgba(0,0,0,0.6);
	box-shadow: 0px -7px 12px -11px rgba(0,0,0,0.6);
	/* width: 80% !important; */
	/* left: 50%; */
	/* transform: translateX(-50%); */
}
.timer {
	font-size: 1.55em;
}
.mdi-player-icon:before {
	font-size: 2.2em;
	line-height: normal;
}
.mdi-player-icon-mini:before {
	font-size: 2em;
	line-height: normal;
}
.mdi-player-icon-play:before {
	font-size: 36px;
	line-height: normal;
}
.progress {
	height: 0.4rem !important;
}
.progress-bar {
	transition: none;
}
.video-title {
	font-size: 1em;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
