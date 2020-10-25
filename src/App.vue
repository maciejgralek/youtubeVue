<template>
  <div id="app">
    <Navbar />

    <div class="container-fluid">
      <router-view></router-view>
    </div>

    <Player />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Player from './components/Player.vue'
import useKey from './use-key'

export default {
  components: {
    Navbar,
    Player,
  },
  setup() {
    useKey();
  }
}
</script>

<style lang="scss">
@import './theme.scss';
@import 'bootstrap/scss/bootstrap.scss';
@import './variables.scss';

:root {
  // light

  --bg-light:                       #{$light};
  --background-player-light:        #eaeaea;
  --text-color-light:               #212529;
  --icon-color-light:               #212529;
  --scroll-track-color-light:       #{$light};
  --scroll-thumb-color-light:       #dae0e5;
  --border-color-light:             #dee2e6;
  --input-background-color-light:   #ffffff;
  --input-color-light:              #495057;
  --input-border-color-light:       #ced4da;
  --modal-content-bg-light:         #{$light};

  // dark

  --bg-dark:                       #{$dark};
  --background-player-dark:        #{$dark-l-2};
  --text-color-dark:               #{$light-d-3};
  --icon-color-dark:               #{$light-d-6};
  --scroll-track-color-dark:       #{$dark};
  --scroll-thumb-color-dark:       #{$secondary};
  --border-color-dark:             #{$secondary};
  --input-background-color-dark:   #{$dark-d-3};
  --input-color-dark:              #{light-d-3};
  --input-border-color-dark:       #{$dark-l-10};
  --modal-content-bg-dark:         #{$dark};

  // theme

  --background:               var(--bg-light);
  --text-color:               var(--text-color-light);
  --icon-color:               var(--icon-color-liht);
  --background-player:        var(--background-player-light);
  --scroll:                   var(--scroll-color-light);
  --scroll-track:             var(--scroll-track-color-light);
  --scroll-thumb:             var(--scroll-thumb-color-light);
  --border-color:             var(--border-color-light);
  --input-background-color:   var(--input-background-color-light);
  --input-color:              var(--input-color-light);
  --input-border-color:       var(--input-border-color-light);
  --modal-content-bg:         var(--modal-content-bg-light);
}

body {
  background-color: var(--background);
  color: var(--text-color);
}

.container-fluid {
  width: 99% !important;
}

i {
  cursor: pointer;
}

.mdi {
  color: var(--icon-color);
}

// TIPPY

div[data-tippy-root] {
  overflow-y: auto;
}

div[data-tippy-root]::-webkit-scrollbar {
  width: 0px;
}

.tippy-content {
  text-overflow: ellipsis;
}

// DROPDOWN

.dropdown-menu {
  z-index: 1045;
}

.dropdown-menu .list-group-item {
  background-color: var(--input-background-color) !important;
}

// PLAYER

#video-player {
  position: fixed;
  z-index: 1010;
}
</style>
