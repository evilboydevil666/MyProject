<template>
  <div class="world-building-panel h-full flex flex-col bg-gray-900 text-white">
    <!-- Header -->
    <div class="bg-gray-800 p-4 border-b border-gray-700">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold text-emerald-400 mb-1">🌍 World Building Workshop</h2>
          <p class="text-sm text-gray-400">Create custom content, rules, and lore for your campaign</p>
        </div>
        <div class="flex items-center gap-2">
  <button
    @click="saveWorldData"
    class="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-sm font-semibold"
    :disabled="generatedContent.length === 0"
    title="Save world to file"
  >
    💾 Save World
  </button>
  <button
    @click="loadWorldFromFile"
    class="bg-green-600 hover:bg-green-500 px-3 py-2 rounded text-sm font-semibold"
    title="Load world from file"
  >
    📂 Load World
  </button>
  <button
    @click="showImportModal = true"
    class="bg-amber-600 hover:bg-amber-500 px-3 py-2 rounded text-sm font-semibold"
    title="Import content from text"
  >
    📥 Import Content
  </button>
  <button
    @click="clearAllContent"
    class="bg-red-600 hover:bg-red-500 px-3 py-2 rounded text-sm font-semibold"
    :disabled="generatedContent.length === 0"
    title="Clear all world content"
  >
    🗑️ Clear All
  </button>
  <div class="text-xs text-gray-400 text-right ml-2">
    <div>Content Generated: {{ totalContentCount }}</div>
    <div>Est. Pages: {{ estimatedPages }}</div>
  </div>
</div>
      </div>
    </div>

    <!-- Content Type Tabs -->
    <div class="flex border-b border-gray-700 overflow-x-auto">
      <button 
        v-for="category in contentCategories" 
        :key="category.id"
        @click="currentCategory = category.id"
        :class="[
          'px-4 py-3 border-b-2 transition-colors whitespace-nowrap',
          currentCategory === category.id 
            ? 'border-emerald-500 bg-gray-800 text-emerald-400' 
            : 'border-transparent hover:bg-gray-800'
        ]"
      >
        {{ category.icon }} {{ category.name }}
      </button>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Configuration Panel -->
      <div class="w-1/3 border-r border-gray-700 p-4 overflow-y-auto">
       <!-- World Settings -->
<div class="mb-4 p-3 bg-gray-800 rounded border border-gray-700">
  <h4 class="text-sm font-semibold text-gray-300 mb-2">World Settings</h4>
  <div class="space-y-2">
    <div>
      <label class="block text-xs font-medium text-gray-400 mb-1">World Name</label>
      <input 
        v-model="worldName" 
        @change="updateWorldName"
        placeholder="My Campaign World"
        class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
      />
    </div>
    <div>
      <label class="block text-xs font-medium text-gray-400 mb-1">World Description</label>
      <textarea 
        v-model="worldDescription" 
        @change="updateWorldDescription"
        placeholder="Brief description of your campaign world..."
        class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm h-16 resize-none"
      ></textarea>
    </div>
  </div>
</div>
        <!-- Campaign Start -->
        <div v-if="currentCategory === 'campaign-start'" class="space-y-4">
          <h3 class="text-lg font-semibold text-amber-400 mb-3">🎭 Campaign Start</h3>
          
          <div>
            <label class="block text-sm font-medium mb-1">Starting Location</label>
            <input 
              v-model="campaignConfig.startingLocation" 
              placeholder="e.g., The Silver Stag Tavern in Absalom, Prison cell in Red Mountain Keep"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Starting Situation</label>
            <textarea 
              v-model="campaignConfig.startingSituation" 
              placeholder="e.g., You've just arrived after a long journey, You wake up with no memory of how you got here"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-20 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Player Context (Optional)</label>
            <input 
              v-model="campaignConfig.playerContext" 
              placeholder="e.g., Seasoned mercenary, Fresh recruit, Mysterious stranger"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Campaign Tone</label>
            <select v-model="campaignConfig.tone" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
              <option value="epic-fantasy">🏰 Epic Fantasy</option>
              <option value="dark-gritty">💀 Dark & Gritty</option>
              <option value="high-adventure">⚔️ High Adventure</option>
              <option value="mystery">🔍 Mystery & Intrigue</option>
              <option value="comedic">🎭 Light-hearted</option>
            </select>
          </div>

          <button 
            @click="generateCampaignOpening"
            :disabled="isGenerating || !campaignConfig.startingLocation || !campaignConfig.startingSituation"
            class="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 px-4 py-3 rounded font-semibold"
          >
            {{ isGenerating ? '🎭 Creating Opening...' : '🎬 Generate Campaign Opening' }}
          </button>
        </div>

        <!-- Lore & History -->
        <div v-if="currentCategory === 'lore'" class="space-y-4">
          <h3 class="text-lg font-semibold text-emerald-400 mb-3">📚 Lore Generator</h3>
          
          <div>
            <label class="block text-sm font-medium mb-1">Lore Type</label>
            <select v-model="loreConfig.type" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
              <option value="world-history">🌍 World History</option>
              <option value="region">🏞️ Regional Lore</option>
              <option value="organization">🏛️ Organization/Faction</option>
              <option value="mythology">⚡ Mythology/Religion</option>
              <option value="legend">📜 Legends & Stories</option>
              <option value="timeline">📅 Historical Timeline</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Subject/Name</label>
            <input 
              v-model="loreConfig.subject" 
              placeholder="e.g., The Crimson Empire, Order of the Silver Dawn"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Time Period</label>
            <input 
              v-model="loreConfig.timePeriod" 
              placeholder="e.g., 1000 years ago, The Age of Dragons"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Key Themes</label>
            <textarea 
              v-model="loreConfig.themes" 
              placeholder="Corruption, redemption, lost knowledge, etc."
              class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-20 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Connected Elements</label>
            <textarea 
              v-model="loreConfig.connections" 
              placeholder="How this connects to current campaign elements"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-20 resize-none"
            ></textarea>
          </div>

          <button 
            @click="generateLore"
            :disabled="isGenerating"
            class="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 px-4 py-3 rounded font-semibold"
          >
            {{ isGenerating ? '🌍 Creating Lore...' : '📚 Generate Lore' }}
          </button>
        </div>

        <!-- Custom Rules -->
        <div v-if="currentCategory === 'rules'" class="space-y-4">
          <h3 class="text-lg font-semibold text-blue-400 mb-3">⚖️ Custom Rules</h3>
          
          <div>
            <label class="block text-sm font-medium mb-1">Rule Category</label>
            <select v-model="rulesConfig.category" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
              <option value="combat">⚔️ Combat Mechanics</option>
              <option value="magic">✨ Magic System</option>
              <option value="skills">🎯 Skills & Abilities</option>
              <option value="social">👥 Social Mechanics</option>
              <option value="environment">🌍 Environmental Rules</option>
              <option value="character">📋 Character Options</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Rule Name</label>
            <input 
              v-model="rulesConfig.name" 
              placeholder="e.g., Spell Corruption, Honor System"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Purpose/Problem to Solve</label>
            <textarea 
              v-model="rulesConfig.purpose" 
              placeholder="What gameplay issue does this address?"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-20 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Basic Concept</label>
            <textarea 
              v-model="rulesConfig.concept" 
              placeholder="Describe the basic idea of the rule"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-20 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="rulesConfig.includeExamples" class="rounded">
              Include play examples
            </label>
          </div>

          <button 
            @click="generateRules"
            :disabled="isGenerating"
            class="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 px-4 py-3 rounded font-semibold"
          >
            {{ isGenerating ? '⚖️ Crafting Rules...' : '📋 Generate Rules' }}
          </button>
        </div>

        <!-- Items & Equipment -->
        <div v-if="currentCategory === 'items'" class="space-y-4">
          <h3 class="text-lg font-semibold text-purple-400 mb-3">⚔️ Item Creation</h3>
          
          <div>
            <label class="block text-sm font-medium mb-1">Item Type</label>
            <select v-model="itemsConfig.type" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
              <option value="weapon">⚔️ Weapons</option>
              <option value="armor">🛡️ Armor</option>
              <option value="magic">✨ Magic Items</option>
              <option value="consumable">🧪 Consumables</option>
              <option value="artifact">💎 Artifacts</option>
              <option value="mundane">🎒 Mundane Equipment</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Generation Mode</label>
            <select v-model="itemsConfig.mode" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
              <option value="single">Single Unique Item</option>
              <option value="batch">Batch (5-10 items)</option>
              <option value="themed">Themed Set</option>
              <option value="treasure">Treasure Hoard</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Item Level/Rarity</label>
            <select v-model="itemsConfig.rarity" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
              <option value="common">Common (1-5)</option>
              <option value="uncommon">Uncommon (6-10)</option>
              <option value="rare">Rare (11-15)</option>
              <option value="very-rare">Very Rare (16-20)</option>
              <option value="legendary">Legendary (20+)</option>
            </select>
          </div>

          <div v-if="itemsConfig.mode === 'themed'">
            <label class="block text-sm font-medium mb-1">Theme</label>
            <input 
              v-model="itemsConfig.theme" 
              placeholder="e.g., Dragon-slaying, Ancient Elven, Necromantic"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Special Properties</label>
            <textarea 
              v-model="itemsConfig.properties" 
              placeholder="Any specific abilities, curses, or requirements"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-20 resize-none"
            ></textarea>
          </div>

          <button 
            @click="generateItems"
            :disabled="isGenerating"
            class="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 px-4 py-3 rounded font-semibold"
          >
            {{ isGenerating ? '⚔️ Forging Items...' : '💎 Generate Items' }}
          </button>
        </div>

        <!-- Locations -->
        <div v-if="currentCategory === 'locations'" class="space-y-4">
          <h3 class="text-lg font-semibold text-yellow-400 mb-3">🏰 Location Builder</h3>
          
          <div>
            <label class="block text-sm font-medium mb-1">Location Type</label>
            <select v-model="locationConfig.type" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
              <option value="city">🏛️ City/Town</option>
              <option value="dungeon">🏚️ Dungeon</option>
              <option value="wilderness">🌲 Wilderness Area</option>
              <option value="building">🏠 Specific Building</option>
              <option value="plane">🌌 Planar Location</option>
              <option value="region">🗺️ Geographic Region</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input 
              v-model="locationConfig.name" 
              placeholder="e.g., Shadowfen Marsh, The Brass Citadel"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Size/Scale</label>
            <select v-model="locationConfig.size" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
              <option value="small">Small (Building/Camp)</option>
              <option value="medium">Medium (Village/Complex)</option>
              <option value="large">Large (Town/Fortress)</option>
              <option value="huge">Huge (City/Region)</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Notable Features</label>
            <textarea 
              v-model="locationConfig.features" 
              placeholder="Unique landmarks, important buildings, etc."
              class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-20 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="locationConfig.includeMap" class="rounded">
              Include map description
            </label>
          </div>

          <div>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="locationConfig.includeNPCs" class="rounded">
              Generate key NPCs
            </label>
          </div>

          <button 
            @click="generateLocation"
            :disabled="isGenerating"
            class="w-full bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 px-4 py-3 rounded font-semibold"
          >
            {{ isGenerating ? '🏰 Building Location...' : '🗺️ Generate Location' }}
          </button>
        </div>

        <!-- Creatures -->
        <div v-if="currentCategory === 'creatures'" class="space-y-4">
          <h3 class="text-lg font-semibold text-red-400 mb-3">🐉 Creature Creator</h3>
          
          <div>
            <label class="block text-sm font-medium mb-1">Creature Type</label>
            <select v-model="creatureConfig.type" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
              <option value="beast">🦊 Beast</option>
              <option value="humanoid">👤 Humanoid</option>
              <option value="undead">💀 Undead</option>
              <option value="construct">🤖 Construct</option>
              <option value="aberration">👁️ Aberration</option>
              <option value="dragon">🐉 Dragon</option>
              <option value="outsider">😈 Outsider</option>
              <option value="fey">🧚 Fey</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Challenge Rating</label>
            <input 
              v-model.number="creatureConfig.cr" 
              type="number" 
              min="0.25" 
              max="30" 
              step="0.25"
              placeholder="1-20"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Concept</label>
            <textarea 
              v-model="creatureConfig.concept" 
              placeholder="Describe the creature's appearance and behavior"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-20 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Special Abilities</label>
            <textarea 
              v-model="creatureConfig.abilities" 
              placeholder="Unique powers, resistances, attacks"
              class="w-full bg-gray-700 border border-gray-600 rounded p-2 h-20 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="creatureConfig.includeVariants" class="rounded">
              Include variant versions
            </label>
          </div>

          <button 
            @click="generateCreature"
            :disabled="isGenerating"
            class="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-600 px-4 py-3 rounded font-semibold"
          >
            {{ isGenerating ? '🐉 Creating Creature...' : '👾 Generate Creature' }}
          </button>
        </div>
      </div>

      <!-- Generated Content Display -->
      <div class="flex-1 overflow-y-auto relative">
        <!-- Export Options - Always visible at top when content exists -->
        <div v-if="generatedContent.length > 0" class="sticky top-0 z-10 bg-gray-900 pb-4 pt-4 px-4 -mx-4 mb-4 border-b border-gray-700 shadow-lg">
          <div class="p-4 bg-gray-800 rounded">
            <div class="flex justify-between items-center mb-3">
              <h4 class="font-semibold">📤 Export Options</h4>
              <span class="text-xs text-gray-400">{{ totalContentCount }} items • ~{{ estimatedPages }} pages</span>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button 
                @click="exportAll('markdown')"
                class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
              >
                📝 Export as Markdown
              </button>
              <button 
                @click="exportAll('json')"
                class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
              >
                📊 Export as JSON
              </button>
              <button 
                @click="exportCampaignGuide()"
                class="bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded text-sm col-span-2 transition-colors"
              >
                📚 Generate Campaign Guide
              </button>
              <button 
                @click="exportToSessionPrep()"
                class="bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded text-sm transition-colors"
              >
                🎯 Send to Session Prep
              </button>
              <button 
                @click="exportToChatGPTSession()"
                class="bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded text-sm transition-colors"
              >
                🌐 Send All to ChatGPT
              </button>
            </div>
          </div>
        </div>

        <div v-if="generatedContent.length === 0" class="text-center text-gray-500 py-12">
          <div class="text-6xl mb-4">🌍</div>
          <h3 class="text-xl mb-2">Ready to Build Your World</h3>
          <p class="text-sm">Choose a category and configure your content generation</p>
        </div>

        <div v-else class="space-y-4 px-4">
          <div 
            v-for="(content, index) in generatedContent" 
            :key="content.id"
            class="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-lg font-semibold flex items-center gap-2">
                  <span :class="getCategoryColor(content.category)">{{ getCategoryIcon(content.category) }}</span>
                  {{ content.title }}
                </h3>
                <div class="text-xs text-gray-400 mt-1">
                  {{ content.category }} • {{ formatTime(content.timestamp) }}
                </div>
              </div>
              
              <div class="flex gap-2">
                <button 
                  @click="editContent(content)"
                  class="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs transition-colors"
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  @click="copyContent(content)"
                  class="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs transition-colors"
                  title="Send to ChatGPT"
                >
                  🌐
                </button>
                <button 
                  @click="exportToChatGPT(content)"
                  class="bg-purple-600 hover:bg-purple-500 px-2 py-1 rounded text-xs transition-colors"
                  title="Send to ChatGPT"
                >
                  🌐
                </button>
                <button 
                  @click="removeContent(index)"
                  class="bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-xs transition-colors"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div 
              class="text-sm bg-gray-900 rounded p-3 content-display"
              v-html="formatContent(content.content)"
            ></div>
            
            <div v-if="content.stats" class="mt-3 p-2 bg-gray-700 rounded text-xs font-mono">
              {{ content.stats }}
            </div>

            <div v-if="content.tags && content.tags.length > 0" class="mt-3 flex gap-2 flex-wrap">
              <span 
                v-for="tag in content.tags" 
                :key="tag"
                class="text-xs px-2 py-1 bg-gray-700 rounded"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Modal -->
    <div v-if="isGenerating" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center gap-3 mb-4">
          <div class="animate-spin h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full"></div>
          <h3 class="text-lg font-semibold text-emerald-300">{{ progressMessage }}</h3>
        </div>
        <div class="text-sm text-gray-400">{{ progressDetail }}</div>
        <div class="mt-4 text-xs text-gray-500">
          Tip: {{ getRandomTip() }}
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-semibold text-amber-400">📥 Import World Building Content</h3>
            <p class="text-sm text-gray-400 mt-1">Paste your world building content and we'll parse it automatically</p>
          </div>
          <button 
            @click="closeImportModal"
            class="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        <!-- Import Steps -->
        <div v-if="!importParsed" class="flex-1 overflow-y-auto">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Paste your content here:</label>
            <textarea 
              v-model="importText"
              placeholder="Paste your world building document, location lists, lore, creatures, etc..."
              class="w-full h-64 bg-gray-700 border border-gray-600 rounded p-3 text-sm font-mono"
            ></textarea>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="parseImportedContent"
              :disabled="!importText.trim() || isParsing"
              class="bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 px-4 py-2 rounded font-semibold"
            >
              {{ isParsing ? '🔄 Parsing...' : '🔍 Parse Content' }}
            </button>
            <button 
              @click="loadSampleContent"
              class="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
            >
              📋 Load Sample
            </button>
          </div>
        </div>
        
        <!-- Parsed Results -->
        <div v-else class="flex-1 overflow-y-auto">
  <div class="mb-4 p-3 bg-gray-700 rounded">
    <h4 class="font-semibold mb-2 text-emerald-300">✅ Content Parsed Successfully!</h4>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
      <template v-for="(categoryItems, category) in parsedResults" :key="category">
        <template v-if="categoryItems && categoryItems.length > 0">
          <span :class="getCategoryColor(category)">{{ getCategoryIcon(category) }} {{ getCategoryName(category) }}:</span>
          <span class="text-white font-semibold">{{ categoryItems.length }}</span>
        </template>
      </template>
    </div>
  </div>
  
  <!-- Category Tabs -->
  <div class="flex gap-2 mb-4 overflow-x-auto">
    <template v-for="(categoryItems, category) in parsedResults" :key="category">
      <button 
        v-if="categoryItems && categoryItems.length > 0"
        @click="selectedImportCategory = category"
        :class="[
          'px-3 py-1 rounded text-sm whitespace-nowrap',
          selectedImportCategory === category 
            ? 'bg-amber-600 text-white' 
            : 'bg-gray-700 hover:bg-gray-600'
        ]"
      >
        {{ getCategoryIcon(category) }} {{ getCategoryName(category) }} ({{ categoryItems.length }})
      </button>
    </template>
  </div>
  
  <!-- Items Preview -->
  <div class="space-y-2 max-h-64 overflow-y-auto mb-4">
    <div 
      v-for="(item, index) in parsedResults[selectedImportCategory]" 
      :key="index"
      class="p-3 bg-gray-700 rounded text-sm"
    >
      <div class="flex justify-between items-start">
        <div>
          <strong>{{ item.name || item.title || `Item ${index + 1}` }}</strong>
          <div class="text-xs text-gray-400 mt-1">
            {{ getItemPreview(item, selectedImportCategory) }}
          </div>
          
          <!-- Additional details for new categories -->
          <div v-if="selectedImportCategory === 'trade' && item.tradeRoutes?.length" class="text-xs text-amber-400 mt-1">
            Routes: {{ item.tradeRoutes.join(', ') }}
          </div>
          <div v-if="selectedImportCategory === 'wars' && item.status" class="text-xs text-red-400 mt-1">
            Status: {{ item.status }} • {{ item.type }}
          </div>
          <div v-if="selectedImportCategory === 'alliances' && item.parties?.length" class="text-xs text-blue-400 mt-1">
            Parties: {{ item.parties.join(' & ') }}
          </div>
        </div>
        <input 
          type="checkbox" 
          v-model="item.selected"
          class="ml-2"
          :checked="true"
        />
      </div>
    </div>
  </div>
  
  <!-- Import Actions -->
  <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
    <div class="text-sm text-gray-400">
      {{ getSelectedCount() }} items selected for import
    </div>
    <div class="flex gap-3">
      <button 
        @click="importParsed = false"
        class="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
      >
        ← Back
      </button>
      <button 
        @click="importSelected"
        :disabled="getSelectedCount() === 0 || isImporting"
        class="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 px-4 py-2 rounded font-semibold"
      >
        {{ isImporting ? '📤 Importing...' : '✨ Import Selected' }}
      </button>
    </div>
  </div>
