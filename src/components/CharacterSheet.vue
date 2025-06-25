<template>
  <div class="character-details">
    <!-- Builder Buttons -->
    <div v-if="showBuilderButton" class="builder-buttons mb-4">
      <button 
        v-if="!characterState.name"
        @click="$emit('open-builder')"
        class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        🎭 Create Character
      </button>
      <button 
        v-else
        @click="$emit('level-up')"
        class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
      >
        📈 Level Up
      </button>
    </div>

    <!-- Rest of your existing CharacterDetails template -->
    <!-- ... -->
  </div>
  <div class="overview-container space-y-6 text-white">

    <!-- Overview Header -->
    <div class="border border-green-500 p-4 rounded">
      <h2 class="text-2xl font-semibold">Overview</h2>
    </div>

    <!-- Identity Fields -->
    <div class="grid grid-cols-2 gap-4">
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Name</label>
        <input v-model="characterState.name" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Race</label>
        <select v-model="characterState.race" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white">
          <option value="">Select race</option>
          <option>Aasimar</option><option>Android</option><option>Catfolk</option>
          <option>Changeling</option><option>Dhampir</option><option>Drow</option>
          <option>Duergar</option><option>Dwarf</option><option>Elf</option>
          <option>Fetchling</option><option>Gillman</option><option>Gnome</option>
          <option>Goblin</option><option>Grippli</option><option>Half-Elf</option>
          <option>Half-Orc</option><option>Halfling</option><option>Hobgoblin</option>
          <option>Ifrit</option><option>Kitsune</option><option>Merfolk</option>
          <option>Nagaji</option><option>Orc</option><option>Oread</option>
          <option>Ratfolk</option><option>Samsaran</option><option>Skinwalker</option>
          <option>Suli</option><option>Sylph</option><option>Tengu</option>
          <option>Tiefling</option><option>Undine</option><option>Vanara</option>
          <option>Vishkanya</option><option>Wayang</option><option>Human</option>
        </select>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Age</label>
        <input type="number" v-model.number="characterState.age" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Alignment</label>
        <input v-model="characterState.alignment" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Deity</label>
        <input v-model="characterState.deity" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Homeland</label>
        <input v-model="characterState.homeland" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Background</label>
        <input v-model="characterState.background" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Occupation</label>
        <input v-model="characterState.occupation" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
    </div>

    <!-- Physical Attributes -->
    <div class="grid grid-cols-3 gap-4">
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Height</label>
        <input v-model="characterState.height" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Weight</label>
        <input v-model="characterState.weight" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
      <div class="border border-green-500 p-4 rounded">
        <label class="block mb-1">Hair / Eyes / Skin</label>
        <input v-model="characterState.hair" placeholder="Hair color" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white mb-2"/>
        <input v-model="characterState.eyes" placeholder="Eye color" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white mb-2"/>
        <input v-model="characterState.skin" placeholder="Skin tone" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
    </div>

    <!-- Combined Total Level & Classes -->
    <div class="border border-green-500 p-4 rounded flex items-start space-x-6">
      <div class="flex-shrink-0">
        <label class="block mb-1">Total Level</label>
        <input :value="characterLevel" readonly class="w-24 bg-blue-800 border border-blue-400 p-2 rounded text-white text-center"/>
      </div>
      <div class="flex-1">
        <label class="block mb-1 font-semibold">Classes & Levels</label>
        <div v-for="(cls, idx) in characterState.classes" :key="idx" class="flex items-center space-x-4 mb-4">
          <select v-model="cls.className" class="w-64 bg-blue-800 border border-blue-400 p-2 rounded text-white">
            <option value="">Select class</option>
            <option>Alchemist</option><option>Antipaladin</option><option>Arcanist</option>
            <option>Barbarian</option><option>Bard</option><option>Bloodrager</option><option>Brawler</option>
            <option>Cavalier</option><option>Cleric</option><option>Dragon Disciple</option><option>Druid</option>
            <option>Fighter</option><option>Gunslinger</option><option>Hunter</option><option>Inquisitor</option>
            <option>Investigator</option><option>Kineticist</option><option>Magus</option><option>Medium</option>
            <option>Mesmerist</option><option>Monk</option><option>Mystic Theurge</option><option>Ninja</option>
            <option>Occultist</option><option>Oracle</option><option>Paladin</option><option>Psychic</option>
            <option>Ranger</option><option>Rogue</option><option>Samurai</option><option>Shaman</option>
            <option>Shifter</option><option>Skald</option><option>Slayer</option><option>Sorcerer</option>
            <option>Spirtualist</option><option>Summoner</option><option>Swashbuckler</option><option>Warpriest</option>
            <option>Witch</option><option>Wizard</option><option>Commoner</option><option>Expert</option>
            <option>Warrior</option><option>Adept</option><option>Aristocrat</option>
          </select>
          <input type="number" v-model.number="cls.level" min="1" class="w-20 bg-blue-800 border border-blue-400 p-2 rounded text-white text-center"/>
          <button v-if="characterState.classes.length > 1" @click="removeClass(idx)" class="border border-green-500 px-3 py-1 rounded text-white hover:bg-green-500">Remove</button>
        </div>
        <button @click="addClass()" class="border border-green-500 px-4 py-2 rounded text-white hover:bg-green-500">+ Add Class</button>
      </div>
    </div>

    <!-- Combat & Defense Stats -->
    <div class="grid grid-cols-4 gap-4">
      <div class="border border-green-500 p-4 rounded bg-blue-900 flex flex-col">
        <label class="block mb-1">Armor Class</label>
        <input type="number" v-model.number="characterState.ac" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
      <div class="border border-green-500 p-4 rounded bg-blue-900 flex flex-col">
        <label class="block mb-1">Touch AC</label>
        <input type="number" v-model.number="characterState.touchAC" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
      <div class="border border-green-500 p-4 rounded bg-blue-900 flex flex-col">
        <label class="block mb-1">Flat-Footed AC</label>
        <input type="number" v-model.number="characterState.flatAC" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
      <div class="border border-green-500 p-4 rounded bg-blue-900 flex flex-col">
        <label class="block mb-1">Initiative</label>
        <div class="flex space-x-2 items-center">
          <input type="number" v-model.number="characterState.init" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
          <button @click="rollInitiative" class="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded" title="Roll Initiative">🎲</button>
        </div>
      </div>
    </div>

    <!-- BAB, CMB, CMD -->
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div class="border border-green-500 p-4 rounded bg-blue-900">
        <label class="block mb-1">Base Attack Bonus (BAB)</label>
        <input type="number" v-model.number="characterState.bab" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
      <div class="border border-green-500 p-4 rounded bg-blue-900">
        <label class="block mb-1">CMB</label>
        <input type="number" v-model.number="characterState.cmb" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
      <div class="border border-green-500 p-4 rounded bg-blue-900">
        <label class="block mb-1">CMD</label>
        <input type="number" v-model.number="characterState.cmd" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
    </div>

    <!-- Saving Throws with Roll Buttons -->
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div class="border border-green-500 p-4 rounded bg-blue-900 flex flex-col">
        <label class="block mb-1">Fortitude Save</label>
        <div class="flex space-x-2 items-center">
          <input type="number" v-model.number="characterState.saves.fort" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
          <button @click="rollFort" class="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded" title="Roll Fortitude Save">🎲</button>
        </div>
      </div>
      <div class="border border-green-500 p-4 rounded bg-blue-900 flex flex-col">
        <label class="block mb-1">Reflex Save</label>
        <div class="flex space-x-2 items-center">
          <input type="number" v-model.number="characterState.saves.ref" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
          <button @click="rollRef" class="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded" title="Roll Reflex Save">🎲</button>
        </div>
      </div>
      <div class="border border-green-500 p-4 rounded bg-blue-900 flex flex-col">
        <label class="block mb-1">Will Save</label>
        <div class="flex space-x-2 items-center">
          <input type="number" v-model.number="characterState.saves.will" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
          <button @click="rollWill" class="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded" title="Roll Will Save">🎲</button>
        </div>
      </div>
    </div>

    <!-- Speed & Initiative Modifier -->
    <div class="grid grid-cols-2 gap-4 mt-4">
      <div class="border border-green-500 p-4 rounded bg-blue-900">
        <label class="block mb-1">Speed (ft)</label>
        <input type="number" v-model.number="characterState.speed" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
      <div class="border border-green-500 p-4 rounded bg-blue-900">
        <label class="block mb-1">Initiative Modifier</label>
        <input type="number" v-model.number="characterState.initiativeMod" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white"/>
      </div>
    </div>

    <!-- Ability Scores -->
    <div class="grid grid-cols-6 gap-4 mt-4">
      <div v-for="(score, ab) in characterState.abilityScores" :key="ab" class="border border-green-500 p-4 rounded text-center">
        <label class="block mb-1">{{ ab }}</label>
        <input type="number" v-model.number="characterState.abilityScores[ab]" class="w-full bg-blue-800 border border-blue-400 p-2 rounded text-white text-center"/>
        <div class="text-sm text-gray-300">Mod: {{ abilityMod(ab) >= 0 ? '+' : '' }}{{ abilityMod(ab) }}</div>
        <button @click="rollAbilityCheck(ab)" class="mt-1 bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded text-xs" :title="`Roll ${ab} Check`">🎲</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { characterState } from '../characterState.js'

