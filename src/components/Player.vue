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
        <PlayerTimer />
      </div>

      <!-- NEXT -->

      <div 
        v-if="currentVideo.title" 
        class="col-auto border-right border-secondary"
      >
        <PlayerPlaylist />
      </div>

      <!-- TITLE -->

      <div class="col text-truncate">
        <PlayerTitle />
      </div>

      <!-- VOLUME -->

      <div class="col-auto ml-auto">
        <PlayerVolume />
      </div>
      
      <!-- COMMENTS FULLSCREEN -->

      <div class="col-auto d-none d-md-block mr-1">
        <PlayerIcons />
      </div>

    </div>

    <div class="row">
      <div class="col mx-1">
        <div 
          ref="progressRef" 
          @mousedown="handleClickProgress" 
          @mouseup="handleClickProgress" 
          @mousemove="handleProgressMouseMove" 
          @mouseleave="handleMouseleaveProgress"
          v-tippy-progress 
          class="progress-container pt-2 pb-1"
        >
          <div class="progress bg-secondary">
            <div 
              class="progress-bar bg-danger" 
              role="progressbar" 
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
import PlayerVolume from './PlayerVolume'
import PlayerTimer from './PlayerTimer'
import PlayerTitle from './PlayerTitle'
import PlayerPlaylist from './PlayerPlaylist'
import PlayerIcons from './PlayerIcons'
import useYoutubePlayer, { playerStates, playerPlaymodes } from '../use-youtube-player'
import useYoutube from '../use-youtube'
import useUI from '../use-UI'
import { ifMinAddDigit } from '../tools'

export default {
  components: {
    PlayerTimer,
    PlayerTitle,
    PlayerPlaylist,
    PlayerVolume,
    PlayerIcons,
  },
  setup(props) {

    let isProgressDragging = false;

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
      toggleYoutubeWindow,
    } = useYoutubePlayer();

    let { 
      setPlayerHeight,
      showComments,
      setComments,
    } = useUI();

    // COMPUTED

    let playButtonMode = computed(() => {
      return playerState.value == playerStates.PAUSED || 
        playerState.value == playerStates.UNSTARTED || 
        playerState.value == playerStates.ENDED;
    })

    // METHODS

    onMounted(() => {
      setPlayerHeight(playerRef.value);
    })

    function handleClickPlay() {
      if (!currentVideo.value.resourceId) return;
      play();
    }

    function handleClickPause() {
      pause();
    }

    function handleClickProgress(ev) {
      if (!currentVideo.value) return;
      if (ev.type == 'mousedown') {
        let seconds = ((ev.x - ev.target.offsetLeft)/ev.target.clientWidth) * duration.value;
        isProgressDragging = true;
        seekTo(seconds);
      }
      else if (ev.type == 'mouseup') {
        isProgressDragging = false;
      }
    }

    function handleWheel(ev) {
      let i = volume.value + ev.deltaY/200 * -1 * 5;
      setVolume(i > 100 ? 100 : i < 0 ? 0 : i);
    }

    function handleMouseleaveProgress() {
      isProgressDragging = false;
    }

    function handleProgressMouseMove(ev) {
      let seconds = Math.floor(((ev.x - ev.target.offsetLeft)/ev.target.clientWidth) * duration.value);
      if (isProgressDragging) {
        seekTo(seconds);
      }
      progressRef.value.tippyProgress.setContent(
        ifMinAddDigit(Math.trunc(seconds/60/60)%60) + ':' + 
        ifMinAddDigit((Math.trunc(seconds/60)%60)) + ':' + 
        ifMinAddDigit(Math.trunc(seconds%60))
      );
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

    return {
      playerRef,
      progressRef,
      currentVideo,
      currentTime,
      duration,
      playerStates,
      playerPlaymodes,
      playerState,
      playerWindowState,
      playButtonMode,
      playMode,
      handleClickPlay,
      handleClickPause,
      handleClickProgress,
      handleWheel,
      handleProgressMouseMove,
      handleMouseleaveProgress,
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
.progress-container {
  cursor: pointer;
}
.progress {
  height: 0.4rem !important;
  cursor: pointer;
  pointer-events: none;
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
