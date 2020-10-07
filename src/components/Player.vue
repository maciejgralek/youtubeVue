<template>
	<div 
		ref="playerRef" 
		@wheel.prevent="handleWheel" 
		class="player w-100 p-2"
	>
		<div class="row align-items-center py-0">

			<!-- PLAY -->

			<div class="col-auto border-right border-secondary pr-1">
				<i 
					v-if="playButtonMode" 
					@click="handleClickPlay" 
					class="mdi mdi-play mdi-player-icon-play" 
				></i>
				<i 
					v-else 
					@click="handleClickPause" 
					class="mdi mdi-pause mdi-player-icon-play"
				></i>
			</div>

			<!-- TIMER -->

			<div 
				v-if="currentVideo.title && duration" 
				class="col-auto border-right border-secondary"
			>
				<span class="timer font-weight-bold mx-3">
					{{ formatedTime }} - {{ durationTime }}
				</span>
			</div>

			<!-- NEXT -->

			<div 
				v-if="currentVideo.title" 
				class="col-auto border-right border-secondary"
			>
				<i class="mdi mdi-skip-previous mdi-player-icon-play"></i>
				<i class="mdi mdi-skip-next mdi-player-icon-play"></i>
				<i v-if="playMode == 1" @click="handleClickPlayMode" class="mdi mdi-shuffle-disabled mdi-player-icon"></i>
				<i v-else-if="playMode == 2" @click="handleClickPlayMode" class="mdi mdi-shuffle mdi-player-icon"></i>
				<i v-else @click="handleClickPlayMode" class="mdi mdi-repeat mdi-player-icon"></i>
			</div>
			
			<!-- TITLE -->

			<div class="col-auto">
				<transition name="fade" mode="out-in">
					<span>
						<span @click="scrollToCurrentVideo" :key="currentVideo.title" class="video-title font-weight-bold mx-3">
							{{ currentVideo.title }}
						</span>
					</span>
				</transition>
			</div>

			<!-- VOLUME -->

			<div class="col-auto ml-auto pr-0">
				<i v-if="volume > 50" class="mdi mdi-volume-high mdi-player-icon"></i>
				<i v-else-if="volume <= 50 && volume > 0" class="mdi mdi-volume-medium mdi-player-icon"></i>
				<i v-else class="mdi mdi-volume-off mdi-player-icon"></i>
			</div>
			<div class="col-auto">
				<div 
					@click="handleClickVolume" 
					class="progress bg-secondary" 
					style="width: 150px"
				>
					<div 
						class="progress-bar bg-danger" 
						role="progressbar" 
						style="pointer-events: none"
						:style="{'width': volume +'%'}" 
						aria-valuenow="0" 
						aria-valuemin="0" 
						aria-valuemax="100">
					</div>
				</div>
			</div>

			<!-- COMMENTS FULLSCREEN -->

			<div class="col-auto mr-1">
				<i v-show="showComments" @click="setComments" class="mdi mdi-comment-outline mdi-player-icon-mini"></i>
				<i v-show="!showComments" @click="setComments" class="mdi mdi-comment-remove-outline mdi-player-icon-mini"></i>
				<i v-if="playerWindowState == 1" @click="handleYoutubeWindowClick" class="mdi mdi-square-rounded-outline mdi-player-icon"></i>
				<i v-else @click="handleYoutubeWindowClick" class="mdi mdi-arrow-top-left-thick mdi-player-icon"></i>
			</div>
		</div>

		<div class="row">
			<div class="col mx-1">
				<div @mousemove="handleMouseMoveProgress" @click="handleClickProgress" class="progress bg-secondary mt-2 mb-1">
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
import { ref, computed, onMounted, watchEffect, watch } from 'vue'
import useYoutubePlayer from '../use-youtube-player.js'
import useYoutube from '../use-youtube.js'
import useUI from '../use-UI.js'

export default {
	setup(props) {

		let showHours = false;
		let showMinutes = false;
		// DATA

		let playerRef = ref(null);

		// COMPOSITION

		let { 
			currentVideo, 
			currentTime, 
			duration, 
			volume,
			playerState, 
			playerWindowState,
			play, 
			stop, 
			pause,
			seekTo,
			playMode,
			getTime,
			setVolume,
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

		// WATCH
		
		watchEffect(() => {
			showHours = false;
			showMinutes = false;
			let hours = Math.trunc((Math.floor(duration.value) / 60 / 60) % 60);
			let minutes = Math.trunc((duration.value / 60) % 60);
			if (hours) {
				showHours = true;
				showMinutes = true;
			}
			if (minutes) showMinutes = true;
		})

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
			let time = "";
			if (currentTime.value == undefined) currentTime.value = 0;
			if (showHours) {
				let hours = Math.trunc((Math.floor(currentTime.value) / 60 / 60) % 60);
				hours = hours < 10 ? '0' + hours : hours;
				time = hours + ':';
			}
			if (showMinutes) {
				let minutes = Math.trunc((Math.floor(currentTime.value) / 60) % 60);
				minutes = minutes < 10 ? '0' + minutes : minutes;
				time += minutes + ':';
			}
			let seconds = Math.floor(currentTime.value) % 60;
			seconds = seconds < 10 ? '0' + seconds : seconds;
			return time + seconds;
		})

		let playButtonMode = computed(() => {
			return playerState.value == 2 || playerState.value == -1 || playerState.value == 0;
		})

		// METHODS

		onMounted(() => {
			setPlayerHeight(playerRef.value.clientHeight);
		})

		function handleClickPlay() {
			play(currentVideo.value);
		}

		function handleClickPause() {
			pause();
		}

		function handleYoutubeWindowClick() {
			setYoutubeWindow(3);
		}

		function handleClickProgress(ev) {
			if (!currentVideo.value) return;
			let w = ev.target.clientWidth;
			let seconds = ((ev.x - ev.target.offsetLeft)/w) * duration.value;
			seekTo(seconds);
		}

		function handleMouseMoveProgress(ev) {
			let w = ev.target.clientWidth;
		}

		function handleWheel(ev) {
			let i = volume.value + ev.deltaY/200 * -1 * 5;
			setVolume(i > 100 ? 100 : i < 0 ? 0 : i);
		}

		function handleClickPlayMode() {
			playMode.value++;
			if (playMode.value > 3) {
				playMode.value = 1;
			}
		}

		function handleClickVolume(ev) {
			let w = ev.target.clientWidth;
			let volume = ((ev.x - ev.target.offsetLeft)/w) * 100;
			setVolume(volume);
		}

		function scrollToCurrentVideo() {
			currentVideo.value.el.scrollIntoView({ block: "center" });
		}

		return {
			playerRef,
			currentVideo,
			currentTime,
			formatedTime,
			durationTime,
			duration,
			volume,
			playerState,
			playerWindowState,
			playButtonMode,
			playMode,
			handleClickPlay,
			handleClickPause,
			handleYoutubeWindowClick,
			handleMouseMoveProgress,
			handleClickProgress,
			handleWheel,
			handleClickVolume,
			handleClickPlayMode,
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
	-webkit-box-shadow: 0px -7px 12px -10px rgba(0,0,0,0.5);
	-moz-box-shadow: 0px -7px 12px -10px rgba(0,0,0,0.5);
	box-shadow: 0px -7px 12px -10px rgba(0,0,0,0.5);
}
.timer {
	font-size: 1.55em;
}
.video-title:hover {
	cursor: pointer;
}
.mdi-player-icon-title:before {
	font-size: 1.4em;
	line-height: normal;
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
	cursor: pointer;
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
