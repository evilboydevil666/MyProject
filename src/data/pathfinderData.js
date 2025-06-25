// pathfinderData.js - Complete Pathfinder 1e Data

// Use embedded data (imports can be added later if needed)
let races, classes, feats, equipment;

races = {
  core: [
    {
      id: 'human',
      name: 'Human',
      category: 'Core',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { any: 2 },
      traits: ['Bonus Feat', 'Bonus Skill Points', 'Flexible'],
      languages: ['Common']
    },
    {
      id: 'elf',
      name: 'Elf',
      category: 'Core',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { DEX: 2, CON: -2, INT: 2 },
      traits: ['Low-Light Vision', 'Elven Immunities', 'Keen Senses'],
      languages: ['Common', 'Elven']
    },
    {
      id: 'dwarf',
      name: 'Dwarf',
      category: 'Core',
      size: 'Medium',
      type: 'Humanoid',
      speed: 20,
      abilityMods: { CON: 2, WIS: 2, CHA: -2 },
      traits: ['Darkvision', 'Hardy', 'Stability'],
      languages: ['Common', 'Dwarven']
    },
    {
      id: 'halfling',
      name: 'Halfling',
      category: 'Core',
      size: 'Small',
      type: 'Humanoid',
      speed: 20,
      abilityMods: { DEX: 2, STR: -2, CHA: 2 },
      traits: ['Small', 'Fearless', 'Lucky'],
      languages: ['Common', 'Halfling']
    },
    {
      id: 'half-orc',
      name: 'Half-Orc',
      category: 'Core',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { STR: 2 },
      traits: ['Darkvision', 'Intimidating', 'Orc Ferocity'],
      languages: ['Common', 'Orc']
    },
    {
      id: 'gnome',
      name: 'Gnome',
      category: 'Core',
      size: 'Small',
      type: 'Humanoid',
      speed: 20,
      abilityMods: { CON: 2, STR: -2, CHA: 2 },
      traits: ['Small', 'Low-Light Vision', 'Gnome Magic'],
      languages: ['Common', 'Gnome', 'Sylvan']
    },
    {
      id: 'half-elf',
      name: 'Half-Elf',
      category: 'Core',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { any: 2 },
      traits: ['Low-Light Vision', 'Adaptability', 'Elf Blood'],
      languages: ['Common', 'Elven']
    }
  ],
  featured: [
    {
      id: 'aasimar',
      name: 'Aasimar',
      category: 'Featured',
      size: 'Medium',
      type: 'Outsider',
      speed: 30,
      abilityMods: { WIS: 2, CHA: 2 },
      traits: ['Darkvision', 'Celestial Resistance', 'Skilled'],
      languages: ['Common', 'Celestial']
    },
    {
      id: 'tiefling',
      name: 'Tiefling',
      category: 'Featured',
      size: 'Medium',
      type: 'Outsider',
      speed: 30,
      abilityMods: { DEX: 2, INT: 2, CHA: -2 },
      traits: ['Darkvision', 'Fiendish Resistance', 'Skilled'],
      languages: ['Common', 'Infernal']
    },
    {
      id: 'catfolk',
      name: 'Catfolk',
      category: 'Featured',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { DEX: 2, CHA: 2, WIS: -2 },
      traits: ['Low-Light Vision', 'Cat\'s Luck', 'Natural Hunter'],
      languages: ['Common', 'Catfolk']
    },
    {
      id: 'dhampir',
      name: 'Dhampir',
      category: 'Featured',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { DEX: 2, CHA: 2, CON: -2 },
      traits: ['Low-Light Vision', 'Undead Resistance', 'Negative Energy Affinity'],
      languages: ['Common']
    },
    {
      id: 'drow',
      name: 'Drow',
      category: 'Featured',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { DEX: 2, CHA: 2, CON: -2 },
      traits: ['Darkvision', 'Spell Resistance', 'Light Blindness'],
      languages: ['Elven', 'Undercommon']
    },
    {
      id: 'fetchling',
      name: 'Fetchling',
      category: 'Featured',
      size: 'Medium',
      type: 'Outsider',
      speed: 30,
      abilityMods: { DEX: 2, CHA: 2, WIS: -2 },
      traits: ['Darkvision', 'Shadow Blending', 'Skilled'],
      languages: ['Common']
    },
    {
      id: 'goblin',
      name: 'Goblin',
      category: 'Featured',
      size: 'Small',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { DEX: 4, STR: -2, CHA: -2 },
      traits: ['Darkvision', 'Fast', 'Skilled'],
      languages: ['Goblin']
    },
    {
      id: 'hobgoblin',
      name: 'Hobgoblin',
      category: 'Featured',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { DEX: 2, CON: 2 },
      traits: ['Darkvision', 'Sneaky', 'Militaristic'],
      languages: ['Common', 'Goblin']
    },
    {
      id: 'ifrit',
      name: 'Ifrit',
      category: 'Featured',
      size: 'Medium',
      type: 'Outsider',
      speed: 30,
      abilityMods: { DEX: 2, CHA: 2, WIS: -2 },
      traits: ['Darkvision', 'Fire Affinity', 'Fire Resistance'],
      languages: ['Common', 'Ignan']
    },
    {
      id: 'kobold',
      name: 'Kobold',
      category: 'Featured',
      size: 'Small',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { DEX: 2, STR: -4, CON: -2 },
      traits: ['Darkvision', 'Crafty', 'Light Sensitivity'],
      languages: ['Draconic']
    },
    {
      id: 'orc',
      name: 'Orc',
      category: 'Featured',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { STR: 4, INT: -2, WIS: -2, CHA: -2 },
      traits: ['Darkvision', 'Ferocity', 'Light Sensitivity'],
      languages: ['Common', 'Orc']
    },
    {
      id: 'oread',
      name: 'Oread',
      category: 'Featured',
      size: 'Medium',
      type: 'Outsider',
      speed: 20,
      abilityMods: { STR: 2, WIS: 2, CHA: -2 },
      traits: ['Darkvision', 'Earth Affinity', 'Acid Resistance'],
      languages: ['Common', 'Terran']
    },
    {
      id: 'ratfolk',
      name: 'Ratfolk',
      category: 'Featured',
      size: 'Small',
      type: 'Humanoid',
      speed: 20,
      abilityMods: { DEX: 2, INT: 2, STR: -2 },
      traits: ['Darkvision', 'Tinker', 'Rodent Empathy'],
      languages: ['Common']
    },
    {
      id: 'sylph',
      name: 'Sylph',
      category: 'Featured',
      size: 'Medium',
      type: 'Outsider',
      speed: 30,
      abilityMods: { DEX: 2, INT: 2, CON: -2 },
      traits: ['Darkvision', 'Air Affinity', 'Electricity Resistance'],
      languages: ['Common', 'Auran']
    },
    {
      id: 'tengu',
      name: 'Tengu',
      category: 'Featured',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { DEX: 2, WIS: 2, CON: -2 },
      traits: ['Low-Light Vision', 'Sneaky', 'Natural Weapons'],
      languages: ['Common', 'Tengu']
    },
    {
      id: 'undine',
      name: 'Undine',
      category: 'Featured',
      size: 'Medium',
      type: 'Outsider',
      speed: 30,
      abilityMods: { DEX: 2, WIS: 2, STR: -2 },
      traits: ['Darkvision', 'Water Affinity', 'Cold Resistance'],
      languages: ['Common', 'Aquan']
    }
  ],
  uncommon: [
    {
      id: 'changeling',
      name: 'Changeling',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { WIS: 2, CHA: 2, CON: -2 },
      traits: ['Darkvision', 'Hulver', 'Sea Lungs'],
      languages: ['Common']
    },
    {
      id: 'duergar',
      name: 'Duergar',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid',
      speed: 20,
      abilityMods: { CON: 2, WIS: 2, CHA: -4 },
      traits: ['Darkvision', 'Duergar Immunities', 'Stability'],
      languages: ['Common', 'Dwarven', 'Undercommon']
    },
    {
      id: 'gillman',
      name: 'Gillman',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { CON: 2, CHA: 2, WIS: -2 },
      traits: ['Amphibious', 'Enchantment Resistance', 'Water Dependent'],
      languages: ['Common', 'Aboleth']
    },
    {
      id: 'grippli',
      name: 'Grippli',
      category: 'Uncommon',
      size: 'Small',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { DEX: 2, WIS: 2, STR: -2 },
      traits: ['Darkvision', 'Camouflage', 'Jumper'],
      languages: ['Common', 'Grippli']
    },
    {
      id: 'kitsune',
      name: 'Kitsune',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { DEX: 2, CHA: 2, STR: -2 },
      traits: ['Low-Light Vision', 'Change Shape', 'Kitsune Magic'],
      languages: ['Common', 'Sylvan']
    },
    {
      id: 'merfolk',
      name: 'Merfolk',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid',
      speed: 5,
      abilityMods: { DEX: 2, CON: 2, CHA: 2 },
      traits: ['Aquatic', 'Amphibious', 'Low-Light Vision'],
      languages: ['Common', 'Aquan']
    },
    {
      id: 'nagaji',
      name: 'Nagaji',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { STR: 2, CHA: 2, INT: -2 },
      traits: ['Low-Light Vision', 'Armored Scales', 'Resistant'],
      languages: ['Common', 'Draconic']
    },
    {
      id: 'samsaran',
      name: 'Samsaran',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { INT: 2, WIS: 2, CON: -2 },
      traits: ['Low-Light Vision', 'Lifebound', 'Samsaran Magic'],
      languages: ['Common', 'Samsaran']
    },
    {
      id: 'strix',
      name: 'Strix',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { DEX: 2, CHA: -2 },
      traits: ['Darkvision', 'Flight', 'Hatred'],
      languages: ['Strix']
    },
    {
      id: 'suli',
      name: 'Suli',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Outsider',
      speed: 30,
      abilityMods: { STR: 2, CHA: 2, INT: -2 },
      traits: ['Low-Light Vision', 'Elemental Resistance', 'Elemental Assault'],
      languages: ['Common']
    },
    {
      id: 'svirfneblin',
      name: 'Svirfneblin',
      category: 'Uncommon',
      size: 'Small',
      type: 'Humanoid',
      speed: 20,
      abilityMods: { DEX: 2, WIS: 2, STR: -2, CHA: -4 },
      traits: ['Darkvision', 'Spell Resistance', 'Svirfneblin Magic'],
      languages: ['Gnome', 'Undercommon']
    },
    {
      id: 'vanara',
      name: 'Vanara',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { DEX: 2, WIS: 2, CHA: -2 },
      traits: ['Low-Light Vision', 'Nimble', 'Prehensile Tail'],
      languages: ['Common', 'Vanaran']
    },
    {
      id: 'vishkanya',
      name: 'Vishkanya',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid',
      speed: 30,
      abilityMods: { DEX: 2, CHA: 2, WIS: -2 },
      traits: ['Low-Light Vision', 'Keen Senses', 'Poison Use'],
      languages: ['Common', 'Vishkanya']
    },
    {
      id: 'wayang',
      name: 'Wayang',
      category: 'Uncommon',
      size: 'Small',
      type: 'Humanoid',
      speed: 20,
      abilityMods: { DEX: 2, INT: 2, WIS: -2 },
      traits: ['Darkvision', 'Light and Dark', 'Shadow Magic'],
      languages: ['Common', 'Wayang']
    }
  ]
};

