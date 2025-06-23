<template>
  <div class="flex h-screen">
    <AppSidebar />
    <main class="content flex-1 p-4 bg-gray-900 text-white overflow-auto">
      <slot />
    </main>
    <NarrativeChat class="w-2/5" />
    <GlobalModals />
  </div>
</template>

<script setup>
import AppSidebar from '../components/layout/AppSidebar.vue'
import NarrativeChat from '../components/NarrativeChat.vue'
import GlobalModals from '../components/GlobalModals.vue'
</script>