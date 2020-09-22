<template>
	<div v-if="comments.length" class="row comments shadow p-2 g-2 rounded">
		<div class="col-auto">
			<img :src="comments[commentIndex].snippet.topLevelComment.snippet.authorProfileImageUrl" alt="">
		</div>
		<div class="col">
			<transition name="fade" mode="out-in">
				<span :key="comments[commentIndex].id">
					<span class="font-weight-bold">
						{{ comments[commentIndex].snippet.topLevelComment.snippet.authorDisplayName }}
					</span>
					{{ comments[commentIndex].snippet.topLevelComment.snippet.textOriginal }}
				</span>
			</transition>
		</div>
	</div>
</template>

<script>
import { ref, computed, onMounted, watchEffect, watch } from 'vue'
import useYoutube from '../use-youtube.js'
import useYoutubePlayer from '../use-youtube-player.js'
import useUI from '../use-UI.js'

export default {
	props: {
	},
	setup(props) {
		let commentIndex = ref(0);
		let commentTimer = null;

		// COMPOSITION

		let { 
			comments,
			getComments,
		} = useYoutube();

		let { 
			currentVideo, 
		} = useYoutubePlayer();

		// COMPUTED

		watch(currentVideo, () => {
			commentIndex.value = 0;
			clearInterval(commentTimer);
			commentTimer = setInterval(() => {
				commentIndex.value++;
				if (commentIndex.value > comments.value.length - 5) {
					getComments(currentVideo.value.resourceId.videoId, true);
				}
				if (commentIndex.value > comments.value.length - 1) {
					commentIndex.value = 0;
				}
			}, 6000)
		});

		// METHODS

		return {
			comments,
			commentIndex,
		}
	}
}
</script>

<style scoped lang="scss">
$input-bg:                var(--input-background-color);
$input-color:             var(--input-color);
$input-border-color:      var(--input-border-color);
$dropdown-bg:             var(--input-background-color);
$dropdown-color:          var(--input-color);
$dropdown-border-color:   var(--input-border-color);
$dropdown-link-color:     var(--input-color);

@import '../../node_modules/bootstrap/scss/bootstrap.scss';

.comments {
	position: fixed;
	width: 50% !important;
	height: 120px;
	left: 50%;
	transform: translateX(-50%);
	bottom: 100px;
	color: var(--text-color);
	background-color: var(--background);
	overflow: hidden;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