classes = {
  core: [
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
    }
  ],
  base: [
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
    }
  ],
  hybrid: [
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
    }
  ],
  occult: [
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
      classSkills: ['Bluff', 'Craft', 'Fly', 'Heal', 'Intimidate', 'Knowledge (all)', 'Linguistics', 'Profession', 'Sense Motive', 'Spellcraft', 'Use Magic Device']
    }
  ],
  alternate: [
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
};

feats = [
  { name: 'Acrobatic', description: '+2 on Acrobatics and Fly', prerequisites: null, type: 'General' },
  { name: 'Agile Maneuvers', description: 'Use DEX for combat maneuvers', prerequisites: null, type: 'Combat' },
  { name: 'Alertness', description: '+2 on Perception and Sense Motive', prerequisites: null, type: 'General' },
  { name: 'Animal Affinity', description: '+2 on Handle Animal and Ride', prerequisites: null, type: 'General' },
  { name: 'Arcane Strike', description: '+1 damage with magic weapons', prerequisites: 'Ability to cast arcane spells', type: 'Combat' },
  { name: 'Armor Proficiency (Light)', description: 'No penalties for wearing light armor', prerequisites: null, type: 'Combat' },
  { name: 'Armor Proficiency (Medium)', description: 'No penalties for wearing medium armor', prerequisites: 'Light Armor Proficiency', type: 'Combat' },
  { name: 'Armor Proficiency (Heavy)', description: 'No penalties for wearing heavy armor', prerequisites: 'Medium Armor Proficiency', type: 'Combat' },
  { name: 'Athletic', description: '+2 on Climb and Swim', prerequisites: null, type: 'General' },
  { name: 'Blind-Fight', description: 'Re-roll miss chances in melee', prerequisites: null, type: 'Combat' },
  { name: 'Catch Off-Guard', description: 'No penalties for improvised weapons', prerequisites: null, type: 'Combat' },
  { name: 'Combat Casting', description: '+4 on concentration checks for defensive casting', prerequisites: null, type: 'General' },
  { name: 'Combat Expertise', description: 'Trade attack bonus for AC', prerequisites: 'INT 13', type: 'Combat' },
  { name: 'Combat Reflexes', description: 'Additional attacks of opportunity', prerequisites: 'DEX 13', type: 'Combat' },
  { name: 'Dazzling Display', description: 'Intimidate all foes within 30 feet', prerequisites: 'Weapon Focus', type: 'Combat' },
  { name: 'Deadly Aim', description: 'Trade ranged attack bonus for damage', prerequisites: 'DEX 13, BAB +1', type: 'Combat' },
  { name: 'Deceitful', description: '+2 on Bluff and Disguise', prerequisites: null, type: 'General' },
  { name: 'Deft Hands', description: '+2 on Disable Device and Sleight of Hand', prerequisites: null, type: 'General' },
  { name: 'Dodge', description: '+1 dodge bonus to AC', prerequisites: 'DEX 13', type: 'Combat' },
  { name: 'Endurance', description: '+4 on checks to avoid fatigue', prerequisites: null, type: 'General' },
  { name: 'Eschew Materials', description: 'Cast spells without material components', prerequisites: null, type: 'General' },
  { name: 'Exotic Weapon Proficiency', description: 'Use exotic weapon without penalty', prerequisites: 'BAB +1', type: 'Combat' },
  { name: 'Extra Channel', description: 'Channel energy two additional times per day', prerequisites: 'Channel energy', type: 'General' },
  { name: 'Extra Ki', description: 'Increase ki pool by 2', prerequisites: 'Ki pool', type: 'General' },
  { name: 'Extra Mercy', description: 'Add one mercy to lay on hands', prerequisites: 'Lay on hands', type: 'General' },
  { name: 'Extra Performance', description: '6 additional rounds of bardic performance per day', prerequisites: 'Bardic performance', type: 'General' },
  { name: 'Extra Rage', description: '6 additional rounds of rage per day', prerequisites: 'Rage', type: 'General' },
  { name: 'Great Fortitude', description: '+2 bonus on Fortitude saves', prerequisites: null, type: 'General' },
  { name: 'Improved Bull Rush', description: '+2 on bull rush, no attack of opportunity', prerequisites: 'Power Attack', type: 'Combat' },
  { name: 'Improved Channel', description: '+2 DC on channel energy', prerequisites: 'Channel energy', type: 'General' },
  { name: 'Improved Counterspell', description: 'Counterspell with similar spell', prerequisites: null, type: 'General' },
  { name: 'Improved Critical', description: 'Double threat range of weapon', prerequisites: 'Weapon proficiency, BAB +8', type: 'Combat' },
  { name: 'Improved Disarm', description: '+2 on disarm, no attack of opportunity', prerequisites: 'Combat Expertise', type: 'Combat' },
  { name: 'Improved Familiar', description: 'Gain a more powerful familiar', prerequisites: 'Familiar', type: 'General' },
  { name: 'Improved Grapple', description: '+2 on grapple, no attack of opportunity', prerequisites: 'Improved Unarmed Strike', type: 'Combat' },
  { name: 'Improved Initiative', description: '+4 bonus on initiative', prerequisites: null, type: 'Combat' },
  { name: 'Improved Natural Armor', description: '+1 natural armor bonus', prerequisites: 'Natural armor', type: 'General' },
  { name: 'Improved Natural Attack', description: 'Increase natural weapon damage', prerequisites: 'Natural weapon', type: 'General' },
  { name: 'Improved Overrun', description: '+2 on overrun, no attack of opportunity', prerequisites: 'Power Attack', type: 'Combat' },
  { name: 'Improved Shield Bash', description: 'Keep shield bonus when bashing', prerequisites: 'Shield Proficiency', type: 'Combat' },
  { name: 'Improved Sunder', description: '+2 on sunder, no attack of opportunity', prerequisites: 'Power Attack', type: 'Combat' },
  { name: 'Improved Trip', description: '+2 on trip, no attack of opportunity', prerequisites: 'Combat Expertise', type: 'Combat' },
  { name: 'Improved Two-Weapon Fighting', description: 'Additional off-hand attack', prerequisites: 'Two-Weapon Fighting, BAB +6', type: 'Combat' },
  { name: 'Improved Unarmed Strike', description: 'Unarmed attacks don\'t provoke attacks', prerequisites: null, type: 'Combat' },
  { name: 'Iron Will', description: '+2 bonus on Will saves', prerequisites: null, type: 'General' },
  { name: 'Leadership', description: 'Attract followers and a cohort', prerequisites: 'Character level 7th', type: 'General' },
  { name: 'Lightning Reflexes', description: '+2 bonus on Reflex saves', prerequisites: null, type: 'General' },
  { name: 'Magical Aptitude', description: '+2 on Spellcraft and Use Magic Device', prerequisites: null, type: 'General' },
  { name: 'Martial Weapon Proficiency', description: 'Use martial weapon without penalty', prerequisites: null, type: 'Combat' },
  { name: 'Mobility', description: '+4 AC against attacks of opportunity', prerequisites: 'Dodge', type: 'Combat' },
  { name: 'Mounted Combat', description: 'Avoid attacks on mount', prerequisites: 'Ride 1 rank', type: 'Combat' },
  { name: 'Natural Spell', description: 'Cast spells in wild shape', prerequisites: 'Wild shape', type: 'General' },
  { name: 'Nimble Moves', description: 'Ignore 5 feet of difficult terrain', prerequisites: 'DEX 13', type: 'General' },
  { name: 'Persuasive', description: '+2 on Diplomacy and Intimidate', prerequisites: null, type: 'General' },
  { name: 'Point-Blank Shot', description: '+1 attack and damage with ranged weapons within 30 ft', prerequisites: null, type: 'Combat' },
  { name: 'Power Attack', description: 'Trade attack bonus for damage', prerequisites: 'STR 13, BAB +1', type: 'Combat' },
  { name: 'Precise Shot', description: 'No penalty for shooting into melee', prerequisites: 'Point-Blank Shot', type: 'Combat' },
  { name: 'Quick Draw', description: 'Draw weapon as free action', prerequisites: 'BAB +1', type: 'Combat' },
  { name: 'Rapid Reload', description: 'Reload crossbow more quickly', prerequisites: null, type: 'Combat' },
  { name: 'Rapid Shot', description: 'Extra ranged attack', prerequisites: 'Point-Blank Shot', type: 'Combat' },
  { name: 'Run', description: 'Run at 5x speed', prerequisites: null, type: 'General' },
  { name: 'Self-Sufficient', description: '+2 on Heal and Survival', prerequisites: null, type: 'General' },
  { name: 'Shield Focus', description: '+1 shield bonus to AC', prerequisites: 'Shield Proficiency', type: 'Combat' },
  { name: 'Shield Proficiency', description: 'No penalties for using shields', prerequisites: null, type: 'Combat' },
  { name: 'Shot on the Run', description: 'Move, attack, move with ranged weapon', prerequisites: 'Mobility, Point-Blank Shot', type: 'Combat' },
  { name: 'Simple Weapon Proficiency', description: 'Use simple weapons without penalty', prerequisites: null, type: 'Combat' },
  { name: 'Skill Focus', description: '+3 bonus on chosen skill', prerequisites: null, type: 'General' },
  { name: 'Spell Focus', description: '+1 DC for spells from chosen school', prerequisites: null, type: 'General' },
  { name: 'Spell Mastery', description: 'Prepare some spells without spellbook', prerequisites: 'Wizard level 1st', type: 'General' },
  { name: 'Spell Penetration', description: '+2 on caster level checks to overcome SR', prerequisites: null, type: 'General' },
  { name: 'Spring Attack', description: 'Move, attack, move without provoking', prerequisites: 'Mobility, BAB +4', type: 'Combat' },
  { name: 'Stand Still', description: 'Stop enemies from moving past', prerequisites: 'Combat Reflexes', type: 'Combat' },
  { name: 'Stealthy', description: '+2 on Escape Artist and Stealth', prerequisites: null, type: 'General' },
  { name: 'Step Up', description: '5-foot step as immediate action', prerequisites: 'BAB +1', type: 'Combat' },
  { name: 'Toughness', description: '+3 hit points, +1 per level after 3rd', prerequisites: null, type: 'General' },
  { name: 'Two-Weapon Defense', description: '+1 shield bonus when fighting with two weapons', prerequisites: 'Two-Weapon Fighting', type: 'Combat' },
  { name: 'Two-Weapon Fighting', description: 'Reduce two-weapon fighting penalties', prerequisites: 'DEX 15', type: 'Combat' },
  { name: 'Vital Strike', description: 'Deal extra weapon damage', prerequisites: 'BAB +6', type: 'Combat' },
  { name: 'Weapon Finesse', description: 'Use DEX for attack with light weapons', prerequisites: null, type: 'Combat' },
  { name: 'Weapon Focus', description: '+1 attack with chosen weapon', prerequisites: 'BAB +1', type: 'Combat' },
  { name: 'Weapon Specialization', description: '+2 damage with chosen weapon', prerequisites: 'Fighter level 4th', type: 'Combat' }
];

