<template>
  <div class="row p-3 m-4">
    <div class="col">
        <h5>
          Display and listen to multiple YouTube playlists. It will try to entertain by playing comments.
        </h5>
      <hr>
      <h5><i class="mdi mdi-play me-2"></i>How to add playlist</h5>
      <p class="mb-0">
        Add comma seperated playlist IDs in URL
      </p>
      <p class="d-inline-block p-1 m-2">
        <a href="https://ytplay.netlify.app/playlist/PL6KKV5307aucIh814g2_yPUztUhLGCPbt,PL6KKV5307auf79PLK0fTDnuMfP3sOOchX">
          https://ytplay.netlify.app/playlist/PL6KKV5307aucIh814g2_yPUztUhLGCPbt,PL6KKV5307auf79PLK0fTDnuMfP3sOOchX
        </a>
      </p>
      <p>
        or click
        <i class="mdi mdi-playlist-music mdi-24px"></i>
      </p>
      <hr>
      <h5><i class="mdi mdi-play me-2"></i>Search is not working</h5>
      <p>
        Search is temporary disabled because of YouTube API quota.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  setup(props) {
    
    return {
      
    }
  }
}
</script>

<style scoped>

</style>
