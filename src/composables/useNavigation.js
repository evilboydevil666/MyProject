import { ref, computed } from 'vue'

export function useNavigation() {
  const currentPage = ref('character')
  const currentTab = ref('Overview')
  
  const pages = [
    { id: 'character', label: '⚔️ Character' },
    { id: 'party', label: '👥 Party' },
    { id: 'chat', label: '🤖 AI Assistant' },
    { id: 'session-prep', label: '🎯 Session Prep' },
    { id: 'automation', label: '⚙️ Automation' },
    { id: 'map', label: '🗺️ Map' },
    { id: 'settings', label: '⚙️ Settings' }
  ]
  
  const characterTabs = ['Overview', 'Skills', 'Feats', 'Spells', 'Inventory']
  
  function navigateTo(page, tab = null) {
    currentPage.value = page
    if (tab) {
      currentTab.value = tab
    }
  }
  
  function navigateToTab(tab) {
    currentTab.value = tab
  }
  
  const currentPageData = computed(() => 
    pages.find(p => p.id === currentPage.value)
  )
  
  return {
    currentPage,
    currentTab,
    pages,
    characterTabs,
    navigateTo,
    navigateToTab,
    currentPageData
  }
}