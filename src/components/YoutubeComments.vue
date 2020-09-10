<template>
	<div v-if="comments.length" class="row comments shadow p-2 g-2">
		<div class="col-auto">
			<img :src="comments[commentIndex].snippet.topLevelComment.snippet.authorProfileImageUrl" alt="">
		</div>
		<div class="col">
			<span class="font-weight-bold">
				{{ comments[commentIndex].snippet.topLevelComment.snippet.authorDisplayName }}
			</span>
			{{ comments[commentIndex].snippet.topLevelComment.snippet.textOriginal }}
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
		} = useYoutube();

		let { 
			currentVideo, 
		} = useYoutubePlayer();

		// COMPUTED

		watch(comments, () => {
			commentIndex.value = 0;
			clearInterval(commentTimer);
			commentTimer = setInterval(() => {
				commentIndex.value++;
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
@import '../../node_modules/bootstrap/scss/bootstrap.scss';

.comments {
	position: fixed;
	width: 50% !important;
	height: 120px;
	left: 50%;
	transform: translateX(-50%);
	bottom: 100px;
	background-color: $light;
	overflow: hidden;
}
</style>
