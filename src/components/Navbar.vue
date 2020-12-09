<template>
  <nav class="navbar navbar-expand-lg navbar-dark py-0">
  <div class="container-fluid">
    <a class="navbar-brand font-weight-bold" href="#">YTPlay</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav ml-auto ml-2 py-1">
        <li class="nav-item">
          <a @click.prevent="handleClickAbout" class="nav-link" aria-current="page" href="#">About</a>
        </li>
      </ul>
      </div>
  </div>
</nav>
</template>

<script>
import useUI from '../use-UI'

export default {
  setup() {
    let { isAboutVisible } = useUI();

    function handleClickAbout () {
      isAboutVisible.value = isAboutVisible.value ? false : true;
    }

    return {
      handleClickAbout,
    }
  }
}
</script>

<style lang="scss">
@import '../theme.scss';
@import 'bootstrap/scss/bootstrap.scss';

.navbar {
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.7);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.7);
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.7);
}

.navbar-dark {
  background-color: #4b545c;
}

.nav-item {
  font-size: 1.0em !important;
}

.nav-item-active {
  border-bottom: solid #0d6efd 2px;
}
</style>
