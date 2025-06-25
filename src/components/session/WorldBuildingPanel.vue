<template>
  <div class="world-building-panel h-full flex flex-col bg-gray-900 text-white">
    <!-- Header -->
    <div class="bg-gray-800 p-4 border-b border-gray-700">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold text-emerald-400 mb-1">🌍 World Building Workshop</h2>
          <p class="text-sm text-gray-400">Create custom content, rules, and lore for your campaign</p>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="showImportModal = true"
            class="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded text-sm font-semibold"
          >
            📥 Import Content
          </button>
          <div class="text-xs text-gray-400 text-right">
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
      <div class="flex-1 p-4 overflow-y-auto">
        <div v-if="generatedContent.length === 0" class="text-center text-gray-500 py-12">
          <div class="text-6xl mb-4">🌍</div>
          <h3 class="text-xl mb-2">Ready to Build Your World</h3>
          <p class="text-sm">Choose a category and configure your content generation</p>
        </div>

        <div v-else class="space-y-4">
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
                  class="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs"
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  @click="copyContent(content)"
                  class="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-xs"
                  title="Copy"
                >
                  📋
                </button>
                <button 
                  @click="exportToChatGPT(content)"
                  class="bg-purple-600 hover:bg-purple-500 px-2 py-1 rounded text-xs"
                  title="Send to ChatGPT"
                >
                  🌐
                </button>
                <button 
                  @click="removeContent(index)"
                  class="bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-xs"
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

        <!-- Export Options -->
        <div v-if="generatedContent.length > 0" class="mt-8 p-4 bg-gray-800 rounded">
          <h4 class="font-semibold mb-3">📤 Export Options</h4>
          <div class="grid grid-cols-2 gap-3">
            <button 
              @click="exportAll('markdown')"
              class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm"
            >
              📝 Export as Markdown
            </button>
            <button 
              @click="exportAll('json')"
              class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm"
            >
              📊 Export as JSON
            </button>
            <button 
              @click="exportCampaignGuide()"
              class="bg-emerald-600 hover:bg-emerald-500 px-3 py-2 rounded text-sm col-span-2"
            >
              📚 Generate Campaign Guide
            </button>
            <button 
              @click="exportToChatGPTSession()"
              class="bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded text-sm col-span-2"
            >
              🌐 Export Session to ChatGPT
            </button>
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
            <div class="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              <div v-for="(items, category) in parsedResults" :key="category" v-if="items.length > 0">
                <span :class="getCategoryColor(category)">{{ getCategoryIcon(category) }} {{ category }}:</span>
                <span class="text-white font-semibold">{{ items.length }}</span>
              </div>
            </div>
          </div>
          
          <!-- Category Tabs -->
          <div class="flex gap-2 mb-4 overflow-x-auto">
            <button 
              v-for="(items, category) in parsedResults" 
              :key="category"
              v-if="items.length > 0"
              @click="selectedImportCategory = category"
              :class="[
                'px-3 py-1 rounded text-sm whitespace-nowrap',
                selectedImportCategory === category 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600'
              ]"
            >
              {{ getCategoryIcon(category) }} {{ category }} ({{ items.length }})
            </button>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { characterState } from '../../characterState.js'

// Props
const props = defineProps({
  apiKey: String
})

// Emit
const emit = defineEmits(['content-generated', 'usage-updated'])

// State
const currentCategory = ref('lore')
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
const parsedResults = ref({})
const selectedImportCategory = ref('locations')

// Content Categories
const contentCategories = [
  { id: 'lore', name: 'Lore & History', icon: '📚' },
  { id: 'rules', name: 'Custom Rules', icon: '⚖️' },
  { id: 'items', name: 'Items & Equipment', icon: '⚔️' },
  { id: 'locations', name: 'Locations', icon: '🏰' },
  { id: 'creatures', name: 'Creatures', icon: '🐉' }
]

// Configuration States
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

