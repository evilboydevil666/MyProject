import { ref } from 'vue'
import NotificationModal from '@/components/modals/NotificationModal.vue'
import InventoryNotification from '@/components/InventoryNotification.vue'

export function useNotifications() {
  const notifications = ref([])
  
  function show(notification) {
    const id = Date.now()
    notifications.value.push({
      id,
      ...notification,
      timestamp: Date.now()
    })
    
    // Auto-dismiss after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        dismiss(id)
      }, notification.duration || 3000)
    }
  }
  
  function dismiss(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }
  
  function success(message, options = {}) {
    show({
      type: 'success',
      message,
      ...options
    })
  }
  
  function error(message, options = {}) {
    show({
      type: 'error',
      message,
      duration: 5000,
      ...options
    })
  }
  
  function warning(message, options = {}) {
    show({
      type: 'warning',
      message,
      duration: 4000,
      ...options
    })
  }
  
  function info(message, options = {}) {
    show({
      type: 'info',
      message,
      ...options
    })
  }
  
  return {
    notifications,
    show,
    dismiss,
    success,
    error,
    warning,
    info
  }
}