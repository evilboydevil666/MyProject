<template>
  <div>
    <h2 class="text-2xl mb-4">Skills</h2>
    <p class="mb-4 text-gray-400">
      Class skills for <span class="text-blue-400 font-bold">{{ currentClassList }}</span> are
      <span class="text-green-600 font-bold">highlighted</span>. You get
      <span class="text-green-600 font-bold">+3</span> bonus on class skills with at least 1 rank.
    </p>

    <table class="w-full text-xs md:text-sm border-collapse">
      <thead>
        <tr class="bg-gray-200 text-black">
          <th class="p-2">Skill</th>
          <th class="p-2">Ability</th>
          <th class="p-2">Class Skill</th>
          <th class="p-2">Trained</th>
          <th class="p-2">Armor Penalty</th>
          <th class="p-2">Roll</th>
          <th class="p-2">Ability Mod</th>
          <th class="p-2">Rank</th>
          <th class="p-2">Misc</th>
          <th class="p-2">Class Bonus</th>
          <th class="p-2">Total</th>
        </tr>
      </thead>
      <tbody>
        <!-- Standard Skills -->
        <tr
          v-for="sk in skills"
          :key="sk.name"
          :class="[
            'even:bg-gray-50 text-black',
            isClassSkill(sk.name) ? 'bg-green-100 font-semibold' : '',
            !isUntrained(sk) && sk.rank === 0 ? 'bg-red-100' : ''
          ]"
        >
          <td class="p-2">{{ sk.name }}</td>
          <td class="p-2">{{ sk.ability }}</td>
          <td class="p-2 text-center">
            <span v-if="isClassSkill(sk.name)" class="text-green-600 font-bold">✓</span>
          </td>
          <td class="p-2 text-center">
            <span :class="sk.untrained==='Yes' ? 'text-green-600' : 'text-red-600'">
              {{ sk.untrained }}
            </span>
          </td>
          <td class="p-2 text-center">
            <span :class="sk.armorCheckPenalty==='Yes' ? 'text-yellow-600' : 'text-gray-500'">
              {{ sk.armorCheckPenalty }}
            </span>
          </td>
          <td class="p-2 text-center">
            <button
              class="px-2 py-1 bg-green-600 text-white rounded"
              @click="rollSkill(sk)"
              title="Roll d20 for this skill"
            >🎲</button>
          </td>
          <td class="p-2 text-center">
            {{ abilityMod(sk.ability) >= 0 ? '+' : '' }}{{ abilityMod(sk.ability) }}
          </td>
          <td class="p-2">
            <input
              type="number"
              v-model.number="sk.rank"
              class="w-12 border p-1 rounded text-center"
              :min="0"
              :disabled="!isUntrained(sk) && sk.rank === 0"
              :title="!isUntrained(sk) ? 'Cannot use untrained' : ''"
            />
          </td>
          <td class="p-2">
            <input
              type="number"
              v-model.number="sk.misc"
              class="w-12 border p-1 rounded text-center"
            />
          </td>
          <td class="p-2 text-center">
            {{ classBonus(sk) !== 0 ? '+' + classBonus(sk) : '' }}
          </td>
          <td class="p-2 text-center font-bold">
            {{ skillTotal(sk) }}
          </td>
        </tr>

        <!-- Knowledge Subskills -->
        <tr
          v-for="(k, i) in characterState.knowledgeSkills"
          :key="'know' + i"
          :class="[
            'even:bg-gray-50 text-black',
            isClassSkill(`Knowledge (${k.subskill})`) ? 'bg-green-100 font-semibold' : '',
            !isUntrained(k) && k.rank === 0 ? 'bg-red-100' : ''
          ]"
        >
          <td class="p-2">Knowledge ({{ k.subskill }})</td>
          <td class="p-2 text-center">Int</td>
          <td class="p-2 text-center">
            <span v-if="isClassSkill(`Knowledge (${k.subskill})`)" class="text-green-600 font-bold">✓</span>
          </td>
          <td class="p-2 text-center">
            <span :class="k.untrained==='Yes' ? 'text-green-600' : 'text-red-600'">{{ k.untrained }}</span>
          </td>
          <td class="p-2 text-center"><span class="text-gray-500">—</span></td>
          <td class="p-2 text-center">
            <button class="px-2 py-1 bg-green-600 text-white rounded" @click="rollSkill(k)">🎲</button>
          </td>
          <td class="p-2 text-center">{{ abilityMod('INT') >= 0 ? '+' : '' }}{{ abilityMod('INT') }}</td>
          <td class="p-2">
            <input type="number" v-model.number="k.rank" class="w-12 border p-1 rounded text-center"/>
          </td>
          <td class="p-2">
            <input type="number" v-model.number="k.misc" class="w-12 border p-1 rounded text-center"/>
          </td>
          <td class="p-2 text-center">{{ classBonus(k) !== 0 ? '+' + classBonus(k) : '' }}</td>
          <td class="p-2 text-center font-bold">{{ skillTotal(k) }}</td>
        </tr>
        <tr>
          <td colspan="11">
            <button @click="addKnowledge" class="mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs">
              + Add Knowledge Skill
            </button>
          </td>
        </tr>

        <!-- Craft Subskills -->
        <tr
          v-for="(c, i) in characterState.craftSkills"
          :key="'craft' + i"
          :class="[
            'even:bg-gray-50 text-black',
            isClassSkill(`Craft (${c.subskill})`) ? 'bg-green-100 font-semibold' : '',
            !isUntrained(c) && c.rank === 0 ? 'bg-red-100' : ''
          ]"
        >
          <td class="p-2">Craft ({{ c.subskill }})</td>
          <td class="p-2 text-center">Int</td>
          <td class="p-2 text-center">
            <span v-if="isClassSkill(`Craft (${c.subskill})`)" class="text-green-600 font-bold">✓</span>
          </td>
          <td class="p-2 text-center">
            <span :class="c.untrained==='Yes' ? 'text-green-600' : 'text-red-600'">{{ c.untrained }}</span>
          </td>
          <td class="p-2 text-center"><span class="text-gray-500">—</span></td>
          <td class="p-2 text-center">
            <button class="px-2 py-1 bg-green-600 text-white rounded" @click="rollSkill(c)">🎲</button>
          </td>
          <td class="p-2 text-center">{{ abilityMod('INT') >= 0 ? '+' : '' }}{{ abilityMod('INT') }}</td>
          <td class="p-2">
            <input type="number" v-model.number="c.rank" class="w-12 border p-1 rounded text-center"/>
          </td>
          <td class="p-2">
            <input type="number" v-model.number="c.misc" class="w-12 border p-1 rounded text-center"/>
          </td>
          <td class="p-2 text-center">{{ classBonus(c) !== 0 ? '+' + classBonus(c) : '' }}</td>
          <td class="p-2 text-center font-bold">{{ skillTotal(c) }}</td>
        </tr>
        <tr>
          <td colspan="11">
            <button @click="addCraft" class="mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs">
              + Add Craft Skill
            </button>
          </td>
        </tr>
        <!-- Profession Subskills -->
        <tr
          v-for="(p, i) in characterState.professionSkills"
          :key="'prof' + i"
          :class="[
            'even:bg-gray-50 text-black',
            isClassSkill(`Profession (${p.subskill})`) ? 'bg-green-100 font-semibold' : '',
            !isUntrained(p) && p.rank === 0 ? 'bg-red-100' : ''
          ]"
        >
          <td class="p-2">Profession ({{ p.subskill }})</td>
          <td class="p-2 text-center">Wis</td>
          <td class="p-2 text-center">
            <span v-if="isClassSkill(`Profession (${p.subskill})`)" class="text-green-600 font-bold">✓</span>
          </td>
          <td class="p-2 text-center">
            <span :class="p.untrained==='Yes' ? 'text-green-600' : 'text-red-600'">{{ p.untrained }}</span>
          </td>
          <td class="p-2 text-center"><span class="text-gray-500">—</span></td>
          <td class="p-2 text-center">
            <button class="px-2 py-1 bg-green-600 text-white rounded" @click="rollSkill(p)">🎲</button>
          </td>
          <td class="p-2 text-center">{{ abilityMod('WIS') >= 0 ? '+' : '' }}{{ abilityMod('WIS') }}</td>
          <td class="p-2">
            <input type="number" v-model.number="p.rank" class="w-12 border p-1 rounded text-center"/>
          </td>
          <td class="p-2">
            <input type="number" v-model.number="p.misc" class="w-12 border p-1 rounded text-center"/>
          </td>
          <td class="p-2 text-center">{{ classBonus(p) !== 0 ? '+' + classBonus(p) : '' }}</td>
          <td class="p-2 text-center font-bold">{{ skillTotal(p) }}</td>
        </tr>
        <tr>
          <td colspan="11">
            <button @click="addProfession" class="mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs">
              + Add Profession Skill
            </button>
          </td>
        </tr>

        <!-- Lore Subskills -->
        <tr
          v-for="(l, i) in characterState.loreSkills"
          :key="'lore' + i"
          :class="[
            'even:bg-gray-50 text-black',
            isClassSkill(`Lore (${l.subskill})`) ? 'bg-green-100 font-semibold' : '',
            !isUntrained(l) && l.rank === 0 ? 'bg-red-100' : ''
          ]"
        >
          <td class="p-2">Lore ({{ l.subskill }})</td>
          <td class="p-2 text-center">Cha</td>
          <td class="p-2 text-center">
            <span v-if="isClassSkill(`Lore (${l.subskill})`)" class="text-green-600 font-bold">✓</span>
          </td>
          <td class="p-2 text-center">
            <span :class="l.untrained==='Yes' ? 'text-green-600' : 'text-red-600'">{{ l.untrained }}</span>
          </td>
          <td class="p-2 text-center"><span class="text-gray-500">—</span></td>
          <td class="p-2 text-center">
            <button class="px-2 py-1 bg-green-600 text-white rounded" @click="rollSkill(l)">🎲</button>
          </td>
          <td class="p-2 text-center">{{ abilityMod('CHA') >= 0 ? '+' : '' }}{{ abilityMod('CHA') }}</td>
          <td class="p-2">
            <input type="number" v-model.number="l.rank" class="w-12 border p-1 rounded text-center"/>
          </td>
          <td class="p-2">
            <input type="number" v-model.number="l.misc" class="w-12 border p-1 rounded text-center"/>
          </td>
          <td class="p-2 text-center">{{ classBonus(l) !== 0 ? '+' + classBonus(l) : '' }}</td>
          <td class="p-2 text-center font-bold">{{ skillTotal(l) }}</td>
        </tr>
        <tr>
          <td colspan="11">
            <button @click="addLore" class="mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs">
              + Add Lore Skill
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { characterState } from '../characterState.js'