equipment = {
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
};

// Add Skills data
const skills = [
  { name: 'Acrobatics', ability: 'DEX', trainedOnly: false, armorPenalty: true },
  { name: 'Appraise', ability: 'INT', trainedOnly: false, armorPenalty: false },
  { name: 'Bluff', ability: 'CHA', trainedOnly: false, armorPenalty: false },
  { name: 'Climb', ability: 'STR', trainedOnly: false, armorPenalty: true },
  { name: 'Craft', ability: 'INT', trainedOnly: false, armorPenalty: false },
  { name: 'Diplomacy', ability: 'CHA', trainedOnly: false, armorPenalty: false },
  { name: 'Disable Device', ability: 'DEX', trainedOnly: true, armorPenalty: true },
  { name: 'Disguise', ability: 'CHA', trainedOnly: false, armorPenalty: false },
  { name: 'Escape Artist', ability: 'DEX', trainedOnly: false, armorPenalty: true },
  { name: 'Fly', ability: 'DEX', trainedOnly: false, armorPenalty: true },
  { name: 'Handle Animal', ability: 'CHA', trainedOnly: true, armorPenalty: false },
  { name: 'Heal', ability: 'WIS', trainedOnly: false, armorPenalty: false },
  { name: 'Intimidate', ability: 'CHA', trainedOnly: false, armorPenalty: false },
  { name: 'Knowledge (arcana)', ability: 'INT', trainedOnly: true, armorPenalty: false },
  { name: 'Knowledge (dungeoneering)', ability: 'INT', trainedOnly: true, armorPenalty: false },
  { name: 'Knowledge (engineering)', ability: 'INT', trainedOnly: true, armorPenalty: false },
  { name: 'Knowledge (geography)', ability: 'INT', trainedOnly: true, armorPenalty: false },
  { name: 'Knowledge (history)', ability: 'INT', trainedOnly: true, armorPenalty: false },
  { name: 'Knowledge (local)', ability: 'INT', trainedOnly: true, armorPenalty: false },
  { name: 'Knowledge (nature)', ability: 'INT', trainedOnly: true, armorPenalty: false },
  { name: 'Knowledge (nobility)', ability: 'INT', trainedOnly: true, armorPenalty: false },
  { name: 'Knowledge (planes)', ability: 'INT', trainedOnly: true, armorPenalty: false },
  { name: 'Knowledge (religion)', ability: 'INT', trainedOnly: true, armorPenalty: false },
  { name: 'Linguistics', ability: 'INT', trainedOnly: true, armorPenalty: false },
  { name: 'Perception', ability: 'WIS', trainedOnly: false, armorPenalty: false },
  { name: 'Perform', ability: 'CHA', trainedOnly: false, armorPenalty: false },
  { name: 'Profession', ability: 'WIS', trainedOnly: true, armorPenalty: false },
  { name: 'Ride', ability: 'DEX', trainedOnly: false, armorPenalty: true },
  { name: 'Sense Motive', ability: 'WIS', trainedOnly: false, armorPenalty: false },
  { name: 'Sleight of Hand', ability: 'DEX', trainedOnly: true, armorPenalty: true },
  { name: 'Spellcraft', ability: 'INT', trainedOnly: true, armorPenalty: false },
  { name: 'Stealth', ability: 'DEX', trainedOnly: false, armorPenalty: true },
  { name: 'Survival', ability: 'WIS', trainedOnly: false, armorPenalty: false },
  { name: 'Swim', ability: 'STR', trainedOnly: false, armorPenalty: true },
  { name: 'Use Magic Device', ability: 'CHA', trainedOnly: true, armorPenalty: false }
];

