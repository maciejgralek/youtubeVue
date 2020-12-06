<template>
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
</template>

<script>
import { ref } from 'vue'
import useYoutubePlayer from '../use-youtube-player.js'
import { ifMinAddDigit } from '../tools'

export default {
  setup() {
    let isProgressDragging = false;
    let progressRef = ref(null);

    let { 
      currentVideo,
      currentTime, 
      duration, 
      seekTo,
    } = useYoutubePlayer();

    function handleClickProgress(ev) {
      if (!currentVideo.value) return;
      if (ev.type == 'mousedown') {
        let seconds = ((ev.x - progressRef.value.offsetLeft)/progressRef.value.clientWidth) * duration.value;
        isProgressDragging = true;
        seekTo(seconds);
      }
      else if (ev.type == 'mouseup') {
        isProgressDragging = false;
      }
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

    return {
      progressRef,
      currentTime,
      duration,
      handleClickProgress,
      handleMouseleaveProgress,
      handleProgressMouseMove,
    }
  }
}
</script>

<style scoped>
.progress-container {
  cursor: pointer;
}
.progress {
  height: 0.4rem !important;
  overflow: visible;
  cursor: pointer;
}
.progress-bar {
  transition: none;
}
.progress-container:hover .progress .progress-bar {
}
</style>
