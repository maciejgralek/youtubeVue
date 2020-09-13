import { ref } from 'vue'

let playerHeight = ref(null);
let compactMode = ref(true);
let _compactThumbnailWidth = 55;
let _compactThumbnailHeight = 30;
let _normalThumbnailWidth = 80;
let _normalThumbnailHeight = 50;
let showComments = ref(true);
let showCommentsPause = ref(true);
let thumbnailWidth = ref(compactMode ? _compactThumbnailWidth : _normalThumbnailWidth);
let thumbnailHeight = ref(compactMode ? _compactThumbnailHeight : _normalThumbnailHeight);

export default function useUI() {
	function setPlayerHeight(h) {
		playerHeight = h;
	}

	function setCompact(value) {
		if (compactMode.value) {
			thumbnailWidth.value = _normalThumbnailWidth;
			thumbnailHeight.value = _normalThumbnailHeight;
			compactMode.value = 0;
		}
		else {
			thumbnailWidth.value = _compactThumbnailWidth;
			thumbnailHeight.value = _compactThumbnailHeight;
			compactMode.value = 1;
		}
	}

	function setComments() {
		if (showComments.value) {
			showComments.value = false;
		}
		else {
			showComments.value = true;
		}
		console.log(showComments.value)
	}

	return {
		playerHeight,
		setPlayerHeight,
		setCompact,
		thumbnailWidth,
		thumbnailHeight,
		showComments,
		showCommentsPause,
		setComments,
	}
}