// Add Conditions data
const conditions = [
  { name: 'Blinded', description: '-2 to AC, loses Dex bonus to AC, -4 on most Str and Dex-based skills, 50% miss chance' },
  { name: 'Broken', description: '-2 to attack rolls and AC (armor/shield), weapons deal half damage' },
  { name: 'Confused', description: 'Cannot act normally, roll d% each round for behavior' },
  { name: 'Cowering', description: '-2 to AC, loses Dex bonus to AC' },
  { name: 'Dazed', description: 'Cannot take actions, but can defend normally' },
  { name: 'Dazzled', description: '-1 on attack rolls and sight-based Perception checks' },
  { name: 'Dead', description: 'Cannot be restored to life by normal means' },
  { name: 'Deafened', description: '-4 on initiative, 20% spell failure for verbal spells' },
  { name: 'Disabled', description: '0 hit points, can only take single move or standard action' },
  { name: 'Dying', description: 'Negative hit points, unconscious, loses 1 hp per round' },
  { name: 'Energy Drained', description: 'Negative levels, -1 on all d20 rolls per negative level' },
  { name: 'Entangled', description: '-2 on attack rolls, -4 to Dex, move at half speed' },
  { name: 'Exhausted', description: '-6 to Str and Dex, move at half speed' },
  { name: 'Fascinated', description: '-4 on skill checks made as reactions' },
  { name: 'Fatigued', description: '-2 to Str and Dex, cannot run or charge' },
  { name: 'Flat-Footed', description: 'Cannot add Dex bonus to AC' },
  { name: 'Frightened', description: '-2 on attack rolls, saves, skill checks, and ability checks, must flee' },
  { name: 'Grappled', description: '-4 to Dex, -2 on attacks and combat maneuvers except grapple' },
  { name: 'Helpless', description: 'Dex treated as 0, melee attacks get +4 to hit' },
  { name: 'Incorporeal', description: 'Immune to nonmagical attacks, 50% damage from magic' },
  { name: 'Invisible', description: '+2 on attack rolls, opponents lose Dex bonus to AC' },
  { name: 'Nauseated', description: 'Can only take move action' },
  { name: 'Panicked', description: '-2 on saves, drops everything and flees' },
  { name: 'Paralyzed', description: 'Str and Dex reduced to 0, helpless' },
  { name: 'Petrified', description: 'Turned to stone, unconscious' },
  { name: 'Pinned', description: 'Held immobile, flat-footed, -4 AC' },
  { name: 'Prone', description: '-4 on melee attacks, +4 AC vs ranged, -4 AC vs melee' },
  { name: 'Shaken', description: '-2 on attack rolls, saves, skill checks, and ability checks' },
  { name: 'Sickened', description: '-2 on attack rolls, damage rolls, saves, skill and ability checks' },
  { name: 'Stable', description: 'No longer dying but still unconscious' },
  { name: 'Staggered', description: 'Can only take move or standard action' },
  { name: 'Stunned', description: 'Drops everything, -2 to AC, loses Dex bonus to AC' },
  { name: 'Unconscious', description: 'Helpless, cannot take actions' }
];

