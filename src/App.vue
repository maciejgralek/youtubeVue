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
import useKey from './use-key.js'

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
@import '../node_modules/bootstrap/scss/bootstrap.scss';

$light-d-3: darken($light, 3);
$light-d-6: darken($light, 6);
$dark-d-3: darken($dark, 3);
$dark-l-2: lighten($dark, 2);
$dark-l-10: lighten($dark, 10);
$dark-d-6: darken($dark, 6);

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
}

body {
	background-color: var(--background);
	color: var(--text-color);
}

i {
	cursor: pointer;
}

.mdi {
	color: var(--icon-color);
}

.dropdown-menu .list-group-item {
	background-color: var(--input-background-color) !important;
}

.container-fluid {
	width: 99% !important;
}

.bg-dark-l10 {
	background-color: lighten($dark, 10);
}

// PLAYER

.player {
	background-color: var(--background-player);
}

#video-player {
	position: fixed;
	right: 10px;
	bottom: 96px;
}
</style>
