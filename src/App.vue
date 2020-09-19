<template>
  <div id="app">
		<div class="container-app">

			<Navbar />

			<div class="container-fluid">
				<router-view></router-view>
			</div>
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
@import '../node_modules/bootstrap/scss/bootstrap.scss';

body {
	/* background-color: $dark; */
	background-color: $light;
}
.container-app {
	overflow-y: hidden;
}

i {
	cursor: pointer;
}

.bg-dark-l10 {
	background-color: lighten($dark, 10);
}

// PLAYER

.player {
	background-color: lighten($dark, 9);
	background-color: #eaeaea;
}

#video-player {
	position: fixed;
	right: 10px;
	bottom: 96px;
}
</style>