</div>
  </div>
<!-- Edit Content Modal -->
<div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div class="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-xl font-semibold text-blue-400">✏️ Edit {{ editingContent?.category || 'Content' }}</h3>
        <p class="text-sm text-gray-400 mt-1">Modify your generated content</p>
      </div>
      <button 
        @click="cancelEdit"
        class="text-gray-400 hover:text-white text-2xl"
        title="Close (Esc)"
      >
        ×
      </button>
    </div>
    
    <!-- Edit Form -->
    <div class="flex-1 overflow-y-auto">
      <div class="space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium mb-1">Title</label>
          <input 
            v-model="editForm.title"
            class="w-full bg-gray-700 border border-gray-600 rounded p-2"
          />
        </div>
        
        <!-- Content with toolbar -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="block text-sm font-medium">Content</label>
            <div class="flex items-center gap-4 text-xs text-gray-400">
              <span>{{ editForm.content.length }} characters | {{ editForm.content.split(' ').length }} words</span>
              <button 
                @click="showFormattingHelp = !showFormattingHelp"
                class="hover:text-white"
              >
                <span v-if="showFormattingHelp">Hide</span>
                <span v-else>Show</span> Formatting Help
              </button>
            </div>
          </div>
          
          <!-- Formatting Help -->
          <div v-if="showFormattingHelp" class="mb-2 p-2 bg-gray-700 rounded text-xs">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <strong class="text-white">Basic Formatting:</strong>
                <div>**bold text** → <strong>bold text</strong></div>
                <div>*italic text* → <em>italic text</em></div>
                <div># Heading → <strong class="text-lg">Heading</strong></div>
              </div>
              <div>
                <strong class="text-white">Lists & More:</strong>
                <div>- Item → • Item</div>
                <div>1. Item → 1. Item</div>
                <div>New paragraph → Double enter</div>
              </div>
            </div>
          </div>
          
          <textarea 
            v-model="editForm.content"
            @keydown.tab.prevent="handleTab"
            class="w-full bg-gray-700 border border-gray-600 rounded p-3 text-sm font-mono h-96 resize-none"
            placeholder="Edit your content here..."
          ></textarea>
          
          <!-- Quick Actions -->
          <div class="flex gap-2 mt-2">
            <button 
              @click="enhanceWithAI"
              class="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded text-sm"
              :disabled="isGenerating"
            >
              ✨ Enhance with AI
            </button>
            <button 
              @click="addSection"
              class="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm"
            >
              ➕ Add Section
            </button>
            <button 
              @click="formatAsStatBlock"
              v-if="editingContent?.category === 'creatures'"
              class="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm"
            >
              📊 Format Stat Block
            </button>
          </div>
        </div>
        
        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium mb-1">Tags (comma-separated)</label>
          <input 
            v-model="editForm.tags"
            @keydown.enter.prevent="addTag"
            placeholder="e.g., city, coastal, trade-hub (press Enter to add)"
            class="w-full bg-gray-700 border border-gray-600 rounded p-2"
          />
          <div v-if="editForm.tags" class="flex gap-2 mt-2 flex-wrap">
            <span 
              v-for="tag in editForm.tags.split(',').map(t => t.trim()).filter(t => t)"
              :key="tag"
              class="text-xs px-2 py-1 bg-gray-600 rounded flex items-center gap-1"
            >
              {{ tag }}
              <button 
                @click="removeTag(tag)"
                class="hover:text-red-400"
              >
                ×
              </button>
            </span>
          </div>
        </div>
        
        <!-- Stats (if applicable) -->
        <div v-if="editForm.stats">
          <label class="block text-sm font-medium mb-1">Stats/Summary</label>
          <input 
            v-model="editForm.stats"
            class="w-full bg-gray-700 border border-gray-600 rounded p-2"
          />
        </div>
        
        <!-- Preview -->
        <div class="border-t border-gray-700 pt-4">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium">Preview</label>
            <label class="flex items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                v-model="livePreview"
                class="rounded"
              />
              Live Preview
            </label>
          </div>
          <div 
            class="bg-gray-900 rounded p-4 max-h-64 overflow-y-auto content-display"
            v-html="formatContent(livePreview ? editForm.content : editingContent?.content || '')"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
      <div class="text-sm text-gray-400">
        <span v-if="editForm.lastModified">Last modified: {{ formatTime(editForm.lastModified) }}</span>
        <span class="ml-2">Ctrl+S to save</span>
      </div>
      <div class="flex gap-3">
        <button 
          @click="cancelEdit"
          class="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button 
          @click="regenerateContent"
          class="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded"
          :disabled="isGenerating"
        >
          🔄 Regenerate
        </button>
        <button 
          @click="saveEdit"
          class="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded font-semibold"
        >
          💾 Save Changes
        </button>
      </div>
    </div>
  </div>
</div>
</div>
</div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { characterState } from '../../characterState.js'
import { chatGPTService } from '@/services/ChatGPTService.js'

function getCategoryName(category) {
  const names = {
    locations: 'Locations',
    lore: 'Lore & History',
    creatures: 'Creatures',
    items: 'Items',
    rules: 'Custom Rules',
    trade: 'Trade & Economy',
    wars: 'Conflicts & Wars',
    alliances: 'Alliances & Treaties',
    worldInfo: 'World Overview',
    regions: 'Regions',
    cities: 'Cities',
    factions: 'Factions',
    npcs: 'NPCs'
  }
  return names[category] || category
}

// Props
const props = defineProps({
  apiKey: String
})

// Emit
const emit = defineEmits(['content-generated', 'usage-updated'])

// Router
const router = useRouter()

// State
const currentCategory = ref('campaign-start')
const isGenerating = ref(false)
const progressMessage = ref('')
const progressDetail = ref('')
const generatedContent = ref([])

// Import modal state
const showImportModal = ref(false)
const importText = ref('')
const isParsing = ref(false)
const isImporting = ref(false)
const importParsed = ref(false)
const selectedImportCategory = ref('locations')
const worldName = ref(sessionStorage.getItem('world-name') || 'My Campaign World')
const worldDescription = ref(sessionStorage.getItem('world-description') || '')