// Add basic spell structures (can be expanded)
const spellSchools = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation', 'Universal'];

const spellDescriptors = ['Acid', 'Air', 'Chaotic', 'Cold', 'Darkness', 'Death', 'Earth', 'Electricity', 'Evil', 'Fear', 'Fire', 'Force', 'Good', 'Language-Dependent', 'Lawful', 'Light', 'Mind-Affecting', 'Sonic', 'Water'];

// Add ability score data
const abilityScores = {
  'STR': { name: 'Strength', description: 'Physical power' },
  'DEX': { name: 'Dexterity', description: 'Agility and reflexes' },
  'CON': { name: 'Constitution', description: 'Endurance and health' },
  'INT': { name: 'Intelligence', description: 'Reasoning and memory' },
  'WIS': { name: 'Wisdom', description: 'Awareness and willpower' },
  'CHA': { name: 'Charisma', description: 'Force of personality' }
};

// Add save types
const saveTypes = {
  'Fort': { name: 'Fortitude', ability: 'CON', description: 'Resistance to poison, disease, and physical transformation' },
  'Ref': { name: 'Reflex', ability: 'DEX', description: 'Ability to dodge area effects and attacks' },
  'Will': { name: 'Will', ability: 'WIS', description: 'Resistance to mental effects and magic' }
};

