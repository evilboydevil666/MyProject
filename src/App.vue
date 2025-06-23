<template>
  <div class="flex h-screen">
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar p-4 bg-gray-800 text-white">
      <h1 class="text-2xl font-bold mb-6 text-yellow-300">🎲 RPG Narrator</h1>
      <nav>
        <button
          v-for="page in pages"
          :key="page.id"
          @click="currentPage = page.id"
          :class="[
            'block w-full text-left px-4 py-2 rounded mb-2 transition-colors',
            currentPage === page.id ? 'bg-yellow-600 text-black font-semibold' : 'hover:bg-gray-700'
          ]"
        >
          {{ page.label }}
        </button>
      </nav>
    </aside>

    <!-- CENTER CONTENT -->
    <main class="content flex-1 p-4 bg-gray-900 text-white overflow-auto">
      <component 
        :is="currentPageComponent" 
        v-model:current-tab="currentTab"
      />
    </main>

    <!-- RIGHT NARRATIVE PANE -->
    <NarrativeChat 
      class="narration-container"
      :character-state="characterState"
    />

    <!-- MODALS -->
    <WebChatModal v-if="showWebChat" @close="showWebChat = false" />
    <NotificationModal 
      v-if="notification.show" 
      v-bind="notification"
      @close="notification.show = false"
      @action="handleNotificationAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, shallowRef, onMounted, onUnmounted, provide } from 'vue'
import { characterState } from './characterState.js'
import { systems } from './core/SystemsManager.js'

// Page Components
import CharacterView from './views/CharacterView.vue'
import PartyView from './views/PartyView.vue'
import ChatGPTView from './views/ChatGPTView.vue'
import SessionPrepView from './views/SessionPrepView.vue'
import AutomationView from './views/AutomationView.vue'
import TacticalMapView from './views/TacticalMapView.vue'
import SettingsView from './views/SettingsView.vue'

// Core Components
import NarrativeChat from './components/NarrativeChat.vue'
import WebChatModal from './components/modals/WebChatModal.vue'
import NotificationModal from './components/modals/NotificationModal.vue'

// Provide dependencies
provide('systems', systems)
provide('characterState', characterState)

// Navigation
const pages = [
  { id: 'character', label: '⚔️ Character', component: CharacterView },
  { id: 'party', label: '👥 Party', component: PartyView },
  { id: 'chat', label: '🤖 AI Assistant', component: ChatGPTView },
  { id: 'session-prep', label: '🎯 Session Prep', component: SessionPrepView },
  { id: 'automation', label: '⚙️ Automation', component: AutomationView },
  { id: 'map', label: '🗺️ Map', component: TacticalMapView },
  { id: 'settings', label: '⚙️ Settings', component: SettingsView }
]

const currentPage = ref('character')
const currentTab = ref('Overview')
const currentPageComponent = computed(() => 
  pages.find(p => p.id === currentPage.value)?.component || CharacterView
)

// UI State
const showWebChat = ref(false)
const notification = ref({
  show: false,
  title: '',
  message: '',
  action: null
})

// Event Handlers
function showNotification(data) {
  notification.value = { show: true, ...data }
}

function handleNotificationAction() {
  if (notification.value.action?.handler) {
    notification.value.action.handler()
  }
  notification.value.show = false
}

// Lifecycle
onMounted(() => {
  // Initialize systems
  systems.initialize()
  
  // Set up event listeners
  systems.on('ui:show-web-chat', () => { showWebChat.value = true })
  systems.on('ui:notification', showNotification)
  systems.on('navigate', ({ page, tab }) => {
    if (page) currentPage.value = page
    if (tab) currentTab.value = tab
  })
})

onUnmounted(() => {
  // Clean up
  systems.off('ui:show-web-chat')
  systems.off('ui:notification')
  systems.off('navigate')
})
</script>

<style scoped>
/* Use existing styles from index.css */
.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.content {
  flex: 1;
  min-width: 0; /* Important: prevents flex child from overflowing */
}

.narration-container {
  width: 40%;
  max-width: 600px;
  min-width: 400px;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  flex-shrink: 0;
}

/* Fix for problematic views */
.content :deep(.h-screen),
.content :deep([class*="h-screen"]) {
  height: auto !important;
  max-height: 100% !important;
}

.content :deep(.w-screen),
.content :deep([class*="w-screen"]) {
  width: 100% !important;
  max-width: 100% !important;
}

.content :deep(.fixed),
.content :deep([class*="fixed"]) {
  position: absolute !important;
}

/* Contain all view components */
.content > :deep(*) {
  max-width: 100%;
  overflow-x: hidden;
}
</style>