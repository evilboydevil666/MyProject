<template>
  <div class="character-builder-wizard-container">
    <div class="character-builder-wizard bg-gray-900 text-white p-6 rounded-lg shadow-2xl border border-gray-700 backdrop-blur-sm bg-opacity-95">
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-blue-300 mb-2">
          {{ isLevelUp ? '📈 Level Up Wizard' : '🎭 Character Builder' }}
        </h2>
        <div class="flex items-center gap-4 text-sm text-gray-400">
          <div>
            <span class="text-lg font-semibold text-white">Step {{ currentStep + 1 }} of {{ totalSteps }}</span>
          </div>
          <div class="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              class="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-300 shadow-sm"
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              @click="creationMode = 'guided'; nextStep()"
              class="p-6 bg-gray-800 hover:bg-gray-700 rounded-lg border-2 border-gray-600 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              <h4 class="text-lg font-bold text-green-300 mb-2">🎯 Guided Creation</h4>
              <p class="text-sm">Step-by-step character creation with recommendations</p>
            </button>
            <button 
              @click="creationMode = 'quick'; generateQuickCharacter()"
              class="p-6 bg-gray-800 hover:bg-gray-700 rounded-lg border-2 border-gray-600 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/30"
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
                    ? 'bg-green-700 text-white shadow-md border border-green-400' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
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
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
              <div 
                v-for="race in filteredRaces" 
                :key="race.id"
                @click="selectRace(race)"
                :class="[
                  'race-card p-4 rounded-lg cursor-pointer transition-all',
                  selectedRace?.id === race.id 
                    ? 'bg-green-800 border-2 border-green-400 shadow-md' 
                    : 'bg-gray-800 border-2 border-gray-600 hover:border-gray-500 hover:bg-gray-750'
                ]"
              >
                <h4 class="font-bold" :class="selectedRace?.id === race.id ? 'text-green-200' : 'text-green-300'">
                  {{ race.name }}
                </h4>
                <p class="text-xs mt-1" :class="selectedRace?.id === race.id ? 'text-green-300' : 'text-gray-400'">
                  {{ race.size }} {{ race.type }}
                </p>
                <div class="mt-2 text-xs">
                  <p :class="selectedRace?.id === race.id ? 'text-green-200' : 'text-blue-300'">
                    {{ formatAbilityMods(race.abilityMods) }}
                  </p>
                  <p class="mt-1" :class="selectedRace?.id === race.id ? 'text-green-300' : 'text-gray-400'">
                    Speed: {{ race.speed }} ft.
                  </p>
                  <p :class="selectedRace?.id === race.id ? 'text-green-300' : 'text-gray-400'">
                    {{ getRaceTraitSummary(race) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Class and Favored Class Selection -->
        <div v-else-if="(!isLevelUp && currentStep === 2) || (isLevelUp && currentStep === 0)" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">
            {{ isLevelUp ? 'Choose Class for Level ' + (currentLevel + 1) : 'Choose Your Class' }}
          </h3>
          
          <!-- Class Category Tabs -->
          <div class="mb-4">
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="category in classCategories"
                :key="category"
                @click="selectedClassCategory = category"
                :class="[
                  'px-4 py-2 rounded transition-all',
                  selectedClassCategory === category 
                    ? 'bg-green-700 text-white shadow-md border border-green-400' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                ]"
              >
                {{ category }}
              </button>
            </div>
          </div>
          
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
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
              <div 
                v-for="cls in filteredClasses" 
                :key="cls.id"
                @click="selectClass(cls)"
                :class="[
                  'class-card p-4 rounded-lg cursor-pointer transition-all',
                  selectedClass?.id === cls.id 
                    ? 'bg-green-800 border-2 border-green-400 shadow-md' 
                    : 'bg-gray-800 border-2 border-gray-600 hover:border-gray-500 hover:bg-gray-750',
                  !meetsClassRequirements(cls) ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                <h4 class="font-bold" :class="selectedClass?.id === cls.id ? 'text-green-200' : 'text-green-300'">
                  {{ cls.name }}
                </h4>
                <p class="text-xs text-gray-400">{{ cls.category }}</p>
                <p class="text-xs mt-1" :class="selectedClass?.id === cls.id ? 'text-green-300' : 'text-gray-400'">
                  {{ cls.hitDie }} HD, {{ formatBAB(cls.bab) }} BAB
                </p>
                <div class="mt-2 text-xs">
                  <p :class="selectedClass?.id === cls.id ? 'text-green-300' : ''">
                    {{ cls.skillPoints }} + Int skill points
                  </p>
                  <p class="mt-1" :class="selectedClass?.id === cls.id ? 'text-green-200' : 'text-blue-300'">
                    {{ cls.primaryAbility }}
                  </p>
                  <p v-if="cls.alignment && cls.alignment !== 'Any'" class="mt-1 text-yellow-400">
                    Requires: {{ cls.alignment }}
                  </p>
                  <p class="mt-1 text-gray-300 line-clamp-2">{{ cls.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Favored Class Selection (Creation Only) -->
          <div v-if="!isLevelUp && selectedClass" class="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h4 class="font-semibold mb-3 text-blue-300">Favored Class</h4>
            <p class="text-sm text-gray-400 mb-3">
              Your favored class grants you a bonus at each level. Choose your favored class:
            </p>
            <div class="space-y-2">
              <label class="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
                <input 
                  type="radio" 
                  v-model="favoredClass" 
                  :value="selectedClass.name"
                  class="mr-2 text-green-500"
                />
                <span>{{ selectedClass.name }} (Current class)</span>
              </label>
              <label v-if="selectedRace?.name === 'Half-Elf'" class="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
                <input 
                  type="radio" 
                  v-model="favoredClass" 
                  value="any"
                  class="mr-2 text-green-500"
                />
                <span>Any (Half-Elf can choose any class)</span>
              </label>
            </div>
            
            <div v-if="favoredClass" class="mt-4 p-3 bg-gray-750 rounded">
              <p class="text-sm font-medium mb-2 text-green-300">Favored Class Bonus (gained each level):</p>
              <div class="space-y-2">
                <label class="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="favoredClassBonus" 
                    value="hp"
                    class="mr-2 text-blue-500"
                  />
                  <span>+1 hit point</span>
                </label>
                <label class="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="favoredClassBonus" 
                    value="skill"
                    class="mr-2 text-blue-500"
                  />
                  <span>+1 skill rank</span>
                </label>
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
                  'px-4 py-2 rounded transition-all',
                  abilityMethod === method 
                    ? 'bg-green-700 text-white shadow-md border border-green-400' 
                    : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
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
            
            <!-- Derived Statistics Display -->
            <div v-if="derivedStats" class="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h4 class="font-semibold mb-3 text-blue-300">Derived Statistics</h4>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span class="text-gray-400">Initiative:</span>
                  <span class="ml-2 text-green-300">{{ derivedStats.initiative >= 0 ? '+' : '' }}{{ derivedStats.initiative }}</span>
                </div>
                <div>
                  <span class="text-gray-400">HP:</span>
                  <span class="ml-2 text-green-300">{{ derivedStats.maxHP }}</span>
                </div>
                <div>
                  <span class="text-gray-400">AC:</span>
                  <span class="ml-2 text-green-300">{{ derivedStats.ac.total }}</span>
                </div>
                <div>
                  <span class="text-gray-400">Fort:</span>
                  <span class="ml-2 text-green-300">{{ derivedStats.fortitude >= 0 ? '+' : '' }}{{ derivedStats.fortitude }}</span>
                </div>
                <div>
                  <span class="text-gray-400">Ref:</span>
                  <span class="ml-2 text-green-300">{{ derivedStats.reflex >= 0 ? '+' : '' }}{{ derivedStats.reflex }}</span>
                </div>
                <div>
                  <span class="text-gray-400">Will:</span>
                  <span class="ml-2 text-green-300">{{ derivedStats.will >= 0 ? '+' : '' }}{{ derivedStats.will }}</span>
                </div>
                <div>
                  <span class="text-gray-400">BAB:</span>
                  <span class="ml-2 text-green-300">{{ derivedStats.bab >= 0 ? '+' : '' }}{{ derivedStats.bab }}</span>
                </div>
                <div>
                  <span class="text-gray-400">CMB:</span>
                  <span class="ml-2 text-green-300">{{ derivedStats.cmb >= 0 ? '+' : '' }}{{ derivedStats.cmb }}</span>
                </div>
                <div>
                  <span class="text-gray-400">CMD:</span>
                  <span class="ml-2 text-green-300">{{ derivedStats.cmd }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Hit Point Rolling -->
          <div v-else class="space-y-4">
            <div class="bg-gray-800 p-6 rounded-lg text-center border border-gray-700">
              <p class="text-lg mb-4">Rolling hit points for <span class="text-green-300 font-bold">{{ selectedClass?.name || 'Unknown Class' }}</span> (<span class="text-blue-300">{{ selectedClass?.hitDie || 'd?' }}</span>)</p>
              
              <div v-if="!hitPointsRolled" class="space-y-4">
                <button 
                  @click="rollHitPoints"
                  class="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg text-lg font-semibold transition-all hover:shadow-lg hover:shadow-green-500/30"
                >
                  🎲 Roll Hit Points
                </button>
                <p class="text-sm text-gray-400">Or take average: <span class="text-white font-bold">{{ getAverageHP() }}</span></p>
                <button 
                  @click="takeAverageHP"
                  class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition-all hover:shadow-md"
                >
                  Take Average
                </button>
              </div>

              <div v-else class="space-y-4">
                <div class="text-3xl font-bold text-green-300 animate-pulse">
                  {{ hitPointRoll }}
                </div>
                <p class="text-sm text-gray-400">
                  + <span class="text-white">{{ getAbilityModifier(getFinalAbilityScore('CON')) }}</span> (CON modifier)
                  <span v-if="favoredClass === selectedClass.name && favoredClassBonus === 'hp'">
                    + <span class="text-white">1</span> (Favored Class)
                  </span>
                </p>
                <p class="text-xl font-semibold bg-green-900 bg-opacity-50 rounded p-2 inline-block">
                  Total: <span class="text-green-300">+{{ getTotalHPGain() }} HP</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: Skills -->
        <div v-else-if="(!isLevelUp && currentStep === 4) || (isLevelUp && currentStep === 2)" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">Allocate Skill Points</h3>
          
          <div class="mb-4 p-3 bg-gray-800 rounded flex justify-between items-center border border-gray-700">
            <div>
              <p class="text-sm text-gray-400">Skill Points Available:</p>
              <p class="text-2xl font-bold" :class="skillPointsRemaining > 0 ? 'text-green-300' : 'text-gray-500'">
                {{ skillPointsRemaining }} / {{ totalSkillPoints }}
              </p>
              <p v-if="totalSkillPoints === 0" class="text-xs text-yellow-400 mt-1">Select a class to see skill points</p>
            </div>
            <div class="text-sm text-gray-400">
              <p v-if="selectedClass">Class Skills: <span class="text-white">{{ selectedClass.skillPoints }}</span> + <span class="text-white">{{ getAbilityModifier(getFinalAbilityScore('INT')) }}</span> (INT)</p>
              <p v-else class="text-yellow-400">Please select a class first</p>
              <p v-if="selectedRace?.name === 'Human'">+<span class="text-white">1</span> (Human bonus)</p>
              <p v-if="favoredClass === selectedClass?.name && favoredClassBonus === 'skill'">+<span class="text-white">1</span> (Favored class)</p>
            </div>
          </div>

          <div class="skills-list grid grid-cols-1 md:grid-cols-2 gap-2">
            <div 
              v-for="skill in availableSkills" 
              :key="skill.name"
              :class="[
                'p-4 rounded flex items-center justify-between transition-all',
                isClassSkill(skill) 
                  ? 'bg-gray-750 border border-green-700' 
                  : 'bg-gray-800 border border-gray-700'
              ]"
            >
              <div class="flex-1 min-w-0 pr-2">
                <p class="font-medium">
                  {{ skill.name }}
                  <span class="text-xs text-gray-400 ml-1">({{ skill.ability }})</span>
                  <span v-if="isClassSkill(skill)" class="text-xs text-green-400 ml-1">● Class Skill</span>
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
          
          <div class="mb-4 p-3 bg-gray-800 rounded border border-gray-700">
            <p class="text-sm text-gray-400">
              Feats Remaining: 
              <span class="font-bold text-2xl" :class="featsRemaining - selectedFeats.length > 0 ? 'text-green-300' : 'text-gray-500'">
                {{ featsRemaining - selectedFeats.length }}
              </span>
            </p>
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

          <div class="feats-list grid grid-cols-1 md:grid-cols-2 gap-3 p-1">
            <div 
              v-for="feat in filteredFeats" 
              :key="feat.name"
              @click="toggleFeat(feat)"
              :class="[
                'feat-card p-4 rounded cursor-pointer transition-all',
                selectedFeats.includes(feat.name) 
                  ? 'bg-green-800 border-2 border-green-400 shadow-md' 
                  : 'bg-gray-800 border-2 border-gray-600 hover:border-gray-500 hover:bg-gray-750',
                !meetsPrerequisites(feat) ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <div>
                <h4 class="font-bold" :class="selectedFeats.includes(feat.name) ? 'text-green-200' : ''">
                  {{ feat.name }}
                </h4>
                <p class="text-xs mt-1" :class="selectedFeats.includes(feat.name) ? 'text-green-300' : 'text-gray-400'">
                  {{ feat.description }}
                </p>
                <p v-if="feat.prerequisites" class="text-xs mt-1" :class="selectedFeats.includes(feat.name) ? 'text-yellow-200' : 'text-yellow-400'">
                  Requires: {{ feat.prerequisites }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 7: Spells (Creation Only, for spellcasters) -->
        <div v-else-if="!isLevelUp && currentStep === 6 && isSpellcaster" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">Select Spells</h3>
          
          <!-- Wizard Spells -->
          <div v-if="selectedClass?.name === 'Wizard'">
            <div class="mb-4 p-3 bg-gray-800 rounded border border-gray-700">
              <p class="text-sm text-gray-400">
                As a wizard, you know all cantrips and start with 3 + INT modifier 1st level spells in your spellbook.
              </p>
              <p class="text-sm text-green-300 mt-2">
                Spells Known: {{ 3 + getAbilityModifier(getFinalAbilityScore('INT')) }}
              </p>
            </div>
            
            <!-- Cantrips -->
            <div class="mb-6">
              <h4 class="font-semibold text-blue-300 mb-2">Cantrips (0-level spells)</h4>
              <p class="text-xs text-gray-400 mb-2">You know all wizard cantrips</p>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div v-for="spell in wizardCantrips" :key="spell.name" class="p-2 bg-gray-800 rounded text-sm">
                  <span class="font-medium">{{ spell.name }}</span>
                  <p class="text-xs text-gray-400">{{ spell.school }}</p>
                </div>
              </div>
            </div>
            
            <!-- 1st Level Spells -->
            <div>
              <h4 class="font-semibold text-blue-300 mb-2">1st Level Spells</h4>
              <p class="text-xs text-gray-400 mb-2">
                Selected: {{ selectedSpells.length }} / {{ 3 + getAbilityModifier(getFinalAbilityScore('INT')) }}
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div 
                  v-for="spell in wizard1stLevelSpells" 
                  :key="spell.name"
                  @click="toggleSpell(spell)"
                  :class="[
                    'p-3 rounded cursor-pointer transition-all',
                    selectedSpells.includes(spell.name) 
                      ? 'bg-green-800 border-2 border-green-400' 
                      : 'bg-gray-800 border-2 border-gray-600 hover:border-gray-500',
                    selectedSpells.length >= (3 + getAbilityModifier(getFinalAbilityScore('INT'))) && !selectedSpells.includes(spell.name)
                      ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                >
                  <h5 class="font-medium">{{ spell.name }}</h5>
                  <p class="text-xs text-gray-400">{{ spell.school }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ spell.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Divine Casters -->
          <div v-else-if="isDivineCaster">
            <div class="p-4 bg-gray-800 rounded border border-gray-700">
              <p class="text-sm text-gray-400 mb-2">
                As a {{ selectedClass.name }}, you have access to all spells on your spell list.
              </p>
              <p class="text-sm text-green-300">
                You can prepare {{ getSpellsPerDay() }} spells per day.
              </p>
              
              <!-- Domain Selection for Clerics -->
              <div v-if="selectedClass?.name === 'Cleric'" class="mt-4">
                <h4 class="font-semibold text-blue-300 mb-2">Choose Domains</h4>
                <p class="text-xs text-gray-400 mb-2">Select 2 domains from your deity</p>
                <div class="grid grid-cols-2 gap-2">
                  <div 
                    v-for="domain in availableDomains" 
                    :key="domain"
                    @click="toggleDomain(domain)"
                    :class="[
                      'p-2 rounded cursor-pointer text-sm transition-all',
                      selectedDomains.includes(domain) 
                        ? 'bg-green-800 border border-green-400' 
                        : 'bg-gray-700 border border-gray-600 hover:border-gray-500',
                      selectedDomains.length >= 2 && !selectedDomains.includes(domain)
                        ? 'opacity-50 cursor-not-allowed' : ''
                    ]"
                  >
                    {{ domain }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 8: Equipment (Creation Only) -->
        <div v-else-if="!isLevelUp && ((isSpellcaster && currentStep === 7) || (!isSpellcaster && currentStep === 6))" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">Starting Equipment</h3>
          
          <!-- Gold Display -->
          <div class="mb-4 p-4 bg-gray-800 rounded border border-gray-700">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p class="text-sm text-gray-400">Starting Gold:</p>
                <div class="flex flex-col items-center">
                  <div class="flex items-center gap-2">
                    <p class="text-xl font-bold text-yellow-300">{{ Math.floor(actualStartingGold) }} gp</p>
                    <button 
                      @click="rollStartingGold"
                      class="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded"
                      :title="`Roll for starting gold (${getStartingGoldFormula()})`"
                    >
                      🎲
                    </button>
                  </div>
                  <span v-if="selectedClass && !goldRollMessage" class="text-xs text-gray-500 mt-1">({{ getStartingGoldFormula() }})</span>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-400">Spent:</p>
                <p class="text-xl font-semibold text-red-400">
                  {{ totalEquipmentCost < 1 ? totalEquipmentCost.toFixed(1) : totalEquipmentCost.toFixed(0) }} gp
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Remaining:</p>
                <p class="text-xl font-bold" :class="actualRemainingGold >= 0 ? 'text-green-300' : 'text-red-400'">
                  {{ actualRemainingGold < 1 && actualRemainingGold > 0 ? actualRemainingGold.toFixed(1) : Math.floor(actualRemainingGold) }} gp
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Total Weight:</p>
                <p class="text-xl font-semibold" :class="totalEquipmentWeight > getCarryingCapacity() ? 'text-red-400' : 'text-gray-300'">
                  {{ totalEquipmentWeight.toFixed(1) }} lbs
                </p>
              </div>
            </div>
            <div v-if="goldRollMessage" class="mt-3 text-center">
              <p class="text-xs text-green-400 animate-pulse">{{ goldRollMessage }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Equipment Categories and List -->
            <div class="space-y-4">
              <!-- Category Tabs -->
              <div class="flex gap-2 flex-wrap mb-4">
                <button
                  v-for="category in equipmentCategories"
                  :key="category"
                  @click="selectedEquipmentCategory = category"
                  :class="[
                    'px-4 py-2 rounded transition-all',
                    selectedEquipmentCategory === category 
                      ? 'bg-green-700 text-white shadow-md border border-green-400' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                  ]"
                >
                  {{ category }}
                </button>
              </div>

              <!-- Search -->
              <div class="mb-3">
                <input 
                  v-model="equipmentSearch"
                  placeholder="Search equipment..."
                  class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>

              <!-- Equipment List -->
              <div class="equipment-list-container bg-gray-800 rounded p-4 border border-gray-700">
                <!-- Class Recommendations -->
                <div v-if="selectedClass && getRecommendedItems().length > 0" class="mb-4 p-3 bg-blue-900 bg-opacity-30 rounded border border-blue-700">
                  <h5 class="text-sm font-semibold text-blue-300 mb-2">Recommended for {{ selectedClass.name }}:</h5>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="item in getRecommendedItems()"
                      :key="item.name"
                      @click="addEquipmentByName(item.name)"
                      :disabled="actualRemainingGold < item.cost"
                      :class="[
                        'px-3 py-1 rounded text-xs transition-all whitespace-nowrap',
                        actualRemainingGold >= item.cost
                          ? 'bg-blue-700 hover:bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      ]"
                    >
                      {{ item.name }} ({{ item.cost }}gp)
                    </button>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto pr-2">
                  <div 
                    v-for="item in filteredEquipment" 
                    :key="item.name"
                    class="flex items-center justify-between p-3 bg-gray-750 hover:bg-gray-700 rounded border border-gray-600 transition-all min-h-[60px]"
                  >
                    <div class="flex-1 pr-3 min-w-0">
                      <p class="font-medium truncate">{{ item.name }}</p>
                      <p class="text-xs text-gray-400 truncate">{{ item.description || item.type }}</p>
                    </div>
                    <div class="flex items-center gap-3 flex-shrink-0">
                      <span class="text-yellow-300 font-semibold whitespace-nowrap">
                        {{ item.cost < 1 ? item.cost.toFixed(1) : item.cost }} gp
                      </span>
                      <button
                        @click="addEquipment(item)"
                        :disabled="actualRemainingGold < item.cost"
                        :class="[
                          'px-3 py-1 rounded text-sm transition-all whitespace-nowrap',
                          actualRemainingGold >= item.cost
                            ? 'bg-green-600 hover:bg-green-500 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        ]"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div v-if="filteredEquipment.length === 0" class="text-center py-8 text-gray-500">
                    No equipment found
                  </div>
                </div>
                
                <!-- Add Custom Item - MOVED HERE -->
                <div class="mt-4 bg-gray-700 rounded p-4 border border-gray-600">
                  <h4 class="font-semibold mb-3 text-blue-300">Add Custom Item</h4>
                  <div class="grid grid-cols-1 gap-2">
                    <div class="grid grid-cols-2 gap-2">
                      <input 
                        v-model="customItemName"
                        placeholder="Item name"
                        class="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-sm"
                      />
                      <input 
                        v-model.number="customItemCost"
                        type="number"
                        placeholder="Cost (gp)"
                        min="0"
                        step="0.1"
                        class="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <button
                      @click="addCustomItem"
                      :disabled="!customItemName || customItemCost < 0 || actualRemainingGold < customItemCost"
                      :class="[
                        'px-4 py-2 rounded text-sm font-medium transition-all w-full',
                        customItemName && customItemCost >= 0 && actualRemainingGold >= customItemCost
                          ? 'bg-green-600 hover:bg-green-500 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      ]"
                    >
                      Add Custom Item
                    </button>
                  </div>
                </div>
              </div>

              <!-- Quick Packs -->
              <div class="mt-4 overflow-hidden">
                <h4 class="font-semibold mb-2 text-blue-300">Quick Equipment Packs</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button 
                    v-for="pack in equipmentPacks" 
                    :key="pack.name"
                    @click="selectEquipmentPack(pack)"
                    :disabled="actualRemainingGold < pack.cost"
                    :class="[
                      'p-4 rounded text-left transition-all border-2 min-h-[100px] hover:brightness-110',
                      actualRemainingGold >= pack.cost
                        ? 'bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-green-500'
                        : 'bg-gray-900 border-gray-700 cursor-not-allowed opacity-50'
                    ]"
                  >
                    <p class="font-medium text-sm mb-1">{{ pack.name }}</p>
                    <p class="text-xs text-gray-400 mb-2 line-clamp-2">{{ pack.description }}</p>
                    <p class="text-sm text-yellow-300 font-semibold">
                      {{ pack.cost < 1 ? pack.cost.toFixed(1) : pack.cost }} gp
                    </p>
                  </button>
                </div>
              </div>
            </div>

            <!-- Selected Equipment -->
            <div class="mt-6">
              <div class="bg-gray-800 p-4 rounded border border-gray-700">
                <h4 class="font-semibold mb-3 text-green-300">Your Equipment</h4>
                <div class="space-y-1 max-h-64 overflow-y-auto">
                  <div v-if="selectedEquipment.length === 0" class="text-gray-500 text-sm text-center py-8">
                    No equipment selected
                  </div>
                  <div 
                    v-for="(item, index) in selectedEquipment" 
                    :key="`${item.name}-${index}`" 
                    class="flex items-center justify-between p-2 bg-gray-750 rounded group hover:bg-gray-700 transition-all min-h-[50px]"
                  >
                    <div class="flex-1 min-w-0 pr-2">
                      <p class="text-sm font-medium truncate">{{ item.name }}</p>
                      <p class="text-xs text-gray-400">
                        {{ ((item.weight || 0) * (item.quantity || 1)).toFixed(1) }} lbs
                      </p>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <!-- Quantity controls -->
                      <div class="flex items-center gap-1">
                        <button 
                          @click="adjustItemQuantity(item, -1)"
                          :disabled="item.quantity <= 1"
                          class="text-xs bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 px-1 rounded"
                        >
                          -
                        </button>
                        <span class="text-xs w-6 text-center">{{ item.quantity || 1 }}</span>
                        <button 
                          @click="adjustItemQuantity(item, 1)"
                          :disabled="actualRemainingGold < item.cost"
                          class="text-xs bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 px-1 rounded"
                        >
                          +
                        </button>
                      </div>
                      <span class="text-yellow-300 text-sm w-12 text-right">
                        {{ (item.cost * (item.quantity || 1)) < 1 ? (item.cost * (item.quantity || 1)).toFixed(1) : (item.cost * (item.quantity || 1)).toFixed(0) }}
                      </span>
                      <button 
                        @click="removeEquipment(index)"
                        class="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Totals -->
                <div v-if="selectedEquipment.length > 0" class="border-t border-gray-700 pt-3 mt-3">
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-400">Items:</span>
                    <span>{{ selectedEquipment.reduce((sum, item) => sum + (item.quantity || 1), 0) }}</span>
                  </div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-400">Total Weight:</span>
                    <span :class="totalEquipmentWeight > getCarryingCapacity() ? 'text-red-400 font-bold' : ''">
                      {{ totalEquipmentWeight.toFixed(1) }} lbs
                    </span>
                  </div>
                  <div class="flex justify-between font-semibold">
                    <span>Total Cost:</span>
                    <span class="text-yellow-300">
                      {{ totalEquipmentCost < 1 ? totalEquipmentCost.toFixed(1) : totalEquipmentCost.toFixed(0) }} gp
                    </span>
                  </div>
                  <div v-if="totalEquipmentWeight > getCarryingCapacity()" class="mt-2 text-xs text-red-400">
                    ⚠️ Over carrying capacity! ({{ getCarryingCapacity() }} lbs light load)
                  </div>
                  <button
                    @click="clearEquipment"
                    class="w-full mt-3 bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-all"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 9: Character Details (Creation Only) -->
        <div v-else-if="!isLevelUp && ((isSpellcaster && currentStep === 8) || (!isSpellcaster && currentStep === 7))" class="space-y-4">
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
                      ? 'bg-green-700 text-white shadow-lg shadow-green-500/50 border border-green-400' 
                      : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
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
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
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
        <div v-else-if="(!isLevelUp && ((isSpellcaster && currentStep === 9) || (!isSpellcaster && currentStep === 8))) || (isLevelUp && currentStep === 4)" class="space-y-4">
          <h3 class="text-xl font-semibold mb-4">Summary</h3>
          
          <div class="bg-gray-800 p-4 rounded-lg space-y-3 border border-gray-700">
            <h4 class="font-bold text-green-300 text-lg">
              {{ isLevelUp ? 'Level Up Complete!' : 'Character Complete!' }}
            </h4>
            
            <div v-if="!isLevelUp" class="space-y-2">
              <div class="grid grid-cols-2 gap-2">
                <p><strong class="text-gray-400">Name:</strong> <span class="text-white">{{ characterDetails.name || 'Unnamed Hero' }}</span></p>
                <p><strong class="text-gray-400">Race:</strong> <span class="text-white">{{ selectedRace?.name }}</span></p>
                <p><strong class="text-gray-400">Class:</strong> <span class="text-white">{{ selectedClass?.name }} 1</span></p>
                <p><strong class="text-gray-400">Alignment:</strong> <span class="text-white">{{ characterDetails.alignment }}</span></p>
              </div>
              <p v-if="characterDetails.deity"><strong class="text-gray-400">Deity:</strong> <span class="text-white">{{ characterDetails.deity }}</span></p>
              <p v-if="favoredClass"><strong class="text-gray-400">Favored Class:</strong> <span class="text-white">{{ favoredClass }} ({{ favoredClassBonus === 'hp' ? '+1 HP/level' : '+1 skill/level' }})</span></p>
              
              <!-- Physical Description -->
              <div v-if="characterDetails.age || characterDetails.height || characterDetails.weight" class="bg-gray-750 p-3 rounded">
                <p class="font-semibold mb-1 text-blue-300">Physical Description:</p>
                <div class="text-sm ml-4 grid grid-cols-2 gap-1">
                  <p v-if="characterDetails.age"><span class="text-gray-400">Age:</span> {{ characterDetails.age }}</p>
                  <p v-if="characterDetails.gender"><span class="text-gray-400">Gender:</span> {{ characterDetails.gender }}</p>
                  <p v-if="characterDetails.height"><span class="text-gray-400">Height:</span> {{ characterDetails.height }}</p>
                  <p v-if="characterDetails.weight"><span class="text-gray-400">Weight:</span> {{ characterDetails.weight }}</p>
                  <p v-if="characterDetails.eyes"><span class="text-gray-400">Eyes:</span> {{ characterDetails.eyes }}</p>
                  <p v-if="characterDetails.hair"><span class="text-gray-400">Hair:</span> {{ characterDetails.hair }}</p>
                </div>
              </div>
              
              <div class="bg-gray-750 p-3 rounded">
                <p class="font-semibold mb-1 text-blue-300">Ability Scores:</p>
                <div class="grid grid-cols-3 gap-2 text-sm ml-4">
                  <span v-for="ability in abilities" :key="ability">
                    <span class="text-gray-400">{{ ability }}:</span> {{ getFinalAbilityScore(ability) }} 
                    <span class="text-green-300">({{ getAbilityModifier(getFinalAbilityScore(ability)) >= 0 ? '+' : '' }}{{ getAbilityModifier(getFinalAbilityScore(ability)) }})</span>
                  </span>
                </div>
              </div>
              
              <!-- Derived Stats -->
              <div v-if="derivedStats" class="bg-gray-750 p-3 rounded">
                <p class="font-semibold mb-1 text-blue-300">Combat Statistics:</p>
                <div class="grid grid-cols-2 gap-2 text-sm ml-4">
                  <p><span class="text-gray-400">HP:</span> {{ derivedStats.maxHP }}</p>
                  <p><span class="text-gray-400">Initiative:</span> {{ derivedStats.initiative >= 0 ? '+' : '' }}{{ derivedStats.initiative }}</p>
                  <p><span class="text-gray-400">AC:</span> {{ derivedStats.ac.total }}</p>
                  <p><span class="text-gray-400">BAB:</span> {{ derivedStats.bab >= 0 ? '+' : '' }}{{ derivedStats.bab }}</p>
                  <p><span class="text-gray-400">Fort:</span> {{ derivedStats.fortitude >= 0 ? '+' : '' }}{{ derivedStats.fortitude }}</p>
                  <p><span class="text-gray-400">Ref:</span> {{ derivedStats.reflex >= 0 ? '+' : '' }}{{ derivedStats.reflex }}</p>
                  <p><span class="text-gray-400">Will:</span> {{ derivedStats.will >= 0 ? '+' : '' }}{{ derivedStats.will }}</p>
                  <p><span class="text-gray-400">CMB:</span> {{ derivedStats.cmb >= 0 ? '+' : '' }}{{ derivedStats.cmb }}</p>
                  <p><span class="text-gray-400">CMD:</span> {{ derivedStats.cmd }}</p>
                </div>
              </div>
              
              <p v-if="characterDetails.languages.length > 0">
                <strong class="text-gray-400">Languages:</strong> <span class="text-white">{{ characterDetails.languages.join(', ') }}</span>
              </p>
              
              <p v-if="selectedSpells.length > 0">
                <strong class="text-gray-400">Spells Known:</strong> <span class="text-white">{{ selectedSpells.join(', ') }}</span>
              </p>
            </div>
            
            <div v-else class="space-y-2">
              <p><strong class="text-gray-400">New Level:</strong> <span class="text-white">{{ selectedClass?.name }} {{ getClassLevel(selectedClass?.name) + 1 }}</span></p>
              <p><strong class="text-gray-400">Total Character Level:</strong> <span class="text-white">{{ currentLevel + 1 }}</span></p>
              <p><strong class="text-gray-400">Hit Points Gained:</strong> <span class="text-green-300">+{{ getTotalHPGain() }}</span></p>
              <p><strong class="text-gray-400">Skill Points Spent:</strong> <span class="text-white">{{ totalSkillPoints - skillPointsRemaining }}</span></p>
              <p v-if="selectedFeats.length > 0"><strong class="text-gray-400">New Feats:</strong> <span class="text-white">{{ selectedFeats.join(', ') }}</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation - Keep at bottom -->
      <div class="flex justify-between items-center pt-4 border-t border-gray-700">
        <button 
          @click="previousStep"
          :disabled="currentStep === 0"
          class="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 px-4 py-2 rounded transition-all hover:shadow-md"
        >
          ← Previous
        </button>
        
        <div class="flex gap-2 items-center">
          <!-- Error message -->
          <div v-if="!canProceed" class="text-xs text-red-400 mr-4">
            <p v-if="!isLevelUp && currentStep === 1 && !selectedRace">Select a race to continue</p>
            <p v-else-if="currentStep === 2 && !selectedClass">Select a class to continue</p>
            <p v-else-if="currentStep === 2 && !favoredClass && !isLevelUp">Select a favored class to continue</p>
            <p v-else>Complete this step to continue</p>
          </div>
          
          <button 
            @click="cancel"
            class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded transition-all hover:shadow-md"
          >
            Cancel
          </button>
          <button 
            @click="nextStep"
            :disabled="!canProceed"
            class="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded transition-all hover:shadow-md disabled:hover:shadow-none"
          >
            {{ currentStep === totalSteps - 1 ? 'Finish' : 'Next →' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { characterState } from '@/characterState.js'
// Import the race data from pathfinderRaces.js
import { pathfinderRaces, getAllRaces, getRaceById } from '@/data/pathfinderRaces.js'
// Import the class data from pathfinderClasses.js
import { getAllClasses, getClassById } from '@/data/pathfinderClasses.js'
import { InventoryParser } from '@/utils/InventoryParser.js'
import { StorageService } from '@/services/StorageService.js'
import { useChatGPT } from '@/composables/useChatGPT'

const storageService = new StorageService('pathfinder')
const { sendToChatGPT } = useChatGPT()

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
const selectedClassCategory = ref('All')

// Favored Class
const favoredClass = ref('')
const favoredClassBonus = ref('hp') // 'hp' or 'skill'

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

// Spell-related state
const selectedSpells = ref([])
const selectedDomains = ref([])

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

// Spell data
const wizardCantrips = [
  { name: 'Acid Splash', school: 'Conjuration' },
  { name: 'Arcane Mark', school: 'Universal' },
  { name: 'Dancing Lights', school: 'Evocation' },
  { name: 'Daze', school: 'Enchantment' },
  { name: 'Detect Magic', school: 'Divination' },
  { name: 'Detect Poison', school: 'Divination' },
  { name: 'Flare', school: 'Evocation' },
  { name: 'Ghost Sound', school: 'Illusion' },
  { name: 'Light', school: 'Evocation' },
  { name: 'Mage Hand', school: 'Transmutation' },
  { name: 'Mending', school: 'Transmutation' },
  { name: 'Message', school: 'Transmutation' },
  { name: 'Open/Close', school: 'Transmutation' },
  { name: 'Prestidigitation', school: 'Universal' },
  { name: 'Ray of Frost', school: 'Evocation' },
  { name: 'Read Magic', school: 'Divination' },
  { name: 'Resistance', school: 'Abjuration' },
  { name: 'Touch of Fatigue', school: 'Necromancy' }
]

const wizard1stLevelSpells = [
  { name: 'Alarm', school: 'Abjuration', description: 'Wards an area for 2 hours/level' },
  { name: 'Burning Hands', school: 'Evocation', description: '1d4/level fire damage (max 5d4)' },
  { name: 'Charm Person', school: 'Enchantment', description: 'Makes one person your friend' },
  { name: 'Color Spray', school: 'Illusion', description: 'Knocks unconscious, blinds, stuns' },
  { name: 'Detect Secret Doors', school: 'Divination', description: 'Reveals hidden doors' },
  { name: 'Disguise Self', school: 'Illusion', description: 'Changes your appearance' },
  { name: 'Enlarge Person', school: 'Transmutation', description: 'Humanoid creature doubles in size' },
  { name: 'Feather Fall', school: 'Transmutation', description: 'Objects or creatures fall slowly' },
  { name: 'Grease', school: 'Conjuration', description: 'Makes 10-ft. square or object slippery' },
  { name: 'Identify', school: 'Divination', description: 'Identifies magic item properties' },
  { name: 'Mage Armor', school: 'Conjuration', description: '+4 armor bonus to AC' },
  { name: 'Magic Missile', school: 'Evocation', description: '1d4+1 damage, always hits' },
  { name: 'Protection from Evil', school: 'Abjuration', description: '+2 AC and saves vs evil' },
  { name: 'Shield', school: 'Abjuration', description: '+4 AC, blocks magic missiles' },
  { name: 'Shocking Grasp', school: 'Evocation', description: 'Touch delivers 1d6/level electricity' },
  { name: 'Silent Image', school: 'Illusion', description: 'Creates minor illusion' },
  { name: 'Sleep', school: 'Enchantment', description: 'Puts 4 HD of creatures to sleep' },
  { name: 'Summon Monster I', school: 'Conjuration', description: 'Summons extraplanar creature' }
]

const availableDomains = [
  'Air', 'Animal', 'Artifice', 'Chaos', 'Charm', 'Community', 'Darkness',
  'Death', 'Destruction', 'Earth', 'Evil', 'Fire', 'Glory', 'Good',
  'Healing', 'Knowledge', 'Law', 'Liberation', 'Luck', 'Madness', 'Magic',
  'Nobility', 'Plant', 'Protection', 'Repose', 'Rune', 'Strength', 'Sun',
  'Travel', 'Trickery', 'War', 'Water', 'Weather'
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
const selectedEquipment = ref([])
const selectedEquipmentCategory = ref('Weapons')
const equipmentSearch = ref('')
const customItemName = ref('')
const customItemCost = ref(0)
const customItemWeight = ref(0)
const actualStartingGold = ref(0)
const goldRollMessage = ref('')

// Calculate starting gold based on class
const startingGold = computed(() => {
  if (!selectedClass.value) return 0
  
  // Starting wealth by class (average values)
  const classWealth = {
    'Fighter': 175,      // 5d4 × 10 gp
    'Wizard': 70,        // 2d4 × 10 gp
    'Rogue': 140,        // 4d4 × 10 gp
    'Cleric': 140,       // 4d4 × 10 gp
    'Barbarian': 105,    // 3d4 × 10 gp
    'Ranger': 175,       // 5d4 × 10 gp
    'Bard': 105,         // 3d4 × 10 gp
    'Druid': 70,         // 2d4 × 10 gp
    'Monk': 17,          // 1d4 × 10 gp
    'Paladin': 175,      // 5d4 × 10 gp
    'Sorcerer': 70,      // 2d4 × 10 gp
    'default': 150       // Default for unknown classes
  }
  
  const baseGold = classWealth[selectedClass.value.name] || classWealth.default
  
  // Set actual starting gold to base if not already set
  if (actualStartingGold.value === 0 && baseGold > 0) {
    actualStartingGold.value = baseGold
  }
  
  return baseGold
})

// Starting gold dice by class - Expanded for all classes
const startingGoldDice = {
  // Core Classes
  'Fighter': { dice: 5, sides: 4, multiplier: 10 },
  'Wizard': { dice: 2, sides: 4, multiplier: 10 },
  'Rogue': { dice: 4, sides: 4, multiplier: 10 },
  'Cleric': { dice: 4, sides: 4, multiplier: 10 },
  'Barbarian': { dice: 3, sides: 4, multiplier: 10 },
  'Ranger': { dice: 5, sides: 4, multiplier: 10 },
  'Bard': { dice: 3, sides: 4, multiplier: 10 },
  'Druid': { dice: 2, sides: 4, multiplier: 10 },
  'Monk': { dice: 1, sides: 4, multiplier: 10 },
  'Paladin': { dice: 5, sides: 4, multiplier: 10 },
  'Sorcerer': { dice: 2, sides: 4, multiplier: 10 },
  // Base Classes
  'Alchemist': { dice: 3, sides: 4, multiplier: 10 },
  'Cavalier': { dice: 5, sides: 4, multiplier: 10 },
  'Gunslinger': { dice: 5, sides: 4, multiplier: 10 },
  'Inquisitor': { dice: 4, sides: 4, multiplier: 10 },
  'Magus': { dice: 4, sides: 4, multiplier: 10 },
  'Oracle': { dice: 3, sides: 4, multiplier: 10 },
  'Summoner': { dice: 2, sides: 4, multiplier: 10 },
  'Witch': { dice: 3, sides: 4, multiplier: 10 },
  // Hybrid Classes
  'Arcanist': { dice: 2, sides: 4, multiplier: 10 },
  'Bloodrager': { dice: 3, sides: 4, multiplier: 10 },
  'Brawler': { dice: 3, sides: 4, multiplier: 10 },
  'Hunter': { dice: 4, sides: 4, multiplier: 10 },
  'Investigator': { dice: 3, sides: 4, multiplier: 10 },
  'Shaman': { dice: 3, sides: 4, multiplier: 10 },
  'Skald': { dice: 3, sides: 4, multiplier: 10 },
  'Slayer': { dice: 5, sides: 4, multiplier: 10 },
  'Swashbuckler': { dice: 5, sides: 4, multiplier: 10 },
  'Warpriest': { dice: 5, sides: 4, multiplier: 10 },
  // Default
  'default': { dice: 4, sides: 4, multiplier: 10 }
}

// Data - Now using imported race data
const raceCategories = ['Core', 'Featured', 'Uncommon']
const classCategories = ['All', 'Core', 'Base', 'Hybrid', 'Occult', 'Alternate', 'Unchained']
const equipmentCategories = ['Weapons', 'Armor', 'Gear', 'Magic Items']

// Equipment data
const equipmentData = {
  Weapons: [
    // Simple Weapons
    { name: 'Dagger', cost: 2, type: 'Simple Light', damage: '1d4', description: 'P or S, 19-20/x2', weight: 1 },
    { name: 'Light Mace', cost: 5, type: 'Simple Light', damage: '1d6', description: 'B, x2', weight: 4 },
    { name: 'Sickle', cost: 6, type: 'Simple Light', damage: '1d6', description: 'S, x2', weight: 2 },
    { name: 'Club', cost: 0, type: 'Simple One-Handed', damage: '1d6', description: 'B, x2', weight: 3 },
    { name: 'Heavy Mace', cost: 12, type: 'Simple One-Handed', damage: '1d8', description: 'B, x2', weight: 8 },
    { name: 'Morningstar', cost: 8, type: 'Simple One-Handed', damage: '1d8', description: 'B and P, x2', weight: 6 },
    { name: 'Shortspear', cost: 1, type: 'Simple One-Handed', damage: '1d6', description: 'P, x2', weight: 3 },
    { name: 'Longspear', cost: 5, type: 'Simple Two-Handed', damage: '1d8', description: 'P, x3, reach', weight: 9 },
    { name: 'Quarterstaff', cost: 0, type: 'Simple Two-Handed', damage: '1d6/1d6', description: 'B, x2', weight: 4 },
    { name: 'Spear', cost: 2, type: 'Simple Two-Handed', damage: '1d8', description: 'P, x3', weight: 6 },
    // Martial Weapons
    { name: 'Handaxe', cost: 6, type: 'Martial Light', damage: '1d6', description: 'S, x3', weight: 3 },
    { name: 'Light Hammer', cost: 1, type: 'Martial Light', damage: '1d4', description: 'B, x2', weight: 2 },
    { name: 'Short Sword', cost: 10, type: 'Martial Light', damage: '1d6', description: 'P, 19-20/x2', weight: 2 },
    { name: 'Battleaxe', cost: 10, type: 'Martial One-Handed', damage: '1d8', description: 'S, x3', weight: 6 },
    { name: 'Longsword', cost: 15, type: 'Martial One-Handed', damage: '1d8', description: 'S, 19-20/x2', weight: 4 },
    { name: 'Rapier', cost: 20, type: 'Martial One-Handed', damage: '1d6', description: 'P, 18-20/x2', weight: 2 },
    { name: 'Scimitar', cost: 15, type: 'Martial One-Handed', damage: '1d6', description: 'S, 18-20/x2', weight: 4 },
    { name: 'Warhammer', cost: 12, type: 'Martial One-Handed', damage: '1d8', description: 'B, x3', weight: 5 },
    { name: 'Falchion', cost: 75, type: 'Martial Two-Handed', damage: '2d4', description: 'S, 18-20/x2', weight: 8 },
    { name: 'Glaive', cost: 8, type: 'Martial Two-Handed', damage: '1d10', description: 'S, x3, reach', weight: 10 },
    { name: 'Greataxe', cost: 20, type: 'Martial Two-Handed', damage: '1d12', description: 'S, x3', weight: 12 },
    { name: 'Greatsword', cost: 50, type: 'Martial Two-Handed', damage: '2d6', description: 'S, 19-20/x2', weight: 8 },
    { name: 'Halberd', cost: 10, type: 'Martial Two-Handed', damage: '1d10', description: 'P or S, x3', weight: 12 },
    { name: 'Scythe', cost: 18, type: 'Martial Two-Handed', damage: '2d4', description: 'P or S, x4', weight: 10 },
    // Ranged Weapons
    { name: 'Crossbow, light', cost: 35, type: 'Simple Ranged', damage: '1d8', description: 'P, 19-20/x2, 80 ft.', weight: 4 },
    { name: 'Dart', cost: 0.5, type: 'Simple Ranged', damage: '1d4', description: 'P, x2, 20 ft.', weight: 0.5 },
    { name: 'Javelin', cost: 1, type: 'Simple Ranged', damage: '1d6', description: 'P, x2, 30 ft.', weight: 2 },
    { name: 'Sling', cost: 0, type: 'Simple Ranged', damage: '1d4', description: 'B, x2, 50 ft.', weight: 0 },
    { name: 'Shortbow', cost: 30, type: 'Martial Ranged', damage: '1d6', description: 'P, x3, 60 ft.', weight: 2 },
    { name: 'Longbow', cost: 75, type: 'Martial Ranged', damage: '1d8', description: 'P, x3, 100 ft.', weight: 3 },
    // Ammunition
    { name: 'Arrows (20)', cost: 1, type: 'Ammunition', description: 'For bow', weight: 3 },
    { name: 'Bolts (10)', cost: 1, type: 'Ammunition', description: 'For crossbow', weight: 1 },
    { name: 'Sling bullets (10)', cost: 0.1, type: 'Ammunition', description: 'For sling', weight: 5 }
  ],
  Armor: [
    // Light Armor
    { name: 'Padded', cost: 5, type: 'Light Armor', description: 'AC +1, Max Dex +8', weight: 10 },
    { name: 'Leather', cost: 10, type: 'Light Armor', description: 'AC +2, Max Dex +6', weight: 15 },
    { name: 'Studded leather', cost: 25, type: 'Light Armor', description: 'AC +3, Max Dex +5', weight: 20 },
    { name: 'Chain shirt', cost: 100, type: 'Light Armor', description: 'AC +4, Max Dex +4', weight: 25 },
    // Medium Armor
    { name: 'Hide', cost: 15, type: 'Medium Armor', description: 'AC +4, Max Dex +4', weight: 25 },
    { name: 'Scale mail', cost: 50, type: 'Medium Armor', description: 'AC +5, Max Dex +3', weight: 30 },
    { name: 'Chainmail', cost: 150, type: 'Medium Armor', description: 'AC +6, Max Dex +2', weight: 40 },
    { name: 'Breastplate', cost: 200, type: 'Medium Armor', description: 'AC +6, Max Dex +3', weight: 30 },
    // Heavy Armor
    { name: 'Splint mail', cost: 200, type: 'Heavy Armor', description: 'AC +7, Max Dex +0', weight: 45 },
    { name: 'Banded mail', cost: 250, type: 'Heavy Armor', description: 'AC +7, Max Dex +1', weight: 35 },
    { name: 'Half-plate', cost: 600, type: 'Heavy Armor', description: 'AC +8, Max Dex +0', weight: 50 },
    { name: 'Full plate', cost: 1500, type: 'Heavy Armor', description: 'AC +9, Max Dex +1', weight: 50 },
    // Shields
    { name: 'Buckler', cost: 5, type: 'Shield', description: 'AC +1, -1 penalty to attack', weight: 5 },
    { name: 'Shield, light wooden', cost: 3, type: 'Shield', description: 'AC +1', weight: 5 },
    { name: 'Shield, light steel', cost: 9, type: 'Shield', description: 'AC +1', weight: 6 },
    { name: 'Shield, heavy wooden', cost: 7, type: 'Shield', description: 'AC +2', weight: 10 },
    { name: 'Shield, heavy steel', cost: 20, type: 'Shield', description: 'AC +2', weight: 15 },
    { name: 'Shield, tower', cost: 30, type: 'Shield', description: 'AC +4, can provide cover', weight: 45 }
  ],
  Gear: [
    // Adventuring Gear
    { name: 'Backpack', cost: 2, type: 'Container', description: 'Holds gear', weight: 2 },
    { name: 'Bedroll', cost: 0.1, type: 'Camping', description: 'For sleeping', weight: 5 },
    { name: 'Blanket, winter', cost: 0.5, type: 'Camping', description: 'Warmth in cold', weight: 3 },
    { name: 'Caltrops', cost: 1, type: 'Trap', description: 'Slows pursuers', weight: 2 },
    { name: 'Candle', cost: 0.01, type: 'Light', description: '1 hour, 5 ft.', weight: 0 },
    { name: 'Chalk (1 piece)', cost: 0.01, type: 'Writing', description: 'For marking', weight: 0 },
    { name: 'Crowbar', cost: 2, type: 'Tool', description: '+2 to Strength checks', weight: 5 },
    { name: 'Flask', cost: 0.03, type: 'Container', description: 'Holds 1 pint', weight: 1.5 },
    { name: 'Flint and steel', cost: 1, type: 'Fire', description: 'Starts fires', weight: 0 },
    { name: 'Grappling hook', cost: 1, type: 'Climbing', description: 'For climbing', weight: 4 },
    { name: 'Hammer', cost: 0.5, type: 'Tool', description: 'Pound things', weight: 2 },
    { name: 'Ink (1 oz. vial)', cost: 8, type: 'Writing', description: 'For writing', weight: 0 },
    { name: 'Inkpen', cost: 0.1, type: 'Writing', description: 'For writing', weight: 0 },
    { name: 'Lantern, hooded', cost: 7, type: 'Light', description: '30 ft., 6 hours', weight: 2 },
    { name: 'Lock, simple', cost: 20, type: 'Security', description: 'DC 20 to pick', weight: 1 },
    { name: 'Lock, average', cost: 40, type: 'Security', description: 'DC 25 to pick', weight: 1 },
    { name: 'Manacles', cost: 15, type: 'Restraint', description: 'DC 26 to break', weight: 2 },
    { name: 'Mirror, small steel', cost: 10, type: 'Tool', description: 'See behind you', weight: 0.5 },
    { name: 'Oil (1-pint flask)', cost: 0.1, type: 'Light', description: 'Fuel for lantern', weight: 1 },
    { name: 'Paper (sheet)', cost: 0.4, type: 'Writing', description: 'For writing', weight: 0 },
    { name: 'Parchment (sheet)', cost: 0.2, type: 'Writing', description: 'For writing', weight: 0 },
    { name: 'Piton', cost: 0.1, type: 'Climbing', description: 'Spike for climbing', weight: 0.5 },
    { name: 'Pole, 10-foot', cost: 0.05, type: 'Tool', description: 'Prod things', weight: 8 },
    { name: 'Pouch, belt', cost: 1, type: 'Container', description: 'Small storage', weight: 0.5 },
    { name: 'Rations, trail (per day)', cost: 0.5, type: 'Food', description: 'One day of food', weight: 1 },
    { name: 'Rope, hempen (50 ft.)', cost: 1, type: 'Climbing', description: 'For climbing', weight: 10 },
    { name: 'Rope, silk (50 ft.)', cost: 10, type: 'Climbing', description: 'Lighter, stronger', weight: 5 },
    { name: 'Sack', cost: 0.1, type: 'Container', description: 'Holds items', weight: 0.5 },
    { name: 'Sealing wax', cost: 1, type: 'Writing', description: 'Seal letters', weight: 1 },
    { name: 'Signet ring', cost: 5, type: 'Writing', description: 'Personal seal', weight: 0 },
    { name: 'Spellbook, blank', cost: 15, type: 'Magic', description: '100 pages', weight: 3 },
    { name: 'Tent', cost: 10, type: 'Camping', description: 'Sleeps 2', weight: 20 },
    { name: 'Torch', cost: 0.01, type: 'Light', description: '20 ft., 1 hour', weight: 1 },
    { name: 'Vial', cost: 1, type: 'Container', description: 'Holds 1 ounce', weight: 0.1 },
    { name: 'Waterskin', cost: 1, type: 'Container', description: 'Holds water', weight: 4 },
    { name: 'Whetstone', cost: 0.02, type: 'Tool', description: 'Sharpen blades', weight: 1 },
    // Thieves' Tools
    { name: 'Thieves\' tools', cost: 30, type: 'Tool', description: 'Pick locks, disarm traps', weight: 1 },
    // Healer's Kit
    { name: 'Healer\'s kit', cost: 50, type: 'Healing', description: '10 uses, +2 Heal checks', weight: 1 },
    { name: 'Bandages', cost: 5, type: 'Healing', description: 'Basic wound care', weight: 0.5 },
    // Holy Symbols
    { name: 'Holy symbol, wooden', cost: 1, type: 'Divine Focus', description: 'For divine spells', weight: 0 },
    { name: 'Holy symbol, silver', cost: 25, type: 'Divine Focus', description: 'For divine spells', weight: 1 },
    // Spell Components
    { name: 'Spell component pouch', cost: 5, type: 'Arcane Focus', description: 'Material components', weight: 2 },
    // Clothing
    { name: 'Traveler\'s outfit', cost: 1, type: 'Clothing', description: 'Sturdy clothes', weight: 5 },
    { name: 'Scholar\'s outfit', cost: 5, type: 'Clothing', description: 'Robes and cap', weight: 6 },
    { name: 'Cleric\'s vestments', cost: 5, type: 'Clothing', description: 'Religious garb', weight: 6 },
    { name: 'Explorer\'s outfit', cost: 10, type: 'Clothing', description: 'Rugged gear', weight: 8 },
    { name: 'Noble\'s outfit', cost: 75, type: 'Clothing', description: 'Fine clothes', weight: 10 }
  ],
  'Magic Items': [
    { name: 'Potion of Cure Light Wounds', cost: 50, type: 'Potion', description: 'Heals 1d8+1 HP', weight: 0.1 },
    { name: 'Scroll of Magic Missile', cost: 25, type: 'Scroll', description: '1d4+1 force damage', weight: 0 },
    { name: 'Alchemist\'s fire', cost: 20, type: 'Alchemical', description: '1d6 fire damage', weight: 1 },
    { name: 'Acid (flask)', cost: 10, type: 'Alchemical', description: '1d6 acid damage', weight: 1 },
    { name: 'Antitoxin (vial)', cost: 50, type: 'Alchemical', description: '+5 to Fort saves vs poison', weight: 0 },
    { name: 'Everburning torch', cost: 110, type: 'Magic Light', description: 'Permanent light', weight: 1 },
    { name: 'Holy water (flask)', cost: 25, type: 'Divine', description: '2d4 damage to undead', weight: 1 },
    { name: 'Smokestick', cost: 20, type: 'Alchemical', description: 'Creates smoke cloud', weight: 0.5 },
    { name: 'Sunrod', cost: 2, type: 'Alchemical', description: '30 ft. light, 6 hours', weight: 1 },
    { name: 'Tanglefoot bag', cost: 50, type: 'Alchemical', description: 'Entangles target', weight: 4 },
    { name: 'Thunderstone', cost: 30, type: 'Alchemical', description: 'Sonic blast, deafens', weight: 1 },
    { name: 'Tindertwig', cost: 1, type: 'Alchemical', description: 'Instant fire', weight: 0 }
  ]
}

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

// Available classes - using imported data
const availableClasses = computed(() => {
  const allClasses = getAllClasses()
  
  if (selectedClassCategory.value === 'All') {
    return allClasses
  }
  
  return allClasses.filter(cls => cls.category === selectedClassCategory.value)
})

// Filtered classes
const filteredClasses = computed(() => {
  if (!characterDetails.value.alignment || selectedClassCategory.value === 'All') {
    return availableClasses.value
  }
  return availableClasses.value.filter(cls => meetsClassRequirements(cls))
})

// Skills data
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
    cost: 9,  // Discounted bundle price
    description: 'Basic adventuring gear for dungeon delving',
    items: [
      { name: 'Backpack', cost: 2, quantity: 1, category: 'gear', weight: 2 },
      { name: 'Bedroll', cost: 0.1, quantity: 1, category: 'gear', weight: 5 },
      { name: 'Pouch, belt', cost: 1, quantity: 1, category: 'gear', weight: 0.5 },
      { name: 'Flint and steel', cost: 1, quantity: 1, category: 'gear', weight: 0 },
      { name: 'Rope, hempen (50 ft.)', cost: 1, quantity: 1, category: 'gear', weight: 10 },
      { name: 'Torch', cost: 0.01, quantity: 10, category: 'gear', weight: 1 },
      { name: 'Rations, trail (per day)', cost: 0.5, quantity: 5, category: 'gear', weight: 1 },
      { name: 'Waterskin', cost: 1, quantity: 1, category: 'gear', weight: 4 }
    ]
  },
  {
    name: 'Warrior\'s Kit',
    cost: 65,  // Discounted from 76.1
    description: 'Essential combat equipment for fighters',
    items: [
      { name: 'Longsword', cost: 15, quantity: 1, category: 'weapons', weight: 4 },
      { name: 'Shield, heavy wooden', cost: 7, quantity: 1, category: 'armor', weight: 10 },
      { name: 'Scale mail', cost: 50, quantity: 1, category: 'armor', weight: 30 },
      { name: 'Backpack', cost: 2, quantity: 1, category: 'gear', weight: 2 },
      { name: 'Bedroll', cost: 0.1, quantity: 1, category: 'gear', weight: 5 },
      { name: 'Rations, trail (per day)', cost: 0.5, quantity: 3, category: 'gear', weight: 1 }
    ]
  },
  {
    name: 'Archer\'s Kit',
    cost: 40,  // Discounted from 54.1
    description: 'Ranged combat gear for marksmen',
    items: [
      { name: 'Shortbow', cost: 30, quantity: 1, category: 'weapons', weight: 2 },
      { name: 'Arrows (20)', cost: 1, quantity: 2, category: 'weapons', weight: 3 },
      { name: 'Leather', cost: 10, quantity: 1, category: 'armor', weight: 15 },
      { name: 'Backpack', cost: 2, quantity: 1, category: 'gear', weight: 2 },
      { name: 'Bedroll', cost: 0.1, quantity: 1, category: 'gear', weight: 5 },
      { name: 'Rations, trail (per day)', cost: 0.5, quantity: 3, category: 'gear', weight: 1 }
    ]
  },
  {
    name: 'Scholar\'s Kit',
    cost: 24,  // Discounted from 28.35
    description: 'Essential tools for wizards and scholars',
    items: [
      { name: 'Spellbook, blank', cost: 15, quantity: 1, category: 'gear', weight: 3 },
      { name: 'Ink (1 oz. vial)', cost: 8, quantity: 1, category: 'gear', weight: 0 },
      { name: 'Inkpen', cost: 0.1, quantity: 1, category: 'gear', weight: 0 },
      { name: 'Parchment (sheet)', cost: 0.2, quantity: 10, category: 'gear', weight: 0 },
      { name: 'Backpack', cost: 2, quantity: 1, category: 'gear', weight: 2 },
      { name: 'Scroll case', cost: 1, quantity: 1, category: 'gear', weight: 0.5 }
    ]
  },
  {
    name: 'Priest\'s Pack',
    cost: 28,  // Discounted from 32.1
    description: 'Divine focus and healing supplies',
    items: [
      { name: 'Holy symbol, wooden', cost: 1, quantity: 1, category: 'gear', weight: 0 },
      { name: 'Holy water (flask)', cost: 25, quantity: 1, category: 'magic', weight: 1 },
      { name: 'Bandages', cost: 5, quantity: 1, category: 'gear', weight: 0.5 },
      { name: 'Candle', cost: 0.01, quantity: 10, category: 'gear', weight: 0 },
      { name: 'Parchment (sheet)', cost: 0.2, quantity: 5, category: 'gear', weight: 0 }
    ]
  },
  {
    name: 'Burglar\'s Pack',
    cost: 50,  // Discounted from 61.5
    description: 'Tools for rogues and infiltrators',
    items: [
      { name: 'Thieves\' tools', cost: 30, quantity: 1, category: 'tools', weight: 1 },
      { name: 'Rope, silk (50 ft.)', cost: 10, quantity: 1, category: 'gear', weight: 5 },
      { name: 'Grappling hook', cost: 1, quantity: 1, category: 'gear', weight: 4 },
      { name: 'Crowbar', cost: 2, quantity: 1, category: 'tools', weight: 5 },
      { name: 'Lantern, hooded', cost: 7, quantity: 1, category: 'gear', weight: 2 },
      { name: 'Oil (1-pint flask)', cost: 0.1, quantity: 3, category: 'gear', weight: 1 },
      { name: 'Caltrops', cost: 1, quantity: 1, category: 'gear', weight: 2 }
    ]
  }
]

// Computed properties
const isSpellcaster = computed(() => {
  return selectedClass.value?.spellcaster || false
})

const isDivineCaster = computed(() => {
  return selectedClass.value?.spellType === 'divine'
})

const derivedStats = computed(() => {
  if (!selectedClass.value || !selectedRace.value) return null
  
  const level = isLevelUp.value ? currentLevel.value + 1 : 1
  
  return {
    // Base Attack Bonus
    bab: calculateBAB(selectedClass.value, level),
    
    // Hit Points
    maxHP: calculateMaxHP(),
    
    // Saves
    fortitude: calculateSave('fort', selectedClass.value, level) + getAbilityModifier(getFinalAbilityScore('CON')),
    reflex: calculateSave('ref', selectedClass.value, level) + getAbilityModifier(getFinalAbilityScore('DEX')),
    will: calculateSave('will', selectedClass.value, level) + getAbilityModifier(getFinalAbilityScore('WIS')),
    
    // Combat stats
    initiative: getAbilityModifier(getFinalAbilityScore('DEX')) + (selectedFeats.value.includes('Improved Initiative') ? 4 : 0),
    
    // AC components
    ac: {
      total: 10 + getAbilityModifier(getFinalAbilityScore('DEX')) + getSizeModifier(selectedRace.value.size),
      base: 10,
      dex: getAbilityModifier(getFinalAbilityScore('DEX')),
      size: getSizeModifier(selectedRace.value.size)
    },
    
    // CMB/CMD
    cmb: calculateBAB(selectedClass.value, level) + getAbilityModifier(getFinalAbilityScore('STR')) - getSizeModifier(selectedRace.value.size),
    cmd: 10 + calculateBAB(selectedClass.value, level) + getAbilityModifier(getFinalAbilityScore('STR')) + getAbilityModifier(getFinalAbilityScore('DEX')) - getSizeModifier(selectedRace.value.size)
  }
})

const totalSteps = computed(() => {
  if (isLevelUp.value) return 5 // Class, HP, Skills, Feats, Summary
  // For creation: Mode, Race, Class+Favored, Abilities, Skills, Feats, [Spells], Equipment, Details, Summary
  if (isSpellcaster.value) return 10
  return 9
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
      case 2: return selectedClass.value !== null && (favoredClass.value !== '' || isLevelUp.value) // Class & Favored Class
      case 3: return validateAbilityScores()
      case 4: return true // Skills (can skip)
      case 5: return selectedFeats.value.length <= featsRemaining.value // Allow 0 feats
      case 6: 
        if (isSpellcaster.value) {
          // Spell selection - check if wizard has selected enough spells
          if (selectedClass.value?.name === 'Wizard') {
            return selectedSpells.value.length === (3 + getAbilityModifier(getFinalAbilityScore('INT')))
          }
          // Cleric domain selection
          if (selectedClass.value?.name === 'Cleric') {
            return selectedDomains.value.length === 2
          }
          return true
        }
        return true // Equipment (can skip)
      case 7: return true // Equipment or Details (can skip)
      case 8: return true // Details (can skip)
      case 9: return true // Summary
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
  return selectedEquipment.value.reduce((sum, item) => sum + (item.cost * (item.quantity || 1)), 0)
})

const totalEquipmentWeight = computed(() => {
  return selectedEquipment.value.reduce((sum, item) => sum + ((item.weight || 0) * (item.quantity || 1)), 0)
})

const remainingGold = computed(() => {
  return startingGold.value - totalEquipmentCost.value
})

const actualRemainingGold = computed(() => {
  return actualStartingGold.value - totalEquipmentCost.value
})

const filteredEquipment = computed(() => {
  const category = selectedEquipmentCategory.value
  const search = equipmentSearch.value.toLowerCase()
  
  let items = equipmentData[category] || []
  
  if (search) {
    items = items.filter(item => 
      item.name.toLowerCase().includes(search) ||
      (item.description && item.description.toLowerCase().includes(search)) ||
      (item.type && item.type.toLowerCase().includes(search))
    )
  }
  
  return items
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

function formatBAB(bab) {
  const babMap = {
    'full': 'Full',
    '3/4': '3/4',
    '1/2': '1/2'
  }
  return babMap[bab] || bab
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
  if (!meetsClassRequirements(cls)) return
  selectedClass.value = cls
  favoredClass.value = cls.name // Default to selected class
  rollStartingGold()
  calculateSkillPoints()
}

function meetsClassRequirements(cls) {
  if (!cls.alignment || cls.alignment === 'Any') return true
  
  // Check alignment restrictions
  if (cls.alignment === 'Any non-lawful' && characterDetails.value.alignment.includes('L')) return false
  if (cls.alignment === 'Any non-chaotic' && characterDetails.value.alignment.includes('C')) return false
  if (cls.alignment === 'Any neutral' && !characterDetails.value.alignment.includes('N')) return false
  if (cls.alignment === 'Lawful good' && characterDetails.value.alignment !== 'LG') return false
  if (cls.alignment === 'Chaotic evil' && characterDetails.value.alignment !== 'CE') return false
  
  return true
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

function rollStartingGold() {
  if (!selectedClass.value) return
  
  const goldDice = startingGoldDice[selectedClass.value.name] || startingGoldDice.default
  let total = 0
  let rolls = []
  
  for (let i = 0; i < goldDice.dice; i++) {
    const roll = Math.floor(Math.random() * goldDice.sides) + 1
    rolls.push(roll)
    total += roll
  }
  
  actualStartingGold.value = total * goldDice.multiplier
  goldRollMessage.value = `Rolled ${rolls.join('+')} = ${total} × ${goldDice.multiplier} = ${actualStartingGold.value}gp`
  
  // Clear message after 5 seconds
  setTimeout(() => {
    goldRollMessage.value = ''
  }, 5000)
}

function calculateBAB(cls, level) {
  if (cls.bab === 'full') return level
  if (cls.bab === '3/4') return Math.floor(level * 0.75)
  if (cls.bab === '1/2') return Math.floor(level * 0.5)
  return 0
}

function calculateSave(type, cls, level) {
  const goodSaves = cls.goodSaves || []
  if (type === 'fort' && goodSaves.includes('Fort')) {
    return 2 + Math.floor(level / 2)
  } else if (type === 'ref' && goodSaves.includes('Ref')) {
    return 2 + Math.floor(level / 2)
  } else if (type === 'will' && goodSaves.includes('Will')) {
    return 2 + Math.floor(level / 2)
  } else {
    return Math.floor(level / 3)
  }
}

function getSizeModifier(size) {
  const modifiers = {
    'Fine': 8,
    'Diminutive': 4,
    'Tiny': 2,
    'Small': 1,
    'Medium': 0,
    'Large': -1,
    'Huge': -2,
    'Gargantuan': -4,
    'Colossal': -8
  }
  return modifiers[size] || 0
}

function calculateMaxHP() {
  if (!selectedClass.value) return 0
  
  const dieSize = parseInt(selectedClass.value.hitDie.substring(1))
  const conMod = getAbilityModifier(getFinalAbilityScore('CON'))
  const fcBonus = (favoredClass.value === selectedClass.value.name && favoredClassBonus.value === 'hp') ? 1 : 0
  const toughnessBonus = selectedFeats.value.includes('Toughness') ? 3 : 0
  
  return dieSize + conMod + fcBonus + toughnessBonus
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
  const fcBonus = (favoredClass.value === selectedClass.value.name && favoredClassBonus.value === 'hp') ? 1 : 0
  return hitPointRoll.value + conMod + fcBonus
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
  
  // Favored class bonus
  if (!isLevelUp.value || (favoredClass.value === selectedClass.value.name && favoredClassBonus.value === 'skill')) {
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
  if (selectedClass.value?.bonusFeats) {
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
  // TODO: Implement full prerequisite parsing
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

// Spell-related methods
function toggleSpell(spell) {
  const maxSpells = 3 + getAbilityModifier(getFinalAbilityScore('INT'))
  const index = selectedSpells.value.indexOf(spell.name)
  
  if (index > -1) {
    selectedSpells.value.splice(index, 1)
  } else if (selectedSpells.value.length < maxSpells) {
    selectedSpells.value.push(spell.name)
  }
}

function toggleDomain(domain) {
  const index = selectedDomains.value.indexOf(domain)
  
  if (index > -1) {
    selectedDomains.value.splice(index, 1)
  } else if (selectedDomains.value.length < 2) {
    selectedDomains.value.push(domain)
  }
}

function getSpellsPerDay() {
  // Simplified for 1st level
  const wisMod = getAbilityModifier(getFinalAbilityScore('WIS'))
  return 1 + wisMod // 1 base + WIS modifier for 1st level spells
}

function selectEquipmentPack(pack) {
  // Check if we can afford the pack
  if (actualRemainingGold.value < pack.cost) {
    return
  }
  
  // Map equipment categories to inventory system categories
  const categoryMap = {
    'weapons': 'weapons',
    'armor': 'armor',
    'gear': 'miscellaneous',
    'tools': 'tools',
    'magic': 'magic',
    'Custom': 'miscellaneous'
  }
  
  // Add all items from the pack
  pack.items.forEach(packItem => {
    const existingItem = selectedEquipment.value.find(item => item.name === packItem.name)
    if (existingItem) {
      existingItem.quantity += packItem.quantity
    } else {
      selectedEquipment.value.push({
        ...packItem,
        category: categoryMap[packItem.category] || packItem.category || 'miscellaneous',
        id: Date.now() + Math.random() // Unique ID for React key
      })
    }
  })
}

function addEquipment(item) {
  // Check if we can afford it
  if (actualRemainingGold.value < item.cost) {
    return
  }
  
  // Map equipment categories to inventory system categories
  const categoryMap = {
    'weapons': 'weapons',
    'armor': 'armor',
    'gear': 'miscellaneous',
    'tools': 'tools',
    'magic': 'magic',
    'Container': 'miscellaneous',
    'Camping': 'miscellaneous',
    'Light': 'miscellaneous',
    'Tool': 'tools',
    'Food': 'consumables',
    'Healing': 'consumables',
    'Divine Focus': 'miscellaneous',
    'Arcane Focus': 'miscellaneous',
    'Clothing': 'miscellaneous',
    'Potion': 'consumables',
    'Scroll': 'consumables',
    'Alchemical': 'consumables',
    'Custom': 'miscellaneous'
  }
  
  // Check if we already have this item
  const existingItem = selectedEquipment.value.find(selected => selected.name === item.name)
  
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1
  } else {
    selectedEquipment.value.push({
      ...item,
      quantity: 1,
      category: categoryMap[item.type] || item.category || 'miscellaneous',
      id: Date.now() + Math.random()
    })
  }
}

function getRecommendedItems() {
  if (!selectedClass.value) return []
  
  const recommendations = {
    'Fighter': [
      { name: 'Longsword', cost: 15 },
      { name: 'Scale mail', cost: 50 },
      { name: 'Shield, heavy wooden', cost: 7 },
      { name: 'Backpack', cost: 2 }
    ],
    'Wizard': [
      { name: 'Spellbook, blank', cost: 15 },
      { name: 'Spell component pouch', cost: 5 },
      { name: 'Dagger', cost: 2 },
      { name: 'Backpack', cost: 2 }
    ],
    'Rogue': [
      { name: 'Short Sword', cost: 10 },
      { name: 'Leather', cost: 10 },
      { name: 'Thieves\' tools', cost: 30 },
      { name: 'Backpack', cost: 2 }
    ],
    'Cleric': [
      { name: 'Heavy Mace', cost: 12 },
      { name: 'Scale mail', cost: 50 },
      { name: 'Holy symbol, wooden', cost: 1 },
      { name: 'Backpack', cost: 2 }
    ],
    'Barbarian': [
      { name: 'Greataxe', cost: 20 },
      { name: 'Hide', cost: 15 },
      { name: 'Backpack', cost: 2 },
      { name: 'Bedroll', cost: 0.1 }
    ],
    'Ranger': [
      { name: 'Longbow', cost: 75 },
      { name: 'Arrows (20)', cost: 1 },
      { name: 'Longsword', cost: 15 },
      { name: 'Studded leather', cost: 25 }
    ]
  }
  
  return recommendations[selectedClass.value.name] || []
}

function addEquipmentByName(itemName) {
  // Find the item in all equipment categories
  for (const category of Object.values(equipmentData)) {
    const item = category.find(i => i.name === itemName)
    if (item) {
      addEquipment(item)
      return
    }
  }
}

function addCustomItem() {
  if (!customItemName.value || customItemCost.value < 0) return
  
  // Check if we can afford it
  if (actualRemainingGold.value < customItemCost.value) {
    return
  }
  
  const customItem = {
    name: customItemName.value,
    cost: customItemCost.value,
    quantity: 1,
    category: 'miscellaneous',
    type: 'Custom',
    description: 'Custom item',
    weight: 0,
    id: Date.now() + Math.random()
  }
  
  selectedEquipment.value.push(customItem)
  
  // Clear the form
  customItemName.value = ''
  customItemCost.value = 0
}

function adjustItemQuantity(item, delta) {
  const newQuantity = (item.quantity || 1) + delta
  
  if (delta > 0 && actualRemainingGold.value < item.cost) {
    return // Can't afford another one
  }
  
  if (newQuantity >= 1) {
    item.quantity = newQuantity
  }
}

function removeEquipment(index) {
  selectedEquipment.value.splice(index, 1)
}

function clearEquipment() {
  selectedEquipment.value = []
}

function getStartingGoldFormula() {
  if (!selectedClass.value) return ''
  const goldDice = startingGoldDice[selectedClass.value.name] || startingGoldDice.default
  return `${goldDice.dice}d${goldDice.sides} × ${goldDice.multiplier}`
}

function getCarryingCapacity() {
  const str = getFinalAbilityScore('STR')
  // Light load capacities by Strength score
  const capacities = {
    1: 3, 2: 6, 3: 10, 4: 13, 5: 16, 6: 20, 7: 23, 8: 26, 9: 30, 10: 33,
    11: 38, 12: 43, 13: 50, 14: 58, 15: 66, 16: 76, 17: 86, 18: 100, 19: 116,
    20: 133, 21: 153, 22: 173, 23: 200, 24: 233, 25: 266, 26: 306, 27: 346,
    28: 400, 29: 466, 30: 532
  }
  return capacities[str] || 33 // Default to STR 10 if not found
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
  
  // Select Fighter class
  const fighterClass = availableClasses.value.find(cls => cls.name === 'Fighter')
  if (fighterClass) {
    selectedClass.value = fighterClass
    favoredClass.value = 'Fighter'
    favoredClassBonus.value = 'hp'
  }
  
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
  characterDetails.value.alignment = 'NG'
  
  // Jump to summary
  currentStep.value = totalSteps.value - 1
}

async function fetchSpellDetails(spellNames) {
  const spellDetails = []
  
  for (const spellName of spellNames) {
    try {
      const prompt = `Provide Pathfinder 1e spell details for "${spellName}" in JSON format:
      {
        "name": "${spellName}",
        "level": <spell level as number>,
        "school": "<school of magic>",
        "castingTime": "<casting time>",
        "components": ["V", "S", "M/F/DF"],
        "range": "<range>",
        "area": "<area if applicable>",
        "effect": "<effect if applicable>",
        "duration": "<duration>",
        "savingThrow": "<save type and effect>",
        "spellResistance": "<yes/no>",
        "description": "<full spell description>"
      }`
      
      const response = await sendToChatGPT(prompt, {}, {
        temperature: 0.1,
        systemPrompt: 'You are a Pathfinder 1e rules expert. Provide accurate spell information in the exact JSON format requested.'
      })
      
      try {
        const spellData = JSON.parse(response)
        spellDetails.push(spellData)
      } catch (e) {
        console.error('Failed to parse spell JSON:', e)
        spellDetails.push({
          name: spellName,
          level: 1,
          school: 'Unknown',
          description: response
        })
      }
    } catch (error) {
      console.error(`Failed to fetch details for ${spellName}:`, error)
      spellDetails.push({
        name: spellName,
        level: 1,
        school: 'Unknown',
        description: 'Failed to load spell details'
      })
    }
  }
  
  return spellDetails
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

async function completeCharacter() {
  // Map equipment categories to inventory system categories
  const categoryMap = {
    'weapons': 'weapons',
    'armor': 'armor',
    'gear': 'miscellaneous',
    'tools': 'tools',
    'magic': 'magic',
    'Container': 'miscellaneous',
    'Camping': 'miscellaneous',
    'Light': 'miscellaneous',
    'Tool': 'tools',
    'Food': 'consumables',
    'Healing': 'consumables',
    'Divine Focus': 'miscellaneous',
    'Arcane Focus': 'miscellaneous',
    'Clothing': 'miscellaneous',
    'Potion': 'consumables',
    'Scroll': 'consumables',
    'Alchemical': 'consumables',
    'Custom': 'miscellaneous'
  }
  
  // Format equipment for inventory system
  const formattedEquipment = selectedEquipment.value.map(item => ({
    name: item.name,
    quantity: item.quantity || 1,
    category: categoryMap[item.type] || item.category || 'miscellaneous',
    type: item.type || '',
    value: item.cost,
    weight: item.weight || 0,
    equipped: false,
    notes: item.description || ''
  }))
  
  const characterData = {
    mode: props.mode,
    ...characterDetails.value, // Include all character details
    race: selectedRace.value,
    class: selectedClass.value,
    favoredClass: favoredClass.value,
    favoredClassBonus: favoredClassBonus.value,
    abilityScores: { ...abilityScores.value },
    finalAbilityScores: abilities.reduce((acc, ability) => {
      acc[ability] = getFinalAbilityScore(ability)
      return acc
    }, {}),
    derivedStats: derivedStats.value,
    skills: { ...skillRanks.value },
    feats: [...selectedFeats.value],
    equipment: formattedEquipment,
    startingMoney: {
      pp: 0,
      gp: Math.max(0, Math.floor(actualStartingGold.value - totalEquipmentCost.value)),
      sp: 0,
      cp: 0
    },
    spells: selectedSpells.value,
    domains: selectedDomains.value,
    hitPointsGained: isLevelUp.value ? getTotalHPGain() : null
  }
  
  // Apply to character state
  await applyCharacterData(characterData)
  
  emit('complete', characterData)
  if (props.onComplete) {
    props.onComplete(characterData)
  }
}

async function applyCharacterData(data) {
  if (!isLevelUp.value) {
    // Basic info
    characterState.name = data.name
    characterState.gender = data.gender
    characterState.age = data.age
    characterState.alignment = data.alignment
    characterState.race = data.race.name
    characterState.favoredClass = data.favoredClass
    characterState.deity = data.deity
    characterState.homeland = data.homeland
    characterState.height = data.height
    characterState.weight = data.weight
    characterState.eyes = data.eyes
    characterState.hair = data.hair
    characterState.skin = data.skin
    
    // Class
    characterState.classes = [{
      className: data.class.name,
      level: 1
    }]
    
    // Ability scores
    Object.assign(characterState.abilityScores, data.finalAbilityScores)
    
    // Calculate ability modifiers
    for (const ability of abilities) {
      characterState.abilityMods[ability] = getAbilityModifier(data.finalAbilityScores[ability])
    }
    
    // Combat stats
    characterState.hp = data.derivedStats.maxHP
    characterState.hpMax = data.derivedStats.maxHP
    characterState.bab = data.derivedStats.bab
    characterState.init = data.derivedStats.initiative
    characterState.initiativeMod = data.derivedStats.initiative
    characterState.ac = data.derivedStats.ac.total
    characterState.touchAC = 10 + data.derivedStats.ac.dex + data.derivedStats.ac.size
    characterState.flatAC = 10 + data.derivedStats.ac.size
    characterState.cmb = data.derivedStats.cmb
    characterState.cmd = data.derivedStats.cmd
    
    // Saves
    characterState.saves.fort = data.derivedStats.fortitude
    characterState.saves.ref = data.derivedStats.reflex
    characterState.saves.will = data.derivedStats.will
    
    // Skills - update the characterState skills array
    for (const skillName in data.skills) {
      const skill = characterState.skills.find(s => s.name === skillName)
      if (skill) {
        skill.rank = data.skills[skillName]
      }
    }
    
    // Feats
    characterState.feats = data.feats.map(featName => ({
      name: featName,
      desc: availableFeats.find(f => f.name === featName)?.description || ''
    }))
    
    // Money
    characterState.money = data.startingMoney
    
    // Languages
    characterState.languages = data.languages || ['Common']
    
    // Equipment
    if (data.equipment && Array.isArray(data.equipment)) {
      data.equipment.forEach(item => {
        if (item && item.name) {
          characterState.inventory.push({
            name: item.name,
            quantity: item.quantity || 1,
            category: item.category || 'miscellaneous',
            type: item.type || '',
            value: item.value || 0,
            weight: item.weight || 0,
            equipped: false,
            notes: item.notes || ''
          })
        }
      })
    }
    
    // Racial traits
    characterState.vision = data.race.racialTraits?.find(t => t.name.includes('vision'))?.name || 'Normal'
    characterState.speed = data.race.speed
    
    // Spells (if applicable)
    if (data.spells && data.spells.length > 0) {
      console.log('Fetching spell details...')
      
      try {
        const spellDetails = await fetchSpellDetails(data.spells)
        
        characterState.spellsKnown = data.spells
        characterState.spells = spellDetails.map(spell => {
          const isCantrip = wizardCantrips.some(c => c.name === spell.name)
          
          return {
            ...spell,
            level: isCantrip ? 0 : (spell.level || 1),
            prepared: true,
            source: 'Wizard'
          }
        })
        
        if (data.class.name === 'Wizard') {
          const intMod = getAbilityModifier(data.finalAbilityScores.INT)
          characterState.spellSlots = {
            0: { used: 0, max: 3 },
            1: { used: 0, max: 1 + Math.max(0, intMod) },
            2: { used: 0, max: 0 },
            3: { used: 0, max: 0 },
            4: { used: 0, max: 0 },
            5: { used: 0, max: 0 },
            6: { used: 0, max: 0 },
            7: { used: 0, max: 0 },
            8: { used: 0, max: 0 },
            9: { used: 0, max: 0 }
          }
        }
      } catch (error) {
        console.error('Failed to fetch spell details:', error)
        characterState.spells = data.spells.map(spellName => ({
          name: spellName,
          level: 1,
          school: 'Unknown',
          description: 'Details unavailable'
        }))
      }
    }
    
  } else {
    // Level up existing character
    const classEntry = characterState.classes.find(c => c.className === data.class.name)
    if (classEntry) {
      classEntry.level++
    } else {
      characterState.classes.push({
        className: data.class.name,
        level: 1
      })
    }
    
    // Update HP
    characterState.hpMax += data.hitPointsGained
    characterState.hp += data.hitPointsGained
    
    // Update skills
    for (const skillName in data.skills) {
      const skill = characterState.skills.find(s => s.name === skillName)
      if (skill) {
        skill.rank += data.skills[skillName]
      }
    }
    
    // Add new feats
    data.feats.forEach(featName => {
      if (!characterState.feats.find(f => f.name === featName)) {
        characterState.feats.push({
          name: featName,
          desc: availableFeats.find(f => f.name === featName)?.description || ''
        })
      }
    })
  }
  
  // Save to storage
  storageService.save('character', characterState)
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
    
    // Copy existing character details including languages
    if (characterState.languages) {
      characterDetails.value.languages = [...characterState.languages]
    }
    
    // Set favored class
    favoredClass.value = characterState.favoredClass || ''
  } else {
    // New character - set default starting language
    characterDetails.value.languages = ['Common']
  }
})

// Watch for race selection to initialize favored class for Half-Elves
watch(selectedRace, (newRace) => {
  if (newRace?.name === 'Half-Elf' && !favoredClass.value) {
    favoredClass.value = 'any'
  }
})

// Watch for class selection to set starting gold
watch(selectedClass, (newClass) => {
  if (newClass && actualStartingGold.value === 0) {
    actualStartingGold.value = startingGold.value
  }
})
</script>

<style scoped>
/* Global box sizing for all elements in component */
* {
  box-sizing: border-box;
}

/* Main wizard container - no longer a modal */
.character-builder-wizard-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #0f172a;
  overflow: hidden;
}

/* Main wizard content */
.character-builder-wizard {
  background-color: #111827;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  contain: layout style;
}

/* Step content container - scrollable */
.step-content-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 300px;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

/* Ensure children don't overflow */
.step-content-container > * {
  max-width: 100%;
}

/* Race and class selection containers */
.race-selection-container,
.class-selection-container {
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

/* Clickable cards */
.race-card,
.class-card,
.feat-card {
  user-select: none;
  position: relative;
  z-index: 1;
  overflow: hidden;
  word-wrap: break-word;
  transition: all 0.2s ease;
  box-sizing: border-box;
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
  box-sizing: border-box;
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

/* Content sections */
.space-y-4 {
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

/* Enhanced section backgrounds */
.space-y-4 > div[class*="bg-gray-800"] {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Custom hover color for better visibility */
.hover\:bg-gray-750:hover {
  background-color: #2d3748;
}

/* Custom background color */
.bg-gray-750 {
  background-color: #2d3748;
}

/* Grid containment */
.grid {
  width: 100%;
  box-sizing: border-box;
}

/* Equipment list container */
.equipment-list-container {
  min-height: 400px;
  max-height: 500px;
  overflow: hidden;
  position: relative;
}

.equipment-list-container > div {
  scrollbar-width: thin;
  scrollbar-color: #4B5563 #1F2937;
}

.equipment-list-container > div::-webkit-scrollbar {
  width: 8px;
}

.equipment-list-container > div::-webkit-scrollbar-track {
  background: #1F2937;
  border-radius: 4px;
}

.equipment-list-container > div::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 4px;
}

.equipment-list-container > div::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}

/* Selected card highlight */
.race-card.bg-green-800,
.class-card.bg-green-800,
.feat-card.bg-green-800 {
  box-shadow: inset 0 0 0 2px rgba(34, 197, 94, 0.5);
  border-color: #10b981 !important;
}

/* Line clamp utility for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive adjustments */
@media (max-width: 850px) {
  .character-builder-wizard {
    height: 100%;
  }
  
  .step-content-container {
    padding: 0.5rem;
  }
  
  .skills-list,
  .feats-list {
    max-height: 300px;
  }
}

@media (max-width: 640px) {
  .character-builder-wizard {
    padding: 1rem;
  }
  
  /* Stack all grids on mobile */
  .grid {
    grid-template-columns: 1fr !important;
  }
}
</style>