const skills = characterState.skills

const currentClassList = computed(() =>
  characterState.classes.map(c => c.className).join(', ')
)

function isClassSkill(name) {
  return characterState.classes.some(c => {
    // Check if the class has this skill directly
    if (characterState.classSkills[c.className]?.includes(name)) return true
    
    // Special handling for Bard and Wizard with "Knowledge (All)"
    if (name.startsWith('Knowledge (') && 
        (c.className === 'Bard' || c.className === 'Wizard') &&
        characterState.classSkills[c.className]?.includes('Knowledge (All)')) {
      return true
    }
    
    // Special handling for general skill categories like "Craft" or "Profession"
    const baseSkill = name.split(' ')[0]
    if (characterState.classSkills[c.className]?.includes(baseSkill)) return true
    
    return false
  })
}

function isUntrained(sk) {
  return sk.untrained === 'Yes'
}

function abilityMod(stat) {
  const score = characterState.abilityScores[stat] || 0
  return Math.floor((score - 10) / 2)
}

function rollSkill(skill) {
  // TODO: Implement dice rolling logic
  const roll = Math.floor(Math.random() * 20) + 1
  const total = skillTotal(skill)
  console.log(`Rolling ${skill.name || skill.subskill}: d20(${roll}) + ${total} = ${roll + total}`)
}

