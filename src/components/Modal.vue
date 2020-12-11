<template>
  <div 
    id="exampleModal" 
    tabindex="-1" 
    aria-labelledby="ModalLabel" 
    aria-hidden="true"
    class="modal fade" 
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">

          <slot name="header"></slot>

          <button 
            type="button" 
            data-bs-dismiss="modal" 
            aria-label="Close"
            class="btn-close" 
          >
          </button>
        </div>
        <div class="modal-body text-right">

          <slot></slot>

        </div>
        <div class="modal-footer">
          <button 
            type="button" 
            data-bs-dismiss="modal"
            class="btn btn-secondary" 
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
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
