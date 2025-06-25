<template>
  <div class="text-white">
    <h2 class="text-2xl font-bold mb-6 text-center">Party &amp; NPC Roster</h2>
    <div
      class="grid"
      style="grid-template-columns: 6rem 1fr; grid-template-rows: auto auto;"
    >
      <!-- Party Sidebar -->
      <div class="border border-blue-700 border-r-4 bg-white/10 rounded-l-lg flex flex-col h-full">
        <div class="font-bold mb-2 text-blue-300 text-center tracking-wide">Party</div>
        <ul class="overflow-y-auto max-h-40 custom-scrollbar px-1 pb-2">
          <li
            v-for="(pm, i) in partyMembers"
            :key="i"
            @click="selectedPartyIndex = i"
            :class="[
              'cursor-pointer rounded text-xs font-semibold transition-all mb-1 px-1 py-1 select-none whitespace-nowrap text-left',
              selectedPartyIndex === i
                ? 'bg-blue-600 text-white shadow'
                : 'hover:bg-blue-500 hover:text-white text-blue-200'
            ]"
            style="max-width: 5.5rem; overflow: hidden; text-overflow: ellipsis;"
          >
            {{ pm.name || '(unnamed)' }}
          </li>
        </ul>
        <button
          @click="addPartyMember"
          class="mt-4 bg-blue-700 hover:bg-blue-600 text-white text-xs px-1 py-1 rounded w-full font-semibold"
        >
          + Add
        </button>
      </div>

      <!-- Party Card -->
      <div>
        <div v-if="partyMembers[selectedPartyIndex]" class="border border-blue-700 rounded-r-lg p-4 bg-blue-900 h-full">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-blue-200">Party Member #{{ selectedPartyIndex + 1 }}</h3>
            <button
              v-if="partyMembers.length > 1"
              @click="removePartyMember(selectedPartyIndex)"
              class="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded"
            >Remove</button>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label class="block mb-1">Name</label>
              <input
                v-model="partyMembers[selectedPartyIndex].name"
                class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white text-left"
              />
            </div>
            <div>
              <label class="block mb-1">Class & Level</label>
              <input
                v-model="partyMembers[selectedPartyIndex].cls"
                class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white text-left"
              />
            </div>
            <div>
              <label class="block mb-1">HP</label>
              <input
                type="number"
                v-model.number="partyMembers[selectedPartyIndex].hp"
                class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white text-left"
              />
            </div>
            <div>
              <label class="block mb-1">AC</label>
              <input
                type="number"
                v-model.number="partyMembers[selectedPartyIndex].ac"
                class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white text-left"
              />
            </div>
            <div>
              <label class="block mb-1">Initiative</label>
              <input
                type="number"
                v-model.number="partyMembers[selectedPartyIndex].init"
                class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white text-left"
              />
            </div>
            <div>
              <label class="block mb-1">Speed (ft)</label>
              <input
                type="number"
                v-model.number="partyMembers[selectedPartyIndex].speed"
                class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white text-left"
              />
            </div>
            <div>
              <label class="block mb-1">Saves (F/R/W)</label>
              <input
                v-model="partyMembers[selectedPartyIndex].saves"
                class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white text-left"
              />
            </div>
            <div>
              <label class="block mb-1">Perception</label>
              <input
                type="number"
                v-model.number="partyMembers[selectedPartyIndex].perception"
                class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white text-left"
              />
            </div>
            <div class="col-span-2">
              <label class="block mb-1">Notable Abilities / Feats</label>
              <input
                v-model="partyMembers[selectedPartyIndex].abilities"
                class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white text-left"
              />
            </div>
            <div class="col-span-2">
              <label class="block mb-1">Equipment (summary)</label>
              <input
                v-model="partyMembers[selectedPartyIndex].equipment"
                class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white text-left"
              />
            </div>
            <div class="col-span-2">
              <label class="block mb-1">Backstory & Notes</label>
              <textarea
                v-model="partyMembers[selectedPartyIndex].notes"
                rows="3"
                class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white text-left"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- NPC Sidebar -->
      <div class="border border-yellow-400 border-r-4 bg-white/10 rounded-l-lg flex flex-col h-full">
        <div class="font-bold mb-2 text-yellow-300 text-center tracking-wide">NPCs</div>
        <ul class="overflow-y-auto max-h-40 custom-scrollbar px-1 pb-2">
          <li
            v-for="(n, i) in npcs"
            :key="i"
            @click="selectedNPCIndex = i"
            :class="[
              'cursor-pointer rounded text-xs font-semibold transition-all mb-1 px-1 py-1 select-none whitespace-nowrap text-left',
              selectedNPCIndex === i
                ? 'bg-yellow-500 text-white font-bold'
                : 'hover:bg-yellow-600 hover:text-white text-yellow-200'
            ]"
            style="max-width: 5.5rem; overflow: hidden; text-overflow: ellipsis;"
          >
            {{ n.name || '(unnamed)' }}
          </li>
        </ul>
        <button
          @click="addNPC"
          class="mt-4 bg-yellow-700 hover:bg-yellow-600 text-white text-xs px-1 py-1 rounded w-full font-semibold"
        >
          + Add
        </button>
      </div>

      <!-- NPC Card -->
      <div>
        <div
          v-if="npcs[selectedNPCIndex]"
          class="border border-yellow-400 rounded-r-lg p-6 bg-yellow-900 min-h-[200px]"
        >
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-yellow-200">
              NPC #{{ selectedNPCIndex + 1 }}
            </h3>
            <button
              v-if="npcs.length > 1"
              @click="removeNPC(selectedNPCIndex)"
              class="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label class="block mb-1">Name</label>
              <input
                v-model="npcs[selectedNPCIndex].name"
                class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white text-left"
              />
            </div>
            <div>
              <label class="block mb-1">Affiliation</label>
              <input
                v-model="npcs[selectedNPCIndex].affiliation"
                class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white text-left"
              />
            </div>
            <div class="col-span-2">
              <label class="block mb-1">Notes</label>
              <input
                v-model="npcs[selectedNPCIndex].notes"
                class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white text-left"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

// Party Members
const partyMembers = reactive([
  {
    name: 'Hero',
    cls: 'Fighter 5',
    hp: 30,
    ac: 16,
    init: 2,
    speed: 30,
    saves: '+5/+2/+4',
    perception: 5,
    abilities: '',
    equipment: '',
    notes: ''
  }
])
const selectedPartyIndex = ref(0)
function addPartyMember() {
  partyMembers.push({
    name: '',
    cls: '',
    hp: 0,
    ac: 10,
    init: 0,
    speed: 30,
    saves: '',
    perception: 0,
    abilities: '',
    equipment: '',
    notes: ''
  })
  selectedPartyIndex.value = partyMembers.length - 1
}
function removePartyMember(i) {
  partyMembers.splice(i, 1)
  if (selectedPartyIndex.value >= partyMembers.length)
    selectedPartyIndex.value = partyMembers.length - 1
}

// NPCs
const npcs = reactive([
  { name: 'NPC 1', affiliation: 'Town Guard', notes: '' }
])
const selectedNPCIndex = ref(0)
function addNPC() {
  npcs.push({ name: '', affiliation: '', notes: '' })
  selectedNPCIndex.value = npcs.length - 1
}
function removeNPC(i) {
  npcs.splice(i, 1)
  if (selectedNPCIndex.value >= npcs.length)
    selectedNPCIndex.value = npcs.length - 1
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 0.6em;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 0.3em;
}
</style>
