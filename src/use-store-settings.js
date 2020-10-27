import { watch, isRef } from 'vue'

export default function useStoreSettings(name, settings) {
  let watchSettings = Object.values(settings)
  watchSettings = watchSettings.filter(item => isRef(item));

  watch(watchSettings, () => {
    _storeSettings(settings);
  })

  function _storeSettings() {
    let newSettings = {};
    for (let [key, value] of Object.entries(settings)) {
      if (isRef(value)) {
        newSettings[key] = value.value;
      }
    }
    localStorage.setItem(name, JSON.stringify(newSettings));
  }

  function restoreSettings() {
    let settingsJSON = localStorage.getItem(name);
    if (settingsJSON) {
      let restoredSettings = JSON.parse(settingsJSON);
      for (let [key, value] of Object.entries(settings)) {
        if (restoredSettings[key] && isRef(settings[key])) {
          settings[key].value = restoredSettings[key];
        }
      }
    }
  }

  return {
    restoreSettings,
  }
}
