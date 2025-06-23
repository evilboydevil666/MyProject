<template>
  <div class="grid grid-cols-2 gap-2">
    <button 
      @click="$emit('roll', '1d20', 'general')" 
      class="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm"
    >
      d20
    </button>
    <button 
      @click="$emit('roll', `1d20+${getAbilityMod('STR')}`, 'strength')" 
      class="bg-green-600 hover:bg-green-500 px-3 py-2 rounded text-sm"
    >
      STR Check
    </button>
    <button 
      @click="$emit('roll', `1d20+${getAbilityMod('DEX')}`, 'dexterity')" 
      class="bg-green-600 hover:bg-green-500 px-3 py-2 rounded text-sm"
    >
      DEX Check
    </button>
    <button 
      @click="$emit('roll', '1d6', 'damage')" 
      class="bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded text-sm"
    >
      d6 Damage
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  characterContext: Object
})

const emit = defineEmits(['roll'])

function getAbilityMod(ability) {
  // This would normally come from character context
  // Simplified for now
  return 0
}
</script>