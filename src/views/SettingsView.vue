<template>
  <div class="h-full">
    <Settings @api-key-changed="handleApiKeyChange" />
  </div>
</template>

<script setup>
import { inject } from 'vue'
import Settings from '../components/Settings.vue'

const systems = inject('systems')

function handleApiKeyChange(newKey) {
  if (systems) {
    systems.state.apiKey = newKey
  }
}
</script>