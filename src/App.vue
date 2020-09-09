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

export default {
	components: {
		Navbar,
		Player,
	},
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
