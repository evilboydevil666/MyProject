<template>
  <div class="character-builder-wizard-backdrop">
    <div class="character-builder-wizard bg-gray-900 text-white p-6 rounded-lg max-w-7xl mx-auto shadow-2xl border border-gray-700">
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-blue-300 mb-2">
          {{ isLevelUp ? '📈 Level Up Wizard' : '🎭 Character Builder' }}
        </h2>
        <div class="flex items-center gap-4 text-sm text-gray-400">
          <div>
            <span>Step {{ currentStep + 1 }} of {{ totalSteps }}</span>
          </div>
          <div class="flex-1 bg-gray-700 rounded-full h-2">
            <div 
              class="bg-blue-500 h-full rounded-full transition-all duration-300"
              :style="{ width: `${((currentStep + 1) / totalSteps) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Step Content - FIXED: Added scrollable container -->
      <div class="step-content-container mb-6">
        <!-- Step 1: Mode Selection (Creation Only) -->
        <div v-if="!isLevelUp && currentStep === 0" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">Choose Creation Method</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          
          <!-- Race Category Tabs -->
          <div class="mb-4">
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="category in raceCategories"
                :key="category"
                @click="selectedRaceCategory = category"
                :class="[
                  'px-4 py-2 rounded transition-all',
                  selectedRaceCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
              >
                {{ category }} ({{ getRacesByCategory(category).length }})
              </button>
            </div>
          </div>
          
          <!-- Race Selection -->
          <div class="race-selection-container">
            <div v-if="filteredRaces.length === 0" class="text-center py-8 text-gray-400">
              <p>No races found for {{ selectedRaceCategory }} category.</p>
              <p class="text-sm mt-2">Check console for debugging information.</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              <div 
                v-for="race in filteredRaces" 
                :key="race.id"
                @click="selectRace(race)"
                :class="[
                  'race-card p-4 bg-gray-800 rounded-lg cursor-pointer transition-all transform hover:scale-102 relative',
                  selectedRace?.id === race.id ? 'border-2 border-blue-500 bg-gray-700' : 'border-2 border-gray-600 hover:border-gray-500'
                ]"
              >
                <h4 class="font-bold text-green-300">{{ race.name }}</h4>
                <div v-if="selectedRace?.id === race.id" class="absolute top-2 right-2 text-green-400 text-2xl">
                  ✓
                </div>
                <p class="text-xs text-gray-400 mt-1">{{ race.size }} {{ race.type }}</p>
                <div class="mt-2 text-xs">
                  <p class="text-blue-300">{{ formatAbilityMods(race.abilityMods) }}</p>
                  <p class="text-gray-400 mt-1">Speed: {{ race.speed }} ft.</p>
                  <p class="text-gray-400">{{ getRaceTraitSummary(race) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Class Selection (Creation) or Step 1: Class Selection (Level Up) -->
        <div v-else-if="(!isLevelUp && currentStep === 2) || (isLevelUp && currentStep === 0)" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">
            {{ isLevelUp ? 'Choose Class for Level ' + (currentLevel + 1) : 'Choose Your Class' }}
          </h3>
          
          <!-- Class Selection -->
          <div class="class-selection-container">
            <div v-if="isLevelUp" class="mb-4 p-3 bg-gray-800 rounded">
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
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div 
                v-for="cls in availableClasses" 
                :key="cls.id"
                @click="selectClass(cls)"
                :class="[
                  'class-card p-4 bg-gray-800 rounded-lg cursor-pointer transition-all transform hover:scale-102 relative',
                  selectedClass?.id === cls.id ? 'border-2 border-blue-500 bg-gray-700' : 'border-2 border-gray-600 hover:border-gray-500'
                ]"
              >
                <h4 class="font-bold text-green-300">{{ cls.name }}</h4>
                <div v-if="selectedClass?.id === cls.id" class="absolute top-2 right-2 text-green-400 text-2xl">
                  ✓
                </div>
                <p class="text-xs text-gray-400">{{ cls.hitDie }} HD, {{ cls.bab }} BAB</p>
                <div class="mt-2 text-xs">
                  <p>{{ cls.skillPoints }} + Int skill points</p>
                  <p class="text-blue-300 mt-1">{{ cls.primaryAbility }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Ability Scores (Creation) / Hit Points (Level Up) -->
        <div v-else-if="(!isLevelUp && currentStep === 3) || (isLevelUp && currentStep === 1)" class="space-y-4">
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
              <p class="text-lg mb-4">Rolling hit points for {{ selectedClass?.name || 'Unknown Class' }} ({{ selectedClass?.hitDie || 'd?' }})</p>
              
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
                  {{ selectedClass?.name === 'Barbarian' ? '+ 4 (Favored Class)' : '+ 1 (Favored Class)' }}
                </p>
                <p class="text-xl font-semibold">
                  Total: +{{ getTotalHPGain() }} HP
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: Skills -->
        <div v-else-if="(!isLevelUp && currentStep === 4) || (isLevelUp && currentStep === 2)" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">Allocate Skill Points</h3>
          
          <div class="mb-4 p-3 bg-gray-800 rounded flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-400">Skill Points Available:</p>
              <p class="text-2xl font-bold text-green-300">{{ skillPointsRemaining }} / {{ totalSkillPoints }}</p>
              <p v-if="totalSkillPoints === 0" class="text-xs text-yellow-400 mt-1">Select a class to see skill points</p>
            </div>
            <div class="text-sm text-gray-400">
              <p v-if="selectedClass">Class Skills: {{ selectedClass.skillPoints }} + {{ getAbilityModifier(getFinalAbilityScore('INT')) }} (INT)</p>
              <p v-else class="text-yellow-400">Please select a class first</p>
              <p v-if="selectedRace?.name === 'Human'">+1 (Human bonus)</p>
            </div>
          </div>

          <div class="skills-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <div 
              v-for="skill in availableSkills" 
              :key="skill.name"
              class="bg-gray-800 p-4 rounded flex items-center justify-between"
            >
              <div class="flex-1 min-w-0 pr-2">
                <p class="font-medium">
                  {{ skill.name }}
                  <span class="text-xs text-gray-400 ml-1">({{ skill.ability }})</span>
                  <span v-if="isClassSkill(skill)" class="text-xs text-green-400 ml-1">●</span>
                </p>
                <p class="text-xs text-gray-400 truncate">{{ skill.description }}</p>
              </div>
              <div class="flex items-center gap-2 ml-4 flex-shrink-0">
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

        <!-- Step 6: Feats -->
        <div v-else-if="(!isLevelUp && currentStep === 5) || (isLevelUp && currentStep === 3)" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">Choose Feats</h3>
          
          <div class="mb-4 p-3 bg-gray-800 rounded">
            <p class="text-sm text-gray-400">Feats Available: <span class="font-bold text-green-300">{{ featsRemaining }}</span></p>
            <div class="text-xs text-gray-400 mt-1">
              <p v-if="!isLevelUp || currentLevel === 0">• 1 feat at 1st level</p>
              <p v-if="selectedRace?.name === 'Human'">• 1 bonus feat (Human)</p>
              <p v-if="isLevelUp && (currentLevel + 1) % 2 === 1">• 1 feat (odd level)</p>
              <p v-if="hasBonusFeats()">• {{ getBonusFeatsCount() }} bonus feat(s) ({{ selectedClass?.name || 'Unknown' }})</p>
            </div>
          </div>

          <div class="mb-3">
            <input 
              v-model="featFilter"
              placeholder="Search feats..."
              class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            />
          </div>

          <div class="feats-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <div 
              v-for="feat in filteredFeats" 
              :key="feat.name"
              @click="toggleFeat(feat)"
              :class="[
                'feat-card p-4 bg-gray-800 rounded cursor-pointer transition-all transform hover:scale-102',
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

        <!-- Step 7: Equipment (Creation Only) -->
        <div v-else-if="!isLevelUp && currentStep === 6" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">Starting Equipment</h3>
          
          <div class="mb-4 p-3 bg-gray-800 rounded">
            <p class="text-sm text-gray-400">Starting Gold: <span class="font-bold text-yellow-300">{{ startingGold }} gp</span></p>
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
                  class="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded text-left transition-all"
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

        <!-- Step 8: Character Details (Creation Only) -->
        <div v-else-if="!isLevelUp && currentStep === 7" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">Character Details</h3>
          
          <div class="flex justify-end mb-4">
            <button 
              @click="generateRandomDetails"
              class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm"
            >
              🎲 Generate Random Details
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Basic Information -->
            <div class="space-y-3">
              <h4 class="font-semibold text-blue-300">Basic Information</h4>
              
              <div>
                <label class="block text-sm font-medium mb-1">Character Name</label>
                <input 
                  v-model="characterDetails.name"
                  type="text"
                  placeholder="Enter character name"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium mb-1">Age</label>
                  <input 
                    v-model="characterDetails.age"
                    type="text"
                    placeholder="e.g., 25"
                    class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Gender</label>
                  <input 
                    v-model="characterDetails.gender"
                    type="text"
                    placeholder="e.g., Female"
                    class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium mb-1">Height</label>
                  <input 
                    v-model="characterDetails.height"
                    type="text"
                    placeholder="e.g., 5'6''"
                    class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Weight</label>
                  <input 
                    v-model="characterDetails.weight"
                    type="text"
                    placeholder="e.g., 140 lbs"
                    class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Homeland</label>
                <input 
                  v-model="characterDetails.homeland"
                  type="text"
                  placeholder="e.g., Absalom"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
            </div>
            
            <!-- Appearance -->
            <div class="space-y-3">
              <h4 class="font-semibold text-blue-300">Appearance</h4>
              
              <div>
                <label class="block text-sm font-medium mb-1">Hair Color</label>
                <input 
                  v-model="characterDetails.hair"
                  type="text"
                  placeholder="e.g., Black"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Eye Color</label>
                <input 
                  v-model="characterDetails.eyes"
                  type="text"
                  placeholder="e.g., Brown"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Skin Color</label>
                <input 
                  v-model="characterDetails.skin"
                  type="text"
                  placeholder="e.g., Tan"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1">Distinguishing Features</label>
                <textarea 
                  v-model="characterDetails.distinguishingFeatures"
                  rows="3"
                  placeholder="Scars, tattoos, or other notable features..."
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                ></textarea>
              </div>
            </div>
          </div>
          
          <!-- Alignment and Deity -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 class="font-semibold text-blue-300 mb-2">Alignment</h4>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  v-for="align in alignments"
                  :key="align"
                  @click="characterDetails.alignment = align"
                  :class="[
                    'p-2 rounded text-sm font-medium transition-all',
                    characterDetails.alignment === align 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  ]"
                >
                  {{ align }}
                </button>
              </div>
            </div>
            
            <div>
              <h4 class="font-semibold text-blue-300 mb-2">Deity</h4>
              <select 
                v-model="characterDetails.deity"
                class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              >
                <option value="">None / Undecided</option>
                <option v-for="deity in deities" :key="deity.name" :value="deity.name">
                  {{ deity.name }} ({{ deity.alignment }}) - {{ deity.domains }}
                </option>
              </select>
            </div>
          </div>
          
          <!-- Languages -->
          <div class="mt-4">
            <h4 class="font-semibold text-blue-300 mb-2">Languages</h4>
            <div class="bg-gray-800 p-3 rounded">
              <p class="text-sm text-gray-400 mb-2">
                Starting languages: {{ getStartingLanguages() }}
              </p>
              <p class="text-sm text-gray-400 mb-2">
                Bonus languages ({{ getBonusLanguages() }} available{{ selectedRace ? '' : ' - select a race first' }}):
              </p>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                <label 
                  v-for="lang in getAvailableLanguages()" 
                  :key="lang"
                  class="flex items-center space-x-2"
                >
                  <input 
                    type="checkbox"
                    :value="lang"
                    v-model="characterDetails.languages"
                    :disabled="!canSelectLanguage(lang)"
                    class="bg-gray-700 border-gray-600 rounded"
                  />
                  <span class="text-sm" :class="canSelectLanguage(lang) ? '' : 'text-gray-500'">
                    {{ lang }}
                  </span>
                </label>
              </div>
            </div>
          </div>
          
          <!-- Personality -->
          <div class="mt-4 space-y-3">
            <h4 class="font-semibold text-blue-300">Personality & Background</h4>
            
            <div>
              <label class="block text-sm font-medium mb-1">Personality Traits</label>
              <textarea 
                v-model="characterDetails.personalityTraits"
                rows="2"
                placeholder="Describe your character's personality..."
                class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label class="block text-sm font-medium mb-1">Ideals</label>
                <input 
                  v-model="characterDetails.ideals"
                  type="text"
                  placeholder="What drives them?"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Bonds</label>
                <input 
                  v-model="characterDetails.bonds"
                  type="text"
                  placeholder="Important connections"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Flaws</label>
                <input 
                  v-model="characterDetails.flaws"
                  type="text"
                  placeholder="Weaknesses or vices"
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div v-else-if="(!isLevelUp && currentStep === 8) || (isLevelUp && currentStep === 4)" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">Summary</h3>
          
          <div class="bg-gray-800 p-4 rounded-lg space-y-3">
            <h4 class="font-bold text-green-300 text-lg">
              {{ isLevelUp ? 'Level Up Complete!' : 'Character Complete!' }}
            </h4>
            
            <div v-if="!isLevelUp" class="space-y-2">
              <p><strong>Name:</strong> {{ characterDetails.name || 'Unnamed Hero' }}</p>
              <p><strong>Race:</strong> {{ selectedRace?.name }}</p>
              <p><strong>Class:</strong> {{ selectedClass?.name }} 1</p>
              <p><strong>Alignment:</strong> {{ characterDetails.alignment }}</p>
              <p v-if="characterDetails.deity"><strong>Deity:</strong> {{ characterDetails.deity }}</p>
              
              <!-- Physical Description -->
              <div v-if="characterDetails.age || characterDetails.height || characterDetails.weight">
                <p class="font-semibold mb-1">Physical Description:</p>
                <div class="text-sm ml-4">
                  <p v-if="characterDetails.age">Age: {{ characterDetails.age }}</p>
                  <p v-if="characterDetails.gender">Gender: {{ characterDetails.gender }}</p>
                  <p v-if="characterDetails.height">Height: {{ characterDetails.height }}</p>
                  <p v-if="characterDetails.weight">Weight: {{ characterDetails.weight }}</p>
                  <p v-if="characterDetails.eyes">Eyes: {{ characterDetails.eyes }}</p>
                  <p v-if="characterDetails.hair">Hair: {{ characterDetails.hair }}</p>
                </div>
              </div>
              
              <div>
                <p class="font-semibold mb-1">Ability Scores:</p>
                <div class="grid grid-cols-3 gap-2 text-sm ml-4">
                  <span v-for="ability in abilities" :key="ability">
                    {{ ability }}: {{ getFinalAbilityScore(ability) }} 
                    ({{ getAbilityModifier(getFinalAbilityScore(ability)) >= 0 ? '+' : '' }}{{ getAbilityModifier(getFinalAbilityScore(ability)) }})
                  </span>
                </div>
              </div>
              
              <p v-if="characterDetails.languages.length > 0">
                <strong>Languages:</strong> {{ characterDetails.languages.join(', ') }}
              </p>
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

      <!-- Navigation - Keep at bottom -->
      <div class="flex justify-between items-center pt-4 border-t border-gray-700">
        <button 
          @click="previousStep"
          :disabled="currentStep === 0"
          class="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 px-4 py-2 rounded"
        >
          ← Previous
        </button>
        
        <div class="flex gap-2 items-center">
          <!-- Error message -->
          <div v-if="!canProceed" class="text-xs text-red-400 mr-4">
            <p v-if="!isLevelUp && currentStep === 1 && !selectedRace">Select a race to continue</p>
            <p v-else-if="currentStep === 2 && !selectedClass">Select a class to continue</p>
            <p v-else>Complete this step to continue</p>
          </div>
          
          <button 
            @click="cancel"
            class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button 
            @click="nextStep"
            :disabled="!canProceed"
            class="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded"
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
// Import the race data from pathfinderRaces.js - Try different import paths
import { pathfinderRaces, getAllRaces, getRaceById } from '@/data/pathfinderRaces.js'

// Debug log the imports
console.log('Imported pathfinderRaces:', pathfinderRaces)

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

// Race/Class selection
const selectedRace = ref(null)
const selectedClass = ref(null)
const currentClasses = ref([])
const currentLevel = ref(0)
const selectedRaceCategory = ref('Core')

// Character details
const characterDetails = ref({
  name: '',
  age: '',
  gender: '',
  height: '',
  weight: '',
  eyes: '',
  hair: '',
  skin: '',
  deity: '',
  homeland: '',
  alignment: 'TN',
  languages: [],  // Will be set based on race
  personalityTraits: '',
  ideals: '',
  bonds: '',
  flaws: '',
  distinguishingFeatures: ''
})

// Common character data
const alignments = [
  'LG', 'NG', 'CG',
  'LN', 'TN', 'CN',
  'LE', 'NE', 'CE'
]

const commonLanguages = [
  'Common', 'Dwarven', 'Elven', 'Giant', 'Gnome', 'Goblin', 
  'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic', 
  'Infernal', 'Sylvan', 'Undercommon', 'Aquan', 'Auran',
  'Ignan', 'Terran', 'Aklo', 'Gnoll'
]

const deities = [
  { name: 'Abadar', alignment: 'LN', domains: 'Cities, wealth, merchants' },
  { name: 'Asmodeus', alignment: 'LE', domains: 'Tyranny, slavery, contracts' },
  { name: 'Calistria', alignment: 'CN', domains: 'Trickery, lust, revenge' },
  { name: 'Cayden Cailean', alignment: 'CG', domains: 'Freedom, ale, bravery' },
  { name: 'Desna', alignment: 'CG', domains: 'Dreams, stars, travelers' },
  { name: 'Erastil', alignment: 'LG', domains: 'Family, farming, hunting' },
  { name: 'Gorum', alignment: 'CN', domains: 'Strength, battle, weapons' },
  { name: 'Gozreh', alignment: 'TN', domains: 'Nature, weather, the sea' },
  { name: 'Iomedae', alignment: 'LG', domains: 'Valor, rulership, justice' },
  { name: 'Irori', alignment: 'LN', domains: 'History, knowledge, self-perfection' },
  { name: 'Lamashtu', alignment: 'CE', domains: 'Madness, monsters, nightmares' },
  { name: 'Nethys', alignment: 'TN', domains: 'Magic, destruction, knowledge' },
  { name: 'Norgorber', alignment: 'NE', domains: 'Greed, secrets, murder' },
  { name: 'Pharasma', alignment: 'TN', domains: 'Fate, death, prophecy' },
  { name: 'Rovagug', alignment: 'CE', domains: 'Wrath, disaster, destruction' },
  { name: 'Sarenrae', alignment: 'NG', domains: 'Sun, redemption, healing' },
  { name: 'Shelyn', alignment: 'NG', domains: 'Beauty, art, love' },
  { name: 'Torag', alignment: 'LG', domains: 'Forge, protection, strategy' },
  { name: 'Urgathoa', alignment: 'NE', domains: 'Gluttony, disease, undeath' },
  { name: 'Zon-Kuthon', alignment: 'LE', domains: 'Envy, pain, darkness' }
]

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

// Data - Now using imported race data
const raceCategories = ['Core', 'Featured', 'Uncommon']

// Temporary fallback races if import fails
const fallbackRaces = {
  core: [
    {
      id: 'human',
      name: 'Human',
      size: 'Medium',
      type: 'Humanoid (human)',
      speed: 30,
      abilityMods: { any: 2 },
      languages: {
        starting: ['Common'],
        bonus: 'Any (except secret languages)'
      },
      racialTraits: [
        { name: 'Bonus Feat', description: 'Humans select one extra feat at 1st level.' },
        { name: 'Skilled', description: 'Humans gain an additional skill rank at first level and one additional rank whenever they gain a level.' }
      ]
    },
    {
      id: 'elf',
      name: 'Elf',
      size: 'Medium',
      type: 'Humanoid (elf)',
      speed: 30,
      abilityMods: { DEX: 2, CON: -2, INT: 2 },
      languages: {
        starting: ['Common', 'Elven'],
        bonus: ['Celestial', 'Draconic', 'Gnoll', 'Gnome', 'Goblin', 'Orc', 'Sylvan']
      },
      racialTraits: [
        { name: 'Low-Light Vision', description: 'Elves can see twice as far as humans in dim light.' },
        { name: 'Elven Immunities', description: 'Immune to magic sleep effects, +2 racial saving throw bonus against enchantment.' }
      ]
    },
    {
      id: 'dwarf',
      name: 'Dwarf',
      size: 'Medium',
      type: 'Humanoid (dwarf)',
      speed: 20,
      abilityMods: { CON: 2, WIS: 2, CHA: -2 },
      languages: {
        starting: ['Common', 'Dwarven'],
        bonus: ['Giant', 'Gnome', 'Goblin', 'Orc', 'Terran', 'Undercommon']
      },
      racialTraits: [
        { name: 'Darkvision', description: 'Dwarves can see in the dark up to 60 feet.' },
        { name: 'Hardy', description: '+2 racial bonus on saving throws against poison, spells, and spell-like abilities.' }
      ]
    }
  ],
  featured: [],
  uncommon: []
}

// Get races by category with fallback
const getRacesByCategory = (category) => {
  try {
    const categoryKey = category.toLowerCase()
    if (pathfinderRaces && pathfinderRaces[categoryKey]) {
      const races = pathfinderRaces[categoryKey] || []
      console.log(`Found ${races.length} races in ${category} category`)
      return races
    }
    console.warn(`No races found for category: ${category}`)
    return fallbackRaces[categoryKey] || []
  } catch (error) {
    console.error('Error loading races:', error)
    return fallbackRaces[category.toLowerCase()] || []
  }
}

// Filtered races based on selected category
const filteredRaces = computed(() => {
  const races = getRacesByCategory(selectedRaceCategory.value)
  console.log('Filtered races:', races) // Debug log
  return races
})

const availableClasses = [
  {
    id: 'fighter',
    name: 'Fighter',
    hitDie: 'd10',
    bab: 'Full',
    skillPoints: 2,
    primaryAbility: 'STR or DEX',
    classSkills: ['Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Knowledge (dungeoneering)', 'Knowledge (engineering)', 'Profession', 'Ride', 'Survival', 'Swim'],
    bonusFeats: true
  },
  {
    id: 'wizard',
    name: 'Wizard',
    hitDie: 'd6',
    bab: '1/2',
    skillPoints: 2,
    primaryAbility: 'INT',
    classSkills: ['Appraise', 'Craft', 'Fly', 'Knowledge (all)', 'Linguistics', 'Profession', 'Spellcraft'],
    bonusFeats: true
  },
  {
    id: 'rogue',
    name: 'Rogue',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 8,
    primaryAbility: 'DEX',
    classSkills: ['Acrobatics', 'Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Intimidate', 'Knowledge (dungeoneering)', 'Knowledge (local)', 'Linguistics', 'Perception', 'Perform', 'Profession', 'Sense Motive', 'Sleight of Hand', 'Stealth', 'Swim', 'Use Magic Device'],
    bonusFeats: false
  },
  {
    id: 'cleric',
    name: 'Cleric',
    hitDie: 'd8',
    bab: '3/4',
    skillPoints: 2,
    primaryAbility: 'WIS',
    classSkills: ['Appraise', 'Craft', 'Diplomacy', 'Heal', 'Knowledge (arcana)', 'Knowledge (history)', 'Knowledge (nobility)', 'Knowledge (planes)', 'Knowledge (religion)', 'Linguistics', 'Profession', 'Sense Motive', 'Spellcraft'],
    bonusFeats: false
  },
  {
    id: 'barbarian',
    name: 'Barbarian',
    hitDie: 'd12',
    bab: 'Full',
    skillPoints: 4,
    primaryAbility: 'STR',
    classSkills: ['Acrobatics', 'Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Knowledge (nature)', 'Perception', 'Ride', 'Survival', 'Swim'],
    bonusFeats: false
  },
  {
    id: 'ranger',
    name: 'Ranger',
    hitDie: 'd10',
    bab: 'Full',
    skillPoints: 6,
    primaryAbility: 'STR or DEX',
    classSkills: ['Climb', 'Craft', 'Handle Animal', 'Heal', 'Intimidate', 'Knowledge (dungeoneering)', 'Knowledge (geography)', 'Knowledge (nature)', 'Perception', 'Profession', 'Ride', 'Spellcraft', 'Stealth', 'Survival', 'Swim'],
    bonusFeats: false
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
  { name: 'Weapon Focus', description: '+1 attack with chosen weapon', prerequisites: 'BAB +1' },
  { name: 'Power Attack', description: 'Trade attack bonus for damage', prerequisites: 'STR 13, BAB +1' },
  { name: 'Combat Reflexes', description: 'Additional attacks of opportunity', prerequisites: 'DEX 13' },
  { name: 'Improved Initiative', description: '+4 bonus on initiative', prerequisites: null },
  { name: 'Toughness', description: '+3 hit points, +1 per level after 3rd', prerequisites: null },
  { name: 'Iron Will', description: '+2 bonus on Will saves', prerequisites: null },
  { name: 'Lightning Reflexes', description: '+2 bonus on Reflex saves', prerequisites: null },
  { name: 'Great Fortitude', description: '+2 bonus on Fortitude saves', prerequisites: null },
  { name: 'Dodge', description: '+1 dodge bonus to AC', prerequisites: 'DEX 13' },
  { name: 'Point-Blank Shot', description: '+1 attack and damage with ranged weapons within 30 ft', prerequisites: null },
  { name: 'Weapon Finesse', description: 'Use DEX for attack with light weapons', prerequisites: null },
  { name: 'Two-Weapon Fighting', description: 'Reduce two-weapon fighting penalties', prerequisites: 'DEX 15' },
  { name: 'Combat Casting', description: '+4 on concentration checks for defensive casting', prerequisites: null },
  { name: 'Spell Focus', description: '+1 DC for spells from chosen school', prerequisites: null },
  { name: 'Skill Focus', description: '+3 bonus on chosen skill', prerequisites: null },
  { name: 'Alertness', description: '+2 on Perception and Sense Motive', prerequisites: null },
  { name: 'Athletic', description: '+2 on Climb and Swim', prerequisites: null },
  { name: 'Acrobatic', description: '+2 on Acrobatics and Fly', prerequisites: null },
  { name: 'Stealthy', description: '+2 on Escape Artist and Stealth', prerequisites: null }
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
  }
]

// Computed
const totalSteps = computed(() => {
  if (isLevelUp.value) return 5 // Class, HP, Skills, Feats, Summary
  return 9 // Mode, Race, Class, Abilities, Skills, Feats, Equipment, Details, Summary
})

const canProceed = computed(() => {
  console.log('Computing canProceed for step', currentStep.value)
  
  if (!isLevelUp.value) {
    switch (currentStep.value) {
      case 0: return true // Mode selection
      case 1: 
        const canProceedStep1 = selectedRace.value !== null
        console.log('Step 1 (Race) can proceed:', canProceedStep1, 'Selected race:', selectedRace.value)
        return canProceedStep1
      case 2: return selectedClass.value !== null // Class
      case 3: return validateAbilityScores()
      case 4: return true // Skills (can skip)
      case 5: return selectedFeats.value.length <= featsRemaining.value // Allow 0 feats
      case 6: return true // Equipment (can skip)
      case 7: return true // Character details (can skip)
      case 8: return true // Summary
    }
  } else {
    switch (currentStep.value) {
      case 0: return selectedClass.value !== null
      case 1: return hitPointsRolled.value
      case 2: return true // Skills (can skip)
      case 3: return selectedFeats.value.length <= featsRemaining.value
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

const filteredFeats = computed(() => {
  if (!featFilter.value) return availableFeats
  const filter = featFilter.value.toLowerCase()
  return availableFeats.filter(feat => 
    feat.name.toLowerCase().includes(filter) ||
    feat.description.toLowerCase().includes(filter)
  )
})

// Methods
function formatAbilityMods(mods) {
  if (mods.any) return `+${mods.any} to any`
  return Object.entries(mods)
    .map(([ability, mod]) => `${mod > 0 ? '+' : ''}${mod} ${ability}`)
    .join(', ')
}

// Get a summary of race traits
function getRaceTraitSummary(race) {
  if (race.racialTraits && race.racialTraits.length > 0) {
    return race.racialTraits.slice(0, 2).map(trait => trait.name).join(', ') + '...'
  }
  return 'No special traits'
}

function selectRace(race) {
  console.log('Selecting race:', race) // Debug log
  selectedRace.value = race
  
  // Set starting languages based on race
  if (race.languages?.starting) {
    characterDetails.value.languages = [...race.languages.starting]
  } else {
    characterDetails.value.languages = ['Common']
  }
  
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
  if (!selectedClass.value?.hitDie) return
  const dieSize = parseInt(selectedClass.value.hitDie.substring(1))
  hitPointRoll.value = Math.floor(Math.random() * dieSize) + 1
  hitPointsRolled.value = true
}

function getAverageHP() {
  if (!selectedClass.value?.hitDie) return 0
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

function calculateSkillPoints() {
  if (!selectedClass.value) {
    totalSkillPoints.value = 0
    skillPointsRemaining.value = 0
    return
  }
  
  const intMod = getAbilityModifier(getFinalAbilityScore('INT'))
  let points = selectedClass.value.skillPoints + intMod
  
  // Human bonus
  if (selectedRace.value?.name === 'Human') {
    points += 1
  }
  
  // Minimum 1 skill point
  points = Math.max(1, points)
  
  totalSkillPoints.value = points
  skillPointsRemaining.value = points
}

function isClassSkill(skill) {
  if (!selectedClass.value?.classSkills) return false
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

function selectEquipmentPack(pack) {
  selectedEquipment.value = pack.items.map(name => ({ name, cost: 10 })) // Simplified
}

function getClassLevel(className) {
  const cls = currentClasses.value.find(c => c.className === className)
  return cls ? cls.level : 0
}

// Helper functions for languages
function getStartingLanguages() {
  if (!selectedRace.value) {
    return 'Common'
  }
  if (!selectedRace.value?.languages?.starting) {
    return 'Common'
  }
  const languages = [...selectedRace.value.languages.starting]
  if (!languages.includes('Common')) {
    languages.unshift('Common')
  }
  return languages.join(', ')
}

function getRacialLanguages() {
  if (!selectedRace.value?.languages?.starting) {
    return ['Common']
  }
  return selectedRace.value.languages.starting
}

function getBonusLanguageOptions() {
  if (!selectedRace.value) {
    return []  // No options until race is selected
  }
  
  if (!selectedRace.value?.languages?.bonus) {
    return commonLanguages
  }
  
  const bonus = selectedRace.value.languages.bonus
  if (typeof bonus === 'string') {
    // Handle "Any (except secret languages)" case
    return commonLanguages
  }
  
  // Return the specific bonus language options
  return bonus
}

function getBonusLanguages() {
  const intMod = getAbilityModifier(getFinalAbilityScore('INT'))
  return Math.max(0, intMod)
}

function getAvailableLanguages() {
  // If no race selected, return empty array
  if (!selectedRace.value) {
    return []
  }
  
  // Get the racial starting languages
  const knownLanguages = getRacialLanguages()
  
  // Get the available bonus languages for this race
  const bonusOptions = getBonusLanguageOptions()
  
  // Filter out languages the character already knows
  return bonusOptions.filter(lang => !knownLanguages.includes(lang))
}

function canSelectLanguage(lang) {
  const bonusLangs = getBonusLanguages()
  const racialLangs = getRacialLanguages()
  const selectedBonus = characterDetails.value.languages.filter(l => 
    !racialLangs.includes(l)
  ).length
  return selectedBonus < bonusLangs || characterDetails.value.languages.includes(lang)
}

// Add random generation helpers
function generateRandomHeight() {
  // Base height by race
  const raceHeights = {
    'Human': { base: 58, modifier: '2d10' }, // 4'10" + 2d10 inches
    'Elf': { base: 64, modifier: '2d8' },    // 5'4" + 2d8 inches
    'Dwarf': { base: 45, modifier: '2d4' },   // 3'9" + 2d4 inches
    'Halfling': { base: 32, modifier: '2d4' }, // 2'8" + 2d4 inches
    // Add more races as needed
  }
  
  const race = selectedRace.value?.name || 'Human'
  const raceData = raceHeights[race] || raceHeights['Human']
  
  // Simple random generation
  let inches = raceData.base
  if (raceData.modifier.includes('d')) {
    const [count, size] = raceData.modifier.split('d').map(Number)
    for (let i = 0; i < count; i++) {
      inches += Math.floor(Math.random() * size) + 1
    }
  }
  
  const feet = Math.floor(inches / 12)
  const remainingInches = inches % 12
  characterDetails.value.height = `${feet}'${remainingInches}"`
}

function generateRandomWeight() {
  // This would be based on height and race
  // Simplified version
  const weights = {
    'Human': { min: 110, max: 200 },
    'Elf': { min: 90, max: 150 },
    'Dwarf': { min: 130, max: 200 },
    'Halfling': { min: 30, max: 40 }
  }
  
  const race = selectedRace.value?.name || 'Human'
  const range = weights[race] || weights['Human']
  const weight = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
  characterDetails.value.weight = `${weight} lbs`
}

function generateRandomDetails() {
  // Generate random physical characteristics
  generateRandomHeight()
  generateRandomWeight()
  
  // Random age based on race
  const ageRanges = {
    'Human': { min: 16, max: 60 },
    'Elf': { min: 100, max: 300 },
    'Dwarf': { min: 40, max: 250 },
    'Halfling': { min: 20, max: 100 }
  }
  const race = selectedRace.value?.name || 'Human'
  const range = ageRanges[race] || ageRanges['Human']
  characterDetails.value.age = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
  
  // Random appearance
  const hairColors = ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White', 'Auburn']
  const eyeColors = ['Brown', 'Blue', 'Green', 'Gray', 'Hazel', 'Amber']
  const skinTones = ['Pale', 'Fair', 'Light', 'Tan', 'Bronze', 'Dark', 'Ebony']
  
  characterDetails.value.hair = hairColors[Math.floor(Math.random() * hairColors.length)]
  characterDetails.value.eyes = eyeColors[Math.floor(Math.random() * eyeColors.length)]
  characterDetails.value.skin = skinTones[Math.floor(Math.random() * skinTones.length)]
}

function generateQuickCharacter() {
  // Quick character generation
  // Select Human from Core races
  const races = getRacesByCategory('Core')
  const humanRace = races.find(race => race.id === 'human') || races[0]
  if (humanRace) {
    selectedRace.value = humanRace
    // Set starting languages
    if (humanRace.languages?.starting) {
      characterDetails.value.languages = [...humanRace.languages.starting]
    } else {
      characterDetails.value.languages = ['Common']
    }
  }
  selectedClass.value = availableClasses[0] // Fighter
  
  // Standard array
  abilityScores.value = {
    STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8
  }
  
  // Auto-allocate skills
  calculateSkillPoints()
  
  // Select basic feats
  selectedFeats.value = ['Weapon Focus', 'Toughness']
  
  // Basic equipment
  selectEquipmentPack(equipmentPacks[1])
  
  // Generate random details
  generateRandomDetails()
  characterDetails.value.name = 'Quick Hero'
  
  // Jump to summary
  currentStep.value = 8 // Updated for new step count
}

function nextStep() {
  console.log('Next button clicked. Current step:', currentStep.value, 'Can proceed:', canProceed.value)
  
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
    console.log('Moving to step:', currentStep.value)
    
    // Initialize step-specific data
    if (!isLevelUp.value && currentStep.value === 4 || isLevelUp.value && currentStep.value === 2) {
      calculateSkillPoints()
    }
    
    if (!isLevelUp.value && currentStep.value === 5 || isLevelUp.value && currentStep.value === 3) {
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
    ...characterDetails.value, // Include all character details
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
  console.log('CharacterBuilderWizard mounted')
  console.log('pathfinderRaces:', pathfinderRaces)
  console.log('Core races:', pathfinderRaces.core)
  
  if (isLevelUp.value) {
    // Load current character data
    currentClasses.value = characterState.classes || []
    currentLevel.value = currentClasses.value.reduce((sum, c) => sum + c.level, 0)
    
    // Copy current ability scores
    if (characterState.abilityScores) {
      Object.assign(abilityScores.value, characterState.abilityScores)
    }
    
    // Copy existing character details including languages
    if (characterState.languages) {
      characterDetails.value.languages = [...characterState.languages]
    }
  } else {
    // New character - set default starting language
    characterDetails.value.languages = ['Common']
  }
})
</script>

<style scoped>
/* Backdrop for modal-like appearance */
.character-builder-wizard-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
  overflow-y: auto;
}

/* Main wizard container */
.character-builder-wizard {
  background-color: #111827;
  position: relative;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0; /* Prevent flex item from overflowing */
}

/* Step content container - scrollable */
.step-content-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 300px;
  max-height: calc(90vh - 200px);
  padding-right: 0.5rem;
  padding-bottom: 1rem; /* Add padding to prevent content cutoff */
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
  overflow: hidden; /* Prevent content overflow */
  word-wrap: break-word; /* Break long words */
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
  padding-right: 0.5rem;
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
.transform.hover\:scale-102:hover {
  transform: scale(1.02);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .character-builder-wizard-backdrop {
    padding: 0.5rem;
  }
  
  .character-builder-wizard {
    max-height: 95vh;
  }
  
  .step-content-container {
    max-height: calc(95vh - 180px);
  }
  
  .skills-list,
  .feats-list {
    max-height: 300px;
  }
}
</style>