// Add creature sizes
const creatureSizes = [
  { name: 'Fine', modifier: 8, space: 0.5, reach: 0 },
  { name: 'Diminutive', modifier: 4, space: 1, reach: 0 },
  { name: 'Tiny', modifier: 2, space: 2.5, reach: 0 },
  { name: 'Small', modifier: 1, space: 5, reach: 5 },
  { name: 'Medium', modifier: 0, space: 5, reach: 5 },
  { name: 'Large', modifier: -1, space: 10, reach: 10 },
  { name: 'Huge', modifier: -2, space: 15, reach: 15 },
  { name: 'Gargantuan', modifier: -4, space: 20, reach: 20 },
  { name: 'Colossal', modifier: -8, space: 30, reach: 30 }
];

// Add alignment data
const alignments = [
  { id: 'lg', name: 'Lawful Good', abbreviation: 'LG' },
  { id: 'ng', name: 'Neutral Good', abbreviation: 'NG' },
  { id: 'cg', name: 'Chaotic Good', abbreviation: 'CG' },
  { id: 'ln', name: 'Lawful Neutral', abbreviation: 'LN' },
  { id: 'n', name: 'True Neutral', abbreviation: 'N' },
  { id: 'cn', name: 'Chaotic Neutral', abbreviation: 'CN' },
  { id: 'le', name: 'Lawful Evil', abbreviation: 'LE' },
  { id: 'ne', name: 'Neutral Evil', abbreviation: 'NE' },
  { id: 'ce', name: 'Chaotic Evil', abbreviation: 'CE' }
];