// Define emits for roll events
const emit = defineEmits(['character-roll'])

const characterLevel = computed(() =>
  characterState.classes.reduce((sum, c) => sum + Number(c.level), 0)
)

const totalLevel = computed(() => characterLevel.value)

function abilityMod(ab) {
  return Math.floor((characterState.abilityScores[ab] - 10) / 2)
}

// Enhanced roll function that adds AI predictions using GPT-4.1
async function rollWithPrediction(modifier = 0, rollType = '', description = '') {
  const roll = Math.ceil(Math.random() * 20)
  const total = roll + modifier
  
  const rollResult = {
    type: rollType,
    description: description,
    expression: `1d20${modifier >= 0 ? '+' : ''}${modifier}`,
    diceRoll: roll,
    modifier: modifier,
    total: total,
    isNatural20: roll === 20,
    isNatural1: roll === 1,
    character: characterState.name || 'Character',
    timestamp: Date.now()
  }

  // Get AI prediction for this roll if API key available
  if (localStorage.getItem('openai-api-key')) {
    try {
      const prediction = await generateRollPrediction(rollResult)
      rollResult.aiPrediction = prediction
    } catch (error) {
      console.log('Could not generate AI prediction:', error.message)
    }
  }
  
  // Emit to parent with enhanced data
  emit('character-roll', rollResult)
  
  return rollResult
}

