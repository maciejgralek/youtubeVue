import { createRouter, createWebHistory } from 'vue-router';
import Youtube from '../components/Youtube.vue'

const routes = [
{
	path: '/',
  component: Youtube,
},
{
	path: '/playlist/:params',
  component: Youtube,
  props: true,
},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