// Create flattened arrays for easier access
const allRaces = Object.values(races).flat();
const allClasses = Object.values(classes).flat();

// Export the data
export const pathfinderData = {
  races: allRaces,
  classes: allClasses,
  feats: feats,
  equipment: equipment,
  skills: skills,
  conditions: conditions,
  spellSchools: spellSchools,
  spellDescriptors: spellDescriptors,
  abilityScores: abilityScores,
  saveTypes: saveTypes,
  creatureSizes: creatureSizes,
  alignments: alignments
};

// Helper functions
export function getRaceById(id) {
  return allRaces.find(race => race.id === id);
}

export function getClassById(id) {
  return allClasses.find(cls => cls.id === id);
}

export function getRacesByCategory(category) {
  return allRaces.filter(race => race.category === category);
}

export function getClassesByCategory(category) {
  return allClasses.filter(cls => cls.category === category);
}

export function getFeatsByType(type) {
  return feats.filter(feat => feat.type === type);
}

export function getEquipmentByCategory(category) {
  return equipment[category] || [];
}

export function getSkillsByAbility(ability) {
  return skills.filter(skill => skill.ability === ability);
}

export function getSkillByName(name) {
  return skills.find(skill => skill.name === name);
}

export function getConditionByName(name) {
  return conditions.find(condition => condition.name === name);
}

