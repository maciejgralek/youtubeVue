<template>
  <div 
    ref="playerRef" 
    @wheel.prevent="handleWheel" 
    class="player p-2"
  >
    <div class="row align-items-center py-0">

      <!-- PLAY -->

      <div class="col-auto border-right border-secondary pr-1">
        <transition name="fade-fast" mode="out-in">
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
        </transition>
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
        <i 
          @click="handleClickPrevious"
          v-tippy="'Previous'"
          class="mdi mdi-skip-previous mdi-player-icon-play"
        ></i>
        <i 
          @click="handleClickNext"
          v-tippy="'Next'"
          class="mdi mdi-skip-next mdi-player-icon-play"
        ></i>
        <transition name="fade-fast" mode="out-in">
          <i 
            v-if="playMode == playerPlaymodes.NEXT" 
            @click="handleClickPlayMode" 
            key="next"
            v-tippy="'Next'"
            class="mdi mdi-shuffle-disabled mdi-player-icon"
          ></i>
          <i 
            v-else-if="playMode == playerPlaymodes.SHUFFLE" 
            @click="handleClickPlayMode" 
            key="shuffle"
            v-tippy="'Shuffle'"
            class="mdi mdi-shuffle mdi-player-icon"
          ></i>
          <i 
            v-else-if="playMode == playerPlaymodes.REPEAT"
            @click="handleClickPlayMode" 
            key="repeat"
            v-tippy="'Repeat'"
            class="mdi mdi-repeat mdi-player-icon"
          ></i>
        </transition>
      </div>

      <!-- TITLE -->

      <div class="col-auto">
        <transition name="fade" mode="out-in">
          <span 
            @click="scrollToCurrentVideo" 
            v-tippy-player="tippyVideoDescriptionContent" 
            :key="currentVideo.title" 
            class="video-title font-weight-bold mx-3"
          >
            {{ currentVideo.title }}
          </span>
        </transition>
      </div>

      <!-- VOLUME -->

      <div class="col-auto ml-auto pr-0">
        <transition name="fade-fast" mode="out-in">
          <i 
            v-if="volume > 50 && !isMuted" 
            @click="handleClickVolumeIcon" 
            class="mdi mdi-volume-high mdi-player-icon"
          ></i>
          <i 
            v-else-if="volume <= 50 && volume > 0 && !isMuted" 
            @click="handleClickVolumeIcon" 
            class="mdi mdi-volume-medium mdi-player-icon"
          ></i>
          <i 
            v-else-if="volume == 0 || isMuted" 
            @click="handleClickVolumeIcon" 
            class="mdi mdi-volume-off mdi-player-icon"
          ></i>
        </transition>
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
        <i 
          v-if="showComments" 
          @click="setComments" 
          v-tippy="'Show comments'" 
          class="mdi mdi-comment-outline mdi-player-icon-mini"
        ></i>
        <i 
          v-else 
          @click="setComments" 
          v-tippy="'Show comments'" 
          class="mdi mdi-comment-remove-outline mdi-player-icon-mini"
        ></i>
        <i 
          v-if="playerWindowState == 1" 
          @click="handleYoutubeWindowClick" 
          v-tippy="'Fullscreen'" 
          class="mdi mdi-square-rounded-outline mdi-player-icon"
        ></i>
        <i 
          v-else 
          @click="handleYoutubeWindowClick" 
          v-tippy="'Fullscreen'" 
          class="mdi mdi-arrow-top-left-thick mdi-player-icon"
        ></i>
      </div>
    </div>

    <div class="row">
      <div class="col mx-1">
        <div 
          ref="progressRef" 
          @click="handleClickProgress" 
          @mousemove="handleProgressMouseMove" 
          v-tippy-progress 
          class="progress-container pt-2 pb-1"
        >
          <div class="progress bg-secondary">
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
  </div>
</template>

<script>
import { ref, computed, onMounted, watchEffect, watch } from 'vue'
import useYoutubePlayer, { playerStates, playerPlaymodes } from '../use-youtube-player'
import useYoutube from '../use-youtube'
import useUI from '../use-UI'
import { ifMinAddDigit } from '../tools'

