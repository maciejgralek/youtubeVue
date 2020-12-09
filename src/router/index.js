import { createRouter, createWebHistory } from 'vue-router';
import Youtube from '../components/Youtube.vue'
import YoutubeView from '../components/YoutubeView.vue'

const routes = [
  {
    path: '/',
    component: YoutubeView,
  },
  {
    path: '/playlist/:params',
    component: YoutubeView,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