export function getSizeModifier(sizeName) {
  const size = creatureSizes.find(s => s.name === sizeName);
  return size ? size.modifier : 0;
}

export function getAlignmentById(id) {
  return alignments.find(alignment => alignment.id === id);
}

// Calculate ability modifier
export function getAbilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

// Calculate skill bonus
export function calculateSkillBonus(skillName, abilityScore, ranks, classSkill = false, miscModifier = 0) {
  const skill = getSkillByName(skillName);
  if (!skill) return 0;
  
  const abilityMod = getAbilityModifier(abilityScore);
  const classBonus = (classSkill && ranks > 0) ? 3 : 0;
  
  return abilityMod + ranks + classBonus + miscModifier;
}

// Calculate save bonus
export function calculateSaveBonus(saveType, baseSave, abilityScore, miscModifier = 0) {
  const abilityMod = getAbilityModifier(abilityScore);
  return baseSave + abilityMod + miscModifier;
}

// Character level helpers
export function getCharacterLevel(classLevels) {
  return Object.values(classLevels).reduce((sum, level) => sum + level, 0);
}

export function getBab(classLevels) {
  let totalBab = 0;
  
  for (const [classId, level] of Object.entries(classLevels)) {
    const cls = getClassById(classId);
    if (!cls) continue;
    
    if (cls.bab === 'Full') {
      totalBab += level;
    } else if (cls.bab === '3/4') {
      totalBab += Math.floor(level * 0.75);
    } else if (cls.bab === '1/2') {
      totalBab += Math.floor(level * 0.5);
    }
  }
  
  return totalBab;
}

// CR calculation helper
export function calculateCR(hitDice, specialAbilities = 0) {
  // Simplified CR calculation
  let cr = hitDice;
  
  // Adjust for special abilities
  cr += Math.floor(specialAbilities / 5);
  
  // CR fractions
  if (cr < 1) {
    if (cr <= 0.125) return '1/8';
    if (cr <= 0.166) return '1/6';
    if (cr <= 0.25) return '1/4';
    if (cr <= 0.33) return '1/3';
    if (cr <= 0.5) return '1/2';
  }
  
  return Math.floor(cr);
}

// Export additional helpers for compatibility
export const pathfinderRaces = races;
export const pathfinderClasses = classes;
export const pathfinderFeats = feats;
export const pathfinderEquipment = equipment;
export const pathfinderSkills = skills;
export const pathfinderConditions = conditions;
export const pathfinderAlignments = alignments;

// Export a comprehensive game data object
export const gameData = {
  races: pathfinderRaces,
  classes: pathfinderClasses,
  feats: pathfinderFeats,
  equipment: pathfinderEquipment,
  skills: pathfinderSkills,
  conditions: pathfinderConditions,
  spellSchools: spellSchools,
  spellDescriptors: spellDescriptors,
  abilityScores: abilityScores,
  saveTypes: saveTypes,
  creatureSizes: creatureSizes,
  alignments: pathfinderAlignments
};

// Default export for easy importing
export default pathfinderData;