export default {
  setup(props) {

    let showHours = false;
    let showMinutes = false;

    // DATA

    let playerRef = ref(null);
    let progressRef = ref(null);

    // COMPOSITION

    let { 
      currentVideo, 
      currentTime, 
      duration, 
      volume,
      isMuted,
      playerState, 
      playerWindowState,
      play, 
      stop, 
      pause,
      seekTo,
      prev,
      next,
      loadVideo,
      playMode,
      getTime,
      setVolume,
      toggleMute,
      setYoutubeWindow,
    } = useYoutubePlayer();

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
      minutes = ifMinAddDigit(minutes);
      seconds = ifMinAddDigit(seconds);
      return (hours ? hours + ':' : '') + minutes + ':' + seconds;
    })

    let formatedTime = computed(() => {
      let time = "";
      if (currentTime.value == undefined) currentTime.value = 0;
      if (showHours) {
        let hours = Math.trunc((Math.floor(currentTime.value) / 60 / 60) % 60);
        hours = ifMinAddDigit(hours);
        time = hours + ':';
      }
      if (showMinutes) {
        let minutes = Math.trunc((Math.floor(currentTime.value) / 60) % 60);
        minutes = ifMinAddDigit(minutes);
        time += minutes + ':';
      }
      let seconds = Math.floor(currentTime.value) % 60;
      seconds = ifMinAddDigit(seconds);
      return time + seconds;
    })

    let playButtonMode = computed(() => {
      return playerState.value == playerStates.PAUSED || 
        playerState.value == playerStates.UNSTARTED || 
        playerState.value == playerStates.ENDED;
    })

    // METHODS

    onMounted(() => {
      setPlayerHeight(playerRef.value.clientHeight);
    })

    function handleClickPlay() {
      if (!currentVideo.value.resourceId) return;
      play();
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

    function handleProgressMouseMove(ev) {
      let seconds = Math.floor(((ev.x - ev.target.offsetLeft)/ev.target.clientWidth) * duration.value);
      progressRef.value.tippyProgress.setContent(
        ifMinAddDigit(Math.trunc(seconds/60/60)%60) + ':' + 
        ifMinAddDigit((Math.trunc(seconds/60)%60)) + ':' + 
        ifMinAddDigit(Math.trunc(seconds%60))
      );
    }

    function handleClickVolume(ev) {
      let w = ev.target.clientWidth;
      let volume = ((ev.x - ev.target.offsetLeft)/w) * 100;
      setVolume(volume);
    }

    function handleClickVolumeIcon() {
      toggleMute();
    }

    function handleClickPrevious() {
      if (currentTime.value > 5 || playMode.value == 3) {
        seekTo(0);
      }
      else {
        let video = prev();
        video.el.scrollIntoView({ block: 'center' });
        loadVideo(video);
        play();
      }
    }

    function handleClickNext() {
      let video = next();
      video.el.scrollIntoView({ block: 'center' });
      loadVideo(video);
      play();
    }

    function tippyVideoDescriptionContent () {
      return currentVideo.value.description ? 
        currentVideo.value.description.replace(/(?:\r\n|\r|\n)/g, '<br>') : 
        'No description'
    }
    

    function scrollToCurrentVideo() {
      currentVideo.value.el.scrollIntoView({ block: "center" });
    }

    return {
      playerRef,
      progressRef,
      currentVideo,
      currentTime,
      formatedTime,
      durationTime,
      duration,
      volume,
      isMuted,
      playerStates,
      playerPlaymodes,
      playerState,
      playerWindowState,
      playButtonMode,
      playMode,
      handleClickPlay,
      handleClickPause,
      handleYoutubeWindowClick,
      handleClickProgress,
      handleWheel,
      handleClickVolume,
      handleClickVolumeIcon,
      handleClickPlayMode,
      handleProgressMouseMove,
      handleClickPrevious,
      handleClickNext,
      tippyVideoDescriptionContent,
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
  width: 100%;
  background-color: var(--background-player);
  -webkit-box-shadow: 0px -7px 12px -10px rgba(0,0,0,0.5);
  -moz-box-shadow: 0px -7px 12px -10px rgba(0,0,0,0.5);
  box-shadow: 0px -7px 12px -10px rgba(0,0,0,0.5);
  z-index: 1020;
}
.timer {
  font-size: 1.55em;
}
.video-title {
  font-size: 1em;
}
.video-title:hover {
  cursor: pointer;
}
.progress-container {
  cursor: pointer;
}
.progress {
  height: 0.4rem !important;
  cursor: pointer;
}
.progress-bar {
  transition: none;
}

/* MDI */

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

/* TRANSITION */

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-fast-enter-active, .fade-fast-leave-active {
  transition: opacity .05s;
}
.fade-fast-enter-from, .fade-fast-leave-to {
  opacity: 0;
}
</style>