async function generateRollPrediction(rollResult) {
  const prompt = `Brief consequence prediction for this Pathfinder 1e roll:

**Roll:** ${rollResult.description}  
**Character:** ${characterState.name} (Level ${totalLevel.value})
**Result:** ${rollResult.total} (d20: ${rollResult.diceRoll} + ${rollResult.modifier})
**Natural 20:** ${rollResult.isNatural20 ? 'YES' : 'NO'}
**Natural 1:** ${rollResult.isNatural1 ? 'YES' : 'NO'}

Provide 2-3 brief consequence scenarios in under 100 words:
1. **Success outcome** (if high roll)
2. **Failure outcome** (if low roll)  
3. **Complication** (interesting twist regardless)`

  const apiKey = localStorage.getItem('openai-api-key')
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4.1-nano', // Updated to GPT-4.1 Nano for quick predictions
      messages: [
        {
          role: 'system', 
          content: 'You are a Pathfinder 1e GM. Give brief, creative roll consequences.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 200
    })
  })

  if (!response.ok) throw new Error(`API Error: ${response.status}`)
  
  const data = await response.json()
  return data.choices[0].message.content
}

// Roll functions using enhanced prediction system
function rollInitiative() {
  rollWithPrediction(characterState.init, 'initiative', 'Initiative Roll')
}

function rollFort() {
  rollWithPrediction(characterState.saves.fort, 'saving-throw', 'Fortitude Save')
}

function rollRef() {
  rollWithPrediction(characterState.saves.ref, 'saving-throw', 'Reflex Save')
}

function rollWill() {
  rollWithPrediction(characterState.saves.will, 'saving-throw', 'Will Save')
}

function rollAbilityCheck(ability) {
  const mod = abilityMod(ability)
  rollWithPrediction(mod, 'ability-check', `${ability} Check`)
}

// Add/remove class controls
function addClass() {
  characterState.classes.push({ className: '', level: 1 })
}

function removeClass(idx) {
  characterState.classes.splice(idx, 1)
}
// Add to your existing props
const props = defineProps({
  showBuilderButton: {
    type: Boolean,
    default: false
  }
  // ... your other props
})

// Add to your existing emits
const emit = defineEmits(['open-builder', 'level-up'])

// ... rest of your script
</script>

<style scoped>
/* Scoped styles if needed */
</style>