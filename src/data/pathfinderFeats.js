<template>
  <div class="character-builder-wizard bg-gray-900 text-white p-6 rounded-lg max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-blue-300 mb-2">
        {{ isLevelUp ? '📈 Level Up Wizard' : '🎭 Character Builder' }}
      </h2>
      <div class="flex items-center gap-4 text-sm text-gray-400">
        <span>Step {{ currentStep + 1 }} of {{ totalSteps }}</span>
        <div class="flex-1 bg-gray-700 rounded-full h-2">
          <div 
            class="bg-blue-500 h-full rounded-full transition-all duration-300"
            :style="{ width: `${((currentStep + 1) / totalSteps) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="mb-6 min-h-[400px]">
      <!-- Step 1: Mode Selection (Creation Only) -->
      <div v-if="!isLevelUp && currentStep === 0" class="space-y-4">
        <h3 class="text-xl font-semibold mb-4">Choose Creation Method</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            @click="creationMode = 'guided'; nextStep()"
            class="p-6 bg-gray-800 hover:bg-gray-700 rounded-lg border-2 border-gray-600 hover:border-blue-500 transition-all"
          >
            <h4 class="text-lg font-bold text-green-300 mb-2">🎯 Guided Creation</h4>
            <p class="text-sm">Step-by-step character creation with recommendations</p>
          </button>
          <button 
            @click="creationMode = 'quick'; generateQuickCharacter()"
            class="p-6 bg-gray-800 hover:bg-gray-700 rounded-lg border-2 border-gray-600 hover:border-purple-500 transition-all"
          >
            <h4 class="text-lg font-bold text-purple-300 mb-2">⚡ Quick Build</h4>
            <p class="text-sm">Generate a balanced character instantly</p>
          </button>
        </div>
      </div>

      <!-- Step 2: Race Selection (Creation) / Class Selection (Level Up) -->
      <div v-else-if="(!isLevelUp && currentStep === 1) || (isLevelUp && currentStep === 0)" class="space-y-4">
        <h3 class="text-xl font-semibold mb-4">
          {{ isLevelUp ? 'Choose Class for Level ' + (currentLevel + 1) : 'Choose Your Race' }}
        </h3>
        
        <!-- Race Selection -->
        <div v-if="!isLevelUp">
          <!-- Race Category Filter -->
          <div class="mb-4 flex gap-2">
            <button 
              v-for="category in raceCategories"
              :key="category"
              @click="selectedRaceCategory = category"
              :class="[
                'px-4 py-2 rounded',
                selectedRaceCategory === category ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              ]"
            >
              {{ category }}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            <div 
              v-for="race in filteredRaces" 
              :key="race.id"
              @click="selectRace(race)"
              :class="[
                'p-4 bg-gray-800 rounded-lg cursor-pointer transition-all',
                selectedRace?.id === race.id ? 'border-2 border-blue-500' : 'border-2 border-gray-600 hover:border-gray-500'
              ]"
            >
              <h4 class="font-bold text-green-300">{{ race.name }}</h4>
              <p class="text-xs text-gray-400 mt-1">{{ race.size }} {{ race.type }}</p>
              <div class="mt-2 text-xs">
                <p class="text-blue-300">{{ formatAbilityMods(race.abilityMods) }}</p>
                <p class="text-gray-400 mt-1">{{ race.racialTraits.slice(0, 2).map(t => t.name).join(', ') }}...</p>
                <p class="text-xs text-yellow-400 mt-1">Speed: {{ race.speed }} ft.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Class Selection -->
        <div v-else>
          <!-- Class Category Filter -->
          <div class="mb-4 flex gap-2 flex-wrap">
            <button 
              v-for="category in classCategories"
              :key="category"
              @click="selectedClassCategory = category"
              :class="[
                'px-4 py-2 rounded',
                selectedClassCategory === category ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              ]"
            >
              {{ category }}
            </button>
          </div>

          <div class="mb-4 p-3 bg-gray-800 rounded">
            <p class="text-sm text-gray-400">Current Classes:</p>
            <div class="flex gap-2 mt-1 flex-wrap">
              <span 
                v-for="cls in currentClasses" 
                :key="cls.className"
                class="px-2 py-1 bg-gray-700 rounded text-sm"
              >
                {{ cls.className }} {{ cls.level }}
              </span>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            <div 
              v-for="cls in filteredClasses" 
              :key="cls.id"
              @click="selectClass(cls)"
              :class="[
                'p-4 bg-gray-800 rounded-lg cursor-pointer transition-all',
                selectedClass?.id === cls.id ? 'border-2 border-blue-500' : 'border-2 border-gray-600 hover:border-gray-500',
                !meetsClassRequirements(cls) ? 'opacity-50' : ''
              ]"
            >
              <h4 class="font-bold text-green-300">{{ cls.name }}</h4>
              <p class="text-xs text-gray-400">{{ cls.hitDie }} HD, {{ formatBAB(cls.bab) }} BAB</p>
              <div class="mt-2 text-xs">
                <p>{{ cls.skillPoints }} + Int skill points</p>
                <p class="text-blue-300 mt-1">{{ cls.primaryAbility }}</p>
                <p class="text-yellow-400 mt-1">{{ cls.alignment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Ability Scores (Creation) / Hit Points (Level Up) -->
      <div v-else-if="(!isLevelUp && currentStep === 2) || (isLevelUp && currentStep === 1)" class="space-y-4">
        <h3 class="text-xl font-semibold mb-4">
          {{ isLevelUp ? 'Roll Hit Points' : 'Determine Ability Scores' }}
        </h3>

        <!-- Ability Score Generation -->
        <div v-if="!isLevelUp" class="space-y-4">
          <div class="flex gap-2 mb-4">
            <button 
              v-for="method in ['standard', 'roll', 'pointbuy']"
              :key="method"
              @click="abilityMethod = method"
              :class="[
                'px-4 py-2 rounded',
                abilityMethod === method ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              ]"
            >
              {{ method === 'standard' ? 'Standard Array' : method === 'roll' ? 'Roll 4d6' : 'Point Buy' }}
            </button>
          </div>

          <!-- Flexible Ability Score Selection for Some Races -->
          <div v-if="selectedRace?.abilityMods?.any" class="mb-4 p-3 bg-gray-800 rounded">
            <p class="text-sm font-semibold mb-2">Choose Ability Score Bonus (+{{ selectedRace.abilityMods.any }})</p>
            <div class="flex gap-2">
              <button 
                v-for="ability in abilities"
                :key="ability"
                @click="flexibleAbilityChoice = ability"
                :class="[
                  'px-3 py-1 rounded',
                  flexibleAbilityChoice === ability ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                ]"
              >
                {{ ability }}
              </button>
            </div>
          </div>

          <!-- Standard Array -->
          <div v-if="abilityMethod === 'standard'" class="space-y-2">
            <p class="text-sm text-gray-400 mb-2">Assign these scores: 15, 14, 13, 12, 10, 8</p>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div v-for="ability in abilities" :key="ability" class="bg-gray-800 p-3 rounded">
                <label class="block text-sm font-medium mb-1">{{ ability }}</label>
                <select 
                  v-model="abilityScores[ability]"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1"
                >
                  <option :value="null">--</option>
                  <option v-for="score in availableScores" :key="score" :value="score">
                    {{ score }}
                  </option>
                </select>
                <p class="text-xs text-blue-300 mt-1">
                  Total: {{ getFinalAbilityScore(ability) }} 
                  ({{ getAbilityModifier(getFinalAbilityScore(ability)) >= 0 ? '+' : '' }}{{ getAbilityModifier(getFinalAbilityScore(ability)) }})
                </p>
              </div>
            </div>
          </div>

          <!-- Roll Method -->
          <div v-else-if="abilityMethod === 'roll'" class="space-y-2">
            <button 
              @click="rollAbilityScores"
              class="bg-green-600 hover:bg-green-500 px-4 py-2 rounded mb-3"
            >
              🎲 Roll All Scores
            </button>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div v-for="ability in abilities" :key="ability" class="bg-gray-800 p-3 rounded">
                <label class="block text-sm font-medium mb-1">{{ ability }}</label>
                <div class="flex items-center gap-2">
                  <input 
                    v-model.number="abilityScores[ability]"
                    type="number"
                    min="3"
                    max="18"
                    class="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1"
                  />
                  <button 
                    @click="rollSingleAbility(ability)"
                    class="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs"
                  >
                    🎲
                  </button>
                </div>
                <p class="text-xs text-blue-300 mt-1">
                  Total: {{ getFinalAbilityScore(ability) }} 
                  ({{ getAbilityModifier(getFinalAbilityScore(ability)) >= 0 ? '+' : '' }}{{ getAbilityModifier(getFinalAbilityScore(ability)) }})
                </p>
              </div>
            </div>
          </div>

          <!-- Point Buy -->
          <div v-else-if="abilityMethod === 'pointbuy'" class="space-y-2">
            <div class="mb-3 p-3 bg-gray-800 rounded">
              <p class="text-sm">Points Remaining: <span class="font-bold text-green-300">{{ pointBuyRemaining }}</span> / 27</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div v-for="ability in abilities" :key="ability" class="bg-gray-800 p-3 rounded">
                <label class="block text-sm font-medium mb-1">{{ ability }}</label>
                <div class="flex items-center gap-2">
                  <button 
                    @click="adjustPointBuy(ability, -1)"
                    :disabled="abilityScores[ability] <= 7"
                    class="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <span class="w-8 text-center">{{ abilityScores[ability] }}</span>
                  <button 
                    @click="adjustPointBuy(ability, 1)"
                    :disabled="abilityScores[ability] >= 15 || getPointCost(abilityScores[ability] + 1) > pointBuyRemaining"
                    class="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 px-2 py-1 rounded"
                  >
                    +
                  </button>
                </div>
                <p class="text-xs text-blue-300 mt-1">
                  Total: {{ getFinalAbilityScore(ability) }} 
                  ({{ getAbilityModifier(getFinalAbilityScore(ability)) >= 0 ? '+' : '' }}{{ getAbilityModifier(getFinalAbilityScore(ability)) }})
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Hit Point Rolling -->
        <div v-else class="space-y-4">
          <div class="bg-gray-800 p-6 rounded-lg text-center">
            <p class="text-lg mb-4">Rolling hit points for {{ selectedClass.name }} ({{ selectedClass.hitDie }})</p>
            
            <div v-if="!hitPointsRolled" class="space-y-4">
              <button 
                @click="rollHitPoints"
                class="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg text-lg font-semibold"
              >
                🎲 Roll Hit Points
              </button>
              <p class="text-sm text-gray-400">Or take average: {{ getAverageHP() }}</p>
              <button 
                @click="takeAverageHP"
                class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
              >
                Take Average
              </button>
            </div>

            <div v-else class="space-y-4">
              <div class="text-3xl font-bold text-green-300">
                {{ hitPointRoll }}
              </div>
              <p class="text-sm text-gray-400">
                + {{ getAbilityModifier(getFinalAbilityScore('CON')) }} (CON modifier)
                {{ favoredClassHP ? '+ 1 (Favored Class)' : '' }}
              </p>
              <p class="text-xl font-semibold">
                Total: +{{ getTotalHPGain() }} HP
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 4: Skills -->
      <div v-else-if="(!isLevelUp && currentStep === 3) || (isLevelUp && currentStep === 2)" class="space-y-4">
        <h3 class="text-xl font-semibold mb-4">Allocate Skill Points</h3>
        
        <div class="mb-4 p-3 bg-gray-800 rounded flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-400">Skill Points Available:</p>
            <p class="text-2xl font-bold text-green-300">{{ skillPointsRemaining }} / {{ totalSkillPoints }}</p>
          </div>
          <div class="text-sm text-gray-400">
            <p>Class Skills: {{ selectedClass.skillPoints }} + {{ getAbilityModifier(getFinalAbilityScore('INT')) }} (INT)</p>
            <p v-if="selectedRace?.name === 'Human'">+1 (Human bonus)</p>
            <p v-if="!isLevelUp">×4 (First level)</p>
          </div>
        </div>

        <!-- Skill Filter -->
        <div class="mb-3">
          <input 
            v-model="skillFilter"
            placeholder="Search skills..."
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
          <div 
            v-for="skill in filteredSkills" 
            :key="skill.name"
            class="bg-gray-800 p-3 rounded flex items-center justify-between"
          >
            <div class="flex-1">
              <p class="font-medium">
                {{ skill.name }}
                <span class="text-xs text-gray-400 ml-1">({{ skill.ability }})</span>
                <span v-if="isClassSkill(skill)" class="text-xs text-green-400 ml-1">●</span>
              </p>
              <p class="text-xs text-gray-400">{{ skill.description }}</p>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <button 
                @click="adjustSkillRanks(skill, -1)"
                :disabled="(skillRanks[skill.name] || 0) <= 0"
                class="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 px-2 py-1 rounded"
              >
                -
              </button>
              <span class="w-8 text-center">{{ skillRanks[skill.name] || 0 }}</span>
              <button 
                @click="adjustSkillRanks(skill, 1)"
                :disabled="skillPointsRemaining <= 0 || (skillRanks[skill.name] || 0) >= getMaxRanks()"
                class="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 px-2 py-1 rounded"
              >
                +
              </button>
              <span class="text-sm text-blue-300 ml-2">
                +{{ getSkillBonus(skill) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 5: Feats -->
      <div v-else-if="(!isLevelUp && currentStep === 4) || (isLevelUp && currentStep === 3)" class="space-y-4">
        <h3 class="text-xl font-semibold mb-4">Choose Feats</h3>
        
        <div class="mb-4 p-3 bg-gray-800 rounded">
          <p class="text-sm text-gray-400">Feats Available: <span class="font-bold text-green-300">{{ featsRemaining }}</span></p>
          <div class="text-xs text-gray-400 mt-1">
            <p v-if="!isLevelUp || currentLevel === 0">• 1 feat at 1st level</p>
            <p v-if="selectedRace?.name === 'Human'">• 1 bonus feat (Human)</p>
            <p v-if="isLevelUp && (currentLevel + 1) % 2 === 1">• 1 feat (odd level)</p>
            <p v-if="bonusFeatCount > 0">• {{ bonusFeatCount }} bonus feat(s) ({{ selectedClass.name }})</p>
          </div>
        </div>

        <!-- Feat Type Filter -->
        <div class="mb-3 flex gap-2 flex-wrap">
          <button 
            v-for="type in featTypes"
            :key="type"
            @click="featTypeFilter = type"
            :class="[
              'px-3 py-1 rounded text-sm',
              featTypeFilter === type ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            ]"
          >
            {{ type }}
          </button>
        </div>

        <div class="mb-3">
          <input 
            v-model="featFilter"
            placeholder="Search feats..."
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
          />
        </div>

        <div class="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
          <div 
            v-for="feat in filteredFeats" 
            :key="feat.name"
            @click="toggleFeat(feat)"
            :class="[
              'p-3 bg-gray-800 rounded cursor-pointer transition-all',
              selectedFeats.find(f => f.name === feat.name) ? 'border-2 border-blue-500' : 'border-2 border-gray-600 hover:border-gray-500',
              !meetsPrerequisites(feat) ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-bold">{{ feat.name }}</h4>
                <p class="text-xs text-gray-500 italic">{{ feat.type }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ feat.description }}</p>
                <p v-if="formatPrerequisites(feat.prerequisites)" class="text-xs text-yellow-400 mt-1">
                  Requires: {{ formatPrerequisites(feat.prerequisites) }}
                </p>
              </div>
              <div v-if="selectedFeats.find(f => f.name === feat.name)" class="ml-2 text-green-400">
                ✓
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 6: Equipment (Creation Only) -->
      <div v-else-if="!isLevelUp && currentStep === 5" class="space-y-4">
        <h3 class="text-xl font-semibold mb-4">Starting Equipment</h3>
        
        <div class="mb-4 p-3 bg-gray-800 rounded">
          <p class="text-sm text-gray-400">Starting Gold: <span class="font-bold text-yellow-300">{{ startingGold }} gp</span></p>
          <p class="text-xs text-gray-500 mt-1">{{ selectedClass.startingWealth }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Quick Packs -->
          <div>
            <h4 class="font-semibold mb-2">Quick Equipment Packs</h4>
            <div class="space-y-2">
              <button 
                v-for="pack in equipmentPacks" 
                :key="pack.name"
                @click="selectEquipmentPack(pack)"
                class="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded text-left"
              >
                <p class="font-medium">{{ pack.name }}</p>
                <p class="text-xs text-gray-400">{{ pack.cost }} gp</p>
              </button>
            </div>
          </div>

          <!-- Selected Equipment -->
          <div>
            <h4 class="font-semibold mb-2">Your Equipment</h4>
            <div class="bg-gray-800 p-3 rounded space-y-1 max-h-64 overflow-y-auto">
              <div v-if="selectedEquipment.length === 0" class="text-gray-500 text-sm">
                No equipment selected
              </div>
              <div v-for="(item, index) in selectedEquipment" :key="index" class="flex justify-between text-sm">
                <span>{{ item.name }}</span>
                <span class="text-yellow-300">{{ item.cost }} gp</span>
              </div>
              <div v-if="selectedEquipment.length > 0" class="border-t border-gray-700 pt-1 mt-2">
                <div class="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span class="text-yellow-300">{{ totalEquipmentCost }} gp</span>
                </div>
                <div class="flex justify-between text-sm text-gray-400">
                  <span>Remaining:</span>
                  <span>{{ startingGold - totalEquipmentCost }} gp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div v-else-if="(!isLevelUp && currentStep === 6) || (isLevelUp && currentStep === 4)" class="space-y-4">
        <h3 class="text-xl font-semibold mb-4">Summary</h3>
        
        <div class="bg-gray-800 p-4 rounded-lg space-y-3">
          <h4 class="font-bold text-green-300 text-lg">
            {{ isLevelUp ? 'Level Up Complete!' : 'Character Complete!' }}
          </h4>
          
          <div v-if="!isLevelUp" class="space-y-2">
            <p><strong>Name:</strong> {{ characterName || 'Unnamed Hero' }}</p>
            <p><strong>Race:</strong> {{ selectedRace?.name }}</p>
            <p><strong>Class:</strong> {{ selectedClass?.name }} 1</p>
            <div>
              <p class="font-semibold mb-1">Ability Scores:</p>
              <div class="grid grid-cols-3 gap-2 text-sm">
                <span v-for="ability in abilities" :key="ability">
                  {{ ability }}: {{ getFinalAbilityScore(ability) }} 
                  ({{ getAbilityModifier(getFinalAbilityScore(ability)) >= 0 ? '+' : '' }}{{ getAbilityModifier(getFinalAbilityScore(ability)) }})
                </span>
              </div>
            </div>
            <div>
              <p class="font-semibold mb-1">Racial Traits:</p>
              <ul class="text-sm text-gray-300 ml-4">
                <li v-for="trait in selectedRace?.racialTraits" :key="trait.name" class="list-disc">
                  {{ trait.name }}
                </li>
              </ul>
            </div>
          </div>
          
          <div v-else class="space-y-2">
            <p><strong>New Level:</strong> {{ selectedClass?.name }} {{ getClassLevel(selectedClass?.name) + 1 }}</p>
            <p><strong>Total Character Level:</strong> {{ currentLevel + 1 }}</p>
            <p><strong>Hit Points Gained:</strong> +{{ getTotalHPGain() }}</p>
            <p><strong>Skill Points Spent:</strong> {{ totalSkillPoints - skillPointsRemaining }}</p>
            <p v-if="selectedFeats.length > 0"><strong>New Feats:</strong> {{ selectedFeats.map(f => f.name).join(', ') }}</p>
            <div v-if="getNewClassFeatures().length > 0">
              <p class="font-semibold">New Class Features:</p>
              <ul class="text-sm text-gray-300 ml-4">
                <li v-for="feature in getNewClassFeatures()" :key="feature" class="list-disc">
                  {{ feature }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between items-center">
      <button 
        @click="previousStep"
        :disabled="currentStep === 0"
        class="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 px-4 py-2 rounded"
      >
        ← Previous
      </button>
      
      <div class="flex gap-2">
        <button 
          @click="cancel"
          class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button 
          @click="nextStep"
          :disabled="!canProceed"
          class="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 px-4 py-2 rounded"
        >
          {{ currentStep === totalSteps - 1 ? 'Finish' : 'Next →' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { characterState } from '../characterState.js'
import { 
  pathfinderRaces, 
  getAllRaces, 
  getRaceById,
  applyRacialModifiers,
  getSizeModifiers 
} from '../data/pathfinderRaces.js'
import { 
  pathfinderClasses, 
  getAllClasses, 
  getClassById,
  getBAB,
  getSaves,
  getClassFeatures,
  grantsBonus
atLevel,
  meetsClassRequirements as checkClassRequirements,
  getSpellcastingInfo
} from '../data/pathfinderClasses.js'
import { 
  pathfinderFeats,
  getAllFeats,
  meetsPrerequisites as checkFeatPrerequisites,
  getFeatsByType,
  getClassBonusFeats,
  getTotalFeats
} from '../data/pathfinderFeats.js'

// Props
const props = defineProps({
  mode: {
    type: String,
    default: 'create' // 'create' or 'levelup'
  },
  onComplete: Function,
  onCancel: Function
})

// Emit
const emit = defineEmits(['complete', 'cancel'])

// Core state
const currentStep = ref(0)
const isLevelUp = computed(() => props.mode === 'levelup')
const creationMode = ref('guided')
const characterName = ref('')

// Race/Class selection
const selectedRace = ref(null)
const selectedClass = ref(null)
const currentClasses = ref([])
const currentLevel = ref(0)
const selectedRaceCategory = ref('All')
const selectedClassCategory = ref('All')
const flexibleAbilityChoice = ref(null) // For races with flexible ability scores

// Ability scores
const abilityMethod = ref('standard')
const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
const abilityScores = ref({
  STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10
})
const standardArray = [15, 14, 13, 12, 10, 8]
const availableScores = ref([...standardArray])

// Hit points
const hitPointsRolled = ref(false)
const hitPointRoll = ref(0)
const favoredClassHP = ref(true) // Whether taking HP for favored class

// Skills
const skillRanks = ref({})
const totalSkillPoints = ref(0)
const skillPointsRemaining = ref(0)
const skillFilter = ref('')

// Feats
const selectedFeats = ref([])
const featFilter = ref('')
const featTypeFilter = ref('All')
const featsRemaining = ref(1)
const bonusFeatCount = ref(0)

// Equipment
const startingGold = ref(150)
const selectedEquipment = ref([])

// Data categories
const raceCategories = computed(() => ['All', 'Core', 'Featured', 'Uncommon'])
const classCategories = computed(() => ['All', 'Core', 'Base', 'Hybrid', 'Occult', 'Alternate', 'Unchained'])
const featTypes = computed(() => ['All', 'Combat', 'General', 'Metamagic', 'Item Creation', 'Teamwork', 'Style'])

// All available skills
const availableSkills = [
  { name: 'Acrobatics', ability: 'DEX', description: 'Balance, tumble, and move gracefully' },
  { name: 'Appraise', ability: 'INT', description: 'Evaluate the worth of items' },
  { name: 'Bluff', ability: 'CHA', description: 'Deceive and mislead others' },
  { name: 'Climb', ability: 'STR', description: 'Scale walls and cliffs' },
  { name: 'Craft', ability: 'INT', description: 'Create items and goods' },
  { name: 'Diplomacy', ability: 'CHA', description: 'Negotiate and influence others' },
  { name: 'Disable Device', ability: 'DEX', description: 'Pick locks and disarm traps' },
  { name: 'Disguise', ability: 'CHA', description: 'Change your appearance' },
  { name: 'Escape Artist', ability: 'DEX', description: 'Escape bonds and grapples' },
  { name: 'Fly', ability: 'DEX', description: 'Maneuver while flying' },
  { name: 'Handle Animal', ability: 'CHA', description: 'Train and work with animals' },
  { name: 'Heal', ability: 'WIS', description: 'Treat wounds and ailments' },
  { name: 'Intimidate', ability: 'CHA', description: 'Frighten or coerce others' },
  { name: 'Knowledge (arcana)', ability: 'INT', description: 'Magic and supernatural' },
  { name: 'Knowledge (dungeoneering)', ability: 'INT', description: 'Dungeons and underground' },
  { name: 'Knowledge (engineering)', ability: 'INT', description: 'Buildings and structures' },
  { name: 'Knowledge (geography)', ability: 'INT', description: 'Lands and terrain' },
  { name: 'Knowledge (history)', ability: 'INT', description: 'Past events and lore' },
  { name: 'Knowledge (local)', ability: 'INT', description: 'Local customs and personalities' },
  { name: 'Knowledge (nature)', ability: 'INT', description: 'Animals, plants, and weather' },
  { name: 'Knowledge (nobility)', ability: 'INT', description: 'Royalty and heraldry' },
  { name: 'Knowledge (planes)', ability: 'INT', description: 'Other dimensions and planes' },
  { name: 'Knowledge (religion)', ability: 'INT', description: 'Gods and theology' },
  { name: 'Linguistics', ability: 'INT', description: 'Languages and forgery' },
  { name: 'Perception', ability: 'WIS', description: 'Notice things around you' },
  { name: 'Perform', ability: 'CHA', description: 'Entertain audiences' },
  { name: 'Profession', ability: 'WIS', description: 'Practice a trade' },
  { name: 'Ride', ability: 'DEX', description: 'Ride mounts' },
  { name: 'Sense Motive', ability: 'WIS', description: 'Discern lies and intentions' },
  { name: 'Sleight of Hand', ability: 'DEX', description: 'Pick pockets and conceal items' },
  { name: 'Spellcraft', ability: 'INT', description: 'Identify spells and magic' },
  { name: 'Stealth', ability: 'DEX', description: 'Hide and move silently' },
  { name: 'Survival', ability: 'WIS', description: 'Survive in the wild' },
  { name: 'Swim', ability: 'STR', description: 'Move through water' },
  { name: 'Use Magic Device', ability: 'CHA', description: 'Activate magic items' }
]

const equipmentPacks = [
  {
    name: 'Adventurer\'s Pack',
    cost: 50,
    items: ['Backpack', 'Bedroll', 'Belt pouch', 'Flint and steel', 'Hemp rope (50 ft)', 'Torches (10)', 'Trail rations (5 days)', 'Waterskin']
  },
  {
    name: 'Warrior\'s Kit',
    cost: 100,
    items: ['Longsword', 'Shield', 'Scale mail', 'Backpack', 'Bedroll', 'Trail rations (3 days)']
  },
  {
    name: 'Archer\'s Kit',
    cost: 80,
    items: ['Shortbow', 'Arrows (40)', 'Leather armor', 'Backpack', 'Bedroll', 'Trail rations (3 days)']
  },
  {
    name: 'Scholar\'s Kit',
    cost: 40,
    items: ['Spellbook', 'Ink and pen', 'Parchment (10 sheets)', 'Scholar\'s outfit', 'Backpack', 'Scroll case']
  },
  {
    name: 'Cleric\'s Kit',
    cost: 60,
    items: ['Holy symbol', 'Healer\'s kit', 'Holy water (2)', 'Backpack', 'Bedroll', 'Trail rations (3 days)']
  },
  {
    name: 'Rogue\'s Kit',
    cost: 90,
    items: ['Thieves\' tools', 'Daggers (2)', 'Leather armor', 'Backpack', 'Rope', 'Caltrops']
  }
]

// Computed properties
const totalSteps = computed(() => {
  if (isLevelUp.value) return 5 // Class, HP, Skills, Feats, Summary
  return 7 // Mode, Race, Abilities, Skills, Feats, Equipment, Summary
})

const canProceed = computed(() => {
  if (!isLevelUp.value) {
    switch (currentStep.value) {
      case 0: return true // Mode selection
      case 1: return selectedRace.value !== null
      case 2: return validateAbilityScores()
      case 3: return true // Skills (can skip)
      case 4: return selectedFeats.value.length === featsRemaining.value || featsRemaining.value === 0
      case 5: return true // Equipment (can skip)
      case 6: return true // Summary
    }
  } else {
    switch (currentStep.value) {
      case 0: return selectedClass.value !== null
      case 1: return hitPointsRolled.value
      case 2: return true // Skills (can skip)
      case 3: return selectedFeats.value.length === featsRemaining.value || featsRemaining.value === 0
      case 4: return true // Summary
    }
  }
  return false
})

const pointBuyRemaining = computed(() => {
  let spent = 0
  for (const ability in abilityScores.value) {
    spent += getPointCost(abilityScores.value[ability])
  }
  return 27 - spent
})

const totalEquipmentCost = computed(() => {
  return selectedEquipment.value.reduce((sum, item) => sum + item.cost, 0)
})

const filteredRaces = computed(() => {
  let races = getAllRaces()
  
  if (selectedRaceCategory.value !== 'All') {
    races = races.filter(race => race.category === selectedRaceCategory.value)
  }
  
  return races
})

const filteredClasses = computed(() => {
  let classes = getAllClasses()
  
  if (selectedClassCategory.value !== 'All') {
    classes = classes.filter(cls => cls.category === selectedClassCategory.value)
  }
  
  return classes
})

const filteredSkills = computed(() => {
  if (!skillFilter.value) return availableSkills
  
  const filter = skillFilter.value.toLowerCase()
  return availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(filter) ||
    skill.description.toLowerCase().includes(filter) ||
    skill.ability.toLowerCase().includes(filter)
  )
})

const filteredFeats = computed(() => {
  let feats = getAllFeats()
  
  // Filter by type
  if (featTypeFilter.value !== 'All') {
    feats = feats.filter(feat => feat.type.includes(featTypeFilter.value))
  }
  
  // If this is a bonus feat, filter to allowed types
  if (bonusFeatCount.value > 0 && selectedFeats.value.length < bonusFeatCount.value) {
    const allowedFeats = getClassBonusFeats(selectedClass.value.name, isLevelUp.value ? currentLevel.value + 1 : 1)
    if (allowedFeats.length > 0) {
      feats = feats.filter(feat => allowedFeats.some(allowed => allowed.name === feat.name))
    }
  }
  
  // Filter by search text
  if (featFilter.value) {
    const filter = featFilter.value.toLowerCase()
    feats = feats.filter(feat => 
      feat.name.toLowerCase().includes(filter) ||
      feat.description.toLowerCase().includes(filter) ||
      feat.type.toLowerCase().includes(filter)
    )
  }
  
  return feats
})

// Methods
function formatAbilityMods(mods) {
  if (mods.any) return `+${mods.any} to any`
  return Object.entries(mods)
    .map(([ability, mod]) => `${mod > 0 ? '+' : ''}${mod} ${ability}`)
    .join(', ')
}

function formatBAB(bab) {
  switch (bab) {
    case 'full': return 'Full'
    case '3/4': return '3/4'
    case '1/2': return '1/2'
    default: return bab
  }
}

function selectRace(race) {
  selectedRace.value = race
  if (race.abilityMods.any) {
    flexibleAbilityChoice.value = null // Reset flexible choice
  }
}

function selectClass(cls) {
  if (meetsClassRequirements(cls)) {
    selectedClass.value = cls
    calculateSkillPoints()
    calculateFeatsAvailable()
  }
}

function meetsClassRequirements(cls) {
  // Build character object for checking
  const character = {
    alignment: characterState.alignment || 'Neutral',
    deity: characterState.deity
  }
  
  return checkClassRequirements(character, cls.name)
}

function validateAbilityScores() {
  if (abilityMethod.value === 'standard') {
    // Check all scores are assigned
    const assigned = Object.values(abilityScores.value).filter(v => v !== null)
    return assigned.length === 6 && new Set(assigned).size === 6
  }
  
  // For races with flexible ability scores, make sure one is chosen
  if (selectedRace.value?.abilityMods?.any && !flexibleAbilityChoice.value) {
    return false
  }
  
  return true
}

function rollAbilityScores() {
  for (const ability of abilities) {
    rollSingleAbility(ability)
  }
}

function rollSingleAbility(ability) {
  // Roll 4d6, drop lowest
  const rolls = Array(4).fill(0).map(() => Math.floor(Math.random() * 6) + 1)
  rolls.sort((a, b) => b - a)
  abilityScores.value[ability] = rolls[0] + rolls[1] + rolls[2]
}

function getPointCost(score) {
  const costs = {
    7: -4, 8: -2, 9: -1, 10: 0, 11: 1, 12: 2, 13: 3, 14: 5, 15: 7
  }
  return costs[score] || 0
}

function adjustPointBuy(ability, delta) {
  const current = abilityScores.value[ability]
  const newScore = current + delta
  if (newScore >= 7 && newScore <= 15) {
    const newCost = getPointCost(newScore)
    const currentCost = getPointCost(current)
    if (delta > 0 && (newCost - currentCost) <= pointBuyRemaining.value) {
      abilityScores.value[ability] = newScore
    } else if (delta < 0) {
      abilityScores.value[ability] = newScore
    }
  }
}

function getFinalAbilityScore(ability) {
  let score = abilityScores.value[ability] || 10
  
  // Add racial modifiers
  if (selectedRace.value?.abilityMods) {
    if (selectedRace.value.abilityMods.any) {
      // Flexible ability score
      if (flexibleAbilityChoice.value === ability) {
        score += selectedRace.value.abilityMods.any
      }
    } else if (selectedRace.value.abilityMods[ability]) {
      // Fixed racial modifier
      score += selectedRace.value.abilityMods[ability]
    }
  }
  
  return score
}

function getAbilityModifier(score) {
  return Math.floor((score - 10) / 2)
}

function rollHitPoints() {
  const dieSize = parseInt(selectedClass.value.hitDie.substring(1))
  hitPointRoll.value = Math.floor(Math.random() * dieSize) + 1
  hitPointsRolled.value = true
}

function getAverageHP() {
  const dieSize = parseInt(selectedClass.value.hitDie.substring(1))
  return Math.floor(dieSize / 2) + 1
}

function takeAverageHP() {
  hitPointRoll.value = getAverageHP()
  hitPointsRolled.value = true
}

function getTotalHPGain() {
  const conMod = getAbilityModifier(getFinalAbilityScore('CON'))
  const favoredBonus = favoredClassHP.value ? 1 : 0
  return hitPointRoll.value + conMod + favoredBonus
}

function calculateSkillPoints() {
  if (!selectedClass.value) return
  
  const intMod = getAbilityModifier(getFinalAbilityScore('INT'))
  let points = selectedClass.value.skillPoints + intMod
  
  // Human bonus
  if (selectedRace.value?.name === 'Human') {
    points += 1
  }
  
  // Minimum 1 skill point
  points = Math.max(1, points)
  
  // First level gets x4
  if (!isLevelUp.value) {
    points *= 4
  }
  
  totalSkillPoints.value = points
  skillPointsRemaining.value = points
}

function isClassSkill(skill) {
  if (!selectedClass.value) return false
  
  // Handle "Knowledge (all)" for some classes
  if (selectedClass.value.classSkills.includes('Knowledge (all)') && skill.name.startsWith('Knowledge')) {
    return true
  }
  
  return selectedClass.value.classSkills.includes(skill.name)
}

function getMaxRanks() {
  return isLevelUp.value ? currentLevel.value + 1 : 1
}

function adjustSkillRanks(skill, delta) {
  const current = skillRanks.value[skill.name] || 0
  const newRanks = current + delta
  
  if (delta > 0 && skillPointsRemaining.value > 0 && newRanks <= getMaxRanks()) {
    skillRanks.value[skill.name] = newRanks
    skillPointsRemaining.value -= 1
  } else if (delta < 0 && current > 0) {
    skillRanks.value[skill.name] = newRanks
    skillPointsRemaining.value += 1
  }
}

function getSkillBonus(skill) {
  const ranks = skillRanks.value[skill.name] || 0
  const abilityMod = getAbilityModifier(getFinalAbilityScore(skill.ability))
  const classBonus = isClassSkill(skill) && ranks > 0 ? 3 : 0
  
  // Add any racial bonuses (simplified)
  let racialBonus = 0
  if (selectedRace.value?.name === 'Elf' && skill.name === 'Perception') {
    racialBonus = 2
  }
  // Add more racial skill bonuses as needed
  
  return ranks + abilityMod + classBonus + racialBonus
}

function calculateFeatsAvailable() {
  let feats = 0
  
  if (!isLevelUp.value || currentLevel.value === 0) {
    feats += 1 // 1st level feat
  }
  
  if (selectedRace.value?.name === 'Human') {
    feats += 1 // Human bonus feat
  }
  
  if (isLevelUp.value && (currentLevel.value + 1) % 2 === 1 && currentLevel.value > 0) {
    feats += 1 // Odd level feat (3rd, 5th, 7th, etc.)
  }
  
  // Check for class bonus feats
  let bonusFeats = 0
  if (selectedClass.value && grantsBonus
atLevel(selectedClass.value.name, isLevelUp.value ? currentLevel.value + 1 : 1)) {
    bonusFeats += 1
  }
  
  bonusFeatCount.value = bonusFeats
  featsRemaining.value = feats + bonusFeats
}

function meetsPrerequisites(feat) {
  // Build character object for checking
  const character = {
    abilityScores: abilities.reduce((acc, ability) => {
      acc[ability] = getFinalAbilityScore(ability)
      return acc
    }, {}),
    bab: isLevelUp.value ? getBAB(selectedClass.value.name, currentLevel.value + 1) : 1,
    feats: selectedFeats.value.map(f => f.name),
    skills: skillRanks.value,
    race: selectedRace.value?.name,
    level: isLevelUp.value ? getClassLevel(selectedClass.value.name) + 1 : 1,
    totalLevel: isLevelUp.value ? currentLevel.value + 1 : 1,
    classes: currentClasses.value
  }
  
  return checkFeatPrerequisites(character, feat)
}

function formatPrerequisites(prereqs) {
  if (!prereqs) return ''
  
  const parts = []
  
  if (prereqs.abilities) {
    for (const [ability, score] of Object.entries(prereqs.abilities)) {
      parts.push(`${ability} ${score}`)
    }
  }
  
  if (prereqs.bab) {
    parts.push(`BAB +${prereqs.bab}`)
  }
  
  if (prereqs.feats) {
    parts.push(...prereqs.feats)
  }
  
  if (prereqs.skills) {
    for (const [skill, ranks] of Object.entries(prereqs.skills)) {
      parts.push(`${skill} ${ranks} ranks`)
    }
  }
  
  if (prereqs.casterLevel) {
    parts.push(`Caster level ${prereqs.casterLevel}`)
  }
  
  if (prereqs.race) {
    parts.push(`${prereqs.race} race`)
  }
  
  return parts.join(', ')
}

function toggleFeat(feat) {
  if (!meetsPrerequisites(feat)) return
  
  const index = selectedFeats.value.findIndex(f => f.name === feat.name)
  if (index > -1) {
    selectedFeats.value.splice(index, 1)
  } else if (selectedFeats.value.length < featsRemaining.value) {
    selectedFeats.value.push(feat)
  }
}

function selectEquipmentPack(pack) {
  selectedEquipment.value = pack.items.map(name => ({ 
    name, 
    cost: Math.floor(pack.cost / pack.items.length) // Simplified cost distribution
  }))
}

function getClassLevel(className) {
  const cls = currentClasses.value.find(c => c.className === className)
  return cls ? cls.level : 0
}

function getNewClassFeatures() {
  if (!selectedClass.value || !isLevelUp.value) return []
  
  const newLevel = getClassLevel(selectedClass.value.name) + 1
  return getClassFeatures(selectedClass.value.name, newLevel)
}

function generateQuickCharacter() {
  // Quick character generation
  selectedRace.value = getAllRaces().find(r => r.name === 'Human')
  selectedClass.value = getAllClasses().find(c => c.name === 'Fighter')
  
  // Standard array optimized for fighter
  abilityScores.value = {
    STR: 15, DEX: 13, CON: 14, INT: 10, WIS: 12, CHA: 8
  }
  flexibleAbilityChoice.value = 'STR' // Human +2 to STR
  
  // Auto-allocate skills
  calculateSkillPoints()
  // Fighters get few skills, put them in useful places
  const fighterSkills = ['Intimidate', 'Climb', 'Survival']
  const pointsPerSkill = Math.floor(totalSkillPoints.value / fighterSkills.length)
  fighterSkills.forEach(skill => {
    skillRanks.value[skill] = pointsPerSkill
  })
  skillPointsRemaining.value = totalSkillPoints.value % fighterSkills.length
  
  // Select basic feats
  calculateFeatsAvailable()
  selectedFeats.value = [
    getAllFeats().find(f => f.name === 'Power Attack'),
    getAllFeats().find(f => f.name === 'Weapon Focus')
  ].filter(Boolean)
  
  // Basic equipment
  selectEquipmentPack(equipmentPacks.find(p => p.name === "Warrior's Kit"))
  
  // Generate starting gold
  rollStartingGold()
  
  // Jump to summary
  currentStep.value = totalSteps.value - 1
}

function rollStartingGold() {
  if (!selectedClass.value) return
  
  // Parse starting wealth (e.g., "5d6 × 10 gp")
  const wealthMatch = selectedClass.value.startingWealth.match(/(\d+)d(\d+)\s*×\s*(\d+)/)
  if (wealthMatch) {
    const [, numDice, dieSize, multiplier] = wealthMatch.map(Number)
    let total = 0
    for (let i = 0; i < numDice; i++) {
      total += Math.floor(Math.random() * dieSize) + 1
    }
    startingGold.value = total * multiplier
  }
}

function nextStep() {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
    
    // Initialize step-specific data
    if (!isLevelUp.value && currentStep.value === 3 || isLevelUp.value && currentStep.value === 2) {
      calculateSkillPoints()
    }
    
    if (!isLevelUp.value && currentStep.value === 4 || isLevelUp.value && currentStep.value === 3) {
      calculateFeatsAvailable()
    }
    
    if (!isLevelUp.value && currentStep.value === 5) {
      rollStartingGold()
    }
  } else {
    completeCharacter()
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function completeCharacter() {
  const characterData = {
    mode: props.mode,
    name: characterName.value,
    race: selectedRace.value,
    class: selectedClass.value,
    abilityScores: { ...abilityScores.value },
    finalAbilityScores: abilities.reduce((acc, ability) => {
      acc[ability] = getFinalAbilityScore(ability)
      return acc
    }, {}),
    flexibleAbilityChoice: flexibleAbilityChoice.value,
    skills: { ...skillRanks.value },
    feats: [...selectedFeats.value],
    equipment: [...selectedEquipment.value],
    hitPointsGained: isLevelUp.value ? getTotalHPGain() : null,
    startingGold: startingGold.value,
    remainingGold: startingGold.value - totalEquipmentCost.value
  }
  
  emit('complete', characterData)
  if (props.onComplete) {
    props.onComplete(characterData)
  }
}

function cancel() {
  emit('cancel')
  if (props.onCancel) {
    props.onCancel()
  }
}

// Initialize
onMounted(() => {
  if (isLevelUp.value) {
    // Load current character data
    currentClasses.value = characterState.classes || []
    currentLevel.value = currentClasses.value.reduce((sum, c) => sum + c.level, 0)
    
    // Copy current ability scores
    if (characterState.abilityScores) {
      Object.assign(abilityScores.value, characterState.abilityScores)
    }
    
    // Load current race
    if (characterState.race) {
      selectedRace.value = getRaceById(characterState.race)
    }
  }
})
</script>

<style scoped>
/* Custom scrollbar for skill/feat lists */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #1F2937;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 3px;
}

/* Smooth transitions */
button, div {
  transition: all 0.2s ease;
}
</style>