// Initialize parsedResults with empty arrays to prevent undefined errors
const parsedResults = ref({
  locations: [],
  lore: [],
  regions: [],
  worldInfo: [],
  items: [],
  creatures: [],
  rules: [],
  cities: [],
  factions: [],
  npcs: [],
  trade: [],
  wars: [],
  alliances: []
})

// Edit modal state
const showEditModal = ref(false)
const editingContent = ref(null)
const editingIndex = ref(-1)
const editForm = ref({
  title: '',
  content: '',
  tags: '',
  stats: '',
  lastModified: null
})
const showFormattingHelp = ref(false)
const livePreview = ref(true)



// Content Categories - Updated to include campaign-start
const contentCategories = [
  { id: 'campaign-start', name: 'Campaign Start', icon: '🎭' },
  { id: 'lore', name: 'Lore & History', icon: '📚' },
  { id: 'rules', name: 'Custom Rules', icon: '⚖️' },
  { id: 'items', name: 'Items & Equipment', icon: '⚔️' },
  { id: 'locations', name: 'Locations', icon: '🏰' },
  { id: 'creatures', name: 'Creatures', icon: '🐉' }
]

// Configuration States
const campaignConfig = ref({
  type: 'campaign-start',
  startingLocation: '',
  startingSituation: '',
  playerContext: '',
  tone: 'epic-fantasy'
})

const loreConfig = ref({
  type: 'world-history',
  subject: '',
  timePeriod: '',
  themes: '',
  connections: ''
})

const rulesConfig = ref({
  category: 'combat',
  name: '',
  purpose: '',
  concept: '',
  includeExamples: true
})

const itemsConfig = ref({
  type: 'weapon',
  mode: 'single',
  rarity: 'uncommon',
  theme: '',
  properties: ''
})

const locationConfig = ref({
  type: 'city',
  name: '',
  size: 'medium',
  features: '',
  includeMap: true,
  includeNPCs: true
})

const creatureConfig = ref({
  type: 'beast',
  cr: 1,
  concept: '',
  abilities: '',
  includeVariants: false
})

// Computed
const totalContentCount = computed(() => generatedContent.value.length)
const estimatedPages = computed(() => {
  const totalWords = generatedContent.value.reduce((sum, content) => {
    return sum + (content.content.split(' ').length || 0)
  }, 0)
  return Math.ceil(totalWords / 250) // ~250 words per page
})

// NEW: Get all locations from generated content
const worldLocations = computed(() => {
  return generatedContent.value
    .filter(content => content.category === 'locations')
    .map(content => ({
      id: content.id,
      name: content.title,
      type: content.tags.find(tag => ['city', 'town', 'dungeon', 'wilderness', 'building'].includes(tag)) || 'location',
      description: content.content.substring(0, 200) + '...',
      fullContent: content.content,
      npcs: extractNPCs(content.content),
      features: content.tags.filter(tag => !['locations', 'imported'].includes(tag))
    }))
})

// Lifecycle
onMounted(() => {
  loadWorldData()
worldName.value = sessionStorage.getItem('world-name') || 'My Campaign World'
  worldDescription.value = sessionStorage.getItem('world-description') || ''

  window.addEventListener('keydown', handleEditKeyboard)
})

// Add this right after onMounted:
onUnmounted(() => {
  window.removeEventListener('keydown', handleEditKeyboard)
})

