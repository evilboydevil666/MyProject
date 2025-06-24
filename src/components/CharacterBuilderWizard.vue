<template>
  <div class="character-builder-overlay">
    <div class="character-builder-wizard bg-gray-900 text-white p-6 rounded-lg shadow-2xl border border-gray-700">
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

      <!-- Step Content - Scrollable container -->
      <div class="step-content-container mb-6">
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

        <!-- Step 2: Race Selection (Creation) -->
        <div v-else-if="!isLevelUp && currentStep === 1" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">Choose Your Race</h3>
          
          <!-- Race Categories -->
          <div class="mb-4">
            <div class="flex gap-2 flex-wrap">
              <button 
                v-for="category in raceCategories"
                :key="category"
                @click="selectedRaceCategory = category"
                :class="[
                  'px-3 py-1 rounded text-sm',
                  selectedRaceCategory === category ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                ]"
              >
                {{ category }}
              </button>
            </div>
          </div>
          
          <!-- Race Grid -->
          <div class="race-selection-container">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              <div 
                v-for="race in filteredRaces" 
                :key="race.id"
                @click="selectRace(race)"
                :class="[
                  'race-card p-4 bg-gray-800 rounded-lg cursor-pointer transition-all transform hover:scale-105',
                  selectedRace?.id === race.id ? 'border-2 border-blue-500 bg-gray-700' : 'border-2 border-gray-600 hover:border-gray-500'
                ]"
              >
                <h4 class="font-bold text-green-300">{{ race.name }}</h4>
                <p class="text-xs text-gray-400 mt-1">{{ race.size }} {{ race.type }}</p>
                <div class="mt-2 text-xs">
                  <p class="text-blue-300">{{ formatAbilityMods(race.abilityMods) }}</p>
                  <p class="text-gray-400 mt-1">{{ race.traits.slice(0, 2).join(', ') }}{{ race.traits.length > 2 ? '...' : '' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2b: Class Selection (Level Up) -->
        <div v-else-if="isLevelUp && currentStep === 0" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">Choose Class for Level {{ currentLevel + 1 }}</h3>
          
          <!-- Current Classes -->
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
          
          <!-- Class Categories -->
          <div class="mb-4">
            <div class="flex gap-2 flex-wrap">
              <button 
                v-for="category in classCategories"
                :key="category"
                @click="selectedClassCategory = category"
                :class="[
                  'px-3 py-1 rounded text-sm',
                  selectedClassCategory === category ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                ]"
              >
                {{ category }}
              </button>
            </div>
          </div>
          
          <!-- Class Grid -->
          <div class="class-selection-container">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div 
                v-for="cls in filteredClasses" 
                :key="cls.id"
                @click="selectClass(cls)"
                :class="[
                  'class-card p-4 bg-gray-800 rounded-lg cursor-pointer transition-all transform hover:scale-105',
                  selectedClass?.id === cls.id ? 'border-2 border-blue-500 bg-gray-700' : 'border-2 border-gray-600 hover:border-gray-500'
                ]"
              >
                <h4 class="font-bold text-green-300">{{ cls.name }}</h4>
                <p class="text-xs text-gray-400">{{ cls.hitDie }} HD, {{ cls.bab }} BAB</p>
                <div class="mt-2 text-xs">
                  <p>{{ cls.skillPoints }} + Int skill points</p>
                  <p class="text-blue-300 mt-1">{{ cls.primaryAbility }}</p>
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
            <div class="flex gap-2 mb-4 flex-wrap">
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
                  {{ selectedClass.name === 'Barbarian' ? '+ 4 (Favored Class)' : '+ 1 (Favored Class)' }}
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
            </div>
          </div>

          <div class="skills-list grid grid-cols-1 md:grid-cols-2 gap-2">
            <div 
              v-for="skill in availableSkills" 
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
              <p v-if="hasBonusFeats()">• {{ getBonusFeatsCount() }} bonus feat(s) ({{ selectedClass.name }})</p>
            </div>
          </div>

          <div class="mb-3">
            <input 
              v-model="featFilter"
              placeholder="Search feats..."
              class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            />
          </div>

          <div class="feats-list grid grid-cols-1 gap-2">
            <div 
              v-for="feat in filteredFeats" 
              :key="feat.name"
              @click="toggleFeat(feat)"
              :class="[
                'feat-card p-3 bg-gray-800 rounded cursor-pointer transition-all transform hover:scale-102',
                selectedFeats.includes(feat.name) ? 'border-2 border-blue-500 bg-gray-700' : 'border-2 border-gray-600 hover:border-gray-500',
                !meetsPrerequisites(feat) ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h4 class="font-bold">{{ feat.name }}</h4>
                  <p class="text-xs text-gray-400 mt-1">{{ feat.description }}</p>
                  <p v-if="feat.prerequisites" class="text-xs text-yellow-400 mt-1">
                    Requires: {{ feat.prerequisites }}
                  </p>
                </div>
                <div v-if="selectedFeats.includes(feat.name)" class="ml-2 text-green-400">
                  ✓
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 6: Equipment Shopping (Creation Only) -->
        <div v-else-if="!isLevelUp && currentStep === 5" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">Purchase Starting Equipment</h3>
          
          <!-- Gold Display -->
          <div class="mb-4 p-3 bg-gray-800 rounded flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-400">Starting Gold:</p>
              <p class="text-2xl font-bold text-yellow-300">{{ startingGold }} gp</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Spent:</p>
              <p class="text-xl font-bold text-red-300">{{ totalEquipmentCost }} gp</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Remaining:</p>
              <p class="text-xl font-bold text-green-300">{{ startingGold - totalEquipmentCost }} gp</p>
            </div>
          </div>

          <!-- Equipment Categories -->
          <div class="mb-4">
            <div class="flex gap-2 flex-wrap">
              <button 
                v-for="category in equipmentCategories"
                :key="category"
                @click="selectedEquipmentCategory = category"
                :class="[
                  'px-3 py-1 rounded text-sm',
                  selectedEquipmentCategory === category ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                ]"
              >
                {{ category }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Available Items -->
            <div>
              <h4 class="font-semibold mb-2">Available Items</h4>
              <div class="bg-gray-800 p-3 rounded max-h-96 overflow-y-auto">
                <div 
                  v-for="item in affordableItems" 
                  :key="item.name"
                  @click="purchaseItem(item)"
                  class="flex justify-between items-center p-2 hover:bg-gray-700 rounded cursor-pointer"
                >
                  <div class="flex-1">
                    <p class="font-medium">{{ item.name }}</p>
                    <p class="text-xs text-gray-400">{{ item.description }}</p>
                  </div>
                  <div class="ml-4 text-right whitespace-nowrap">
                    <p class="text-yellow-300 font-medium">{{ item.cost }} gp</p>
                    <p class="text-xs text-gray-400">{{ item.weight }} lb</p>
                  </div>
                </div>
                <div v-if="affordableItems.length === 0" class="text-gray-500 text-center py-4">
                  No items available in this category within budget
                </div>
              </div>
            </div>

            <!-- Purchased Items -->
            <div>
              <h4 class="font-semibold mb-2">Your Equipment</h4>
              <div class="bg-gray-800 p-3 rounded max-h-96 overflow-y-auto">
                <div v-if="selectedEquipment.length === 0" class="text-gray-500 text-sm text-center py-4">
                  No equipment purchased yet
                </div>
                <div 
                  v-for="(item, index) in selectedEquipment" 
                  :key="index"
                  class="flex justify-between items-center p-2 hover:bg-gray-700 rounded"
                >
                  <div class="flex-1">
                    <p class="font-medium">{{ item.name }}</p>
                    <p class="text-xs text-gray-400">
                      {{ item.quantity }}x @ {{ item.cost }} gp each
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-yellow-300">{{ item.cost * item.quantity }} gp</span>
                    <button 
                      @click="removeItem(index)"
                      class="text-red-400 hover:text-red-300 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <!-- Totals -->
                <div v-if="selectedEquipment.length > 0" class="border-t border-gray-700 pt-2 mt-2">
                  <div class="flex justify-between font-semibold">
                    <span>Total Weight:</span>
                    <span>{{ totalEquipmentWeight }} lbs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Packs Option -->
          <div class="mt-4">
            <h4 class="font-semibold mb-2">Quick Equipment Packs</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <button 
                v-for="pack in equipmentPacks.filter(p => p.cost <= startingGold - totalEquipmentCost)" 
                :key="pack.name"
                @click="selectEquipmentPack(pack)"
                class="p-3 bg-gray-800 hover:bg-gray-700 rounded text-left transition-all"
              >
                <p class="font-medium">{{ pack.name }}</p>
                <p class="text-xs text-gray-400">{{ pack.cost }} gp</p>
                <p class="text-xs text-blue-300 mt-1">{{ pack.items.length }} items</p>
              </button>
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
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Character Name:</label>
                <input 
                  v-model="characterName"
                  placeholder="Enter character name..."
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
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
              <p><strong>Starting HP:</strong> {{ getStartingHP() }}</p>
              <p><strong>Equipment Value:</strong> {{ totalEquipmentCost }} gp</p>
              <p><strong>Remaining Gold:</strong> {{ startingGold - totalEquipmentCost }} gp</p>
            </div>
            
            <div v-else class="space-y-2">
              <p><strong>New Level:</strong> {{ selectedClass?.name }} {{ getClassLevel(selectedClass?.name) + 1 }}</p>
              <p><strong>Total Character Level:</strong> {{ currentLevel + 1 }}</p>
              <p><strong>Hit Points Gained:</strong> +{{ getTotalHPGain() }}</p>
              <p><strong>Skill Points Spent:</strong> {{ totalSkillPoints - skillPointsRemaining }}</p>
              <p v-if="selectedFeats.length > 0"><strong>New Feats:</strong> {{ selectedFeats.join(', ') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between items-center pt-4 border-t border-gray-700">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { characterState } from '@/characterState.js'
import { pathfinderData } from '@/data/pathfinderData.js'

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
const selectedRaceCategory = ref('Core')
const selectedClassCategory = ref('Core')

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

// Skills
const skillRanks = ref({})
const totalSkillPoints = ref(0)
const skillPointsRemaining = ref(0)

// Feats
const selectedFeats = ref([])
const featFilter = ref('')
const featsRemaining = ref(1)

// Equipment
const startingGold = ref(150)
const selectedEquipment = ref([])
const selectedEquipmentCategory = ref('Weapons')

// Categories - Added "All" option for viewing everything
const raceCategories = ['Core', 'Featured', 'Uncommon', 'Other', 'All']
const classCategories = ['Core', 'Base', 'Hybrid', 'Occult', 'Alternate', 'All']
const equipmentCategories = ['Weapons', 'Armor', 'Adventuring Gear', 'Tools', 'Magic Items', 'Consumables']

// Import data (expanded to include more races and classes)
const availableRaces = pathfinderData?.races || [
  // Core Races
  {
    id: 'human',
    name: 'Human',
    category: 'Core',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { any: 2 },
    traits: ['Bonus Feat', 'Bonus Skill Points', 'Flexible'],
    speed: 30
  },
  {
    id: 'elf',
    name: 'Elf',
    category: 'Core',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { DEX: 2, CON: -2, INT: 2 },
    traits: ['Low-Light Vision', 'Elven Immunities', 'Keen Senses'],
    speed: 30
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    category: 'Core',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { CON: 2, WIS: 2, CHA: -2 },
    traits: ['Darkvision', 'Hardy', 'Stability'],
    speed: 20
  },
  {
    id: 'halfling',
    name: 'Halfling',
    category: 'Core',
    size: 'Small',
    type: 'Humanoid',
    abilityMods: { DEX: 2, STR: -2, CHA: 2 },
    traits: ['Small', 'Fearless', 'Lucky'],
    speed: 20
  },
  {
    id: 'half-orc',
    name: 'Half-Orc',
    category: 'Core',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { STR: 2 },
    traits: ['Darkvision', 'Intimidating', 'Orc Ferocity'],
    speed: 30
  },
  {
    id: 'gnome',
    name: 'Gnome',
    category: 'Core',
    size: 'Small',
    type: 'Humanoid',
    abilityMods: { CON: 2, STR: -2, CHA: 2 },
    traits: ['Small', 'Low-Light Vision', 'Gnome Magic'],
    speed: 20
  },
  {
    id: 'half-elf',
    name: 'Half-Elf',
    category: 'Core',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { any: 2 },
    traits: ['Low-Light Vision', 'Adaptability', 'Elf Blood'],
    speed: 30
  },
  // Featured Races
  {
    id: 'aasimar',
    name: 'Aasimar',
    category: 'Featured',
    size: 'Medium',
    type: 'Outsider',
    abilityMods: { WIS: 2, CHA: 2 },
    traits: ['Darkvision', 'Celestial Resistance', 'Skilled'],
    speed: 30
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    category: 'Featured',
    size: 'Medium',
    type: 'Outsider',
    abilityMods: { DEX: 2, INT: 2, CHA: -2 },
    traits: ['Darkvision', 'Fiendish Resistance', 'Skilled'],
    speed: 30
  },
  {
    id: 'catfolk',
    name: 'Catfolk',
    category: 'Featured',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { DEX: 2, CHA: 2, WIS: -2 },
    traits: ['Low-Light Vision', 'Cat\'s Luck', 'Natural Hunter'],
    speed: 30
  },
  {
    id: 'dhampir',
    name: 'Dhampir',
    category: 'Featured',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { DEX: 2, CHA: 2, CON: -2 },
    traits: ['Low-Light Vision', 'Undead Resistance', 'Negative Energy Affinity'],
    speed: 30
  },
  {
    id: 'drow',
    name: 'Drow',
    category: 'Featured',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { DEX: 2, CHA: 2, CON: -2 },
    traits: ['Darkvision', 'Spell Resistance', 'Light Blindness'],
    speed: 30
  },
  {
    id: 'fetchling',
    name: 'Fetchling',
    category: 'Featured',
    size: 'Medium',
    type: 'Outsider',
    abilityMods: { DEX: 2, CHA: 2, WIS: -2 },
    traits: ['Darkvision', 'Shadow Blending', 'Skilled'],
    speed: 30
  },
  {
    id: 'goblin',
    name: 'Goblin',
    category: 'Featured',
    size: 'Small',
    type: 'Humanoid',
    abilityMods: { DEX: 4, STR: -2, CHA: -2 },
    traits: ['Darkvision', 'Fast', 'Skilled'],
    speed: 30
  },
  {
    id: 'hobgoblin',
    name: 'Hobgoblin',
    category: 'Featured',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { DEX: 2, CON: 2 },
    traits: ['Darkvision', 'Sneaky', 'Militaristic'],
    speed: 30
  },
  {
    id: 'ifrit',
    name: 'Ifrit',
    category: 'Featured',
    size: 'Medium',
    type: 'Outsider',
    abilityMods: { DEX: 2, CHA: 2, WIS: -2 },
    traits: ['Darkvision', 'Fire Affinity', 'Fire Resistance'],
    speed: 30
  },
  {
    id: 'kobold',
    name: 'Kobold',
    category: 'Featured',
    size: 'Small',
    type: 'Humanoid',
    abilityMods: { DEX: 2, STR: -4, CON: -2 },
    traits: ['Darkvision', 'Crafty', 'Light Sensitivity'],
    speed: 30
  },
  {
    id: 'orc',
    name: 'Orc',
    category: 'Featured',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { STR: 4, INT: -2, WIS: -2, CHA: -2 },
    traits: ['Darkvision', 'Ferocity', 'Light Sensitivity'],
    speed: 30
  },
  {
    id: 'oread',
    name: 'Oread',
    category: 'Featured',
    size: 'Medium',
    type: 'Outsider',
    abilityMods: { STR: 2, WIS: 2, CHA: -2 },
    traits: ['Darkvision', 'Earth Affinity', 'Acid Resistance'],
    speed: 20
  },
  {
    id: 'ratfolk',
    name: 'Ratfolk',
    category: 'Featured',
    size: 'Small',
    type: 'Humanoid',
    abilityMods: { DEX: 2, INT: 2, STR: -2 },
    traits: ['Darkvision', 'Tinker', 'Rodent Empathy'],
    speed: 20
  },
  {
    id: 'sylph',
    name: 'Sylph',
    category: 'Featured',
    size: 'Medium',
    type: 'Outsider',
    abilityMods: { DEX: 2, INT: 2, CON: -2 },
    traits: ['Darkvision', 'Air Affinity', 'Electricity Resistance'],
    speed: 30
  },
  {
    id: 'tengu',
    name: 'Tengu',
    category: 'Featured',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { DEX: 2, WIS: 2, CON: -2 },
    traits: ['Low-Light Vision', 'Sneaky', 'Natural Weapons'],
    speed: 30
  },
  {
    id: 'undine',
    name: 'Undine',
    category: 'Featured',
    size: 'Medium',
    type: 'Outsider',
    abilityMods: { DEX: 2, WIS: 2, STR: -2 },
    traits: ['Darkvision', 'Water Affinity', 'Cold Resistance'],
    speed: 30
  },
  // Uncommon Races
  {
    id: 'changeling',
    name: 'Changeling',
    category: 'Uncommon',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { WIS: 2, CHA: 2, CON: -2 },
    traits: ['Darkvision', 'Hulver', 'Sea Lungs'],
    speed: 30
  },
  {
    id: 'duergar',
    name: 'Duergar',
    category: 'Uncommon',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { CON: 2, WIS: 2, CHA: -4 },
    traits: ['Darkvision', 'Duergar Immunities', 'Stability'],
    speed: 20
  },
  {
    id: 'gillman',
    name: 'Gillman',
    category: 'Uncommon',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { CON: 2, CHA: 2, WIS: -2 },
    traits: ['Amphibious', 'Enchantment Resistance', 'Water Dependent'],
    speed: 30
  },
  {
    id: 'grippli',
    name: 'Grippli',
    category: 'Uncommon',
    size: 'Small',
    type: 'Humanoid',
    abilityMods: { DEX: 2, WIS: 2, STR: -2 },
    traits: ['Darkvision', 'Camouflage', 'Jumper'],
    speed: 30
  },
  {
    id: 'kitsune',
    name: 'Kitsune',
    category: 'Uncommon',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { DEX: 2, CHA: 2, STR: -2 },
    traits: ['Low-Light Vision', 'Change Shape', 'Kitsune Magic'],
    speed: 30
  },
  {
    id: 'merfolk',
    name: 'Merfolk',
    category: 'Uncommon',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { DEX: 2, CON: 2, CHA: 2 },
    traits: ['Aquatic', 'Amphibious', 'Low-Light Vision'],
    speed: 5
  },
  {
    id: 'nagaji',
    name: 'Nagaji',
    category: 'Uncommon',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { STR: 2, CHA: 2, INT: -2 },
    traits: ['Low-Light Vision', 'Armored Scales', 'Resistant'],
    speed: 30
  },
  {
    id: 'samsaran',
    name: 'Samsaran',
    category: 'Uncommon',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { INT: 2, WIS: 2, CON: -2 },
    traits: ['Low-Light Vision', 'Lifebound', 'Samsaran Magic'],
    speed: 30
  },
  {
    id: 'strix',
    name: 'Strix',
    category: 'Uncommon',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { DEX: 2, CHA: -2 },
    traits: ['Darkvision', 'Flight', 'Hatred'],
    speed: 30
  },
  {
    id: 'suli',
    name: 'Suli',
    category: 'Uncommon',
    size: 'Medium',
    type: 'Outsider',
    abilityMods: { STR: 2, CHA: 2, INT: -2 },
    traits: ['Low-Light Vision', 'Elemental Resistance', 'Elemental Assault'],
    speed: 30
  },
  {
    id: 'svirfneblin',
    name: 'Svirfneblin',
    category: 'Uncommon',
    size: 'Small',
    type: 'Humanoid',
    abilityMods: { DEX: 2, WIS: 2, STR: -2, CHA: -4 },
    traits: ['Darkvision', 'Spell Resistance', 'Svirfneblin Magic'],
    speed: 20
  },
  {
    id: 'vanara',
    name: 'Vanara',
    category: 'Uncommon',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { DEX: 2, WIS: 2, CHA: -2 },
    traits: ['Low-Light Vision', 'Nimble', 'Prehensile Tail'],
    speed: 30
  },
  {
    id: 'vishkanya',
    name: 'Vishkanya',
    category: 'Uncommon',
    size: 'Medium',
    type: 'Humanoid',
    abilityMods: { DEX: 2, CHA: 2, WIS: -2 },
    traits: ['Low-Light Vision', 'Keen Senses', 'Poison Use'],
    speed: 30
  },
  {
    id: 'wayang',
    name: 'Wayang',
    category: 'Uncommon',
    size: 'Small',
    type: 'Humanoid',
    abilityMods: { DEX: 2, INT: 2, WIS: -2 },
    traits: ['Darkvision', 'Light and Dark', 'Shadow Magic'],
    speed: 20
  }
]

const availableClasses = pathfinderData?.classes || [
  // Core Classes
  {
    id: 'barbarian',
    name: 'Barbarian',
    category: 'Core',
    hitDie: 'd12',
    bab: 'Full',
    skillPoints: 4,
    primaryAbility: 'STR',
    classSkills: ['Acrobatics', 'Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Knowledge (nature)', 'Perception', 'Ride', 'Survival', 'Swim']
  },
  {
    id: 'bard',
    name: 'Bard',
    category: 'Core',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 6,
    primaryAbility: 'CHA',
    classSkills: ['Acrobatics', 'Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy', 'Disguise', 'Escape Artist', 'Intimidate', 'Knowledge (all)', 'Linguistics', 'Perception', 'Perform', 'Profession', 'Sense Motive', 'Sleight of Hand', 'Spellcraft', 'Stealth', 'Use Magic Device']
  },
  {
    id: 'cleric',
    name: 'Cleric',
    category: 'Core',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 2,
    primaryAbility: 'WIS',
    classSkills: ['Appraise', 'Craft', 'Diplomacy', 'Heal', 'Knowledge (arcana)', 'Knowledge (history)', 'Knowledge (nobility)', 'Knowledge (planes)', 'Knowledge (religion)', 'Linguistics', 'Profession', 'Sense Motive', 'Spellcraft']
  },
  {
    id: 'druid',
    name: 'Druid',
    category: 'Core',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 4,
    primaryAbility: 'WIS',
    classSkills: ['Climb', 'Craft', 'Fly', 'Handle Animal', 'Heal', 'Knowledge (geography)', 'Knowledge (nature)', 'Perception', 'Profession', 'Ride', 'Spellcraft', 'Survival', 'Swim']
  },
  {
    id: 'fighter',
    name: 'Fighter',
    category: 'Core',
    hitDie: 'd10',
    bab: 'Full',
    skillPoints: 2,
    primaryAbility: 'STR or DEX',
    classSkills: ['Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Knowledge (dungeoneering)', 'Knowledge (engineering)', 'Profession', 'Ride', 'Survival', 'Swim'],
    bonusFeats: true
  },
  {
    id: 'monk',
    name: 'Monk',
    category: 'Core',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 4,
    primaryAbility: 'WIS',
    classSkills: ['Acrobatics', 'Climb', 'Craft', 'Escape Artist', 'Intimidate', 'Knowledge (history)', 'Knowledge (religion)', 'Perception', 'Perform', 'Profession', 'Ride', 'Sense Motive', 'Stealth', 'Swim']
  },
  {
    id: 'paladin',
    name: 'Paladin',
    category: 'Core',
    hitDie: 'd10',
    bab: 'Full',
    skillPoints: 2,
    primaryAbility: 'CHA',
    classSkills: ['Craft', 'Diplomacy', 'Handle Animal', 'Heal', 'Knowledge (nobility)', 'Knowledge (religion)', 'Profession', 'Ride', 'Sense Motive', 'Spellcraft']
  },
  {
    id: 'ranger',
    name: 'Ranger',
    category: 'Core',
    hitDie: 'd10',
    bab: 'Full',
    skillPoints: 6,
    primaryAbility: 'STR or DEX',
    classSkills: ['Climb', 'Craft', 'Handle Animal', 'Heal', 'Intimidate', 'Knowledge (dungeoneering)', 'Knowledge (geography)', 'Knowledge (nature)', 'Perception', 'Profession', 'Ride', 'Spellcraft', 'Stealth', 'Survival', 'Swim']
  },
  {
    id: 'rogue',
    name: 'Rogue',
    category: 'Core',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 8,
    primaryAbility: 'DEX',
    classSkills: ['Acrobatics', 'Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Intimidate', 'Knowledge (dungeoneering)', 'Knowledge (local)', 'Linguistics', 'Perception', 'Perform', 'Profession', 'Sense Motive', 'Sleight of Hand', 'Stealth', 'Swim', 'Use Magic Device']
  },
  {
    id: 'sorcerer',
    name: 'Sorcerer',
    category: 'Core',
    hitDie: 'd6',
    bab: '1/2',
    skillPoints: 2,
    primaryAbility: 'CHA',
    classSkills: ['Appraise', 'Bluff', 'Craft', 'Fly', 'Intimidate', 'Knowledge (arcana)', 'Profession', 'Spellcraft', 'Use Magic Device']
  },
  {
    id: 'wizard',
    name: 'Wizard',
    category: 'Core',
    hitDie: 'd6',
    bab: '1/2',
    skillPoints: 2,
    primaryAbility: 'INT',
    classSkills: ['Appraise', 'Craft', 'Fly', 'Knowledge (all)', 'Linguistics', 'Profession', 'Spellcraft'],
    bonusFeats: true
  },
  // Base Classes
  {
    id: 'alchemist',
    name: 'Alchemist',
    category: 'Base',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 4,
    primaryAbility: 'INT',
    classSkills: ['Appraise', 'Craft', 'Disable Device', 'Fly', 'Heal', 'Knowledge (arcana)', 'Knowledge (nature)', 'Perception', 'Profession', 'Sleight of Hand', 'Spellcraft', 'Survival', 'Use Magic Device']
  },
  {
    id: 'cavalier',
    name: 'Cavalier',
    category: 'Base',
    hitDie: 'd10',
    bab: 'Full',
    skillPoints: 4,
    primaryAbility: 'STR',
    classSkills: ['Bluff', 'Climb', 'Craft', 'Diplomacy', 'Handle Animal', 'Intimidate', 'Profession', 'Ride', 'Sense Motive', 'Swim']
  },
  {
    id: 'gunslinger',
    name: 'Gunslinger',
    category: 'Base',
    hitDie: 'd10',
    bab: 'Full',
    skillPoints: 4,
    primaryAbility: 'DEX',
    classSkills: ['Acrobatics', 'Bluff', 'Climb', 'Craft', 'Handle Animal', 'Heal', 'Intimidate', 'Knowledge (engineering)', 'Knowledge (local)', 'Perception', 'Profession', 'Ride', 'Sleight of Hand', 'Survival', 'Swim']
  },
  {
    id: 'inquisitor',
    name: 'Inquisitor',
    category: 'Base',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 6,
    primaryAbility: 'WIS',
    classSkills: ['Bluff', 'Climb', 'Craft', 'Diplomacy', 'Disguise', 'Heal', 'Intimidate', 'Knowledge (arcana)', 'Knowledge (dungeoneering)', 'Knowledge (nature)', 'Knowledge (planes)', 'Knowledge (religion)', 'Perception', 'Profession', 'Ride', 'Sense Motive', 'Spellcraft', 'Stealth', 'Survival', 'Swim']
  },
  {
    id: 'magus',
    name: 'Magus',
    category: 'Base',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 2,
    primaryAbility: 'INT',
    classSkills: ['Climb', 'Craft', 'Fly', 'Intimidate', 'Knowledge (arcana)', 'Knowledge (dungeoneering)', 'Knowledge (planes)', 'Profession', 'Ride', 'Spellcraft', 'Swim', 'Use Magic Device']
  },
  {
    id: 'oracle',
    name: 'Oracle',
    category: 'Base',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 4,
    primaryAbility: 'CHA',
    classSkills: ['Craft', 'Diplomacy', 'Heal', 'Knowledge (history)', 'Knowledge (planes)', 'Knowledge (religion)', 'Profession', 'Sense Motive', 'Spellcraft']
  },
  {
    id: 'summoner',
    name: 'Summoner',
    category: 'Base',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 2,
    primaryAbility: 'CHA',
    classSkills: ['Craft', 'Fly', 'Handle Animal', 'Knowledge (all)', 'Linguistics', 'Profession', 'Ride', 'Spellcraft', 'Use Magic Device']
  },
  {
    id: 'witch',
    name: 'Witch',
    category: 'Base',
    hitDie: 'd6',
    bab: '1/2',
    skillPoints: 2,
    primaryAbility: 'INT',
    classSkills: ['Craft', 'Fly', 'Heal', 'Intimidate', 'Knowledge (arcana)', 'Knowledge (history)', 'Knowledge (nature)', 'Knowledge (planes)', 'Profession', 'Spellcraft', 'Use Magic Device']
  },
  // Hybrid Classes
  {
    id: 'arcanist',
    name: 'Arcanist',
    category: 'Hybrid',
    hitDie: 'd6',
    bab: '1/2',
    skillPoints: 2,
    primaryAbility: 'INT',
    classSkills: ['Appraise', 'Craft', 'Fly', 'Knowledge (all)', 'Linguistics', 'Profession', 'Spellcraft', 'Use Magic Device']
  },
  {
    id: 'bloodrager',
    name: 'Bloodrager',
    category: 'Hybrid',
    hitDie: 'd10',
    bab: 'Full',
    skillPoints: 4,
    primaryAbility: 'STR',
    classSkills: ['Acrobatics', 'Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Knowledge (arcana)', 'Perception', 'Ride', 'Spellcraft', 'Survival', 'Swim']
  },
  {
    id: 'brawler',
    name: 'Brawler',
    category: 'Hybrid',
    hitDie: 'd10',
    bab: 'Full',
    skillPoints: 4,
    primaryAbility: 'STR',
    classSkills: ['Acrobatics', 'Climb', 'Craft', 'Escape Artist', 'Handle Animal', 'Intimidate', 'Knowledge (dungeoneering)', 'Knowledge (local)', 'Perception', 'Profession', 'Ride', 'Sense Motive', 'Swim']
  },
  {
    id: 'hunter',
    name: 'Hunter',
    category: 'Hybrid',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 6,
    primaryAbility: 'WIS',
    classSkills: ['Climb', 'Craft', 'Handle Animal', 'Heal', 'Intimidate', 'Knowledge (dungeoneering)', 'Knowledge (geography)', 'Knowledge (nature)', 'Perception', 'Profession', 'Ride', 'Spellcraft', 'Stealth', 'Survival', 'Swim']
  },
  {
    id: 'investigator',
    name: 'Investigator',
    category: 'Hybrid',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 6,
    primaryAbility: 'INT',
    classSkills: ['Acrobatics', 'Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Heal', 'Intimidate', 'Knowledge (all)', 'Linguistics', 'Perception', 'Perform', 'Profession', 'Sense Motive', 'Sleight of Hand', 'Spellcraft', 'Stealth', 'Use Magic Device']
  },
  {
    id: 'shaman',
    name: 'Shaman',
    category: 'Hybrid',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 4,
    primaryAbility: 'WIS',
    classSkills: ['Craft', 'Diplomacy', 'Fly', 'Handle Animal', 'Heal', 'Knowledge (nature)', 'Knowledge (planes)', 'Knowledge (religion)', 'Profession', 'Ride', 'Spellcraft', 'Survival']
  },
  {
    id: 'skald',
    name: 'Skald',
    category: 'Hybrid',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 4,
    primaryAbility: 'CHA',
    classSkills: ['Acrobatics', 'Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy', 'Escape Artist', 'Handle Animal', 'Intimidate', 'Knowledge (all)', 'Linguistics', 'Perception', 'Perform', 'Profession', 'Ride', 'Sense Motive', 'Spellcraft', 'Swim', 'Use Magic Device']
  },
  {
    id: 'slayer',
    name: 'Slayer',
    category: 'Hybrid',
    hitDie: 'd10',
    bab: 'Full',
    skillPoints: 6,
    primaryAbility: 'STR or DEX',
    classSkills: ['Acrobatics', 'Bluff', 'Climb', 'Craft', 'Disguise', 'Heal', 'Intimidate', 'Knowledge (dungeoneering)', 'Knowledge (geography)', 'Knowledge (local)', 'Perception', 'Profession', 'Ride', 'Sense Motive', 'Stealth', 'Survival', 'Swim']
  },
  {
    id: 'swashbuckler',
    name: 'Swashbuckler',
    category: 'Hybrid',
    hitDie: 'd10',
    bab: 'Full',
    skillPoints: 4,
    primaryAbility: 'DEX',
    classSkills: ['Acrobatics', 'Bluff', 'Climb', 'Craft', 'Diplomacy', 'Escape Artist', 'Intimidate', 'Knowledge (local)', 'Knowledge (nobility)', 'Perception', 'Perform', 'Profession', 'Ride', 'Sense Motive', 'Swim']
  },
  {
    id: 'warpriest',
    name: 'Warpriest',
    category: 'Hybrid',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 2,
    primaryAbility: 'WIS',
    classSkills: ['Climb', 'Craft', 'Diplomacy', 'Handle Animal', 'Heal', 'Intimidate', 'Knowledge (engineering)', 'Knowledge (religion)', 'Profession', 'Ride', 'Sense Motive', 'Spellcraft', 'Survival', 'Swim']
  },
  // Occult Classes
  {
    id: 'kineticist',
    name: 'Kineticist',
    category: 'Occult',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 4,
    primaryAbility: 'CON',
    classSkills: ['Acrobatics', 'Craft', 'Heal', 'Intimidate', 'Perception', 'Profession', 'Stealth', 'Use Magic Device']
  },
  {
    id: 'medium',
    name: 'Medium',
    category: 'Occult',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 4,
    primaryAbility: 'CHA',
    classSkills: ['Bluff', 'Craft', 'Diplomacy', 'Heal', 'Intimidate', 'Knowledge (arcana)', 'Knowledge (planes)', 'Knowledge (religion)', 'Linguistics', 'Perception', 'Perform', 'Profession', 'Sense Motive', 'Spellcraft', 'Use Magic Device']
  },
  {
    id: 'mesmerist',
    name: 'Mesmerist',
    category: 'Occult',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 6,
    primaryAbility: 'CHA',
    classSkills: ['Appraise', 'Bluff', 'Craft', 'Diplomacy', 'Disguise', 'Escape Artist', 'Intimidate', 'Knowledge (arcana)', 'Knowledge (dungeoneering)', 'Knowledge (history)', 'Knowledge (local)', 'Knowledge (nobility)', 'Knowledge (religion)', 'Linguistics', 'Perception', 'Perform', 'Profession', 'Sense Motive', 'Sleight of Hand', 'Spellcraft', 'Stealth', 'Use Magic Device']
  },
  {
    id: 'occultist',
    name: 'Occultist',
    category: 'Occult',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 4,
    primaryAbility: 'INT',
    classSkills: ['Appraise', 'Craft', 'Diplomacy', 'Disable Device', 'Disguise', 'Fly', 'Knowledge (arcana)', 'Knowledge (engineering)', 'Knowledge (history)', 'Knowledge (planes)', 'Knowledge (religion)', 'Linguistics', 'Perception', 'Profession', 'Sense Motive', 'Sleight of Hand', 'Spellcraft', 'Use Magic Device']
  },
  {
    id: 'psychic',
    name: 'Psychic',
    category: 'Occult',
    hitDie: 'd6',
    bab: '1/2',
    skillPoints: 2,
    primaryAbility: 'INT',
    classSkills: ['Bluff', 'Craft', 'Diplomacy', 'Fly', 'Intimidate', 'Knowledge (all)', 'Linguistics', 'Perception', 'Profession', 'Sense Motive', 'Spellcraft']
  },
  {
    id: 'spiritualist',
    name: 'Spiritualist',
    category: 'Occult',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 4,
    primaryAbility: 'WIS',
    classSkills: ['Bluff', 'Craft', 'Fly', 'Heal', 'Intimidate', 'Knowledge (arcana)', 'Knowledge (dungeoneering)', 'Knowledge (history)', 'Knowledge (nature)', 'Knowledge (planes)', 'Knowledge (religion)', 'Linguistics', 'Profession', 'Sense Motive', 'Spellcraft', 'Use Magic Device']
  },
  // Alternate Classes
  {
    id: 'antipaladin',
    name: 'Antipaladin',
    category: 'Alternate',
    hitDie: 'd10',
    bab: 'Full',
    skillPoints: 2,
    primaryAbility: 'CHA',
    classSkills: ['Bluff', 'Craft', 'Disguise', 'Handle Animal', 'Intimidate', 'Knowledge (religion)', 'Profession', 'Ride', 'Sense Motive', 'Spellcraft', 'Stealth']
  },
  {
    id: 'ninja',
    name: 'Ninja',
    category: 'Alternate',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 8,
    primaryAbility: 'DEX',
    classSkills: ['Acrobatics', 'Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Intimidate', 'Knowledge (local)', 'Knowledge (nobility)', 'Linguistics', 'Perception', 'Perform', 'Profession', 'Sense Motive', 'Sleight of Hand', 'Stealth', 'Swim', 'Use Magic Device']
  },
  {
    id: 'samurai',
    name: 'Samurai',
    category: 'Alternate',
    hitDie: 'd10',
    bab: 'Full',
    skillPoints: 4,
    primaryAbility: 'STR',
    classSkills: ['Bluff', 'Climb', 'Craft', 'Diplomacy', 'Handle Animal', 'Intimidate', 'Profession', 'Ride', 'Sense Motive', 'Swim']
  }
]

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

const availableFeats = [
  { name: 'Acrobatic', description: '+2 on Acrobatics and Fly', prerequisites: null },
  { name: 'Agile Maneuvers', description: 'Use DEX for combat maneuvers', prerequisites: null },
  { name: 'Alertness', description: '+2 on Perception and Sense Motive', prerequisites: null },
  { name: 'Animal Affinity', description: '+2 on Handle Animal and Ride', prerequisites: null },
  { name: 'Arcane Strike', description: '+1 damage with magic weapons', prerequisites: 'Ability to cast arcane spells' },
  { name: 'Armor Proficiency (Light)', description: 'No penalties for wearing light armor', prerequisites: null },
  { name: 'Armor Proficiency (Medium)', description: 'No penalties for wearing medium armor', prerequisites: 'Light Armor Proficiency' },
  { name: 'Armor Proficiency (Heavy)', description: 'No penalties for wearing heavy armor', prerequisites: 'Medium Armor Proficiency' },
  { name: 'Athletic', description: '+2 on Climb and Swim', prerequisites: null },
  { name: 'Blind-Fight', description: 'Re-roll miss chances in melee', prerequisites: null },
  { name: 'Catch Off-Guard', description: 'No penalties for improvised weapons', prerequisites: null },
  { name: 'Combat Casting', description: '+4 on concentration checks for defensive casting', prerequisites: null },
  { name: 'Combat Expertise', description: 'Trade attack bonus for AC', prerequisites: 'INT 13' },
  { name: 'Combat Reflexes', description: 'Additional attacks of opportunity', prerequisites: 'DEX 13' },
  { name: 'Dazzling Display', description: 'Intimidate all foes within 30 feet', prerequisites: 'Weapon Focus' },
  { name: 'Deadly Aim', description: 'Trade ranged attack bonus for damage', prerequisites: 'DEX 13, BAB +1' },
  { name: 'Deceitful', description: '+2 on Bluff and Disguise', prerequisites: null },
  { name: 'Deft Hands', description: '+2 on Disable Device and Sleight of Hand', prerequisites: null },
  { name: 'Dodge', description: '+1 dodge bonus to AC', prerequisites: 'DEX 13' },
  { name: 'Endurance', description: '+4 on checks to avoid fatigue', prerequisites: null },
  { name: 'Eschew Materials', description: 'Cast spells without material components', prerequisites: null },
  { name: 'Exotic Weapon Proficiency', description: 'Use exotic weapon without penalty', prerequisites: 'BAB +1' },
  { name: 'Extra Channel', description: 'Channel energy two additional times per day', prerequisites: 'Channel energy' },
  { name: 'Extra Ki', description: 'Increase ki pool by 2', prerequisites: 'Ki pool' },
  { name: 'Extra Mercy', description: 'Add one mercy to lay on hands', prerequisites: 'Lay on hands' },
  { name: 'Extra Performance', description: '6 additional rounds of bardic performance per day', prerequisites: 'Bardic performance' },
  { name: 'Extra Rage', description: '6 additional rounds of rage per day', prerequisites: 'Rage' },
  { name: 'Great Fortitude', description: '+2 bonus on Fortitude saves', prerequisites: null },
  { name: 'Improved Bull Rush', description: '+2 on bull rush, no attack of opportunity', prerequisites: 'Power Attack' },
  { name: 'Improved Channel', description: '+2 DC on channel energy', prerequisites: 'Channel energy' },
  { name: 'Improved Counterspell', description: 'Counterspell with similar spell', prerequisites: null },
  { name: 'Improved Critical', description: 'Double threat range of weapon', prerequisites: 'Weapon proficiency, BAB +8' },
  { name: 'Improved Disarm', description: '+2 on disarm, no attack of opportunity', prerequisites: 'Combat Expertise' },
  { name: 'Improved Familiar', description: 'Gain a more powerful familiar', prerequisites: 'Familiar' },
  { name: 'Improved Grapple', description: '+2 on grapple, no attack of opportunity', prerequisites: 'Improved Unarmed Strike' },
  { name: 'Improved Initiative', description: '+4 bonus on initiative', prerequisites: null },
  { name: 'Improved Natural Armor', description: '+1 natural armor bonus', prerequisites: 'Natural armor' },
  { name: 'Improved Natural Attack', description: 'Increase natural weapon damage', prerequisites: 'Natural weapon' },
  { name: 'Improved Overrun', description: '+2 on overrun, no attack of opportunity', prerequisites: 'Power Attack' },
  { name: 'Improved Shield Bash', description: 'Keep shield bonus when bashing', prerequisites: 'Shield Proficiency' },
  { name: 'Improved Sunder', description: '+2 on sunder, no attack of opportunity', prerequisites: 'Power Attack' },
  { name: 'Improved Trip', description: '+2 on trip, no attack of opportunity', prerequisites: 'Combat Expertise' },
  { name: 'Improved Two-Weapon Fighting', description: 'Additional off-hand attack', prerequisites: 'Two-Weapon Fighting, BAB +6' },
  { name: 'Improved Unarmed Strike', description: 'Unarmed attacks don\'t provoke attacks', prerequisites: null },
  { name: 'Iron Will', description: '+2 bonus on Will saves', prerequisites: null },
  { name: 'Leadership', description: 'Attract followers and a cohort', prerequisites: 'Character level 7th' },
  { name: 'Lightning Reflexes', description: '+2 bonus on Reflex saves', prerequisites: null },
  { name: 'Magical Aptitude', description: '+2 on Spellcraft and Use Magic Device', prerequisites: null },
  { name: 'Martial Weapon Proficiency', description: 'Use martial weapon without penalty', prerequisites: null },
  { name: 'Mobility', description: '+4 AC against attacks of opportunity', prerequisites: 'Dodge' },
  { name: 'Mounted Combat', description: 'Avoid attacks on mount', prerequisites: 'Ride 1 rank' },
  { name: 'Natural Spell', description: 'Cast spells in wild shape', prerequisites: 'Wild shape' },
  { name: 'Nimble Moves', description: 'Ignore 5 feet of difficult terrain', prerequisites: 'DEX 13' },
  { name: 'Persuasive', description: '+2 on Diplomacy and Intimidate', prerequisites: null },
  { name: 'Point-Blank Shot', description: '+1 attack and damage with ranged weapons within 30 ft', prerequisites: null },
  { name: 'Power Attack', description: 'Trade attack bonus for damage', prerequisites: 'STR 13, BAB +1' },
  { name: 'Precise Shot', description: 'No penalty for shooting into melee', prerequisites: 'Point-Blank Shot' },
  { name: 'Quick Draw', description: 'Draw weapon as free action', prerequisites: 'BAB +1' },
  { name: 'Rapid Reload', description: 'Reload crossbow more quickly', prerequisites: null },
  { name: 'Rapid Shot', description: 'Extra ranged attack', prerequisites: 'Point-Blank Shot' },
  { name: 'Run', description: 'Run at 5x speed', prerequisites: null },
  { name: 'Self-Sufficient', description: '+2 on Heal and Survival', prerequisites: null },
  { name: 'Shield Focus', description: '+1 shield bonus to AC', prerequisites: 'Shield Proficiency' },
  { name: 'Shield Proficiency', description: 'No penalties for using shields', prerequisites: null },
  { name: 'Shot on the Run', description: 'Move, attack, move with ranged weapon', prerequisites: 'Mobility, Point-Blank Shot' },
  { name: 'Simple Weapon Proficiency', description: 'Use simple weapons without penalty', prerequisites: null },
  { name: 'Skill Focus', description: '+3 bonus on chosen skill', prerequisites: null },
  { name: 'Spell Focus', description: '+1 DC for spells from chosen school', prerequisites: null },
  { name: 'Spell Mastery', description: 'Prepare some spells without spellbook', prerequisites: 'Wizard level 1st' },
  { name: 'Spell Penetration', description: '+2 on caster level checks to overcome SR', prerequisites: null },
  { name: 'Spring Attack', description: 'Move, attack, move without provoking', prerequisites: 'Mobility, BAB +4' },
  { name: 'Stand Still', description: 'Stop enemies from moving past', prerequisites: 'Combat Reflexes' },
  { name: 'Stealthy', description: '+2 on Escape Artist and Stealth', prerequisites: null },
  { name: 'Step Up', description: '5-foot step as immediate action', prerequisites: 'BAB +1' },
  { name: 'Toughness', description: '+3 hit points, +1 per level after 3rd', prerequisites: null },
  { name: 'Two-Weapon Defense', description: '+1 shield bonus when fighting with two weapons', prerequisites: 'Two-Weapon Fighting' },
  { name: 'Two-Weapon Fighting', description: 'Reduce two-weapon fighting penalties', prerequisites: 'DEX 15' },
  { name: 'Vital Strike', description: 'Deal extra weapon damage', prerequisites: 'BAB +6' },
  { name: 'Weapon Finesse', description: 'Use DEX for attack with light weapons', prerequisites: null },
  { name: 'Weapon Focus', description: '+1 attack with chosen weapon', prerequisites: 'BAB +1' },
  { name: 'Weapon Specialization', description: '+2 damage with chosen weapon', prerequisites: 'Fighter level 4th' }
].sort((a, b) => a.name.localeCompare(b.name))

// Equipment database already sorted alphabetically within categories
const equipmentDatabase = pathfinderData?.equipment || {
  'Weapons': [
    // Simple Weapons
    { name: 'Club', cost: 0, weight: 3, description: 'Simple one-handed weapon (1d6 B)' },
    { name: 'Dagger', cost: 2, weight: 1, description: 'Simple light weapon (1d4 P/S)' },
    { name: 'Dart', cost: 0.5, weight: 0.5, description: 'Simple ranged weapon (1d4 P)' },
    { name: 'Heavy Crossbow', cost: 50, weight: 8, description: 'Simple ranged weapon (1d10 P)' },
    { name: 'Javelin', cost: 1, weight: 2, description: 'Simple ranged weapon (1d6 P)' },
    { name: 'Light Crossbow', cost: 35, weight: 4, description: 'Simple ranged weapon (1d8 P)' },
    { name: 'Quarterstaff', cost: 0, weight: 4, description: 'Simple two-handed weapon (1d6 B)' },
    { name: 'Sling', cost: 0, weight: 0, description: 'Simple ranged weapon (1d4 B)' },
    { name: 'Spear', cost: 2, weight: 6, description: 'Simple two-handed weapon (1d8 P)' },
    // Martial Weapons
    { name: 'Arrows (20)', cost: 1, weight: 3, description: 'Ammunition for bows' },
    { name: 'Battleaxe', cost: 10, weight: 6, description: 'Martial one-handed weapon (1d8 S)' },
    { name: 'Bolts (10)', cost: 1, weight: 1, description: 'Ammunition for crossbows' },
    { name: 'Falchion', cost: 75, weight: 8, description: 'Martial two-handed weapon (2d4 S)' },
    { name: 'Flail', cost: 8, weight: 5, description: 'Martial one-handed weapon (1d8 B)' },
    { name: 'Glaive', cost: 8, weight: 10, description: 'Martial two-handed weapon (1d10 S)' },
    { name: 'Greataxe', cost: 20, weight: 12, description: 'Martial two-handed weapon (1d12 S)' },
    { name: 'Greatclub', cost: 5, weight: 8, description: 'Martial two-handed weapon (1d10 B)' },
    { name: 'Greatsword', cost: 50, weight: 8, description: 'Martial two-handed weapon (2d6 S)' },
    { name: 'Halberd', cost: 10, weight: 12, description: 'Martial two-handed weapon (1d10 P/S)' },
    { name: 'Heavy Pick', cost: 8, weight: 6, description: 'Martial one-handed weapon (1d6 P)' },
    { name: 'Lance', cost: 10, weight: 10, description: 'Martial two-handed weapon (1d8 P)' },
    { name: 'Longbow', cost: 75, weight: 3, description: 'Martial ranged weapon (1d8 P)' },
    { name: 'Longsword', cost: 15, weight: 4, description: 'Martial one-handed weapon (1d8 S)' },
    { name: 'Ranseur', cost: 10, weight: 12, description: 'Martial two-handed weapon (2d4 P)' },
    { name: 'Rapier', cost: 20, weight: 2, description: 'Martial one-handed weapon (1d6 P)' },
    { name: 'Scimitar', cost: 15, weight: 4, description: 'Martial one-handed weapon (1d6 S)' },
    { name: 'Scythe', cost: 18, weight: 10, description: 'Martial two-handed weapon (2d4 P/S)' },
    { name: 'Shortbow', cost: 30, weight: 2, description: 'Martial ranged weapon (1d6 P)' },
    { name: 'Trident', cost: 15, weight: 4, description: 'Martial one-handed weapon (1d8 P)' },
    { name: 'Warhammer', cost: 12, weight: 5, description: 'Martial one-handed weapon (1d8 B)' }
  ].sort((a, b) => a.name.localeCompare(b.name)),
  
  'Armor': [
    // Light Armor
    { name: 'Chain Shirt', cost: 100, weight: 25, description: 'Light armor (+4 AC, max Dex +4)' },
    { name: 'Leather', cost: 10, weight: 15, description: 'Light armor (+2 AC, max Dex +6)' },
    { name: 'Padded', cost: 5, weight: 10, description: 'Light armor (+1 AC, max Dex +8)' },
    { name: 'Studded Leather', cost: 25, weight: 20, description: 'Light armor (+3 AC, max Dex +5)' },
    // Medium Armor
    { name: 'Breastplate', cost: 200, weight: 30, description: 'Medium armor (+6 AC, max Dex +3)' },
    { name: 'Chainmail', cost: 150, weight: 40, description: 'Medium armor (+6 AC, max Dex +2)' },
    { name: 'Hide', cost: 15, weight: 25, description: 'Medium armor (+4 AC, max Dex +4)' },
    { name: 'Scale Mail', cost: 50, weight: 30, description: 'Medium armor (+5 AC, max Dex +3)' },
    // Heavy Armor
    { name: 'Banded Mail', cost: 250, weight: 35, description: 'Heavy armor (+7 AC, max Dex +1)' },
    { name: 'Full Plate', cost: 1500, weight: 50, description: 'Heavy armor (+9 AC, max Dex +1)' },
    { name: 'Half-Plate', cost: 600, weight: 50, description: 'Heavy armor (+8 AC, max Dex +0)' },
    { name: 'Splint Mail', cost: 200, weight: 45, description: 'Heavy armor (+7 AC, max Dex +0)' },
    // Shields
    { name: 'Buckler', cost: 5, weight: 5, description: 'Shield (+1 AC, -1 penalty)' },
    { name: 'Heavy Steel Shield', cost: 20, weight: 15, description: 'Shield (+2 AC)' },
    { name: 'Heavy Wooden Shield', cost: 7, weight: 10, description: 'Shield (+2 AC)' },
    { name: 'Light Steel Shield', cost: 9, weight: 6, description: 'Shield (+1 AC)' },
    { name: 'Light Wooden Shield', cost: 3, weight: 5, description: 'Shield (+1 AC)' },
    { name: 'Tower Shield', cost: 30, weight: 45, description: 'Shield (+4 AC, max Dex +2)' }
  ].sort((a, b) => a.name.localeCompare(b.name)),
  
  'Adventuring Gear': [
    { name: 'Acid Flask', cost: 10, weight: 1, description: '1d6 acid damage, splash' },
    { name: 'Alchemist\'s Fire', cost: 20, weight: 1, description: '1d6 fire damage' },
    { name: 'Antitoxin', cost: 50, weight: 0, description: '+5 on Fort saves vs poison' },
    { name: 'Backpack', cost: 2, weight: 2, description: 'Holds gear' },
    { name: 'Barrel', cost: 2, weight: 30, description: 'Holds 10 cubic feet' },
    { name: 'Basket', cost: 0.4, weight: 1, description: 'Holds 2 cubic feet' },
    { name: 'Bedroll', cost: 0.1, weight: 5, description: 'Sleeping gear' },
    { name: 'Bell', cost: 1, weight: 0, description: 'Makes noise' },
    { name: 'Blanket', cost: 0.5, weight: 3, description: 'Keeps warm' },
    { name: 'Block and Tackle', cost: 5, weight: 5, description: 'Pulley system' },
    { name: 'Bottle, Glass', cost: 2, weight: 1, description: 'Holds 1 pint' },
    { name: 'Bucket', cost: 0.5, weight: 2, description: 'Holds liquids' },
    { name: 'Caltrops', cost: 1, weight: 2, description: 'Slows movement' },
    { name: 'Candle', cost: 0.01, weight: 0, description: '5ft light for 1 hour' },
    { name: 'Canvas (sq. yd.)', cost: 0.1, weight: 1, description: 'Cloth material' },
    { name: 'Case, Map or Scroll', cost: 1, weight: 0.5, description: 'Protects papers' },
    { name: 'Chain (10 ft.)', cost: 30, weight: 2, description: 'Metal chain' },
    { name: 'Chalk', cost: 0.01, weight: 0, description: 'Writing tool' },
    { name: 'Chest', cost: 2, weight: 25, description: 'Storage container' },
    { name: 'Crowbar', cost: 2, weight: 5, description: '+2 to open doors' },
    { name: 'Firewood (per day)', cost: 0.01, weight: 20, description: 'Fuel for fire' },
    { name: 'Fishhook', cost: 0.1, weight: 0, description: 'For fishing' },
    { name: 'Fishing Net', cost: 4, weight: 5, description: '25 sq. ft.' },
    { name: 'Flask', cost: 0.03, weight: 1.5, description: 'Holds 1 pint' },
    { name: 'Flint and Steel', cost: 1, weight: 0, description: 'Starts fires' },
    { name: 'Grappling Hook', cost: 1, weight: 4, description: 'Climbing tool' },
    { name: 'Hammer', cost: 0.5, weight: 2, description: 'Tool' },
    { name: 'Holy Water', cost: 25, weight: 1, description: '2d4 vs undead' },
    { name: 'Hourglass', cost: 25, weight: 1, description: 'Tracks time' },
    { name: 'Ink (1 oz. vial)', cost: 8, weight: 0, description: 'For writing' },
    { name: 'Inkpen', cost: 0.1, weight: 0, description: 'Writing tool' },
    { name: 'Ladder (10 ft.)', cost: 0.05, weight: 20, description: 'Climbing tool' },
    { name: 'Lamp, Common', cost: 0.1, weight: 1, description: '15ft light' },
    { name: 'Lantern, Bullseye', cost: 12, weight: 3, description: '60ft cone light' },
    { name: 'Lantern, Hooded', cost: 7, weight: 2, description: '30ft light' },
    { name: 'Lock, Average', cost: 40, weight: 1, description: 'DC 25 to pick' },
    { name: 'Lock, Good', cost: 80, weight: 1, description: 'DC 30 to pick' },
    { name: 'Lock, Simple', cost: 20, weight: 1, description: 'DC 20 to pick' },
    { name: 'Manacles', cost: 15, weight: 2, description: 'Restraints' },
    { name: 'Mirror, Small Steel', cost: 10, weight: 0.5, description: 'Reflective surface' },
    { name: 'Mug/Tankard, Clay', cost: 0.02, weight: 1, description: 'Drinking vessel' },
    { name: 'Oil (1-pint flask)', cost: 0.1, weight: 1, description: 'Lamp fuel' },
    { name: 'Paper (sheet)', cost: 0.4, weight: 0, description: 'Writing surface' },
    { name: 'Parchment (sheet)', cost: 0.2, weight: 0, description: 'Writing surface' },
    { name: 'Pick, Miner\'s', cost: 3, weight: 10, description: 'Digging tool' },
    { name: 'Piton', cost: 0.1, weight: 0.5, description: 'Climbing spike' },
    { name: 'Pole (10 ft.)', cost: 0.05, weight: 8, description: 'Long stick' },
    { name: 'Pot, Iron', cost: 0.8, weight: 10, description: 'Cooking vessel' },
    { name: 'Pouch, Belt', cost: 1, weight: 0.5, description: 'Small container' },
    { name: 'Rations, Trail (per day)', cost: 0.5, weight: 1, description: 'Food' },
    { name: 'Rope, Hemp (50 ft.)', cost: 1, weight: 10, description: 'Climbing rope' },
    { name: 'Rope, Silk (50 ft.)', cost: 10, weight: 5, description: 'Strong rope' },
    { name: 'Sack', cost: 0.1, weight: 0.5, description: 'Holds 1 cubic ft.' },
    { name: 'Sealing Wax', cost: 1, weight: 1, description: 'For letters' },
    { name: 'Sewing Needle', cost: 0.5, weight: 0, description: 'For repairs' },
    { name: 'Shovel', cost: 2, weight: 8, description: 'Digging tool' },
    { name: 'Signal Whistle', cost: 0.8, weight: 0, description: 'Makes loud noise' },
    { name: 'Signet Ring', cost: 5, weight: 0, description: 'Personal seal' },
    { name: 'Sledge', cost: 1, weight: 10, description: 'Heavy hammer' },
    { name: 'Soap', cost: 0.5, weight: 1, description: 'Cleaning' },
    { name: 'Spade', cost: 2, weight: 8, description: 'Digging tool' },
    { name: 'Spyglass', cost: 1000, weight: 1, description: 'Magnifies vision' },
    { name: 'Tent', cost: 10, weight: 20, description: 'Portable shelter' },
    { name: 'Torch', cost: 0.01, weight: 1, description: '20ft light for 1 hour' },
    { name: 'Vial', cost: 1, weight: 0, description: 'Holds 1 ounce' },
    { name: 'Waterskin', cost: 1, weight: 4, description: 'Holds 1/2 gallon' },
    { name: 'Whetstone', cost: 0.02, weight: 1, description: 'Sharpens blades' }
  ].sort((a, b) => a.name.localeCompare(b.name)),
  
  'Tools': [
    { name: 'Alchemist\'s Lab', cost: 200, weight: 40, description: '+2 on Craft (alchemy)' },
    { name: 'Artisan\'s Tools', cost: 5, weight: 5, description: 'For Craft skills' },
    { name: 'Artisan\'s Tools, Masterwork', cost: 55, weight: 5, description: '+2 on Craft' },
    { name: 'Climber\'s Kit', cost: 80, weight: 5, description: '+2 on Climb' },
    { name: 'Disguise Kit', cost: 50, weight: 8, description: '+2 on Disguise' },
    { name: 'Healer\'s Kit', cost: 50, weight: 1, description: '+2 on Heal, 10 uses' },
    { name: 'Holy Symbol, Silver', cost: 25, weight: 1, description: 'Divine focus' },
    { name: 'Holy Symbol, Wooden', cost: 1, weight: 0, description: 'Divine focus' },
    { name: 'Magnifying Glass', cost: 100, weight: 0, description: '+2 on Appraise' },
    { name: 'Musical Instrument, Common', cost: 5, weight: 3, description: 'For Perform' },
    { name: 'Musical Instrument, Masterwork', cost: 100, weight: 3, description: '+2 on Perform' },
    { name: 'Spell Component Pouch', cost: 5, weight: 2, description: 'Material components' },
    { name: 'Spellbook', cost: 15, weight: 3, description: '100 pages' },
    { name: 'Thieves\' Tools', cost: 30, weight: 1, description: 'For Disable Device' },
    { name: 'Thieves\' Tools, Masterwork', cost: 100, weight: 2, description: '+2 on Disable Device' },
    { name: 'Tool, Masterwork', cost: 50, weight: 1, description: '+2 on related skill' }
  ].sort((a, b) => a.name.localeCompare(b.name)),
  
  'Magic Items': [
    { name: 'Potion of Bear\'s Endurance', cost: 300, weight: 0, description: '+4 CON for 3 min' },
    { name: 'Potion of Bull\'s Strength', cost: 300, weight: 0, description: '+4 STR for 3 min' },
    { name: 'Potion of Cat\'s Grace', cost: 300, weight: 0, description: '+4 DEX for 3 min' },
    { name: 'Potion of Cure Light Wounds', cost: 50, weight: 0, description: 'Heals 1d8+1 hp' },
    { name: 'Potion of Cure Moderate Wounds', cost: 300, weight: 0, description: 'Heals 2d8+3 hp' },
    { name: 'Potion of Eagle\'s Splendor', cost: 300, weight: 0, description: '+4 CHA for 3 min' },
    { name: 'Potion of Fox\'s Cunning', cost: 300, weight: 0, description: '+4 INT for 3 min' },
    { name: 'Potion of Owl\'s Wisdom', cost: 300, weight: 0, description: '+4 WIS for 3 min' },
    { name: 'Scroll of Identify', cost: 25, weight: 0, description: 'Identifies magic items' },
    { name: 'Scroll of Mage Armor', cost: 25, weight: 0, description: '+4 armor bonus for 1 hr' },
    { name: 'Scroll of Magic Missile', cost: 25, weight: 0, description: '1d4+1 force damage' },
    { name: 'Scroll of Shield', cost: 25, weight: 0, description: '+4 AC for 1 min' },
    { name: 'Wand of Detect Magic', cost: 375, weight: 0, description: '50 charges' },
    { name: 'Wand of Light', cost: 375, weight: 0, description: '50 charges' }
  ].sort((a, b) => a.name.localeCompare(b.name)),
  
  'Consumables': [
    { name: 'Smokestick', cost: 20, weight: 0.5, description: 'Creates smoke' },
    { name: 'Sunrod', cost: 2, weight: 1, description: '30ft light for 6 hours' },
    { name: 'Tanglefoot Bag', cost: 50, weight: 4, description: 'Entangles target' },
    { name: 'Thunderstone', cost: 30, weight: 1, description: 'Sonic attack' },
    { name: 'Tindertwig', cost: 1, weight: 0, description: 'Lights fires' }
  ].sort((a, b) => a.name.localeCompare(b.name))
}

const equipmentPacks = [
  {
    name: 'Dungeoneer\'s Pack',
    cost: 15,
    items: ['Backpack', 'Crowbar', 'Hammer', '10 Pitons', 'Torch (10)', '5 days rations', 'Waterskin', '50 ft. rope']
  },
  {
    name: 'Explorer\'s Pack',
    cost: 10,
    items: ['Backpack', 'Bedroll', 'Mess kit', 'Torch (10)', '10 days rations', 'Waterskin', '50 ft. rope']
  },
  {
    name: 'Scholar\'s Pack',
    cost: 40,
    items: ['Backpack', 'Book of lore', 'Ink', 'Inkpen', 'Lamp', '10 flasks of oil', '5 days rations', 'Waterskin']
  },
  {
    name: 'Priest\'s Pack',
    cost: 25,
    items: ['Backpack', 'Blanket', 'Holy symbol', 'Incense (10)', 'Prayer book', '5 days rations', 'Waterskin']
  },
  {
    name: 'Burglar\'s Pack',
    cost: 45,
    items: ['Backpack', 'Bag of caltrops', 'Bell', 'Candle (10)', 'Crowbar', 'Hammer', 'Piton (10)', 'Hooded lantern', '2 flasks of oil', '5 days rations', 'Thieves\' tools', 'Waterskin', '50 ft. rope']
  }
]

// Computed
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
      case 6: return characterName.value && characterName.value.trim().length > 0
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
  return selectedEquipment.value.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
})

const totalEquipmentWeight = computed(() => {
  return selectedEquipment.value.reduce((sum, item) => sum + (item.weight * item.quantity), 0).toFixed(1)
})

const filteredRaces = computed(() => {
  if (selectedRaceCategory === 'All') return availableRaces
  return availableRaces.filter(race => race.category === selectedRaceCategory)
})

const filteredClasses = computed(() => {
  if (selectedClassCategory === 'All') return availableClasses
  return availableClasses.filter(cls => cls.category === selectedClassCategory)
})

const filteredFeats = computed(() => {
  if (!featFilter.value) return availableFeats
  const filter = featFilter.value.toLowerCase()
  return availableFeats.filter(feat => 
    feat.name.toLowerCase().includes(filter) ||
    feat.description.toLowerCase().includes(filter)
  )
})

const affordableItems = computed(() => {
  const budget = startingGold.value - totalEquipmentCost.value
  return equipmentDatabase[selectedEquipmentCategory.value]
    ?.filter(item => item.cost <= budget) || []
})

// Methods
function formatAbilityMods(mods) {
  if (mods.any) return `+${mods.any} to any`
  return Object.entries(mods)
    .map(([ability, mod]) => `${mod > 0 ? '+' : ''}${mod} ${ability}`)
    .join(', ')
}

function selectRace(race) {
  selectedRace.value = race
  // Apply racial modifiers
  if (race.abilityMods && !race.abilityMods.any) {
    for (const [ability, mod] of Object.entries(race.abilityMods)) {
      if (abilities.includes(ability)) {
        // Store racial mods separately or apply them in getFinalAbilityScore
      }
    }
  }
}

function selectClass(cls) {
  selectedClass.value = cls
  
  // Roll starting gold based on class
  const goldRolls = {
    'Barbarian': { dice: 3, sides: 4, mult: 10 },
    'Bard': { dice: 3, sides: 4, mult: 10 },
    'Cleric': { dice: 4, sides: 4, mult: 10 },
    'Druid': { dice: 2, sides: 4, mult: 10 },
    'Fighter': { dice: 5, sides: 4, mult: 10 },
    'Monk': { dice: 1, sides: 4, mult: 10 },
    'Paladin': { dice: 5, sides: 4, mult: 10 },
    'Ranger': { dice: 5, sides: 4, mult: 10 },
    'Rogue': { dice: 4, sides: 4, mult: 10 },
    'Sorcerer': { dice: 2, sides: 4, mult: 10 },
    'Wizard': { dice: 2, sides: 4, mult: 10 },
    'Alchemist': { dice: 3, sides: 4, mult: 10 },
    'Cavalier': { dice: 5, sides: 4, mult: 10 },
    'Gunslinger': { dice: 5, sides: 4, mult: 10 },
    'Inquisitor': { dice: 4, sides: 4, mult: 10 },
    'Magus': { dice: 4, sides: 4, mult: 10 },
    'Oracle': { dice: 3, sides: 4, mult: 10 },
    'Summoner': { dice: 2, sides: 4, mult: 10 },
    'Witch': { dice: 3, sides: 4, mult: 10 }
  }
  
  const roll = goldRolls[cls.name] || { dice: 3, sides: 4, mult: 10 }
  let gold = 0
  for (let i = 0; i < roll.dice; i++) {
    gold += Math.floor(Math.random() * roll.sides) + 1
  }
  startingGold.value = gold * roll.mult
  
  calculateSkillPoints()
}

function validateAbilityScores() {
  if (abilityMethod.value === 'standard') {
    // Check all scores are assigned
    const assigned = Object.values(abilityScores.value).filter(v => v !== null)
    return assigned.length === 6 && new Set(assigned).size === 6
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
    7: -4, 8: -2, 9: -1, 10: 0, 11: 1, 12: 2, 13: 3, 14: 5, 15: 7, 16: 10, 17: 13, 18: 17
  }
  return costs[score] || 0
}

function adjustPointBuy(ability, delta) {
  const current = abilityScores.value[ability]
  const newScore = current + delta
  if (newScore >= 7 && newScore <= 18) {
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
    if (selectedRace.value.abilityMods[ability]) {
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
  const favoredClassBonus = 1 // Could be HP or skill point
  return hitPointRoll.value + conMod + favoredClassBonus
}

function getStartingHP() {
  const dieSize = parseInt(selectedClass.value.hitDie.substring(1))
  const conMod = getAbilityModifier(getFinalAbilityScore('CON'))
  return dieSize + conMod
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
  return selectedClass.value?.classSkills.includes(skill.name) || false
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
  return ranks + abilityMod + classBonus
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
  
  if (hasBonusFeats()) {
    feats += getBonusFeatsCount()
  }
  
  featsRemaining.value = feats
}

function hasBonusFeats() {
  if (selectedClass.value?.name === 'Fighter') {
    return !isLevelUp.value || (currentLevel.value + 1) % 2 === 0
  }
  if (selectedClass.value?.name === 'Wizard' && (!isLevelUp.value || (currentLevel.value + 1) % 5 === 0)) {
    return true
  }
  return false
}

function getBonusFeatsCount() {
  if (selectedClass.value?.name === 'Fighter') return 1
  if (selectedClass.value?.name === 'Wizard') return 1
  return 0
}

function meetsPrerequisites(feat) {
  if (!feat.prerequisites) return true
  // Simplified - would need full prerequisite parsing
  return true
}

function toggleFeat(feat) {
  if (!meetsPrerequisites(feat)) return
  
  const index = selectedFeats.value.indexOf(feat.name)
  if (index > -1) {
    selectedFeats.value.splice(index, 1)
  } else if (selectedFeats.value.length < featsRemaining.value) {
    selectedFeats.value.push(feat.name)
  }
}

function purchaseItem(item) {
  const existingItem = selectedEquipment.value.find(e => e.name === item.name)
  if (existingItem) {
    existingItem.quantity++
  } else {
    selectedEquipment.value.push({
      ...item,
      quantity: 1
    })
  }
}

function removeItem(index) {
  selectedEquipment.value.splice(index, 1)
}

function selectEquipmentPack(pack) {
  // Clear current equipment
  selectedEquipment.value = []
  
  // Add pack items
  pack.items.forEach(itemName => {
    // Find item in database
    for (const category of Object.values(equipmentDatabase)) {
      const item = category.find(i => i.name === itemName)
      if (item) {
        selectedEquipment.value.push({
          ...item,
          quantity: 1
        })
        break
      }
    }
  })
}

function getClassLevel(className) {
  const cls = currentClasses.value.find(c => c.className === className)
  return cls ? cls.level : 0
}

function generateQuickCharacter() {
  // Quick character generation
  selectedRace.value = availableRaces[0] // Human
  selectedClass.value = availableClasses.find(c => c.name === 'Fighter') // Fighter
  
  // Standard array
  abilityScores.value = {
    STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8
  }
  
  // Auto-allocate skills
  calculateSkillPoints()
  
  // Select basic feats
  selectedFeats.value = ['Weapon Focus', 'Toughness']
  
  // Basic equipment
  selectEquipmentPack(equipmentPacks[0])
  
  // Generate name
  characterName.value = 'Quick Hero'
  
  // Jump to summary
  currentStep.value = totalSteps.value - 1
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
    skills: { ...skillRanks.value },
    feats: [...selectedFeats.value],
    equipment: [...selectedEquipment.value],
    remainingGold: startingGold.value - totalEquipmentCost.value,
    hitPointsGained: isLevelUp.value ? getTotalHPGain() : null
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
  }
})
</script>

<style scoped>
/* Overlay for the character builder */
.character-builder-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

/* Main wizard container - wider */
.character-builder-wizard {
  background-color: #111827;
  position: relative;
  width: 100%;
  max-width: 1400px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Step content container - scrollable */
.step-content-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 300px;
  max-height: calc(90vh - 200px);
  padding-right: 0.5rem;
}

/* Race and class selection containers */
.race-selection-container,
.class-selection-container {
  width: 100%;
}

/* Clickable cards */
.race-card,
.class-card,
.feat-card {
  user-select: none;
  position: relative;
  z-index: 1;
}

.race-card:hover,
.class-card:hover,
.feat-card:hover {
  z-index: 2;
}

/* Fix for click events */
.race-card *,
.class-card *,
.feat-card * {
  pointer-events: none;
}

/* Skills and feats lists */
.skills-list,
.feats-list {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

/* Custom scrollbar for the step content */
.step-content-container::-webkit-scrollbar,
.skills-list::-webkit-scrollbar,
.feats-list::-webkit-scrollbar {
  width: 8px;
}

.step-content-container::-webkit-scrollbar-track,
.skills-list::-webkit-scrollbar-track,
.feats-list::-webkit-scrollbar-track {
  background: #1F2937;
  border-radius: 4px;
}

.step-content-container::-webkit-scrollbar-thumb,
.skills-list::-webkit-scrollbar-thumb,
.feats-list::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 4px;
}

.step-content-container::-webkit-scrollbar-thumb:hover,
.skills-list::-webkit-scrollbar-thumb:hover,
.feats-list::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}

/* Custom scrollbar for other elements */
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

/* Enhanced section backgrounds */
.space-y-4 > div[class*="bg-gray-800"] {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Hover scale for cards */
.transform.hover\:scale-105:hover {
  transform: scale(1.05);
}

.transform.hover\:scale-102:hover {
  transform: scale(1.02);
}

/* Prevent text overflow in equipment section */
.whitespace-nowrap {
  white-space: nowrap;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .character-builder-overlay {
    padding: 0.5rem;
  }
  
  .character-builder-wizard {
    max-height: 100vh;
    max-width: 100%;
  }
  
  .step-content-container {
    max-height: calc(100vh - 180px);
  }
  
  .skills-list,
  .feats-list {
    max-height: 300px;
  }
}

/* Large screens */
@media (min-width: 1536px) {
  .character-builder-wizard {
    max-width: 1600px;
  }
}
</style>