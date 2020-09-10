import { ref } from 'vue'

let playerHeight = ref(null);
let compactMode = ref(false);
let thumbnailWidth = ref(80);
let thumbnailHeight = ref(50);
let _compactThumbnailWidth = 55;
let _compactThumbnailHeight = 30;
let _normalThumbnailWidth = 80;
let _normalThumbnailHeight = 50;

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

	return {
		playerHeight,
		setPlayerHeight,
		setCompact,
		thumbnailWidth,
		thumbnailHeight,
	}
}
