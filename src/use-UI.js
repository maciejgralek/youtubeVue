import { ref } from 'vue'

let playerHeight = ref(null);

export default function useUI() {
	function setPlayerHeight(h) {
		playerHeight = h;
	}

	return {
		playerHeight,
		setPlayerHeight,
	}
}
