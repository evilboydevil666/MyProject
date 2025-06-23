import { createRouter, createWebHistory } from 'vue-router'

// Import views
import CharacterView from '../views/CharacterView.vue'
import PartyView from '../views/PartyView.vue'
import ChatGPTView from '../views/ChatGPTView.vue'
import SessionPrepView from '../views/SessionPrepView.vue'
import AutomationView from '../views/AutomationView.vue'
import TacticalMapView from '../views/TacticalMapView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/character'
  },
  {
    path: '/character',
    name: 'Character',
    component: CharacterView
  },
  {
    path: '/party',
    name: 'Party',
    component: PartyView
  },
  {
    path: '/chat',
    name: 'ChatGPT',
    component: ChatGPTView
  },
  {
    path: '/session-prep',
    name: 'SessionPrep',
    component: SessionPrepView
  },
  {
    path: '/automation',
    name: 'Automation',
    component: AutomationView
  },
  {
    path: '/tactical-map',
    name: 'TacticalMap',
    component: TacticalMapView
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router