<template>
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">

          <slot name="header"></slot>

          <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-right">

          <slot></slot>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watchEffect } from 'vue'
import useYoutube from '../use-youtube'
import useUI from '../use-UI'
import useStore from '../use-store'

export default {
  setup(props, { emit }) {
    let isModalOpen = ref(false);
    
    return {
      
    }
  }
}
</script>

<style scoped>
</style>
