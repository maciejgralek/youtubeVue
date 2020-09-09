import { ref, reactive, computed } from 'vue'

let state = reactive({
	filter: '',
})

export default function useStore() {

	return state
}
