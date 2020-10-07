import { watch } from 'vue'

export default function useStoreSettings(name, settings) {
	let watchSettings = Object.values(settings)

	watch(watchSettings, () => {
		storeSettings(settings);
	})

	function storeSettings() {
		let newSettings = {};
		for (let [key, value] of Object.entries(settings)) {
			newSettings[key] = value.value;
		}
		localStorage.setItem(name, JSON.stringify(newSettings));
	}

	function restoreSettings(name) {
		let settingsJSON = localStorage.getItem(name);
		if (settingsJSON) {
			let restoredSettings = JSON.parse(settingsJSON);
			for (let [key, value] of Object.entries(settings)) {
				settings[key].value = restoredSettings[key];
			}
		}
	}

	return {
		restoreSettings,
	}
}