// Fixed classBonus function - returns 3 if ANY class has it as a class skill
function classBonus(skill) {
  const skillName = skill.subskill
    ? `${skill.name || (skill.ability === 'INT' ? 'Knowledge' : skill.ability === 'WIS' ? 'Profession' : skill.ability === 'CHA' ? 'Lore' : 'Craft')} (${skill.subskill})`
    : skill.name
  
  // Check if ANY class has this as a class skill (not sum)
  const isAnyClassSkill = characterState.classes.some(c => {
    // Direct match
    if (characterState.classSkills[c.className]?.includes(skillName)) return true
    
    // Knowledge (All) for Bard and Wizard
    if (skillName.startsWith('Knowledge (') && 
        (c.className === 'Bard' || c.className === 'Wizard') &&
        characterState.classSkills[c.className]?.includes('Knowledge (All)')) {
      return true
    }
    
    // Check base categories
    const baseSkill = skillName.split(' ')[0]
    if (characterState.classSkills[c.className]?.includes(baseSkill)) return true
    
    return false
  })
  
  // Return 3 if it's a class skill and has at least 1 rank, otherwise 0
  return (isAnyClassSkill && skill.rank > 0) ? 3 : 0
}

// Fixed skillTotal function - no longer double-adding class bonus
function skillTotal(skill) {
  const skillName = skill.subskill
    ? `${skill.name || (skill.ability === 'INT' ? 'Knowledge' : skill.ability === 'WIS' ? 'Profession' : skill.ability === 'CHA' ? 'Lore' : 'Craft')} (${skill.subskill})`
    : skill.name
  
  // Calculate components
  const ranks = skill.rank || 0
  const abilityModValue = abilityMod(skill.ability || 'INT')
  const misc = skill.misc || 0
  const classBonusValue = classBonus(skill) // Get the class bonus (already handles the logic)
  
  // Return total without double-adding class bonus
  return ranks + abilityModValue + misc + classBonusValue
}

function addKnowledge() {
  characterState.knowledgeSkills.push({ 
    subskill: '', 
    rank: 0, 
    misc: 0, 
    untrained: 'No',
    ability: 'INT',
    name: 'Knowledge'
  })
}

function addCraft() {
  characterState.craftSkills.push({ 
    subskill: '', 
    rank: 0, 
    misc: 0, 
    untrained: 'Yes',
    ability: 'INT',
    name: 'Craft'
  })
}

function addProfession() {
  characterState.professionSkills.push({ 
    subskill: '', 
    rank: 0, 
    misc: 0, 
    untrained: 'No',
    ability: 'WIS',
    name: 'Profession'
  })
}

function addLore() {
  characterState.loreSkills.push({ 
    subskill: '', 
    rank: 0, 
    misc: 0, 
    untrained: 'No',
    ability: 'CHA',
    name: 'Lore'
  })
}
</script>
<style scoped>
table {
  border: 1px solid #374151;
}
thead th {
  background-color: #1f2937;
}
tbody tr:nth-child(odd) {
  background-color: #111827;
}
input:focus {
  outline: 2px solid #4f46e5;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 0.6em;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 0.3em;
}
</style>