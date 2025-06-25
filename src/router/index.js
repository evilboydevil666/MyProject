import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

// Import views
import { createRouter, createWebHistory } from 'vue-router'
import CharacterView from '@/views/CharacterView.vue'
import PartyView from '@/views/PartyView.vue'
import TacticalMapView from '@/views/TacticalMapView.vue'
import ChatGPTView from '@/views/ChatGPTView.vue'
import SessionPrepView from '@/views/SessionPrepView.vue'
import AutomationView from '@/views/AutomationView.vue'
import SettingsView from '@/views/SettingsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/character'
  },
  {
    path: '/character',
    name: 'character',
    component: CharacterView,
    meta: { title: 'Character Sheet' }
  },
  {
    path: '/party',
    name: 'party',
    component: PartyView,
    meta: { title: 'Party Management' }
  },
  {
    path: '/tactical-map',
    name: 'tactical-map',
    component: TacticalMapView,
    meta: { title: 'Tactical Map' }
  },
  {
    path: '/session-prep',
    name: 'session-prep',
    component: SessionPrepView,
    meta: { title: 'Campaign Start' }
  },
  {
    path: '/automation',
    name: 'automation',
    component: AutomationView,
    meta: { title: 'Automation Tools' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { title: 'Settings' }
  },
  {
  path: '/chatgpt',
  name: 'ChatGPT',
  component: () => import('@/views/ChatGPTView.vue').then(m => m.default || m)
}
]

const router = createRouter({
  // Use hash mode for Electron, history mode for web
  history: window.isElectron ? createWebHashHistory() : createWebHistory(),
  routes
})

router.onError((error) => {
  console.error('Router error:', error)
  // Fallback to home or previous route
  if (error.name === 'ChunkLoadError') {
    window.location.reload()
  }
})

// Update document title on route change
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - RPG Narrator` : 'RPG Narrator'
  next()
})

export default router