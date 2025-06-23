<template>
  <aside class="w-64 bg-gradient-to-b from-gray-900 to-gray-700 text-white p-6 flex flex-col h-full shadow-2xl">
    <h1 class="text-3xl font-extrabold mb-8 tracking-wide text-yellow-300">☸️ RPG</h1>
    <button
      v-for="btn in buttons"
      :key="btn.key"
      :class="[
        'w-full mb-2 px-4 py-3 rounded-lg transition font-semibold',
        view === btn.key
          ? 'bg-yellow-300 text-gray-900 shadow'
          : 'bg-gray-800 hover:bg-gray-600'
      ]"
      @click="$emit('changeView', btn.key)"
    >
      {{ btn.label }}
    </button>
    <div class="flex-1"></div>
    <footer class="text-xs text-gray-300 text-center opacity-60">RPG Narrator ©2024</footer>
  </aside>
</template>

<script>
export default {
  name: "Sidebar",
  props: { view: String },
  data() {
    return {
      buttons: [
        { key: "character", label: "Character" },
        { key: "chatgpt", label: "ChatGPT Web" },
        { key: "settings", label: "Settings" },
        { key: "map", label: "🗺️ Map" },
      ],
    };
  },
};
</script>
