// src/characterState.js
import { reactive } from 'vue'

export const characterState = reactive({
  // Core Identity
  name: '',
  race: '',
  age: 18,
  gender: '',
  alignment: '',
  deity: '',
  homeland: '',
  background: '',
  occupation: '',
  height: '',
  weight: '',
  hair: '',
  eyes: '',
  skin: '',
  portrait: '',
  personalityTraits: '',
  ideals: '',
  bonds: '',
  flaws: '',
  distinguishingFeatures: '',

  // Class & Leveling - FIXED: Added id to default class object
  classes: [{ id: 1, className: '', level: 1 }],
  favoredClass: '',
  archetypes: [],
  experience: 0,      // Current XP
  nextLevelXP: 0,     // XP required for next level
  xpLog: [],          // [{date, amount, reason}]
  xpRewards: [],      // For session/encounter logs

  // Ability Scores & Modifiers
  abilityScores: {
    STR: 10,
    DEX: 10,
    CON: 10,
    INT: 10,
    WIS: 10,
    CHA: 10
  },
  abilityMods: {
    STR: 0,
    DEX: 0,
    CON: 0,
    INT: 0,
    WIS: 0,
    CHA: 0
  },

  // Combat
  hp: 8,
  hpMax: 8,
  tempHp: 0,
  nonlethal: 0,
  wounds: 0,
  ac: 10,
  touchAC: 10,
  flatAC: 10,
  acArmor: 0,
  acShield: 0,
  acNatural: 0,
  acDeflection: 0,
  acDodge: 0,
  acMisc: 0,
  init: 0,
  initiativeMod: 0,
  bab: 0,
  cmb: 0,
  cmd: 10,
  speed: 30,
  spellResistance: 0,

  // Saving Throws
  saves: {
    fort: 0,
    fortBase: 0,
    fortMagic: 0,
    fortMisc: 0,
    ref: 0,
    refBase: 0,
    refMagic: 0,
    refMisc: 0,
    will: 0,
    willBase: 0,
    willMagic: 0,
    willMisc: 0
  },

  // Attacks
  melee: '',
  ranged: '',
  attacks: [],

  // Skills (Core Pathfinder 1e Skills)
  skills: [
    { name: 'Acrobatics', ability: 'DEX', untrained: 'Yes', armorCheckPenalty: 'Yes', rank: 0, misc: 0 },
    { name: 'Appraise', ability: 'INT', untrained: 'Yes', armorCheckPenalty: 'No', rank: 0, misc: 0 },
    { name: 'Bluff', ability: 'CHA', untrained: 'Yes', armorCheckPenalty: 'No', rank: 0, misc: 0 },
    { name: 'Climb', ability: 'STR', untrained: 'Yes', armorCheckPenalty: 'Yes', rank: 0, misc: 0 },
    { name: 'Diplomacy', ability: 'CHA', untrained: 'Yes', armorCheckPenalty: 'No', rank: 0, misc: 0 },
    { name: 'Disable Device', ability: 'DEX', untrained: 'No', armorCheckPenalty: 'Yes', rank: 0, misc: 0 },
    { name: 'Disguise', ability: 'CHA', untrained: 'Yes', armorCheckPenalty: 'No', rank: 0, misc: 0 },
    { name: 'Escape Artist', ability: 'DEX', untrained: 'Yes', armorCheckPenalty: 'Yes', rank: 0, misc: 0 },
    { name: 'Fly', ability: 'DEX', untrained: 'Yes', armorCheckPenalty: 'Yes', rank: 0, misc: 0 },
    { name: 'Handle Animal', ability: 'CHA', untrained: 'No', armorCheckPenalty: 'No', rank: 0, misc: 0 },
    { name: 'Heal', ability: 'WIS', untrained: 'Yes', armorCheckPenalty: 'No', rank: 0, misc: 0 },
    { name: 'Intimidate', ability: 'CHA', untrained: 'Yes', armorCheckPenalty: 'No', rank: 0, misc: 0 },
    { name: 'Linguistics', ability: 'INT', untrained: 'No', armorCheckPenalty: 'No', rank: 0, misc: 0 },
    { name: 'Perception', ability: 'WIS', untrained: 'Yes', armorCheckPenalty: 'No', rank: 0, misc: 0 },
    { name: 'Perform', ability: 'CHA', untrained: 'Yes', armorCheckPenalty: 'No', rank: 0, misc: 0 },
    { name: 'Ride', ability: 'DEX', untrained: 'Yes', armorCheckPenalty: 'Yes', rank: 0, misc: 0 },
    { name: 'Sense Motive', ability: 'WIS', untrained: 'Yes', armorCheckPenalty: 'No', rank: 0, misc: 0 },
    { name: 'Sleight of Hand', ability: 'DEX', untrained: 'No', armorCheckPenalty: 'Yes', rank: 0, misc: 0 },
    { name: 'Spellcraft', ability: 'INT', untrained: 'No', armorCheckPenalty: 'No', rank: 0, misc: 0 },
    { name: 'Stealth', ability: 'DEX', untrained: 'Yes', armorCheckPenalty: 'Yes', rank: 0, misc: 0 },
    { name: 'Survival', ability: 'WIS', untrained: 'Yes', armorCheckPenalty: 'No', rank: 0, misc: 0 },
    { name: 'Swim', ability: 'STR', untrained: 'Yes', armorCheckPenalty: 'Yes', rank: 0, misc: 0 },
    { name: 'Use Magic Device', ability: 'CHA', untrained: 'No', armorCheckPenalty: 'No', rank: 0, misc: 0 }
  ],

  // Subskills
  knowledgeSkills: [
    { subskill: 'Arcana', rank: 0, misc: 0, untrained: 'No' },
    { subskill: 'Dungeoneering', rank: 0, misc: 0, untrained: 'No' },
    { subskill: 'Engineering', rank: 0, misc: 0, untrained: 'No' },
    { subskill: 'Geography', rank: 0, misc: 0, untrained: 'No' },
    { subskill: 'History', rank: 0, misc: 0, untrained: 'No' },
    { subskill: 'Local', rank: 0, misc: 0, untrained: 'No' },
    { subskill: 'Nature', rank: 0, misc: 0, untrained: 'No' },
    { subskill: 'Nobility', rank: 0, misc: 0, untrained: 'No' },
    { subskill: 'Planes', rank: 0, misc: 0, untrained: 'No' },
    { subskill: 'Religion', rank: 0, misc: 0, untrained: 'No' }
  ],
  craftSkills: [],
  professionSkills: [],
  loreSkills: [],

  // Class Skills by Class (Pathfinder 1e)
  classSkills: {
    'Alchemist': ['Appraise', 'Craft', 'Disable Device', 'Fly', 'Heal', 'Knowledge (Arcana)', 'Knowledge (Nature)', 'Perception', 'Profession', 'Sleight of Hand', 'Spellcraft', 'Survival', 'Use Magic Device'],
    'Barbarian': ['Acrobatics', 'Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Knowledge (Nature)', 'Perception', 'Ride', 'Survival', 'Swim'],
    'Bard': ['Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy', 'Disguise', 'Escape Artist', 'Intimidate', 'Knowledge (All)', 'Linguistics', 'Perception', 'Perform', 'Profession', 'Sense Motive', 'Sleight of Hand', 'Spellcraft', 'Stealth', 'Use Magic Device'],
    'Cleric': ['Appraise', 'Craft', 'Diplomacy', 'Heal', 'Knowledge (Arcana)', 'Knowledge (History)', 'Knowledge (Nobility)', 'Knowledge (Planes)', 'Knowledge (Religion)', 'Linguistics', 'Profession', 'Sense Motive', 'Spellcraft'],
    'Druid': ['Climb', 'Craft', 'Fly', 'Handle Animal', 'Heal', 'Knowledge (Geography)', 'Knowledge (Nature)', 'Perception', 'Profession', 'Ride', 'Spellcraft', 'Survival', 'Swim'],
    'Fighter': ['Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Knowledge (Dungeoneering)', 'Knowledge (Engineering)', 'Profession', 'Ride', 'Survival', 'Swim'],
    'Monk': ['Acrobatics', 'Climb', 'Craft', 'Escape Artist', 'Intimidate', 'Knowledge (History)', 'Knowledge (Religion)', 'Perception', 'Perform', 'Profession', 'Ride', 'Sense Motive', 'Stealth', 'Swim'],
    'Paladin': ['Craft', 'Diplomacy', 'Handle Animal', 'Heal', 'Knowledge (Nobility)', 'Knowledge (Religion)', 'Profession', 'Ride', 'Sense Motive', 'Spellcraft'],
    'Ranger': ['Climb', 'Craft', 'Handle Animal', 'Heal', 'Intimidate', 'Knowledge (Dungeoneering)', 'Knowledge (Geography)', 'Knowledge (Nature)', 'Perception', 'Profession', 'Ride', 'Spellcraft', 'Stealth', 'Survival', 'Swim'],
    'Rogue': ['Acrobatics', 'Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Intimidate', 'Knowledge (Dungeoneering)', 'Knowledge (Local)', 'Linguistics', 'Perception', 'Perform', 'Profession', 'Sense Motive', 'Sleight of Hand', 'Stealth', 'Swim', 'Use Magic Device'],
    'Sorcerer': ['Appraise', 'Bluff', 'Craft', 'Fly', 'Intimidate', 'Knowledge (Arcana)', 'Profession', 'Spellcraft', 'Use Magic Device'],
    'Wizard': ['Appraise', 'Craft', 'Fly', 'Knowledge (All)', 'Linguistics', 'Profession', 'Spellcraft']
  },

  skillRanks: 0,
  skillFavored: [],
  skillPenalties: 0,

  // Equipment
  weapons: [],
  armor: [],
  shield: [],
  gear: [],
  inventory: [
    { name: 'Backpack', notes: 'Standard adventuring pack', weight: 2, quantity: 1, value: 2 },
    { name: 'Bedroll', notes: '', weight: 5, quantity: 1, value: 0.1 },
    { name: 'Trail Rations (5 days)', notes: '', weight: 5, quantity: 1, value: 2.5 }
  ],
  money: {
    cp: 0,
    sp: 0,
    gp: 0,
    pp: 0
  },

  // Spellcasting
  casterLevel: 0,
  spellDC: 0,
  spellSlots: {
    '1': { used: 0, max: 0 },
    '2': { used: 0, max: 0 },
    '3': { used: 0, max: 0 },
    '4': { used: 0, max: 0 },
    '5': { used: 0, max: 0 },
    '6': { used: 0, max: 0 },
    '7': { used: 0, max: 0 },
    '8': { used: 0, max: 0 },
    '9': { used: 0, max: 0 }
  },
  spells: [],
  spellsKnown: [],
  spellsPrepared: [],
  spellbook: [],

  // Special Abilities, Feats, Traits
  feats: [
    { name: 'Toughness', desc: '+3 hit points, +1 per Hit Die beyond 3' }
  ],
  traits: [],
  specialAbilities: [],
  languages: ['Common'],

  // Reputation, Social, Campaign
  reputation: 0,
  relationships: [],
  titles: [],
  honors: [],
  notes: '',

  // Journal & Session Log
  journal: [],

  // Map & Tokens
  tokens: [
    // Example token format:
    // {
    //   id: 1,
    //   label: 'Hero',
    //   row: 5,
    //   col: 7,
    //   icon: '🗡️',
    //   color: '#3498db',
    //   hp: 8,
    //   owner: 'player'
    // }
  ],
  currentMap: '', // String, filename, or map ID
  fogOfWar: false,

  // Miscellaneous
  encumbrance: 0,
  carryingCapacity: 0,
  vision: '',
  senses: '',
  resistances: [],
  immunities: [],
  weaknesses: [],
  conditions: [],
  affiliation: '',
})