// Methods
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
    
    // Process results
    if (results.worldInfo) {
      // Comprehensive document
      parsedResults.value = {
        locations: [...(results.cities || []), ...(results.pirateCities || []), ...(results.legendaryLocations || [])],
        lore: results.lore || [],
        regions: results.regions || [],
        worldInfo: results.worldInfo ? [results.worldInfo] : []
      }
    } else {
      // Mixed content
      parsedResults.value = results
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
      parsedResults.value[cat].length > 0
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

function formatLocationContent(location) {
  let content = `# ${location.name}\n\n`
  
  if (location.isCapital) content += `**Status:** Capital City\n`
  if (location.region) content += `**Region:** ${location.region}\n`
  if (location.population) content += `**Population:** ${location.population.toLocaleString()}\n`
  if (location.wealth) content += `**Wealth Level:** ${location.wealth}\n`
  
  content += `\n## Description\n${location.description || 'No description available.'}\n`
  
  if (location.traits) {
    content += `\n## Notable Features\n${location.traits}\n`
  }
  
  if (location.features && location.features.length > 0) {
    content += `\n## Features\n`
    location.features.forEach(feature => {
      content += `- ${feature}\n`
    })
  }
  
  return content
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

function formatWorldInfo(info) {
  return `# World Overview

**System:** ${info.system || 'Pathfinder 1e'}
**Tone:** ${info.tone || 'Not specified'}
**Magic Level:** ${info.magicLevel || 'Medium'}
**Technology:** ${info.technology || 'Medieval Fantasy'}

## Calendar System
${info.calendar.system || 'Standard'} Calendar
- Months: ${info.calendar.months || 12}

${info.calendar.specialEvents && info.calendar.specialEvents.length > 0 ? 
  '## Special Events\n' + info.calendar.specialEvents.map(event => 
    `- **${event.name}** (${event.timing}): ${event.description}`
  ).join('\n') : ''}`
}

function formatRegionContent(region) {
  let content = `# ${region.name}\n\n`
  
  if (region.description) content += `${region.description}\n\n`
  
  if (region.cities && region.cities.length > 0) {
    content += `## Major Settlements\n\n`
    region.cities.forEach(city => {
      content += `### ${city.name}${city.isCapital ? ' (Capital)' : ''}\n`
      content += `- Population: ${city.population?.toLocaleString() || 'Unknown'}\n`
      content += `- Wealth: ${city.wealth || 'Unknown'}\n`
      if (city.description) content += `- ${city.description}\n`
      content += '\n'
    })
  }
  
  return content
}

function closeImportModal() {
  showImportModal.value = false
  importText.value = ''
  importParsed.value = false
  parsedResults.value = {}
}

function loadSampleContent() {
  importText.value = `1. Thalorim Isles
Elun'vyr (Capital): Pop. 42,000 – High elven spires, leyline research, naval command. Wealth: Rich
Virelen: Pop. 9,500 – Artisan district, magical glassworks. Wealth: In-between
Lys'Alae: Pop. 4,200 – Healing sanctum and sacred groves. Wealth: Rich

Legendary Sites:
Moon-Drowned Vault (Nessavine Bloom) – Lost Fey Archive warped by lunar anomalies.
Leviathan Hinge (Orekh's Teeth) – Giant kraken skeleton used as bridge between submerged ruins.`
}

function getItemPreview(item, category) {
  if (category === 'locations' || category === 'cities') {
    return `Pop: ${item.population?.toLocaleString() || 'Unknown'} • ${item.wealth || 'Unknown wealth'} • ${item.type || 'Settlement'}`
  }
  if (category === 'lore') {
    return `${item.type || 'History'} • ${item.timePeriod || 'Era unknown'}`
  }
  if (category === 'worldInfo') {
    return `Magic: ${item.magicLevel || 'Unknown'} • Tech: ${item.technology || 'Unknown'}`
  }
  if (category === 'regions') {
    return `${item.cities?.length || 0} cities • ${item.description?.substring(0, 50)}...`
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
      temperature: 0.8,
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

function formatContent(content) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^#+\s(.*)$/gm, '<h4 class="font-semibold text-white mt-3 mb-1">$1</h4>')
    .replace(/^(\d+\.)\s/gm, '<br>$1 ')
    .replace(/^-\s/gm, '<br>• ')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p class="mb-2">')
    .replace(/$/, '</p>')
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

function getCategoryIcon(category) {
  const icons = {
    lore: '📚',
    rules: '⚖️',
    items: '⚔️',
    locations: '🏰',
    creatures: '🐉',
    worldInfo: '🌍',
    regions: '🗺️',
    cities: '🏛️'
  }
  return icons[category] || '📄'
}

function getCategoryColor(category) {
  const colors = {
    lore: 'text-emerald-400',
    rules: 'text-blue-400',
    items: 'text-purple-400',
    locations: 'text-yellow-400',
    creatures: 'text-red-400',
    worldInfo: 'text-cyan-400',
    regions: 'text-orange-400',
    cities: 'text-yellow-400'
  }
  return colors[category] || 'text-gray-400'
}

function copyContent(content) {
  const text = `# ${content.title}\n\n${content.content}\n\n---\nGenerated for Pathfinder 1e`
  navigator.clipboard.writeText(text).then(() => {
    alert('Content copied to clipboard!')
  })
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
    
    // Copy to clipboard
    await navigator.clipboard.writeText(exportText)
    
    // Show success with options
    const action = confirm(
      'Content exported to clipboard with ChatGPT setup!\n\n' +
      'Click OK to open ChatGPT in a new tab, or Cancel to stay here.'
    )
    
    if (action) {
      // Open ChatGPT
      const projectId = localStorage.getItem('chatgpt-project-id')
      const url = projectId 
        ? `https://chat.openai.com/?project=${projectId}`
        : 'https://chat.openai.com'
      window.open(url, '_blank')
    }
    
  } catch (error) {
    console.error('Export failed:', error)
    
    // Fallback to simple export
    const simpleText = `# Pathfinder 1e ${content.category}: ${content.title}\n\n${content.content}`
    navigator.clipboard.writeText(simpleText).then(() => {
      alert('Content copied to clipboard (simple format)')
    })
  }
}

function editContent(content) {
  // Could open a modal for editing
  alert('Edit functionality coming soon!')
}

function removeContent(index) {
  if (confirm('Remove this content?')) {
    generatedContent.value.splice(index, 1)
  }
}

function exportAll(format) {
  if (format === 'markdown') {
    const markdown = generatedContent.value.map(content => 
      `# ${content.title}\n\n*Category: ${content.category}*\n\n${content.content}\n\n---\n`
    ).join('\n')
    
    downloadFile('world-building.md', markdown)
  } else if (format === 'json') {
    const json = JSON.stringify(generatedContent.value, null, 2)
    downloadFile('world-building.json', json)
  }
}

async function exportCampaignGuide() {
  if (generatedContent.value.length === 0) return
  
  isGenerating.value = true
  progressMessage.value = 'Creating Campaign Guide'
  progressDetail.value = 'Organizing your world building...'
  
  try {
    const contentSummary = generatedContent.value.map(c => 
      `${c.category}: ${c.title}`
    ).join('\n')
    
    const prompt = `Create a cohesive campaign guide that ties together these world-building elements:

${contentSummary}

Structure the guide with:
1. **Campaign Overview** - Central theme and tone
2. **World Summary** - Key locations and history
3. **Major Factions** - Power groups and their goals  
4. **Campaign Arcs** - 3-5 major storylines
5. **Getting Started** - First adventure hooks
6. **GM Resources** - Quick reference lists

Connect all the elements into a unified campaign setting.`

    const guide = await callOpenAI(prompt, { maxTokens: 2000 })
    
    downloadFile('campaign-guide.md', `# Campaign Guide\n\n${guide}`)
    
  } catch (error) {
    console.error('Campaign guide generation failed:', error)
    alert('Failed to generate campaign guide: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}

// NEW: Export entire session to ChatGPT
async function exportToChatGPTSession() {
  if (generatedContent.value.length === 0) {
    alert('No content to export yet!')
    return
  }
  
  try {
    // Import the enhanced exporter
    const { EnhancedChatGPTExport } = await import('../../utils/EnhancedChatGPTExport.js')
    const exporter = new EnhancedChatGPTExport()
    
    // Update session context
    exporter.saveSessionContext({
      character: {
        name: characterState.name,
        level: characterState.classes?.reduce((sum, c) => sum + (c.level || 0), 0) || 1,
        classes: characterState.classes?.map(c => `${c.className} ${c.level}`).join(', ') || 'Adventurer'
      }
    })
    
    // Add all world elements
    generatedContent.value.forEach(content => {
      exporter.addWorldElement(content)
    })
    
    // Generate session briefing
    const briefing = exporter.generateSessionBriefing(generatedContent.value)
    
    // Copy to clipboard
    await navigator.clipboard.writeText(briefing)
    
    const action = confirm(
      `Session summary with ${generatedContent.value.length} items exported!\n\n` +
      'ChatGPT will now act as your world building assistant, maintaining context of all created content.\n\n' +
      'Click OK to open ChatGPT, or Cancel to stay here.'
    )
    
    if (action) {
      const projectId = localStorage.getItem('chatgpt-project-id')
      const url = projectId 
        ? `https://chat.openai.com/?project=${projectId}`
        : 'https://chat.openai.com'
      window.open(url, '_blank')
    }
    
  } catch (error) {
    console.error('Session export failed:', error)
    alert('Export failed - please try again')
  }
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function getRandomTip() {
  const tips = [
    'You can generate related content by referencing previous items',
    'Use the themed item generation for cohesive treasure hoards',
    'Custom rules work best when solving specific gameplay issues',
    'Reference real mythology for inspiring creature abilities',
    'Connect new lore to player character backstories',
    'Generate NPCs for each major location you create',
    'Save your favorite content as templates for future use',
    'Batch generation is more cost-effective than single items',
    'Add personal touches to generated content after creation',
    'Import existing content to enhance with AI'
  ]
  return tips[Math.floor(Math.random() * tips.length)]
}

// Watch for category changes
watch(currentCategory, (newCategory) => {
  progressMessage.value = ''
  progressDetail.value = ''
})
</script>

<style scoped>
.content-display {
  max-height: 400px;
  overflow-y: auto;
}

.content-display::-webkit-scrollbar {
  width: 6px;
}

.content-display::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.content-display::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* Animation for new content */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.bg-gray-800 {
  animation: slideIn 0.3s ease-out;
}

/* Make form inputs consistent */
input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
  height: 2rem;
}
</style>