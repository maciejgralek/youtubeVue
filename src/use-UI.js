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
let currentTheme = ref("light");

export default function useUI() {
	function setPlayerHeight(h) {
		playerHeight = h;
	}

	function setCompact() {
		if (compactMode.value) {
			thumbnailWidth.value = _normalThumbnailWidth;
			thumbnailHeight.value = _normalThumbnailHeight;
			compactMode.value = false;
		}
		else {
			thumbnailWidth.value = _compactThumbnailWidth;
			thumbnailHeight.value = _compactThumbnailHeight;
			compactMode.value = true;
		}
	}

	function setTheme(theme) {
		if (currentTheme.value == "light") {
			document.documentElement.style.setProperty('--background', 'var(--bg-dark)');
			document.documentElement.style.setProperty('--text-color', 'var(--text-color-dark)');
			document.documentElement.style.setProperty('--background-player', 'var(--background-player-dark)');
			document.documentElement.style.setProperty('--scroll-track', 'var(--scroll-track-color-dark)');
			document.documentElement.style.setProperty('--scroll-thumb', 'var(--scroll-thumb-color-dark)');
			document.documentElement.style.setProperty('--border-color', 'var(--border-color-dark)');
			document.documentElement.style.setProperty('--input-background-color', 'var(--input-background-color-dark)');
			document.documentElement.style.setProperty('--input-color', 'var(--input-color-dark)');
			document.documentElement.style.setProperty('--input-border-color', 'var(--input-border-color-dark)');
			document.documentElement.style.setProperty('--icon-color', 'var(--icon-color-dark)');
			currentTheme.value = "dark";
		}
		else {
			document.documentElement.style.setProperty('--background', 'var(--bg-light)');
			document.documentElement.style.setProperty('--text-color', 'var(--text-color-light)');
			document.documentElement.style.setProperty('--background-player', 'var(--background-player-light)');
			document.documentElement.style.setProperty('--scroll-track', 'var(--scroll-track-color-light)');
			document.documentElement.style.setProperty('--scroll-thumb', 'var(--scroll-thumb-color-light)');
			document.documentElement.style.setProperty('--border-color', 'var(--border-color-light)');
			document.documentElement.style.setProperty('--input-background-color', 'var(--input-background-color-light)');
			document.documentElement.style.setProperty('--input-color', 'var(--input-color-light)');
			document.documentElement.style.setProperty('--input-border-color', 'var(--input-border-color-light)');
			document.documentElement.style.setProperty('--icon-color', 'var(--icon-color-light)');
			currentTheme.value = "light";
		}
	}

	function setComments() {
		if (showComments.value) {
			showComments.value = false;
		}
		else {
			showComments.value = true;
		}
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
		setTheme,
		compactMode,
		currentTheme,
	}
}
