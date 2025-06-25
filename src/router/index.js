import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

// Import views
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
    path: '/chatgpt',
    name: 'chatgpt',
    component: ChatGPTView,
    meta: { title: 'ChatGPT Assistant' }
  },
  {
    path: '/session-prep',
    name: 'session-prep',
    component: SessionPrepView,
    meta: { title: 'Session Preparation' }
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
  }
]

const router = createRouter({
  // Use hash mode for Electron, history mode for web
  history: window.isElectron ? createWebHashHistory() : createWebHistory(),
  routes
})

// Update document title on route change
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - RPG Narrator` : 'RPG Narrator'
  next()
})

export default router