// Methods
async function generateCampaignOpening() {
  if (!campaignConfig.value.startingLocation || !campaignConfig.value.startingSituation) {
    alert('Please specify both starting location and starting situation')
    return
  }
  
  isGenerating.value = true
  progressMessage.value = 'Creating Campaign Opening'
  progressDetail.value = 'Setting the stage for your adventure...'
  
  try {
    const characterLevel = characterState.classes?.reduce((sum, c) => sum + (c.level || 0), 0) || 1
    const characterName = characterState.name || 'the adventurer'
    
    const prompt = `Create a campaign opening for Pathfinder 1e that begins at this EXACT location and situation:

**Starting Location:** ${campaignConfig.value.startingLocation}
**Starting Situation:** ${campaignConfig.value.startingSituation}
**Player Context:** ${campaignConfig.value.playerContext || 'New adventurer'}
**Campaign Tone:** ${campaignConfig.value.tone}
**Character:** ${characterName} (Level ${characterLevel})

CRITICAL INSTRUCTIONS:
- The campaign MUST start EXACTLY at: ${campaignConfig.value.startingLocation}
- The opening MUST incorporate this situation: ${campaignConfig.value.startingSituation}
- DO NOT include sections for "Adventure Hooks", "Key NPCs", or "Initial Challenges"
- DO NOT list plot hooks, NPCs, or challenges as separate sections

Provide ONLY these two sections:

1. **Campaign Opening** (2-3 paragraphs)
   - Set the tone and atmosphere of the world
   - Begin the narrative AT ${campaignConfig.value.startingLocation}
   - Reference the starting situation naturally in the narrative

2. **The Scene** (2-3 paragraphs)
   - Describe EXACTLY what ${characterName} experiences at ${campaignConfig.value.startingLocation}
   - Include sensory details: sights, sounds, smells, atmosphere
   - Incorporate ${campaignConfig.value.startingSituation} into the immediate scene
   - End with the character's immediate circumstances, not future possibilities

Make it immersive and atmospheric. The reader should feel like they are there.`

    const content = await callOpenAI(prompt, { 
      maxTokens: 800,
      temperature: 0.8 
    })
    
    // Clean the response to ensure no unwanted sections
    const cleanedContent = cleanCampaignOpening(content)
    
    addGeneratedContent({
      category: 'campaign-start',
      title: `Campaign Opening: ${campaignConfig.value.startingLocation}`,
      content: cleanedContent,
      tags: ['campaign-start', 'opening-scene', campaignConfig.value.tone, campaignConfig.value.startingLocation.split(' ')[0].toLowerCase()]
    })
    
    // Reset form
    campaignConfig.value.startingLocation = ''
    campaignConfig.value.startingSituation = ''
    campaignConfig.value.playerContext = ''
    
  } catch (error) {
    console.error('Campaign opening generation failed:', error)
    alert('Failed to generate campaign opening: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}

function cleanCampaignOpening(content) {
  // Remove any sections that shouldn't be there
  const unwantedSections = [
    /\*\*Adventure Hooks?\*\*[\s\S]*?(?=\*\*|$)/gi,
    /\*\*Key NPCs?\*\*[\s\S]*?(?=\*\*|$)/gi,
    /\*\*Initial Challenges?\*\*[\s\S]*?(?=\*\*|$)/gi,
    /\*\*Plot Hooks?\*\*[\s\S]*?(?=\*\*|$)/gi,
    /\*\*Notable NPCs?\*\*[\s\S]*?(?=\*\*|$)/gi,
    /\*\*Immediate Challenges?\*\*[\s\S]*?(?=\*\*|$)/gi,
    /\*\*Quest Hooks?\*\*[\s\S]*?(?=\*\*|$)/gi,
    /\*\*Potential Encounters?\*\*[\s\S]*?(?=\*\*|$)/gi,
    /\d+\.\s*\*\*[^*]+\*\*\s*[-:].*?(?=\d+\.|$)/gi, // Numbered lists of hooks/challenges
    /^[-•]\s*\*\*[^*]+\*\*\s*[-:].*$/gm // Bullet lists of hooks/challenges
  ]
  
  let cleanedContent = content
  unwantedSections.forEach(pattern => {
    cleanedContent = cleanedContent.replace(pattern, '')
  })
  
  // Clean up extra whitespace
  cleanedContent = cleanedContent.replace(/\n{3,}/g, '\n\n').trim()
  
  // If content was overly cleaned and too short, return original
  if (cleanedContent.length < 200) {
    return content
  }
  
  return cleanedContent
}

async function generateLore() {
  if (!validateConfig(loreConfig.value, ['subject'])) return
  
  isGenerating.value = true
  progressMessage.value = 'Creating Lore'
  progressDetail.value = 'Weaving the threads of history...'
  
  try {
    const prompt = `Create detailed Pathfinder 1e lore:

**Type:** ${loreConfig.value.type}
**Subject:** ${loreConfig.value.subject}
**Time Period:** ${loreConfig.value.timePeriod || 'Current era'}
**Themes:** ${loreConfig.value.themes || 'Epic fantasy'}
**Campaign Connections:** ${loreConfig.value.connections || 'Standalone'}

Provide:
1. **Overview** - General description and importance
2. **History** - Key events and timeline
3. **Key Figures** - Important people/entities
4. **Current State** - How it affects the present
5. **Adventure Hooks** - How to use in gameplay
6. **Secrets** - Hidden truths for the GM

Make it rich, detailed, and immediately usable in play.`

    const content = await callOpenAI(prompt)
    
    addGeneratedContent({
      category: 'lore',
      title: loreConfig.value.subject || 'World Lore',
      content: content,
      tags: [loreConfig.value.type, 'lore', 'history']
    })
    
    // Reset form
    loreConfig.value.subject = ''
    loreConfig.value.themes = ''
    loreConfig.value.connections = ''
    
  } catch (error) {
    console.error('Lore generation failed:', error)
    alert('Failed to generate lore: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}

async function generateRules() {
  if (!validateConfig(rulesConfig.value, ['name', 'purpose'])) return
  
  isGenerating.value = true
  progressMessage.value = 'Crafting Rules'
  progressDetail.value = 'Balancing mechanics and fun...'
  
  try {
    const prompt = `Design a custom Pathfinder 1e rule:

**Category:** ${rulesConfig.value.category}
**Rule Name:** ${rulesConfig.value.name}
**Purpose:** ${rulesConfig.value.purpose}
**Concept:** ${rulesConfig.value.concept}
**Include Examples:** ${rulesConfig.value.includeExamples ? 'Yes' : 'No'}

Create a complete, balanced rule that includes:
1. **Rule Summary** - One paragraph overview
2. **Detailed Mechanics** - Step-by-step how it works
3. **Interaction with Core Rules** - How it fits with existing systems
4. **Balance Considerations** - Potential issues and solutions
5. **Optional Variants** - Ways to adjust difficulty/complexity
${rulesConfig.value.includeExamples ? '6. **Play Examples** - 2-3 scenarios showing the rule in action' : ''}

Ensure the rule is clear, balanced, and enhances gameplay.`

    const content = await callOpenAI(prompt)
    
    addGeneratedContent({
      category: 'rules',
      title: rulesConfig.value.name,
      content: content,
      tags: [rulesConfig.value.category, 'homebrew', 'rules']
    })
    
    // Reset form
    rulesConfig.value.name = ''
    rulesConfig.value.purpose = ''
    rulesConfig.value.concept = ''
    
  } catch (error) {
    console.error('Rule generation failed:', error)
    alert('Failed to generate rule: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}

async function generateItems() {
  if (!validateConfig(itemsConfig.value, [])) return
  
  isGenerating.value = true
  progressMessage.value = 'Forging Items'
  progressDetail.value = 'Imbuing with magical properties...'
  
  try {
    const characterLevel = characterState.classes?.reduce((sum, c) => sum + (c.level || 0), 0) || 10
    const itemCount = itemsConfig.value.mode === 'single' ? 1 : 
                     itemsConfig.value.mode === 'batch' ? '5-10' :
                     itemsConfig.value.mode === 'themed' ? '3-5 themed' : 
                     '10-20 mixed'
    
    const prompt = `Generate Pathfinder 1e ${itemsConfig.value.type}:

**Quantity:** ${itemCount} items
**Rarity/Level:** ${itemsConfig.value.rarity}
**Character Level:** ${characterLevel}
${itemsConfig.value.mode === 'themed' ? `**Theme:** ${itemsConfig.value.theme}` : ''}
${itemsConfig.value.properties ? `**Special Properties:** ${itemsConfig.value.properties}` : ''}

For each item provide:
1. **Name** - Evocative and memorable
2. **Description** - Physical appearance and lore
3. **Mechanics** - Complete stats (damage, AC, bonuses, etc.)
4. **Special Abilities** - Unique powers or properties
5. **Value** - GP cost and crafting requirements
6. **Quirks/Drawbacks** - Interesting limitations or personality

${itemsConfig.value.mode === 'treasure' ? 'Include a mix of weapons, armor, consumables, and treasure.' : ''}
Make each item unique and interesting for actual play.`

    const content = await callOpenAI(prompt, { maxTokens: itemsConfig.value.mode === 'single' ? 800 : 1500 })
    
    addGeneratedContent({
      category: 'items',
      title: `${itemsConfig.value.type} Collection`,
      content: content,
      tags: [itemsConfig.value.type, itemsConfig.value.rarity, 'equipment'],
      stats: `${itemCount} items, ${itemsConfig.value.rarity} rarity`
    })
    
    // Reset form
    itemsConfig.value.theme = ''
    itemsConfig.value.properties = ''
    
  } catch (error) {
    console.error('Item generation failed:', error)
    alert('Failed to generate items: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}

async function generateLocation() {
  if (!validateConfig(locationConfig.value, ['name'])) return
  
  isGenerating.value = true
  progressMessage.value = 'Building Location'
  progressDetail.value = 'Mapping out the details...'
  
  try {
    const prompt = `Create a detailed Pathfinder 1e location:

**Type:** ${locationConfig.value.type}
**Name:** ${locationConfig.value.name}
**Size:** ${locationConfig.value.size}
**Notable Features:** ${locationConfig.value.features || 'Generate appropriate features'}

Provide:
1. **Overview** - General description and first impressions
2. **History** - How this place came to be
3. **Layout** - Key areas and their purposes
${locationConfig.value.includeMap ? '4. **Map Description** - Detailed layout for GM to sketch' : ''}
5. **Notable Features** - 3-5 interesting locations within
6. **Inhabitants** - Who/what lives here
${locationConfig.value.includeNPCs ? '7. **Key NPCs** - 2-3 important characters with stats' : ''}
8. **Secrets** - Hidden areas, treasures, or plots
9. **Adventure Hooks** - 3 ways to use this location
10. **Atmosphere** - Sights, sounds, smells for description

Make it vivid and ready for immediate use in play.`

    const content = await callOpenAI(prompt, { maxTokens: 1500 })
    
    addGeneratedContent({
      category: 'locations',
      title: locationConfig.value.name,
      content: content,
      tags: [locationConfig.value.type, locationConfig.value.size, 'location']
    })
    
    // Save to session storage for Session Prep
    saveLocationForSessionPrep({
      name: locationConfig.value.name,
      type: locationConfig.value.type,
      size: locationConfig.value.size,
      features: locationConfig.value.features,
      content: content
    })
    
    // Reset form
    locationConfig.value.name = ''
    locationConfig.value.features = ''
    
  } catch (error) {
    console.error('Location generation failed:', error)
    alert('Failed to generate location: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}

async function generateCreature() {
  if (!validateConfig(creatureConfig.value, ['concept'])) return
  
  isGenerating.value = true
  progressMessage.value = 'Creating Creature'
  progressDetail.value = 'Breathing life into your monster...'
  
  try {
    const prompt = `Design a Pathfinder 1e creature:

**Type:** ${creatureConfig.value.type}
**CR:** ${creatureConfig.value.cr}
**Concept:** ${creatureConfig.value.concept}
**Special Abilities:** ${creatureConfig.value.abilities || 'Generate appropriate abilities'}

Create a complete stat block including:
1. **Name and Description** - Appearance and behavior
2. **Full Statistics:**
   - CR, XP value
   - Alignment, Size, Type
   - Init, Senses, Aura
   - AC (touch, flat-footed)
   - HP, HD, Saves
   - Speed, Melee/Ranged attacks
   - Special Attacks
   - Spell-Like Abilities (if any)
   - Ability Scores
   - Skills, Feats
   - Environment, Organization
   - Treasure
3. **Ecology** - Habitat, behavior, diet
4. **Combat Tactics** - How it fights
${creatureConfig.value.includeVariants ? '5. **Variants** - 2-3 variations (young, elite, etc.)' : ''}

Format as a proper Pathfinder stat block.`

    const content = await callOpenAI(prompt)
    
    addGeneratedContent({
      category: 'creatures',
      title: `CR ${creatureConfig.value.cr} ${creatureConfig.value.type}`,
      content: content,
      tags: [creatureConfig.value.type, `CR${creatureConfig.value.cr}`, 'creature'],
      stats: `CR ${creatureConfig.value.cr}`
    })
    
    // Reset form
    creatureConfig.value.concept = ''
    creatureConfig.value.abilities = ''
    
  } catch (error) {
    console.error('Creature generation failed:', error)
    alert('Failed to generate creature: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}

// NEW: Save world data
// Save world data to file (WITHOUT using prompt)
// Fixed saveWorldData function (replace the entire function around line 919)
function saveWorldData() {
  if (generatedContent.value.length === 0) {
    alert('No world content to save yet!')
    return
  }

  try {
    // Use the reactive value, not the ref itself
    const currentWorldName = worldName.value || 'My Campaign World'
    const currentWorldDescription = worldDescription.value || ''
    
    // Create world data object with plain values only
    const worldData = {
      version: '1.0',
      name: currentWorldName,
      description: currentWorldDescription,
      content: generatedContent.value.map(item => ({
        // Create a plain copy of each content item
        id: item.id,
        category: item.category,
        title: item.title,
        content: item.content,
        tags: [...(item.tags || [])], // Copy array
        stats: item.stats,
        timestamp: item.timestamp instanceof Date ? item.timestamp.toISOString() : item.timestamp
      })),
      locations: worldLocations.value.map(loc => ({
        // Create plain copy of locations
        id: loc.id,
        name: loc.name,
        type: loc.type,
        description: loc.description,
        fullContent: loc.fullContent,
        npcs: loc.npcs ? [...loc.npcs] : [],
        features: loc.features ? [...loc.features] : []
      })),
      metadata: {
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        contentCount: totalContentCount.value,
        worldName: currentWorldName,
        categories: {
          'campaign-start': generatedContent.value.filter(c => c.category === 'campaign-start').length,
          lore: generatedContent.value.filter(c => c.category === 'lore').length,
          rules: generatedContent.value.filter(c => c.category === 'rules').length,
          items: generatedContent.value.filter(c => c.category === 'items').length,
          locations: generatedContent.value.filter(c => c.category === 'locations').length,
          creatures: generatedContent.value.filter(c => c.category === 'creatures').length
        },
        statistics: {
          totalItems: generatedContent.value.length,
          estimatedPages: estimatedPages.value,
          characterContext: {
            name: characterState.name || 'Unknown',
            level: characterState.classes?.reduce((sum, c) => sum + (c.level || 0), 0) || 1,
            classes: characterState.classes?.map(c => `${c.className} ${c.level}`).join(', ') || 'Adventurer'
          }
        }
      }
    }
    
    // Save to localStorage for auto-load on next visit
    localStorage.setItem('worldBuildingData', JSON.stringify(worldData))
    
    // Save locations separately (plain data)
    const plainLocations = worldLocations.value.map(loc => ({
      id: loc.id,
      name: loc.name,
      type: loc.type,
      description: loc.description,
      fullContent: loc.fullContent,
      npcs: loc.npcs || [],
      features: loc.features || []
    }))
    localStorage.setItem('worldLocations', JSON.stringify(plainLocations))
    
    // Convert to JSON with formatting
    const jsonData = JSON.stringify(worldData, null, 2)
    
    // Create filename with date
    const date = new Date().toISOString().split('T')[0]
    const safeWorldName = currentWorldName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const filename = `pathfinder-world-${safeWorldName}-${date}.json`
    
    // Download file
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    
    // Show success message
    alert(
      `✅ World saved successfully!\n\n` +
      `File: ${filename}\n` +
      `Items: ${totalContentCount.value}\n` +
      `Pages: ~${estimatedPages.value}\n\n` +
      `Tip: Use the world name field to change the world name.`
    )
    
  } catch (error) {
    console.error('Save failed:', error)
    alert('Failed to save world content. Please try again.')
  }
}
// Auto-save to localStorage only (without downloading file)
function autoSaveWorld() {
  if (generatedContent.value.length === 0) return
  
  try {
    const currentWorldName = worldName.value || 'My Campaign World'
    const currentWorldDescription = worldDescription.value || ''
    
    const worldData = {
      version: '1.0',
      name: currentWorldName,
      description: currentWorldDescription,
      content: generatedContent.value.map(item => ({
        id: item.id,
        category: item.category,
        title: item.title,
        content: item.content,
        tags: [...(item.tags || [])],
        stats: item.stats,
        timestamp: item.timestamp instanceof Date ? item.timestamp.toISOString() : item.timestamp,
        lastModified: item.lastModified instanceof Date ? item.lastModified.toISOString() : item.lastModified
      })),
      metadata: {
        lastAutoSave: new Date().toISOString(),
        contentCount: totalContentCount.value
      }
    }
    
    localStorage.setItem('worldBuildingData', JSON.stringify(worldData))
    
  } catch (error) {
    console.error('Auto-save failed:', error)
  }
}
// NEW: Load world data on mount
function loadWorldFromFile() {
  // Create file input
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    try {
      // Read file
      const text = await file.text()
      const worldData = JSON.parse(text)
      
      // Validate data structure
      if (!worldData.content || !Array.isArray(worldData.content)) {
        throw new Error('Invalid world file format')
      }
      
      // Show preview and confirm
      const itemCount = worldData.content.length
      const worldName = worldData.name || worldData.metadata?.worldName || 'Unknown World'
      const createdDate = worldData.metadata?.createdAt ? 
        new Date(worldData.metadata.createdAt).toLocaleDateString() : 
        'Unknown date'
      
      const categories = worldData.metadata?.categories || {}
      const categoryBreakdown = Object.entries(categories)
        .filter(([_, count]) => count > 0)
        .map(([cat, count]) => `${getCategoryIcon(cat)} ${cat}: ${count}`)
        .join(', ')
      
      const proceed = confirm(
        `Load "${worldName}"?\n\n` +
        `This file contains ${itemCount} world building items.\n` +
        `Created: ${createdDate}\n` +
        `Categories: ${categoryBreakdown || 'Various'}\n\n` +
        `⚠️ This will REPLACE all current world content!`
      )
      
      if (!proceed) return
      
      // Clear current content and load new
      generatedContent.value = worldData.content.map(item => ({
        ...item,
        // Ensure timestamps are Date objects
        timestamp: new Date(item.timestamp)
      }))
      
      // Update world metadata if available
      if (worldData.name) {
  worldName.value = worldData.name  // Update the reactive ref
  sessionStorage.setItem('world-name', worldData.name)
}
if (worldData.description) {
  worldDescription.value = worldData.description  // Update the reactive ref
  sessionStorage.setItem('world-description', worldData.description)
}
      
      // Update locations for session prep
      if (worldData.locations) {
        localStorage.setItem('worldLocations', JSON.stringify(worldData.locations))
      }
      
      // Save to localStorage for persistence
      localStorage.setItem('worldBuildingData', JSON.stringify(worldData))
      
      // Show success message
      alert(
        `✅ World loaded successfully!\n\n` +
        `World: ${worldName}\n` +
        `Items: ${itemCount}\n` +
        `Categories: ${categoryBreakdown || 'Various'}`
      )
      
    } catch (error) {
      console.error('Load failed:', error)
      alert('Failed to load world file. Please check the file format and try again.')
    }
  }
  
  // Trigger file selection
  input.click()
}
function loadWorldData() {
  try {
    const savedData = localStorage.getItem('worldBuildingData')
    if (savedData) {
      const worldData = JSON.parse(savedData)
      
      // Load content
      if (worldData.content && Array.isArray(worldData.content)) {
        generatedContent.value = worldData.content.map(item => ({
          ...item,
          // Ensure timestamps are Date objects
          timestamp: new Date(item.timestamp)
        }))
      }
      
      // Load world metadata
      if (worldData.name) {
        worldName.value = worldData.name
        sessionStorage.setItem('world-name', worldData.name)
      }
      if (worldData.description) {
        worldDescription.value = worldData.description
        sessionStorage.setItem('world-description', worldData.description)
      }
    }
  } catch (error) {
    console.error('Error loading world data:', error)
  }
}
// NEW: Save location for session prep
function saveLocationForSessionPrep(location) {
  let locations = []
  try {
    const saved = sessionStorage.getItem('sessionPrepLocations')
    if (saved) {
      locations = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading locations:', error)
  }
  
  locations.push({
    id: Date.now(),
    ...location,
    createdAt: new Date().toISOString()
  })
  
  sessionStorage.setItem('sessionPrepLocations', JSON.stringify(locations))
}

// NEW: Export to Session Prep
function exportToSessionPrep() {
  const locations = worldLocations.value
  
  if (locations.length === 0) {
    alert('No locations to export. Generate some locations first!')
    return
  }
  
  // Save locations and world data
  sessionStorage.setItem('worldBuildingExport', JSON.stringify({
    locations: locations,
    worldData: {
      name: sessionStorage.getItem('world-name') || 'My Campaign World',
      content: generatedContent.value
    },
    exportedAt: new Date().toISOString()
  }))
  
  // Navigate to Session Prep
  router.push({
    path: '/session-prep',
    query: { worldData: 'loaded' }
  })
}

// NEW: Extract NPCs from content
function extractNPCs(content) {
  const npcPattern = /\*\*([^*]+)\*\*\s*-\s*([^.]+\.)/g
  const npcs = []
  let match
  
  while ((match = npcPattern.exec(content)) !== null) {
    if (match[1].toLowerCase().includes('npc') || content.indexOf(match[0]) > content.indexOf('NPC')) {
      npcs.push({
        name: match[1],
        description: match[2]
      })
    }
  }
  
  return npcs
}

// NEW: Import functions
async function parseImportedContent() {
  if (!importText.value.trim()) return
  
  isParsing.value = true
  
  try {
    // Import the parser
    const { WorldBuildingImportParser } = await import('../../utils/WorldBuildingImportParser.js')
    const parser = new WorldBuildingImportParser()
    
    // Parse the content
    const results = await parser.parseWorldBuildingContent(importText.value)
    
    // Reset parsedResults
    parsedResults.value = {
      locations: [],
      lore: [],
      regions: [],
      worldInfo: [],
      items: [],
      creatures: [],
      rules: [],
      cities: [],
      factions: [],
      npcs: [],
      trade: [],
      wars: [],
      alliances: []
    }
    
    // Process results safely
    if (results.worldInfo) {
      // Comprehensive document
      parsedResults.value.locations = [
        ...(results.cities || []), 
        ...(results.pirateCities || []), 
        ...(results.legendaryLocations || [])
      ]
      parsedResults.value.lore = results.lore || []
      parsedResults.value.regions = results.regions || []
      parsedResults.value.worldInfo = results.worldInfo ? [results.worldInfo] : []
      parsedResults.value.trade = results.trade || []
      parsedResults.value.wars = results.wars || []
      parsedResults.value.alliances = results.alliances || []
    } else {
      // Mixed content - safely merge with defaults
      Object.keys(results).forEach(key => {
        if (parsedResults.value.hasOwnProperty(key) && Array.isArray(results[key])) {
          parsedResults.value[key] = results[key]
        }
      })
    }
    
    // Add selected property to all items
    Object.keys(parsedResults.value).forEach(category => {
      if (Array.isArray(parsedResults.value[category])) {
        parsedResults.value[category].forEach(item => {
          item.selected = true
        })
      }
    })
    
    // Set default category
    const categories = Object.keys(parsedResults.value).filter(cat => 
      parsedResults.value[cat] && parsedResults.value[cat].length > 0
    )
    selectedImportCategory.value = categories[0] || 'locations'
    
    importParsed.value = true
    
  } catch (error) {
    console.error('Parse error:', error)
    alert('Failed to parse content. Please check the format and try again.')
  } finally {
    isParsing.value = false
  }
}
// Update the importSelected method to use enhanced formatting
async function importSelected() {
  isImporting.value = true
  
  try {
    // Get all selected items across categories
    const itemsToImport = []
    
    Object.keys(parsedResults.value).forEach(category => {
      const selectedItems = parsedResults.value[category].filter(item => item.selected)
      
      selectedItems.forEach(item => {
        // Special handling for cities/locations
        if (category === 'locations' || category === 'cities') {
          itemsToImport.push({
            category: 'locations',
            title: item.name,
            content: formatLocationContent(item),
            tags: ['imported', item.type || 'city', item.region || 'unknown'],
            stats: `Pop: ${item.population || 'Unknown'}, Wealth: ${item.wealth || 'Unknown'}`
          })
        }
        // Trade information
        else if (category === 'trade') {
          itemsToImport.push({
            category: 'lore',
            title: `Trade Network: ${item.name}`,
            content: formatTradeContent(item),
            tags: ['imported', 'trade', 'economy']
          })
        }
        // War/Conflict information
        else if (category === 'wars') {
          itemsToImport.push({
            category: 'lore',
            title: `Conflict: ${item.name}`,
            content: formatWarContent(item),
            tags: ['imported', 'conflict', item.status || 'active']
          })
        }
        // Alliance information
        else if (category === 'alliances') {
          itemsToImport.push({
            category: 'lore',
            title: `Alliance: ${item.name}`,
            content: formatAllianceContent(item),
            tags: ['imported', 'alliance', 'diplomacy']
          })
        }
        // Lore items
        else if (category === 'lore') {
          itemsToImport.push({
            category: 'lore',
            title: item.title || item.name || 'Imported Lore',
            content: item.content || formatLoreContent(item),
            tags: ['imported', item.type || 'history']
          })
        }
        // World info
        else if (category === 'worldInfo') {
          itemsToImport.push({
            category: 'lore',
            title: 'World Overview',
            content: formatWorldInfo(item),
            tags: ['imported', 'world-overview', 'campaign-setting']
          })
        }
        // Regions
        else if (category === 'regions') {
          itemsToImport.push({
            category: 'lore',
            title: `Region: ${item.name}`,
            content: formatRegionContent(item),
            tags: ['imported', 'region', 'geography']
          })
        }
        // Other categories
        else {
          itemsToImport.push({
            category: category.slice(0, -1), // Remove plural 's'
            title: item.name || item.title || 'Imported Content',
            content: item.description || item.content || JSON.stringify(item, null, 2),
            tags: ['imported']
          })
        }
      })
    })
    
    // Add all items to generated content
    itemsToImport.forEach(item => {
      addGeneratedContent(item)
    })
    
    // Close modal and reset
    closeImportModal()
    
    // Show success message
    alert(`Successfully imported ${itemsToImport.length} items!`)
    
  } catch (error) {
    console.error('Import error:', error)
    alert('Failed to import content. Please try again.')
  } finally {
    isImporting.value = false
  }
}

// Enhanced location formatting with better structure
function formatLocationContent(location) {
  let content = `<div class="rounded-lg overflow-hidden">`;
  
  // Header section with gradient background
  content += `<div class="bg-gradient-to-r from-gray-800 to-gray-700 p-4">`;
  content += `<div class="flex items-start justify-between">`;
  content += `<div>`;
  content += `<h2 class="text-2xl font-bold text-white flex items-center gap-2">`;
  
  // Icon based on type
  if (location.type === 'pirate-city') content += `<span class="text-red-400">🏴‍☠️</span>`;
  else if (location.isCapital) content += `<span class="text-yellow-400">👑</span>`;
  else if (location.type === 'legendary') content += `<span class="text-purple-400">✨</span>`;
  else content += `<span class="text-blue-400">🏛️</span>`;
  
  content += `${location.name}</h2>`;
  
  // Region subtitle
  if (location.region) {
    content += `<p class="text-gray-300 text-sm mt-1">Region: ${location.region}</p>`;
  }
  content += `</div>`;
  
  // Badges
  content += `<div class="flex gap-2 flex-wrap">`;
  if (location.isCapital) {
    content += `<span class="px-3 py-1 bg-yellow-500 text-yellow-900 rounded-full text-xs font-semibold">Capital</span>`;
  }
  if (location.type === 'pirate-city') {
    content += `<span class="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">Pirate Haven</span>`;
  }
  if (location.type === 'legendary') {
    content += `<span class="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-semibold">Legendary</span>`;
  }
  content += `</div>`;
  content += `</div>`;
  content += `</div>`;
  
  // Stats bar
  content += `<div class="bg-gray-700 px-4 py-3 flex flex-wrap gap-6 text-sm">`;
  
  if (location.population) {
    content += `<div class="flex items-center gap-2">`;
    content += `<span class="text-gray-400">Population:</span>`;
    content += `<span class="text-white font-semibold">${location.population.toLocaleString()}</span>`;
    content += `</div>`;
  }
  
  if (location.wealth) {
    const wealthColors = {
      'Rich': 'text-yellow-400',
      'Poor': 'text-red-400',
      'In-between': 'text-blue-400'
    };
    content += `<div class="flex items-center gap-2">`;
    content += `<span class="text-gray-400">Wealth:</span>`;
    content += `<span class="${wealthColors[location.wealth] || 'text-white'} font-semibold">${location.wealth}</span>`;
    content += `</div>`;
  }
  
  if (location.size) {
    content += `<div class="flex items-center gap-2">`;
    content += `<span class="text-gray-400">Size:</span>`;
    content += `<span class="text-white font-semibold capitalize">${location.size}</span>`;
    content += `</div>`;
  }
  
  content += `</div>`;
  
  // Main content area
  content += `<div class="p-4 space-y-4">`;
  
  // Description
  if (location.description) {
    content += `<div>`;
    content += `<h3 class="text-lg font-semibold text-emerald-400 mb-2">Description</h3>`;
    content += `<p class="text-gray-300">${location.description}</p>`;
    content += `</div>`;
  }
  
  // Traits/Features
  if (location.traits) {
    content += `<div>`;
    content += `<h3 class="text-lg font-semibold text-emerald-400 mb-2">Notable Features</h3>`;
    content += `<p class="text-gray-300">${location.traits}</p>`;
    content += `</div>`;
  } else if (location.features && location.features.length > 0) {
    content += `<div>`;
    content += `<h3 class="text-lg font-semibold text-emerald-400 mb-2">Notable Features</h3>`;
    content += `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">`;
    location.features.forEach(feature => {
      content += `<div class="flex items-start gap-2">`;
      content += `<span class="text-emerald-400 mt-1">•</span>`;
      content += `<span class="text-gray-300">${feature}</span>`;
      content += `</div>`;
    });
    content += `</div>`;
    content += `</div>`;
  }
  
  // Cities within region (if this is a region)
  if (location.cities && location.cities.length > 0) {
    content += `<div>`;
    content += `<h3 class="text-lg font-semibold text-emerald-400 mb-3">Cities in this Region</h3>`;
    content += `<div class="grid grid-cols-1 md:grid-cols-2 gap-3">`;
    
    location.cities.forEach(city => {
      content += `<div class="bg-gray-800 rounded-lg p-3 border border-gray-700">`;
      content += `<div class="flex items-start justify-between mb-2">`;
      content += `<h4 class="font-semibold text-white">${city.name}${city.isCapital ? ' 👑' : ''}</h4>`;
      content += `<span class="text-xs ${city.wealth === 'Rich' ? 'text-yellow-400' : city.wealth === 'Poor' ? 'text-red-400' : 'text-blue-400'}">${city.wealth || 'Unknown'}</span>`;
      content += `</div>`;
      content += `<div class="text-sm text-gray-400 mb-2">Pop: ${city.population?.toLocaleString() || 'Unknown'}</div>`;
      if (city.description) {
        content += `<p class="text-sm text-gray-300">${city.description}</p>`;
      }
      content += `</div>`;
    });
    
    content += `</div>`;
    content += `</div>`;
  }
  
  content += `</div>`; // Close main content area
  content += `</div>`; // Close container
  
  return content;
}

function formatLoreContent(lore) {
  let content = ''
  
  if (lore.timePeriod) content += `**Time Period:** ${lore.timePeriod}\n\n`
  if (lore.type) content += `**Type:** ${lore.type}\n\n`
  
  content += lore.content || lore.description || ''
  
  if (lore.themes && lore.themes.length > 0) {
    content += `\n\n**Themes:** ${lore.themes.join(', ')}`
  }
  
  return content
}

// Enhanced world info formatting
function formatWorldInfo(info) {
  let content = `<div class="rounded-lg overflow-hidden">`;
  
  // Hero section
  content += `<div class="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 text-center">`;
  content += `<h1 class="text-3xl font-bold text-white mb-2">🌍 ${info.name || 'World Overview'}</h1>`;
  content += `<p class="text-indigo-200">Campaign Setting Information</p>`;
  content += `</div>`;
  
  // Stats grid
  content += `<div class="bg-gray-800 p-4">`;
  content += `<div class="grid grid-cols-2 md:grid-cols-4 gap-4">`;
  
  const stats = [
    { label: 'System', value: info.system, icon: '⚔️', color: 'from-red-500 to-orange-500' },
    { label: 'Tone', value: info.tone, icon: '🎭', color: 'from-purple-500 to-pink-500' },
    { label: 'Magic Level', value: info.magicLevel, icon: '✨', color: 'from-blue-500 to-cyan-500' },
    { label: 'Technology', value: info.technology, icon: '⚙️', color: 'from-green-500 to-emerald-500' }
  ];
  
  stats.forEach(stat => {
    if (stat.value) {
      content += `<div class="text-center">`;
      content += `<div class="bg-gradient-to-br ${stat.color} rounded-lg p-3 mb-2">`;
      content += `<span class="text-2xl">${stat.icon}</span>`;
      content += `</div>`;
      content += `<div class="text-xs text-gray-400">${stat.label}</div>`;
      content += `<div class="text-sm font-semibold text-white">${stat.value}</div>`;
      content += `</div>`;
    }
  });
  
  content += `</div>`;
  content += `</div>`;
  
  // Calendar section
  if (info.calendar) {
    content += `<div class="p-4 space-y-4">`;
    content += `<div>`;
    content += `<h3 class="text-lg font-semibold text-emerald-400 mb-3">📅 Calendar System</h3>`;
    content += `<div class="bg-gray-800 rounded-lg p-4">`;
    content += `<div class="grid grid-cols-2 gap-4 mb-4">`;
    content += `<div>`;
    content += `<span class="text-gray-400 text-sm">Calendar Type</span>`;
    content += `<p class="text-white font-semibold">${info.calendar.system || 'Standard'}</p>`;
    content += `</div>`;
    content += `<div>`;
    content += `<span class="text-gray-400 text-sm">Structure</span>`;
    content += `<p class="text-white font-semibold">${info.calendar.months || 12} months, ${info.calendar.days || 365} days</p>`;
    content += `</div>`;
    content += `</div>`;
    
    if (info.calendar.weekDays) {
      content += `<div class="mb-4">`;
      content += `<span class="text-gray-400 text-sm">Days of the Week</span>`;
      content += `<p class="text-white">${info.calendar.weekDays}</p>`;
      content += `</div>`;
    }
    
    if (info.calendar.specialEvents && info.calendar.specialEvents.length > 0) {
      content += `<div>`;
      content += `<h4 class="font-semibold text-yellow-400 mb-2">🎉 Special Events</h4>`;
      content += `<div class="space-y-2">`;
      
      info.calendar.specialEvents.forEach(event => {
        content += `<div class="bg-gray-700 rounded p-3">`;
        content += `<div class="flex justify-between items-start mb-1">`;
        content += `<span class="font-semibold text-white">${event.name}</span>`;
        content += `<span class="text-xs text-blue-400">${event.timing}</span>`;
        content += `</div>`;
        content += `<p class="text-sm text-gray-300">${event.description}</p>`;
        content += `</div>`;
      });
      
      content += `</div>`;
      content += `</div>`;
    }
    
    content += `</div>`;
    content += `</div>`;
    content += `</div>`;
  }
  
  content += `</div>`;
  
  return content;
}

// Enhanced region formatting
function formatRegionContent(region) {
  let content = `<div class="rounded-lg overflow-hidden">`;
  
  // Header
  content += `<div class="bg-gradient-to-r from-green-800 to-emerald-700 p-4">`;
  content += `<h2 class="text-2xl font-bold text-white flex items-center gap-2">`;
  content += `<span>🗺️</span> ${region.name}`;
  content += `</h2>`;
  content += `</div>`;
  
  // Key information
  content += `<div class="bg-gray-800 p-4 space-y-3">`;
  
  const infoFields = [
    { label: 'Location', value: region.location, icon: '📍' },
    { label: 'Government', value: region.government, icon: '🏛️' },
    { label: 'Culture', value: region.culture, icon: '🎭' },
    { label: 'Military', value: region.military, icon: '⚔️' }
  ];
  
  infoFields.forEach(field => {
    if (field.value) {
      content += `<div class="flex items-start gap-3">`;
      content += `<span class="text-xl mt-1">${field.icon}</span>`;
      content += `<div class="flex-1">`;
      content += `<span class="text-gray-400 text-sm">${field.label}</span>`;
      content += `<p class="text-white">${field.value}</p>`;
      content += `</div>`;
      content += `</div>`;
    }
  });
  
  content += `</div>`;
  
  // Description and other sections
  content += `<div class="p-4 space-y-4">`;
  
  if (region.description) {
    content += `<div>`;
    content += `<h3 class="text-lg font-semibold text-emerald-400 mb-2">Overview</h3>`;
    content += `<p class="text-gray-300">${region.description}</p>`;
    content += `</div>`;
  }
  
  // Cities
  if (region.cities && region.cities.length > 0) {
    content += `<div>`;
    content += `<h3 class="text-lg font-semibold text-emerald-400 mb-3">Major Settlements</h3>`;
    content += `<div class="space-y-3">`;
    
    region.cities.forEach(city => {
      content += `<div class="bg-gray-800 rounded-lg p-4 border border-gray-700">`;
      content += `<div class="flex items-start justify-between mb-2">`;
      content += `<h4 class="text-lg font-semibold text-white flex items-center gap-2">`;
      content += city.isCapital ? '👑 ' : '🏛️ ';
      content += city.name;
      content += `</h4>`;
      content += `<div class="text-right">`;
      content += `<div class="text-sm text-gray-400">Population</div>`;
      content += `<div class="font-semibold text-white">${city.population?.toLocaleString() || 'Unknown'}</div>`;
      content += `</div>`;
      content += `</div>`;
      content += `<div class="flex items-center gap-4 text-sm mb-2">`;
      content += `<span class="${city.wealth === 'Rich' ? 'text-yellow-400' : city.wealth === 'Poor' ? 'text-red-400' : 'text-blue-400'}">`;
      content += `💰 ${city.wealth || 'Unknown'} Wealth`;
      content += `</span>`;
      content += `</div>`;
      if (city.description) {
        content += `<p class="text-gray-300 text-sm">${city.description}</p>`;
      }
      content += `</div>`;
    });
    
    content += `</div>`;
    content += `</div>`;
  }
  
  // Conflicts
  if (region.conflicts) {
    content += `<div class="bg-red-900 bg-opacity-20 rounded-lg p-4 border border-red-800">`;
    content += `<h3 class="text-lg font-semibold text-red-400 mb-2">⚔️ Current Conflicts</h3>`;
    content += `<p class="text-gray-300">${region.conflicts}</p>`;
    content += `</div>`;
  }
  
  // Trade
  if (region.trade) {
    content += `<div class="bg-green-900 bg-opacity-20 rounded-lg p-4 border border-green-800">`;
    content += `<h3 class="text-lg font-semibold text-green-400 mb-2">💰 Trade & Economy</h3>`;
    content += `<p class="text-gray-300">${region.trade}</p>`;
    content += `</div>`;
  }
  
  content += `</div>`;
  content += `</div>`;
  
  return content;
}

// Format trade information
function formatTradeContent(trade) {
  let content = `# ${trade.name}\n\n`
  
  if (trade.economicStatus) content += `**Economic Status:** ${trade.economicStatus}\n\n`
  
  if (trade.tradeRoutes && trade.tradeRoutes.length > 0) {
    content += `## Trade Routes\n`
    trade.tradeRoutes.forEach(route => {
      content += `- ${route}\n`
    })
    content += '\n'
  }
  
  if (trade.exports && trade.exports.length > 0) {
    content += `## Exports\n`
    content += trade.exports.join(', ') + '\n\n'
  }
  
  if (trade.imports && trade.imports.length > 0) {
    content += `## Imports\n`
    content += trade.imports.join(', ') + '\n\n'
  }
  
  if (trade.specialties && trade.specialties.length > 0) {
    content += `## Specialties\n`
    trade.specialties.forEach(specialty => {
      content += `- ${specialty}\n`
    })
  }
  
  if (trade.tradePartners && trade.tradePartners.length > 0) {
    content += `\n## Trade Partners\n`
    content += trade.tradePartners.join(', ')
  }
  
  return content
}

// Format war/conflict information
function formatWarContent(war) {
  let content = `# ${war.name}\n\n`
  
  content += `**Type:** ${war.type}\n`
  content += `**Status:** ${war.status}\n`
  
  if (war.parties && war.parties.length > 0) {
    content += `**Belligerents:** ${war.parties.join(' vs ')}\n`
  }
  
  if (war.duration) {
    content += `**Duration:** ${war.duration}\n`
  }
  
  if (war.location) {
    content += `**Location:** ${war.location}\n`
  }
  
  content += `\n## Description\n${war.description || 'No detailed description available.'}\n`
  
  return content
}

// Format alliance information
function formatAllianceContent(alliance) {
  let content = `# ${alliance.name}\n\n`
  
  content += `**Type:** ${alliance.type} alliance\n`
  content += `**Status:** ${alliance.status || 'Active'}\n`
  
  if (alliance.parties && alliance.parties.length > 0) {
    content += `**Parties:** ${alliance.parties.join(' & ')}\n`
  }
  
  if (alliance.purpose) {
    content += `**Purpose:** ${alliance.purpose}\n`
  }
  
  content += `\n## Description\n${alliance.description || 'No detailed description available.'}\n`
  
  if (alliance.terms && alliance.terms.length > 0) {
    content += `\n## Terms\n`
    alliance.terms.forEach(term => {
      content += `- ${term}\n`
    })
  }
  
  return content
}

function closeImportModal() {
  showImportModal.value = false
  importText.value = ''
  importParsed.value = false
  parsedResults.value = {
    locations: [],
    lore: [],
    regions: [],
    worldInfo: [],
    items: [],
    creatures: [],
    rules: [],
    cities: [],
    factions: [],
    npcs: []
  }
}

function loadSampleContent() {
  importText.value = `1. Thalorim Isles
Elun'vyr (Capital): Pop. 42,000 – High elven spires, leyline research, naval command. Major trading port with extensive silk and spice trade. Allied with the Southern Kingdoms. Wealth: Rich
Virelen: Pop. 9,500 – Artisan district, magical glassworks. Exports enchanted glass to mainland cities. Wealth: In-between
Lys'Alae: Pop. 4,200 – Healing sanctum and sacred groves. Currently under siege by rebel forces. Wealth: Rich

Trade Routes:
- Northern Passage: Connects to Dwarven Mountain Holds (gems, ore imports)
- Sunset Route: Links to Western Desert Cities (spice trade)
- Moonlight Way: Secret smuggling route to Free Pirate Cities

Current Conflicts:
- The Virelen Uprising: Active civil war in the artisan quarter
- Border Skirmishes: Ongoing territorial dispute with the Storm Coast settlements

Diplomatic Alliances:
- Treaty of Silver Waves: Military alliance with the Coral Throne Empire
- Merchant's Compact: Trade agreement ensuring safe passage for guild members

2. Storm Coast Region
Port Blackwater: Pop. 18,000 – Pirate haven turned legitimate trading hub. Major naval base. At war with the Crimson Fleet. Wealth: Prosperous
Tidecaller Village: Pop. 890 – Fishing village, storm oracle temple. Neutral in current conflicts. Wealth: Poor

Economic Notes: The region's economy depends on fishing, piracy, and salvage operations. Recent discovery of pearl beds has attracted merchant guilds.

Legendary Sites:
Moon-Drowned Vault (Nessavine Bloom) – Lost Fey Archive warped by lunar anomalies.
Leviathan Hinge (Orekh's Teeth) – Giant kraken skeleton used as bridge between submerged ruins.`
}

function getItemPreview(item, category) {
  if (category === 'locations' || category === 'cities') {
    const details = []
    if (item.population) details.push(`Pop: ${item.population?.toLocaleString() || 'Unknown'}`)
    if (item.wealth) details.push(item.wealth)
    if (item.type) details.push(item.type)
    if (item.hasTradeImportance) details.push('🏪 Trade Hub')
    return details.join(' • ')
  }
  if (category === 'trade') {
    const details = []
    if (item.economicStatus) details.push(item.economicStatus)
    if (item.exports?.length) details.push(`Exports: ${item.exports.slice(0, 3).join(', ')}`)
    if (item.specialties?.length) details.push(`Known for: ${item.specialties[0]}`)
    return details.join(' • ')
  }
  if (category === 'wars') {
    const details = []
    if (item.type) details.push(item.type)
    if (item.parties?.length) details.push(item.parties.join(' vs '))
    if (item.duration) details.push(`Duration: ${item.duration}`)
    return details.join(' • ')
  }
  if (category === 'alliances') {
    const details = []
    if (item.type) details.push(`${item.type} alliance`)
    if (item.purpose) details.push(item.purpose)
    if (item.status) details.push(`Status: ${item.status}`)
    return details.join(' • ')
  }
  if (category === 'lore') {
    return `${item.type || 'History'} • ${item.timePeriod || 'Era unknown'}`
  }
  if (category === 'worldInfo') {
    return `Magic: ${item.magicLevel || 'Unknown'} • Tech: ${item.technology || 'Unknown'}`
  }
  if (category === 'regions') {
    const details = []
    if (item.cities?.length) details.push(`${item.cities.length} cities`)
    if (item.tradeNotes?.length) details.push('Trade hub')
    if (item.conflicts?.length) details.push('⚔️ Active conflicts')
    if (item.alliances?.length) details.push('🤝 Diplomatic ties')
    return details.join(' • ')
  }
  return item.type || 'Imported content'
}

function getSelectedCount() {
  let count = 0
  Object.keys(parsedResults.value).forEach(category => {
    if (Array.isArray(parsedResults.value[category])) {
      count += parsedResults.value[category].filter(item => item.selected).length
    }
  })
  return count
}

// Utility Functions
async function callOpenAI(prompt, options = {}) {
  const apiKey = props.apiKey || localStorage.getItem('openai-api-key')
  if (!apiKey) {
    throw new Error('No OpenAI API key found. Please set it in Settings.')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert Pathfinder 1e content creator. Generate rich, detailed, mechanically sound content that GMs can use immediately in their games. Use proper Pathfinder terminology and formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || 0.8,
      max_tokens: options.maxTokens || 1200
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`API Error: ${error.error?.message || response.statusText}`)
  }

  const data = await response.json()
  
  // Update usage
  emit('usage-updated', {
    tokens: data.usage?.total_tokens || 0,
    cost: calculateCost(data.usage)
  })
  
  return data.choices[0].message.content
}

function calculateCost(usage) {
  if (!usage) return 0
  // GPT-4 Turbo pricing (adjust as needed)
  const inputCost = (usage.prompt_tokens / 1000) * 0.01
  const outputCost = (usage.completion_tokens / 1000) * 0.03
  return inputCost + outputCost
}

function validateConfig(config, requiredFields) {
  for (const field of requiredFields) {
    if (!config[field]?.trim()) {
      alert(`Please fill in the ${field} field`)
      return false
    }
  }
  return true
}

function addGeneratedContent(content) {
  generatedContent.value.unshift({
    ...content,
    id: Date.now(),
    timestamp: new Date()
  })
  
  emit('content-generated', content)
}

// Enhanced formatContent method that detects content type and applies appropriate formatting
function formatContent(content) {
  // Check if content has HTML formatting already
  if (content.content && content.content.includes('<div class="')) {
    return content.content;
  }
  
  // Apply basic markdown-like formatting
  let formatted = content.content || content;
  
  // Headers
  formatted = formatted.replace(/^### (.*)$/gm, '<h4 class="text-base font-semibold text-emerald-300 mt-3 mb-2">$1</h4>');
  formatted = formatted.replace(/^## (.*)$/gm, '<h3 class="text-lg font-semibold text-emerald-400 mt-4 mb-2">$1</h3>');
  formatted = formatted.replace(/^# (.*)$/gm, '<h2 class="text-xl font-bold text-emerald-500 mt-4 mb-3">$1</h2>');
  
  // Bold and italic
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="text-gray-300">$1</em>');
  
  // Lists
  formatted = formatted.replace(/^- (.*)$/gm, '<li class="ml-4 mb-1">• $1</li>');
  formatted = formatted.replace(/^(\d+)\. (.*)$/gm, '<li class="ml-4 mb-1">$1. $2</li>');
  
  // Wrap lists
  formatted = formatted.replace(/(<li.*<\/li>\n?)+/g, '<ul class="my-2">$&</ul>');
  
  // Paragraphs
  formatted = formatted.replace(/\n\n/g, '</p><p class="mb-3 text-gray-300">');
  formatted = formatted.replace(/\n/g, '<br>');
  
  // Wrap in paragraph if not already
  if (!formatted.startsWith('<')) {
    formatted = `<p class="mb-3 text-gray-300">${formatted}</p>`;
  }
  
  return formatted;
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

function getCategoryIcon(category) {
  const icons = {
    'campaign-start': '🎭',
    lore: '📚',
    rules: '⚖️',
    items: '⚔️',
    locations: '🏰',
    creatures: '🐉',
    worldInfo: '🌍',
    regions: '🗺️',
    cities: '🏛️',
    trade: '💰',
    wars: '⚔️',
    alliances: '🤝',
    factions: '🏛️',
    npcs: '👥'
  }
  return icons[category] || '📄'
}

function getCategoryColor(category) {
  const colors = {
    'campaign-start': 'text-amber-400',
    lore: 'text-emerald-400',
    rules: 'text-blue-400',
    items: 'text-purple-400',
    locations: 'text-yellow-400',
    creatures: 'text-red-400',
    worldInfo: 'text-cyan-400',
    regions: 'text-orange-400',
    cities: 'text-yellow-400',
    trade: 'text-amber-400',
    wars: 'text-red-500',
    alliances: 'text-blue-500',
    factions: 'text-indigo-400',
    npcs: 'text-green-400'
  }
  return colors[category] || 'text-gray-400'
}

async function copyContent(content) {
  try {
    const text = `# ${content.title}\n\n${content.content}\n\n---\nGenerated for Pathfinder 1e`
    
    // Send to ChatGPT instead of clipboard
    const success = await chatGPTService.sendToChatGPT(text, {
      autoSubmit: false,
      showNotification: true
    })
    
    if (!success) {
      alert('Failed to send to ChatGPT. Make sure ChatGPT tab is loaded.')
    }
  } catch (error) {
    console.error('Failed to send to ChatGPT:', error)
    alert('Failed to send content to ChatGPT')
  }
}

function exportToChatGPT(content) {
  // Show export options modal
  showExportModal(content)
}

// NEW: Show export options modal
function showExportModal(content) {
  const modal = {
    show: true,
    content: content,
    options: {
      requestType: 'enhance',
      includeFullContext: true,
      continueConversation: true
    }
  }
  
  // For now, use default options and export
  // In future, could show a modal for user to choose options
  performChatGPTExport(content, modal.options)
}

// NEW: Perform the actual export with enhanced options
async function performChatGPTExport(content, options) {
  try {
    // Import the enhanced exporter
    const { EnhancedChatGPTExport } = await import('../../utils/EnhancedChatGPTExport.js')
    const exporter = new EnhancedChatGPTExport()
    
    // Update session context with current character/campaign info
    exporter.saveSessionContext({
      character: {
        name: characterState.name,
        level: characterState.classes?.reduce((sum, c) => sum + (c.level || 0), 0) || 1,
        classes: characterState.classes?.map(c => `${c.className} ${c.level}`).join(', ') || 'Adventurer'
      },
      campaign: {
        currentLocation: sessionStorage.getItem('current-location') || '',
        tone: sessionStorage.getItem('campaign-tone') || 'Epic Fantasy'
      }
    })
    
    // Track this world element
    exporter.addWorldElement(content)
    
    // Generate the export text
    const exportText = exporter.exportWorldBuildingContent(content, options)
    
    // Send to ChatGPT directly
    const success = await chatGPTService.sendToChatGPT(exportText, {
      autoSubmit: false,
      showNotification: true
    })
    
    if (!success) {
      alert('Failed to send to ChatGPT. Make sure ChatGPT tab is loaded.')
    }
    
  } catch (error) {
    console.error('Export failed:', error)
    alert('Failed to send to ChatGPT. Please try again.')
  }
}

// Open edit modal
function editContent(content) {
  const index = generatedContent.value.findIndex(item => item.id === content.id)
  if (index === -1) return
  
  editingContent.value = content
  editingIndex.value = index
  
  // Populate edit form
  editForm.value = {
    title: content.title,
    content: content.content,
    tags: content.tags ? content.tags.join(', ') : '',
    stats: content.stats || '',
    lastModified: content.lastModified || null
  }
  
  showEditModal.value = true
}

// Save edited content
function saveEdit() {
  if (editingIndex.value === -1) return
  
  // Update the content
  const updatedContent = {
    ...generatedContent.value[editingIndex.value],
    title: editForm.value.title,
    content: editForm.value.content,
    tags: editForm.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    stats: editForm.value.stats,
    lastModified: new Date()
  }
  
  // Update in the array
  generatedContent.value[editingIndex.value] = updatedContent
  
  // Save to localStorage
  autoSaveWorld()
  
  // Close modal
  showEditModal.value = false
  editingContent.value = null
  editingIndex.value = -1
  
  alert('Content updated successfully!')
}

// Cancel editing
function cancelEdit() {
  showEditModal.value = false
  editingContent.value = null
  editingIndex.value = -1
  editForm.value = {
    title: '',
    content: '',
    tags: '',
    stats: '',
    lastModified: null
  }
}
// Regenerate content with AI
async function regenerateContent() {
  if (!editingContent.value) return
  
  const confirmRegen = confirm(
    'This will use AI to regenerate this content based on the original parameters.\n\n' +
    'Current edits will be lost. Continue?'
  )
  
  if (!confirmRegen) return
  
  isGenerating.value = true
  progressMessage.value = 'Regenerating Content'
  progressDetail.value = 'Creating new version...'
  
  try {
    let prompt = ''
    const category = editingContent.value.category
    
    // Build prompt based on category
    switch (category) {
      case 'campaign-start':
        prompt = `Regenerate this Pathfinder 1e campaign opening with a fresh perspective:
        
Title: ${editingContent.value.title}
Previous version for context (create something new, don't copy):
${editingContent.value.content.substring(0, 500)}...

Create an entirely new campaign opening that:
1. Maintains the same starting location and situation
2. Provides a different atmospheric approach
3. Uses different descriptive details
4. Creates a fresh scene setup

Remember to ONLY include Campaign Opening and The Scene sections, no adventure hooks or NPCs.`
        break
        
      case 'lore':
        prompt = `Regenerate this Pathfinder 1e lore with a fresh perspective:
        
Title: ${editingContent.value.title}
Previous version for context (create something new, don't copy):
${editingContent.value.content.substring(0, 500)}...

Create entirely new content that:
1. Maintains the same subject and scope
2. Provides different details and perspectives
3. Includes new plot hooks and secrets
4. Remains consistent with Pathfinder 1e

Make it fresh and exciting while covering the same topic.`
        break
        
      case 'locations':
        prompt = `Regenerate this Pathfinder 1e location with new details:
        
Location Name: ${editingContent.value.title}
Previous version summary (create something new):
${editingContent.value.content.substring(0, 500)}...

Create an entirely new version that:
1. Keeps the same location name and basic type
2. Provides different history and features
3. Includes new NPCs and secrets
4. Offers fresh adventure hooks

Make it feel like a completely different take on the same place.`
        break
        
      case 'items':
        prompt = `Regenerate this Pathfinder 1e item collection with new items:
        
Item Type: ${editingContent.value.title}
Previous items (create different ones):
${editingContent.value.content.substring(0, 500)}...

Create entirely new items that:
1. Match the same rarity and type
2. Have different abilities and lore
3. Include unique mechanics
4. Remain balanced for Pathfinder 1e

No duplicates from the previous version.`
        break
        
      case 'creatures':
        prompt = `Regenerate this Pathfinder 1e creature with a new design:
        
Creature Type: ${editingContent.value.title}
Previous version (create something different):
${editingContent.value.content.substring(0, 500)}...

Create an entirely new creature that:
1. Maintains the same CR and type
2. Has different abilities and tactics
3. Features new lore and ecology
4. Uses different mechanics

Make it a fresh take on the concept.`
        break
        
      case 'rules':
        prompt = `Regenerate this Pathfinder 1e custom rule with a new approach:
        
Rule Name: ${editingContent.value.title}
Previous version (create a different solution):
${editingContent.value.content.substring(0, 500)}...

Create an entirely new rule that:
1. Addresses the same game issue
2. Uses different mechanics
3. Provides alternative balance points
4. Includes new examples

Approach the problem from a different angle.`
        break
        
      default:
        prompt = `Regenerate this content with a fresh perspective:
${editingContent.value.title}
Create new content that maintains the theme but provides entirely different details.`
    }
    
    const content = await callOpenAI(prompt)
    
    // Update the edit form with new content
    editForm.value.content = content
    editForm.value.lastModified = new Date()
    
    progressMessage.value = ''
    progressDetail.value = ''
    
  } catch (error) {
    console.error('Regeneration failed:', error)
    alert('Failed to regenerate content: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}
// Enhance content with AI
async function enhanceWithAI() {
  const action = confirm(
    'AI will enhance your content by:\n\n' +
    '• Adding more vivid descriptions\n' +
    '• Improving narrative flow\n' +
    '• Adding Pathfinder-specific details\n' +
    '• Maintaining your core content\n\n' +
    'Continue?'
  )
  
  if (!action) return
  
  isGenerating.value = true
  progressMessage.value = 'Enhancing Content'
  progressDetail.value = 'Adding depth and detail...'
  
  try {
    const prompt = `Enhance this Pathfinder 1e content while maintaining its core information:

Title: ${editForm.value.title}
Category: ${editingContent.value.category}
Current Content:
${editForm.value.content}

Enhancement Guidelines:
1. Keep all existing information intact
2. Add more vivid descriptions and sensory details
3. Expand on mechanics with Pathfinder-specific rules
4. Add atmospheric details and narrative hooks
5. Improve the flow and readability
6. Add any missing standard elements for this content type

Return the enhanced version while preserving the original structure and intent.`

    const enhanced = await callOpenAI(prompt)
    editForm.value.content = enhanced
    editForm.value.lastModified = new Date()
    
  } catch (error) {
    console.error('Enhancement failed:', error)
    alert('Failed to enhance content: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}

// Add a new section to content
function addSection() {
  const sectionTemplates = {
    'campaign-start': '\n\n## Additional Scene Details\n\nAdd your content here...',
    lore: '\n\n## New Section\n\nAdd your content here...',
    locations: '\n\n## Additional Area\n\n**Description:** \n\n**Notable Features:**\n- \n- ',
    items: '\n\n---\n\n**Item Name**\n\n*Description:* \n\n*Mechanics:* \n\n*Value:* gp',
    creatures: '\n\n**Special Ability Name**\n\n*Description:* \n\n*Mechanics:* ',
    rules: '\n\n### Additional Rule Component\n\n**Mechanic:** \n\n**Example:** '
  }
  
  const template = sectionTemplates[editingContent.value?.category] || '\n\n## New Section\n\nAdd content here...'
  
  // Insert at cursor position if possible
  const textarea = document.querySelector('textarea')
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = editForm.value.content
    editForm.value.content = text.substring(0, start) + template + text.substring(end)
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.selectionStart = start + template.length
      textarea.selectionEnd = start + template.length
      textarea.focus()
    }, 0)
  } else {
    editForm.value.content += template
  }
}

// Format content as stat block (for creatures)
function formatAsStatBlock() {
  const template = `**${editForm.value.title}**
CR ${editingContent.value.stats || '1'} • XP ${getCRExperience(editingContent.value.stats)}

**Alignment** Size Type
**Init** +0; **Senses** Perception +0

**DEFENSE**
**AC** 10, touch 10, flat-footed 10
**hp** 0 (0d0)
**Fort** +0, **Ref** +0, **Will** +0

**OFFENSE**
**Speed** 30 ft.
**Melee** attack +0 (damage)
**Ranged** attack +0 (damage)
**Special Attacks** 

**STATISTICS**
**Str** 10, **Dex** 10, **Con** 10, **Int** 10, **Wis** 10, **Cha** 10
**Base Atk** +0; **CMB** +0; **CMD** 10
**Feats** 
**Skills** 
**Languages** 

**SPECIAL ABILITIES**
**Ability Name (Ex/Su/Sp)** Description

**ECOLOGY**
**Environment** 
**Organization** 
**Treasure** `

  editForm.value.content = template + '\n\n' + editForm.value.content
}

// Get CR experience value
function getCRExperience(cr) {
  const crXP = {
    '0.125': 50, '0.25': 100, '0.5': 200, '1': 400, '2': 600,
    '3': 800, '4': 1200, '5': 1600, '6': 2400, '7': 3200,
    '8': 4800, '9': 6400, '10': 9600, '11': 12800, '12': 19200,
    '13': 25600, '14': 38400, '15': 51200, '16': 76800, '17': 102400,
    '18': 153600, '19': 204800, '20': 307200
  }
  return crXP[cr] || 400
}

// Handle tab key in textarea
function handleTab(event) {
  const textarea = event.target
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  
  // Insert tab character
  editForm.value.content = text.substring(0, start) + '\t' + text.substring(end)
  
  // Move cursor
  setTimeout(() => {
    textarea.selectionStart = start + 1
    textarea.selectionEnd = start + 1
  }, 0)
}

// Add tag on enter (completing the cut-off function)
function addTag(event) {
  const input = event.target.value.trim()
  if (input && !editForm.value.tags.includes(input)) {
    editForm.value.tags = editForm.value.tags 
      ? `${editForm.value.tags}, ${input}`
      : input
    event.target.value = ''
  }
}

// Remove tag from edit form
function removeTag(tagToRemove) {
  const tags = editForm.value.tags.split(',').map(t => t.trim()).filter(t => t && t !== tagToRemove)
  editForm.value.tags = tags.join(', ')
}

// Handle keyboard shortcuts in edit modal
function handleEditKeyboard(event) {
  // Ctrl/Cmd + S to save
  if ((event.ctrlKey || event.metaKey) && event.key === 's' && showEditModal.value) {
    event.preventDefault()
    saveEdit()
  }
  
  // Escape to close
  if (event.key === 'Escape') {
    if (showEditModal.value) {
      cancelEdit()
    } else if (showImportModal.value) {
      closeImportModal()
    }
  }
}

// Update world name
function updateWorldName() {
  sessionStorage.setItem('world-name', worldName.value)
  autoSaveWorld()
}

// Update world description
function updateWorldDescription() {
  sessionStorage.setItem('world-description', worldDescription.value)
  autoSaveWorld()
}

// Remove content item
function removeContent(index) {
  const item = generatedContent.value[index]
  const confirmDelete = confirm(
    `Delete "${item.title}"?\n\n` +
    `Category: ${item.category}\n` +
    `This action cannot be undone.`
  )
  
  if (confirmDelete) {
    generatedContent.value.splice(index, 1)
    autoSaveWorld()
  }
}

// Clear all content
function clearAllContent() {
  if (generatedContent.value.length === 0) return
  
  const confirmClear = confirm(
    '⚠️ Clear ALL world building content?\n\n' +
    `This will permanently delete ${totalContentCount.value} items.\n` +
    'This action cannot be undone!\n\n' +
    'Tip: Save your world first if you want to keep a backup.'
  )
  
  if (confirmClear) {
    const doubleCheck = confirm(
      'Are you REALLY sure?\n\n' +
      'All locations, lore, creatures, items, and rules will be deleted.'
    )
    
    if (doubleCheck) {
      generatedContent.value = []
      localStorage.removeItem('worldBuildingData')
      localStorage.removeItem('worldLocations')
      alert('All world content has been cleared.')
    }
  }
}

// Export all content in various formats
async function exportAll(format) {
  if (generatedContent.value.length === 0) {
    alert('No content to export!')
    return
  }
  
  let exportData = ''
  const worldTitle = worldName.value || 'My Campaign World'
  const date = new Date().toLocaleDateString()
  
  if (format === 'markdown') {
    // Create markdown document
    exportData = `# ${worldTitle}\n\n`
    exportData += `*Generated on ${date} for Pathfinder 1e*\n\n`
    
    if (worldDescription.value) {
      exportData += `## World Description\n\n${worldDescription.value}\n\n`
    }
    
    exportData += `## Table of Contents\n\n`
    
    // Group by category
    const categories = {}
    generatedContent.value.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = []
      }
      categories[item.category].push(item)
    })
    
    // Add TOC
    Object.keys(categories).forEach(cat => {
      const catName = cat.charAt(0).toUpperCase() + cat.slice(1)
      exportData += `- **${catName}** (${categories[cat].length} items)\n`
    })
    
    exportData += '\n---\n\n'
    
    // Add content by category
    Object.keys(categories).forEach(cat => {
      const catName = cat.charAt(0).toUpperCase() + cat.slice(1)
      exportData += `# ${getCategoryIcon(cat)} ${catName}\n\n`
      
      categories[cat].forEach(item => {
        exportData += `## ${item.title}\n\n`
        
        if (item.tags && item.tags.length > 0) {
          exportData += `*Tags: ${item.tags.join(', ')}*\n\n`
        }
        
        if (item.stats) {
          exportData += `**${item.stats}**\n\n`
        }
        
        // Convert HTML formatting back to markdown
        let content = item.content
        content = content.replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1')
        content = content.replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1')
        content = content.replace(/<h4[^>]*>(.*?)<\/h4>/g, '#### $1')
        content = content.replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**')
        content = content.replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*')
        content = content.replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n\n')
        content = content.replace(/<br\s*\/?>/g, '\n')
        content = content.replace(/<[^>]+>/g, '') // Remove remaining HTML
        
        exportData += content + '\n\n---\n\n'
      })
    })
    
    // Save as markdown file
    const blob = new Blob([exportData], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${worldTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-worldbuilding.md`
    a.click()
    URL.revokeObjectURL(url)
    
  } else if (format === 'json') {
    // Export as structured JSON
    const jsonExport = {
      version: '1.0',
      worldName: worldTitle,
      worldDescription: worldDescription.value,
      exportDate: new Date().toISOString(),
      metadata: {
        totalItems: totalContentCount.value,
        estimatedPages: estimatedPages.value,
        categories: {}
      },
      content: {}
    }
    
    // Organize by category
    generatedContent.value.forEach(item => {
      if (!jsonExport.content[item.category]) {
        jsonExport.content[item.category] = []
        jsonExport.metadata.categories[item.category] = 0
      }
      
      jsonExport.content[item.category].push({
        id: item.id,
        title: item.title,
        content: item.content,
        tags: item.tags,
        stats: item.stats,
        timestamp: item.timestamp,
        lastModified: item.lastModified
      })
      
      jsonExport.metadata.categories[item.category]++
    })
    
    // Save as JSON file
    const blob = new Blob([JSON.stringify(jsonExport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${worldTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-worldbuilding.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  alert(`✅ Exported ${totalContentCount.value} items as ${format.toUpperCase()}`)
}

// Generate comprehensive campaign guide
async function exportCampaignGuide() {
  if (generatedContent.value.length < 5) {
    alert('Please generate more content before creating a campaign guide.\n\nRecommended: At least 5-10 pieces of world content.')
    return
  }
  
  isGenerating.value = true
  progressMessage.value = 'Creating Campaign Guide'
  progressDetail.value = 'Organizing your world into a comprehensive document...'
  
  try {
    // Prepare world summary
    const categories = {}
    generatedContent.value.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = []
      }
      categories[item.category].push({
        title: item.title,
        summary: item.content.substring(0, 200) + '...'
      })
    })
    
    const prompt = `Create a comprehensive Pathfinder 1e Campaign Guide document outline based on this world content:

World Name: ${worldName.value || 'My Campaign World'}
Description: ${worldDescription.value || 'A rich fantasy world'}

Content Summary:
${Object.entries(categories).map(([cat, items]) => 
  `${cat}: ${items.length} items - ${items.slice(0, 3).map(i => i.title).join(', ')}${items.length > 3 ? ', and more...' : ''}`
).join('\n')}

Create a professional campaign guide outline that includes:

1. **Campaign Guide Cover Page**
   - World name and tagline
   - Brief overview paragraph
   - Content highlights

2. **Table of Contents**
   - Organized by logical sections
   - Page number placeholders

3. **Introduction**
   - Welcome to the world
   - How to use this guide
   - Campaign themes and tone

4. **World Overview**
   - Geography and regions
   - Political landscape
   - Magic and technology level
   - Major conflicts and tensions

5. **Chapter Outlines** (3-5 chapters based on the content)
   - Each chapter should organize related content
   - Include suggested reading order
   - Cross-references between sections

6. **Appendices Suggestions**
   - Quick reference sheets needed
   - Campaign starter ideas
   - NPC name generators topics

7. **GM Resources**
   - Session zero topics
   - Campaign arc suggestions
   - Potential plot hooks

Make this a practical outline that a GM could use to organize all their world content into a cohesive campaign guide.`

    const guideOutline = await callOpenAI(prompt, { maxTokens: 1500 })
    
    // Create the campaign guide document
    let campaignGuide = `# ${worldName.value || 'My Campaign World'} - Campaign Guide\n\n`
    campaignGuide += `*A comprehensive guide for Game Masters*\n\n`
    campaignGuide += `---\n\n`
    campaignGuide += guideOutline
    campaignGuide += `\n\n---\n\n# World Content\n\n`
    
    // Add all world content organized by the AI's suggested structure
    const sortedContent = [...generatedContent.value].sort((a, b) => {
      const categoryOrder = ['campaign-start', 'lore', 'locations', 'rules', 'creatures', 'items']
      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    })
    
    let currentCategory = ''
    sortedContent.forEach(item => {
      if (item.category !== currentCategory) {
        currentCategory = item.category
        campaignGuide += `\n## ${getCategoryIcon(item.category)} ${item.category.charAt(0).toUpperCase() + item.category.slice(1)}\n\n`
      }
      
      campaignGuide += `### ${item.title}\n\n`
      
      // Clean content for markdown
      let content = item.content
      content = content.replace(/<[^>]+>/g, '') // Remove HTML tags
      content = content.replace(/\*\*(.*?)\*\*/g, '**$1**') // Preserve bold
      
      campaignGuide += content + '\n\n'
    })
    
    // Save the guide
    const blob = new Blob([campaignGuide], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${worldName.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-campaign-guide.md`
    a.click()
    URL.revokeObjectURL(url)
    
    alert('✅ Campaign Guide created successfully!\n\nThe guide includes an AI-generated outline to help organize your content.')
    
  } catch (error) {
    console.error('Campaign guide generation failed:', error)
    alert('Failed to generate campaign guide: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}

// Export entire world to ChatGPT
async function exportToChatGPTSession() {
  if (generatedContent.value.length === 0) {
    alert('No world content to export!')
    return
  }
  
  try {
    const { EnhancedChatGPTExport } = await import('../../utils/EnhancedChatGPTExport.js')
    const exporter = new EnhancedChatGPTExport()
    
    // Create a comprehensive world summary
    const worldSummary = {
      worldName: worldName.value || 'My Campaign World',
      worldDescription: worldDescription.value || '',
      contentSummary: {},
      totalItems: totalContentCount.value,
      categories: []
    }
    
    // Organize content by category
    const categoryMap = {}
    generatedContent.value.forEach(item => {
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = []
      }
      categoryMap[item.category].push(item)
    })
    
    // Build summary
    Object.entries(categoryMap).forEach(([category, items]) => {
      worldSummary.categories.push({
        name: category,
        count: items.length,
        highlights: items.slice(0, 3).map(i => i.title)
      })
      worldSummary.contentSummary[category] = items.length
    })
    
    // Generate export text
    let exportText = `# 🌍 Pathfinder 1e World Building Session

## World: ${worldSummary.worldName}

${worldSummary.worldDescription || 'A rich and detailed campaign world.'}

### Content Overview:
- Total Items: ${worldSummary.totalItems}
- Categories: ${worldSummary.categories.map(c => `${getCategoryIcon(c.name)} ${c.name} (${c.count})`).join(', ')}

### Available Locations:
${worldLocations.value.slice(0, 10).map(loc => `- ${loc.name} (${loc.type})`).join('\n')}
${worldLocations.value.length > 10 ? `\n...and ${worldLocations.value.length - 10} more locations` : ''}

### Request Examples:
- "Tell me about [location name]"
- "What creatures might be found in [region]?"
- "Describe the lore of [subject]"
- "How does [custom rule] work?"
- "Create an adventure hook involving [location/item/NPC]"

### World-Specific Context:
This world contains ${totalContentCount.value} carefully crafted elements. Each location has NPCs, plot hooks, and connections to the greater world. The lore is interconnected and ready for adventure.

---

I'm ready to help you explore and expand this world. What would you like to know about or work on?`

    // Send to ChatGPT directly
    const success = await chatGPTService.sendToChatGPT(exportText, {
      autoSubmit: false,
      showNotification: true
    })
    
    if (success) {
      // Show custom success message
      chatGPTService.showNotification(`✅ World with ${totalContentCount.value} elements sent to ChatGPT!`)
    } else {
      alert('Failed to send to ChatGPT. Make sure ChatGPT tab is loaded.')
    }
    
  } catch (error) {
    console.error('Export failed:', error)
    alert('Failed to send to ChatGPT: ' + error.message)
  }
}
// Get random tips for loading screen
function getRandomTip() {
  const tips = [
    'Tip: Use tags to organize your content for easy searching',
    'Tip: Generated locations are automatically available in Session Prep',
    'Tip: Export your world regularly to create backups',
    'Tip: Click the edit button to refine any generated content',
    'Tip: Campaign openings set the tone for your entire adventure',
    'Tip: Link creatures to specific locations for coherent encounters',
    'Tip: Custom rules can make your world feel unique',
    'Tip: Use the import feature to add content from other sources',
    'Tip: Items with curses or quirks create memorable moments',
    'Tip: Every location should have at least one secret'
  ]
  
  return tips[Math.floor(Math.random() * tips.length)]
}

// Auto-save periodically
setInterval(() => {
  if (generatedContent.value.length > 0) {
    autoSaveWorld()
  }
}, 60000) // Auto-save every minute

// Clean up on unmount
onUnmounted(() => {
  // Save current state
  autoSaveWorld()
})
</script>