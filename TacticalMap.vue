<template>
  <div class="map-container flex flex-col h-full">
    <!-- Controls -->
    <div class="flex justify-between items-center p-2 bg-gray-800 text-white border-b border-gray-700">
      <div class="space-x-2">
        <button @click="zoomIn" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded">Zoom In</button>
        <button @click="zoomOut" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded">Zoom Out</button>
      </div>
      <label class="flex items-center space-x-2">
        <input type="checkbox" v-model="fogOfWar" class="form-checkbox text-green-400" />
        <span>Fog of War</span>
      </label>
    </div>

    <!-- Grid Container -->
    <div
      ref="gridContainer"
      class="relative flex-1 overflow-auto"
      @wheel.prevent="onWheel"
      :style="`transform: scale(${zoom}); transform-origin: top left;`"
    >
      <div class="grid" :style="gridStyle">
        <div
          v-for="cell in cells"
          :key="cell.key"
          class="w-8 h-8 border border-gray-700"
          :class="(cell.row + cell.col) % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'"
          @click="placeToken(cell)"
        >
          <!-- Token -->
          <div
            v-if="tokenAt(cell.row, cell.col)"
            class="w-6 h-6 bg-red-500 rounded-full shadow-lg m-1 cursor-move"
            @mousedown.prevent="startDrag(cell)"
          ></div>
          <!-- Fog overlay -->
          <div
            v-if="fogOfWar && !visibleCells[cell.key]"
            class="absolute top-0 left-0 w-8 h-8 bg-black opacity-75 pointer-events-none"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

// Grid dimensions 30x30
const rows = 30
const cols = 30
const zoom = ref(1)
const fogOfWar = ref(false)

// State
const visibleCells = reactive({})
const tokens = reactive([])

// Generate cells
const cells = computed(() => {
  const arr = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      arr.push({ row: r, col: c, key: `${r}-${c}` })
    }
  }
  return arr
})

// CSS grid style
const gridStyle = computed(() => {
  return `display: grid; grid-template-columns: repeat(${cols}, 2rem); grid-template-rows: repeat(${rows}, 2rem);`
})

// Zoom controls
function zoomIn() { zoom.value = Math.min(4, zoom.value + 0.2) }
function zoomOut() { zoom.value = Math.max(0.5, zoom.value - 0.2) }
function onWheel(e) {
  zoom.value = Math.max(0.5, Math.min(4, zoom.value - e.deltaY * 0.001))
}

// Token management
function tokenAt(r, c) {
  return tokens.find(t => t.row === r && t.col === c)
}

// Place token on click
function placeToken(cell) {
  if (!tokenAt(cell.row, cell.col)) {
    tokens.push({ row: cell.row, col: cell.col })
    visibleCells[cell.key] = true
  }
}

// Drag logic
let dragging = null
function startDrag(cell) {
  const token = tokenAt(cell.row, cell.col)
  if (!token) return
  dragging = { token }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', endDrag)
}
function onDrag(e) {
  if (!dragging) return
  const container = document.querySelector('.grid')
  const rect = container.getBoundingClientRect()
  const cellWidth = rect.width / cols
  const cellHeight = rect.height / rows
  const col = Math.floor((e.clientX - rect.left) / cellWidth)
  const row = Math.floor((e.clientY - rect.top) / cellHeight)
  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    dragging.token.row = row
    dragging.token.col = col
    visibleCells[`${row}-${col}`] = true
  }
}
function endDrag() {
  dragging = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
}
</script>

<style scoped>
.grid {
  position: relative;
}
</style>
