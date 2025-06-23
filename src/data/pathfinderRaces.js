// pathfinderRaces.js - Complete Pathfinder 1e Races Data

export const pathfinderRaces = {
  // Core Races
  core: [
    {
      id: 'human',
      name: 'Human',
      category: 'Core',
      size: 'Medium',
      type: 'Humanoid (human)',
      speed: 30,
      abilityMods: { any: 2 }, // +2 to any one ability score
      racialTraits: [
        {
          name: 'Bonus Feat',
          description: 'Humans select one extra feat at 1st level.'
        },
        {
          name: 'Skilled',
          description: 'Humans gain an additional skill rank at first level and one additional rank whenever they gain a level.'
        }
      ],
      languages: {
        starting: ['Common'],
        bonus: 'Any (except secret languages)'
      }
    },
    {
      id: 'dwarf',
      name: 'Dwarf',
      category: 'Core',
      size: 'Medium',
      type: 'Humanoid (dwarf)',
      speed: 20, // but never modified by encumbrance
      abilityMods: { CON: 2, WIS: 2, CHA: -2 },
      racialTraits: [
        {
          name: 'Darkvision',
          description: 'Dwarves can see in the dark up to 60 feet.'
        },
        {
          name: 'Defensive Training',
          description: '+4 dodge bonus to AC against monsters of the giant subtype.'
        },
        {
          name: 'Greed',
          description: '+2 racial bonus on Appraise checks for precious metals or gemstones.'
        },
        {
          name: 'Hatred',
          description: '+1 bonus on attack rolls against orc and goblinoid subtypes.'
        },
        {
          name: 'Hardy',
          description: '+2 racial bonus on saving throws against poison, spells, and spell-like abilities.'
        },
        {
          name: 'Stability',
          description: '+4 racial bonus to CMD against bull rush or trip when standing on ground.'
        },
        {
          name: 'Stonecunning',
          description: '+2 bonus on Perception checks for unusual stonework, automatic check within 10 feet.'
        },
        {
          name: 'Weapon Familiarity',
          description: 'Proficient with battleaxes, heavy picks, and warhammers, treat dwarven weapons as martial.'
        }
      ],
      languages: {
        starting: ['Common', 'Dwarven'],
        bonus: ['Giant', 'Gnome', 'Goblin', 'Orc', 'Terran', 'Undercommon']
      }
    },
    {
      id: 'elf',
      name: 'Elf',
      category: 'Core',
      size: 'Medium',
      type: 'Humanoid (elf)',
      speed: 30,
      abilityMods: { DEX: 2, CON: -2, INT: 2 },
      racialTraits: [
        {
          name: 'Low-Light Vision',
          description: 'Elves can see twice as far as humans in dim light.'
        },
        {
          name: 'Elven Immunities',
          description: 'Immune to magic sleep effects, +2 racial saving throw bonus against enchantment.'
        },
        {
          name: 'Elven Magic',
          description: '+2 racial bonus on caster level checks to overcome spell resistance, +2 on Spellcraft to identify magic items.'
        },
        {
          name: 'Keen Senses',
          description: '+2 racial bonus on Perception checks.'
        },
        {
          name: 'Weapon Familiarity',
          description: 'Proficient with longbows, longswords, rapiers, shortbows, treat elven weapons as martial.'
        }
      ],
      languages: {
        starting: ['Common', 'Elven'],
        bonus: ['Celestial', 'Draconic', 'Gnoll', 'Gnome', 'Goblin', 'Orc', 'Sylvan']
      }
    },
    {
      id: 'gnome',
      name: 'Gnome',
      category: 'Core',
      size: 'Small',
      type: 'Humanoid (gnome)',
      speed: 20,
      abilityMods: { CON: 2, STR: -2, CHA: 2 },
      racialTraits: [
        {
          name: 'Small',
          description: '+1 size bonus to AC and attack rolls, -1 penalty to CMB and CMD, +4 size bonus on Stealth.'
        },
        {
          name: 'Low-Light Vision',
          description: 'Gnomes can see twice as far as humans in dim light.'
        },
        {
          name: 'Defensive Training',
          description: '+4 dodge bonus to AC against monsters of the giant subtype.'
        },
        {
          name: 'Gnome Magic',
          description: '+1 to DC of illusion spells, spell-like abilities 1/day if Cha 11+.'
        },
        {
          name: 'Hatred',
          description: '+1 bonus on attack rolls against reptilian and goblinoid subtypes.'
        },
        {
          name: 'Illusion Resistance',
          description: '+2 racial saving throw bonus against illusion spells and effects.'
        },
        {
          name: 'Keen Senses',
          description: '+2 racial bonus on Perception checks.'
        },
        {
          name: 'Obsessive',
          description: '+2 racial bonus on Craft or Profession skill of choice.'
        },
        {
          name: 'Weapon Familiarity',
          description: 'Treat gnome weapons as martial weapons.'
        }
      ],
      languages: {
        starting: ['Common', 'Gnome', 'Sylvan'],
        bonus: ['Draconic', 'Dwarven', 'Elven', 'Giant', 'Goblin', 'Orc']
      }
    },
    {
      id: 'half-elf',
      name: 'Half-Elf',
      category: 'Core',
      size: 'Medium',
      type: 'Humanoid (elf, human)',
      speed: 30,
      abilityMods: { any: 2 }, // +2 to any one ability score
      racialTraits: [
        {
          name: 'Low-Light Vision',
          description: 'Half-elves can see twice as far as humans in dim light.'
        },
        {
          name: 'Adaptability',
          description: 'Receive Skill Focus as a bonus feat at 1st level.'
        },
        {
          name: 'Elf Blood',
          description: 'Count as both elves and humans for effects related to race.'
        },
        {
          name: 'Elven Immunities',
          description: 'Immune to magic sleep effects, +2 racial saving throw bonus against enchantment.'
        },
        {
          name: 'Keen Senses',
          description: '+2 racial bonus on Perception checks.'
        },
        {
          name: 'Multitalented',
          description: 'Choose two favored classes at first level.'
        }
      ],
      languages: {
        starting: ['Common', 'Elven'],
        bonus: 'Any (except secret languages)'
      }
    },
    {
      id: 'half-orc',
      name: 'Half-Orc',
      category: 'Core',
      size: 'Medium',
      type: 'Humanoid (human, orc)',
      speed: 30,
      abilityMods: { any: 2 }, // +2 to any one ability score
      racialTraits: [
        {
          name: 'Darkvision',
          description: 'Half-orcs can see in the dark up to 60 feet.'
        },
        {
          name: 'Intimidating',
          description: '+2 racial bonus on Intimidate checks.'
        },
        {
          name: 'Orc Blood',
          description: 'Count as both humans and orcs for effects related to race.'
        },
        {
          name: 'Orc Ferocity',
          description: 'Once per day, when reduced to 0 hit points but not killed, can fight on for 1 more round.'
        },
        {
          name: 'Weapon Familiarity',
          description: 'Proficient with greataxes and falchions, treat orc weapons as martial.'
        }
      ],
      languages: {
        starting: ['Common', 'Orc'],
        bonus: ['Abyssal', 'Draconic', 'Giant', 'Gnoll', 'Goblin']
      }
    },
    {
      id: 'halfling',
      name: 'Halfling',
      category: 'Core',
      size: 'Small',
      type: 'Humanoid (halfling)',
      speed: 20,
      abilityMods: { DEX: 2, STR: -2, CHA: 2 },
      racialTraits: [
        {
          name: 'Small',
          description: '+1 size bonus to AC and attack rolls, -1 penalty to CMB and CMD, +4 size bonus on Stealth.'
        },
        {
          name: 'Fearless',
          description: '+2 racial bonus on all saving throws against fear.'
        },
        {
          name: 'Halfling Luck',
          description: '+1 racial bonus on all saving throws.'
        },
        {
          name: 'Keen Senses',
          description: '+2 racial bonus on Perception checks.'
        },
        {
          name: 'Sure-Footed',
          description: '+2 racial bonus on Acrobatics and Climb checks.'
        },
        {
          name: 'Weapon Familiarity',
          description: 'Proficient with slings, treat halfling weapons as martial.'
        }
      ],
      languages: {
        starting: ['Common', 'Halfling'],
        bonus: ['Dwarven', 'Elven', 'Gnome', 'Goblin']
      }
    }
  ],
  
  // Featured Races
  featured: [
    {
      id: 'aasimar',
      name: 'Aasimar',
      category: 'Featured',
      size: 'Medium',
      type: 'Outsider (native)',
      speed: 30,
      abilityMods: { WIS: 2, CHA: 2 },
      racialTraits: [
        {
          name: 'Darkvision',
          description: 'Aasimar can see in the dark up to 60 feet.'
        },
        {
          name: 'Skilled',
          description: '+2 racial bonus on Diplomacy and Perception checks.'
        },
        {
          name: 'Spell-Like Ability',
          description: 'Daylight once per day as a spell-like ability (caster level equals the aasimar\'s class level).'
        },
        {
          name: 'Celestial Resistance',
          description: 'Acid resistance 5, cold resistance 5, and electricity resistance 5.'
        }
      ],
      languages: {
        starting: ['Common', 'Celestial'],
        bonus: ['Draconic', 'Dwarven', 'Elven', 'Gnome', 'Halfling', 'Sylvan']
      }
    },
    {
      id: 'catfolk',
      name: 'Catfolk',
      category: 'Featured',
      size: 'Medium',
      type: 'Humanoid (catfolk)',
      speed: 30,
      abilityMods: { DEX: 2, CHA: 2, WIS: -2 },
      racialTraits: [
        {
          name: 'Low-Light Vision',
          description: 'Catfolk can see twice as far as humans in dim light.'
        },
        {
          name: 'Cat\'s Luck',
          description: 'Once per day, can roll twice on a Reflex save and take the better result.'
        },
        {
          name: 'Natural Hunter',
          description: '+2 racial bonus on Perception, Stealth, and Survival checks.'
        },
        {
          name: 'Sprinter',
          description: '+10 foot racial bonus to speed when using charge, run, or withdraw actions.'
        }
      ],
      languages: {
        starting: ['Common', 'Catfolk'],
        bonus: ['Draconic', 'Elven', 'Gnoll', 'Gnome', 'Goblin', 'Halfling', 'Orc', 'Sylvan']
      }
    },
    {
      id: 'dhampir',
      name: 'Dhampir',
      category: 'Featured',
      size: 'Medium',
      type: 'Humanoid (dhampir)',
      speed: 30,
      abilityMods: { DEX: 2, CHA: 2, CON: -2 },
      racialTraits: [
        {
          name: 'Darkvision',
          description: 'Dhampirs can see in the dark up to 60 feet.'
        },
        {
          name: 'Low-Light Vision',
          description: 'Dhampirs can see twice as far as humans in dim light.'
        },
        {
          name: 'Manipulative',
          description: '+2 racial bonus on Bluff and Perception checks.'
        },
        {
          name: 'Undead Resistance',
          description: '+2 racial bonus on saving throws against disease and mind-affecting effects.'
        },
        {
          name: 'Light Sensitivity',
          description: 'Dazzled in areas of bright sunlight or within the radius of a daylight spell.'
        },
        {
          name: 'Negative Energy Affinity',
          description: 'Harmed by positive energy and healed by negative energy.'
        },
        {
          name: 'Spell-Like Ability',
          description: 'Detect undead three times per day as a spell-like ability.'
        }
      ],
      languages: {
        starting: ['Common'],
        bonus: 'Any (except secret languages)'
      }
    },
    {
      id: 'drow',
      name: 'Drow',
      category: 'Featured',
      size: 'Medium',
      type: 'Humanoid (elf)',
      speed: 30,
      abilityMods: { DEX: 2, CHA: 2, CON: -2 },
      racialTraits: [
        {
          name: 'Darkvision',
          description: 'Drow can see in the dark up to 120 feet.'
        },
        {
          name: 'Drow Immunities',
          description: 'Immune to magic sleep effects, +2 racial bonus on saves against enchantment.'
        },
        {
          name: 'Keen Senses',
          description: '+2 racial bonus on Perception checks.'
        },
        {
          name: 'Spell Resistance',
          description: 'Spell resistance equal to 6 + class level.'
        },
        {
          name: 'Spell-Like Abilities',
          description: 'Dancing lights, darkness, and faerie fire each 1/day.'
        },
        {
          name: 'Light Blindness',
          description: 'Blinded for 1 round by abrupt exposure to bright light, dazzled afterward.'
        },
        {
          name: 'Weapon Familiarity',
          description: 'Proficient with hand crossbow, rapier, and short sword.'
        }
      ],
      languages: {
        starting: ['Elven', 'Undercommon'],
        bonus: ['Abyssal', 'Aklo', 'Aquan', 'Draconic', 'Drow Sign Language', 'Gnome', 'Goblin']
      }
    },
    {
      id: 'fetchling',
      name: 'Fetchling',
      category: 'Featured',
      size: 'Medium',
      type: 'Outsider (native)',
      speed: 30,
      abilityMods: { DEX: 2, CHA: 2, WIS: -2 },
      racialTraits: [
        {
          name: 'Darkvision',
          description: 'Fetchlings can see in the dark up to 60 feet.'
        },
        {
          name: 'Low-Light Vision',
          description: 'Fetchlings can see twice as far as humans in dim light.'
        },
        {
          name: 'Skilled',
          description: '+2 racial bonus on Knowledge (planes) and Stealth checks.'
        },
        {
          name: 'Shadow Blending',
          description: 'Attacks against fetchlings in dim light have 50% miss chance.'
        },
        {
          name: 'Shadowy Resistance',
          description: 'Cold resistance 5 and electricity resistance 5.'
        },
        {
          name: 'Spell-Like Abilities',
          description: 'Disguise self 1/day (humanoid form only).'
        }
      ],
      languages: {
        starting: ['Common'],
        bonus: ['Aklo', 'Aquan', 'Auran', 'Draconic', 'D\'ziriak', 'Ignan', 'Terran']
      }
    },
    {
      id: 'goblin',
      name: 'Goblin',
      category: 'Featured',
      size: 'Small',
      type: 'Humanoid (goblinoid)',
      speed: 30,
      abilityMods: { DEX: 4, STR: -2, CHA: -2 },
      racialTraits: [
        {
          name: 'Small',
          description: '+1 size bonus to AC and attack rolls, -1 penalty to CMB and CMD, +4 size bonus on Stealth.'
        },
        {
          name: 'Darkvision',
          description: 'Goblins can see in the dark up to 60 feet.'
        },
        {
          name: 'Fast',
          description: 'Goblins have a base speed of 30 feet.'
        },
        {
          name: 'Skilled',
          description: '+4 racial bonus on Ride and Stealth checks.'
        }
      ],
      languages: {
        starting: ['Goblin'],
        bonus: ['Common', 'Draconic', 'Dwarven', 'Gnoll', 'Gnome', 'Halfling', 'Orc']
      }
    },
    {
      id: 'hobgoblin',
      name: 'Hobgoblin',
      category: 'Featured',
      size: 'Medium',
      type: 'Humanoid (goblinoid)',
      speed: 30,
      abilityMods: { DEX: 2, CON: 2 },
      racialTraits: [
        {
          name: 'Darkvision',
          description: 'Hobgoblins can see in the dark up to 60 feet.'
        },
        {
          name: 'Sneaky',
          description: '+4 racial bonus on Stealth checks.'
        }
      ],
      languages: {
        starting: ['Common', 'Goblin'],
        bonus: ['Draconic', 'Dwarven', 'Infernal', 'Giant', 'Orc']
      }
    },
    {
      id: 'ifrit',
      name: 'Ifrit',
      category: 'Featured',
      size: 'Medium',
      type: 'Outsider (native)',
      speed: 30,
      abilityMods: { DEX: 2, CHA: 2, WIS: -2 },
      racialTraits: [
        {
          name: 'Darkvision',
          description: 'Ifrits can see in the dark up to 60 feet.'
        },
        {
          name: 'Spell-Like Ability',
          description: 'Burning hands 1/day as a spell-like ability.'
        },
        {
          name: 'Energy Resistance',
          description: 'Fire resistance 5.'
        },
        {
          name: 'Fire Affinity',
          description: 'Ifrit sorcerers with elemental (fire) bloodline treat Charisma as 2 higher.'
        }
      ],
      languages: {
        starting: ['Common', 'Ignan'],
        bonus: ['Aquan', 'Auran', 'Dwarven', 'Elven', 'Gnome', 'Halfling', 'Terran']
      }
    },
    {
      id: 'kobold',
      name: 'Kobold',
      category: 'Featured',
      size: 'Small',
      type: 'Humanoid (reptilian)',
      speed: 30,
      abilityMods: { DEX: 2, STR: -4, CON: -2 },
      racialTraits: [
        {
          name: 'Small',
          description: '+1 size bonus to AC and attack rolls, -1 penalty to CMB and CMD, +4 size bonus on Stealth.'
        },
        {
          name: 'Darkvision',
          description: 'Kobolds can see in the dark up to 60 feet.'
        },
        {
          name: 'Armor',
          description: '+1 natural armor bonus.'
        },
        {
          name: 'Crafty',
          description: '+2 racial bonus on Craft (trapmaking), Perception, and Profession (miner).'
        },
        {
          name: 'Weakness',
          description: 'Light sensitivity.'
        }
      ],
      languages: {
        starting: ['Draconic'],
        bonus: ['Common', 'Dwarven', 'Gnome', 'Halfling', 'Undercommon']
      }
    },
    {
      id: 'orc',
      name: 'Orc',
      category: 'Featured',
      size: 'Medium',
      type: 'Humanoid (orc)',
      speed: 30,
      abilityMods: { STR: 4, INT: -2, WIS: -2, CHA: -2 },
      racialTraits: [
        {
          name: 'Darkvision',
          description: 'Orcs can see in the dark up to 60 feet.'
        },
        {
          name: 'Ferocity',
          description: 'Can remain conscious and continue fighting at 0 or fewer hit points.'
        },
        {
          name: 'Weapon Familiarity',
          description: 'Proficient with greataxes and falchions, treat orc weapons as martial.'
        },
        {
          name: 'Light Sensitivity',
          description: 'Dazzled in areas of bright sunlight.'
        }
      ],
      languages: {
        starting: ['Common', 'Orc'],
        bonus: ['Abyssal', 'Draconic', 'Giant', 'Gnoll', 'Goblin', 'Undercommon']
      }
    },
    {
      id: 'oread',
      name: 'Oread',
      category: 'Featured',
      size: 'Medium',
      type: 'Outsider (native)',
      speed: 20,
      abilityMods: { STR: 2, WIS: 2, CHA: -2 },
      racialTraits: [
        {
          name: 'Darkvision',
          description: 'Oreads can see in the dark up to 60 feet.'
        },
        {
          name: 'Spell-Like Ability',
          description: 'Magic stone 1/day as a spell-like ability.'
        },
        {
          name: 'Energy Resistance',
          description: 'Acid resistance 5.'
        },
        {
          name: 'Earth Affinity',
          description: 'Oread sorcerers with elemental (earth) bloodline treat Charisma as 2 higher.'
        }
      ],
      languages: {
        starting: ['Common', 'Terran'],
        bonus: ['Aquan', 'Auran', 'Dwarven', 'Elven', 'Gnome', 'Halfling', 'Ignan', 'Undercommon']
      }
    },
    {
      id: 'ratfolk',
      name: 'Ratfolk',
      category: 'Featured',
      size: 'Small',
      type: 'Humanoid (ratfolk)',
      speed: 20,
      abilityMods: { DEX: 2, INT: 2, STR: -2 },
      racialTraits: [
        {
          name: 'Small',
          description: '+1 size bonus to AC and attack rolls, -1 penalty to CMB and CMD, +4 size bonus on Stealth.'
        },
        {
          name: 'Darkvision',
          description: 'Ratfolk can see in the dark up to 60 feet.'
        },
        {
          name: 'Rodent Empathy',
          description: 'Can communicate with rodents, +4 racial bonus on Handle Animal with rodents.'
        },
        {
          name: 'Swarming',
          description: 'Can share square with another ratfolk, gain benefits when doing so.'
        },
        {
          name: 'Tinker',
          description: '+2 racial bonus on Craft (alchemy), Perception, and Use Magic Device.'
        }
      ],
      languages: {
        starting: ['Common'],
        bonus: ['Aklo', 'Draconic', 'Dwarven', 'Gnoll', 'Gnome', 'Goblin', 'Halfling', 'Orc', 'Undercommon']
      }
    },
    {
      id: 'sylph',
      name: 'Sylph',
      category: 'Featured',
      size: 'Medium',
      type: 'Outsider (native)',
      speed: 30,
      abilityMods: { DEX: 2, INT: 2, CON: -2 },
      racialTraits: [
        {
          name: 'Darkvision',
          description: 'Sylphs can see in the dark up to 60 feet.'
        },
        {
          name: 'Spell-Like Ability',
          description: 'Feather fall 1/day as a spell-like ability.'
        },
        {
          name: 'Energy Resistance',
          description: 'Electricity resistance 5.'
        },
        {
          name: 'Air Affinity',
          description: 'Sylph sorcerers with elemental (air) bloodline treat Charisma as 2 higher.'
        }
      ],
      languages: {
        starting: ['Common', 'Auran'],
        bonus: ['Aquan', 'Dwarven', 'Elven', 'Gnome', 'Halfling', 'Ignan', 'Terran']
      }
    },
    {
      id: 'tengu',
      name: 'Tengu',
      category: 'Featured',
      size: 'Medium',
      type: 'Humanoid (tengu)',
      speed: 30,
      abilityMods: { DEX: 2, WIS: 2, CON: -2 },
      racialTraits: [
        {
          name: 'Low-Light Vision',
          description: 'Tengus can see twice as far as humans in dim light.'
        },
        {
          name: 'Sneaky',
          description: '+2 racial bonus on Perception and Stealth checks.'
        },
        {
          name: 'Gifted Linguist',
          description: '+4 racial bonus on Linguistics, learn 2 languages per rank.'
        },
        {
          name: 'Swordtrained',
          description: 'Proficient with swordlike weapons.'
        },
        {
          name: 'Natural Weapon',
          description: 'Bite attack dealing 1d3 damage.'
        }
      ],
      languages: {
        starting: ['Common', 'Tengu'],
        bonus: 'Any (except secret languages)'
      }
    },
    {
      id: 'tiefling',
      name: 'Tiefling',
      category: 'Featured',
      size: 'Medium',
      type: 'Outsider (native)',
      speed: 30,
      abilityMods: { DEX: 2, INT: 2, CHA: -2 },
      racialTraits: [
        {
          name: 'Darkvision',
          description: 'Tieflings can see in the dark up to 60 feet.'
        },
        {
          name: 'Skilled',
          description: '+2 racial bonus on Bluff and Stealth checks.'
        },
        {
          name: 'Spell-Like Ability',
          description: 'Darkness once per day as a spell-like ability.'
        },
        {
          name: 'Fiendish Resistance',
          description: 'Cold resistance 5, electricity resistance 5, and fire resistance 5.'
        },
        {
          name: 'Fiendish Sorcery',
          description: 'Tiefling sorcerers with Abyssal or Infernal bloodline treat Charisma as 2 higher.'
        }
      ],
      languages: {
        starting: ['Common', 'Infernal'],
        bonus: ['Abyssal', 'Draconic', 'Dwarven', 'Elven', 'Gnome', 'Goblin', 'Halfling', 'Orc']
      }
    },
    {
      id: 'undine',
      name: 'Undine',
      category: 'Featured',
      size: 'Medium',
      type: 'Outsider (native)',
      speed: 30,
      swimSpeed: 30,
      abilityMods: { DEX: 2, WIS: 2, STR: -2 },
      racialTraits: [
        {
          name: 'Darkvision',
          description: 'Undines can see in the dark up to 60 feet.'
        },
        {
          name: 'Spell-Like Ability',
          description: 'Hydraulic push 1/day as a spell-like ability.'
        },
        {
          name: 'Energy Resistance',
          description: 'Cold resistance 5.'
        },
        {
          name: 'Water Affinity',
          description: 'Undine sorcerers with elemental (water) bloodline treat Charisma as 2 higher.'
        },
        {
          name: 'Amphibious',
          description: 'Can breathe both air and water.'
        }
      ],
      languages: {
        starting: ['Common', 'Aquan'],
        bonus: ['Auran', 'Dwarven', 'Elven', 'Gnome', 'Halfling', 'Ignan', 'Terran']
      }
    }
  ],
  
  // Uncommon Races
  uncommon: [
    {
      id: 'changeling',
      name: 'Changeling',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid (changeling)',
      speed: 30,
      abilityMods: { WIS: 2, CHA: 2, CON: -2 },
      racialTraits: [
        {
          name: 'Darkvision',
          description: 'Changelings can see in the dark up to 60 feet.'
        },
        {
          name: 'Hulking Changeling',
          description: '+1 racial bonus on melee damage (alternate trait option).'
        },
        {
          name: 'Green Widow',
          description: '+2 racial bonus on Bluff against attracted creatures (alternate trait option).'
        },
        {
          name: 'Sea Lungs',
          description: 'Can hold breath for rounds equal to 3x Constitution (alternate trait option).'
        },
        {
          name: 'Natural Armor',
          description: '+1 natural armor bonus.'
        }
      ],
      languages: {
        starting: ['Common', 'First mother\'s language'],
        bonus: ['Aklo', 'Draconic', 'Dwarven', 'Elven', 'Giant', 'Gnoll', 'Goblin', 'Orc']
      }
    },
    {
      id: 'duergar',
      name: 'Duergar',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid (dwarf)',
      speed: 20,
      abilityMods: { CON: 2, WIS: 2, CHA: -4 },
      racialTraits: [
        {
          name: 'Superior Darkvision',
          description: 'Duergar can see in the dark up to 120 feet.'
        },
        {
          name: 'Duergar Immunities',
          description: 'Immune to paralysis, phantasms, and poison.'
        },
        {
          name: 'Stability',
          description: '+4 racial bonus to CMD against bull rush or trip.'
        },
        {
          name: 'Spell-Like Abilities',
          description: 'Enlarge person and invisibility each 1/day (self only).'
        },
        {
          name: 'Light Sensitivity',
          description: 'Dazzled in areas of bright light.'
        }
      ],
      languages: {
        starting: ['Common', 'Dwarven', 'Undercommon'],
        bonus: ['Aklo', 'Draconic', 'Giant', 'Goblin', 'Orc', 'Terran']
      }
    },
    {
      id: 'gillman',
      name: 'Gillman',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid (aquatic)',
      speed: 30,
      swimSpeed: 30,
      abilityMods: { CON: 2, CHA: 2, WIS: -2 },
      racialTraits: [
        {
          name: 'Amphibious',
          description: 'Can breathe both air and water.'
        },
        {
          name: 'Enchantment Resistance',
          description: '+2 racial saving throw bonus against non-aboleth enchantments, -2 against aboleth.'
        },
        {
          name: 'Water Dependent',
          description: 'Must immerse in water for 1 hour per day or take Constitution damage.'
        }
      ],
      languages: {
        starting: ['Common', 'Aboleth'],
        bonus: ['Aklo', 'Aquan', 'Draconic', 'Elven']
      }
    },
    {
      id: 'grippli',
      name: 'Grippli',
      category: 'Uncommon',
      size: 'Small',
      type: 'Humanoid (grippli)',
      speed: 30,
      climbSpeed: 20,
      abilityMods: { DEX: 2, WIS: 2, STR: -2 },
      racialTraits: [
        {
          name: 'Small',
          description: '+1 size bonus to AC and attack rolls, -1 penalty to CMB and CMD, +4 size bonus on Stealth.'
        },
        {
          name: 'Darkvision',
          description: 'Gripplis can see in the dark up to 60 feet.'
        },
        {
          name: 'Camouflage',
          description: '+4 racial bonus on Stealth in marshes and forests.'
        },
        {
          name: 'Swamp Stride',
          description: 'Can move through difficult terrain at normal speed in swamps.'
        },
        {
          name: 'Weapon Familiarity',
          description: 'Proficient with nets.'
        }
      ],
      languages: {
        starting: ['Common', 'Grippli'],
        bonus: ['Boggard', 'Draconic', 'Elven', 'Gnome', 'Goblin', 'Sylvan']
      }
    },
    {
      id: 'kitsune',
      name: 'Kitsune',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid (kitsune, shapechanger)',
      speed: 30,
      abilityMods: { DEX: 2, CHA: 2, STR: -2 },
      racialTraits: [
        {
          name: 'Low-Light Vision',
          description: 'Kitsune can see twice as far as humans in dim light.'
        },
        {
          name: 'Change Shape',
          description: 'Can assume a specific human form.'
        },
        {
          name: 'Agile',
          description: '+2 racial bonus on Acrobatics checks.'
        },
        {
          name: 'Kitsune Magic',
          description: '+1 to DC of enchantment spells, dancing lights 3/day.'
        },
        {
          name: 'Natural Weapons',
          description: 'Bite attack dealing 1d4 damage.'
        }
      ],
      languages: {
        starting: ['Common', 'Sylvan'],
        bonus: 'Any (except secret languages)'
      }
    },
    {
      id: 'merfolk',
      name: 'Merfolk',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid (aquatic)',
      speed: 5,
      swimSpeed: 50,
      abilityMods: { DEX: 2, CON: 2, CHA: 2 },
      racialTraits: [
        {
          name: 'Low-Light Vision',
          description: 'Merfolk can see twice as far as humans in dim light.'
        },
        {
          name: 'Amphibious',
          description: 'Can breathe both air and water.'
        },
        {
          name: 'Armor',
          description: '+2 natural armor bonus.'
        },
        {
          name: 'Legless',
          description: 'Cannot be tripped, 5 ft land speed.'
        }
      ],
      languages: {
        starting: ['Common', 'Aquan'],
        bonus: ['Aboleth', 'Aklo', 'Draconic', 'Elven', 'Sahuagin', 'Sylvan']
      }
    },
    {
      id: 'nagaji',
      name: 'Nagaji',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid (reptilian)',
      speed: 30,
      abilityMods: { STR: 2, CHA: 2, INT: -2 },
      racialTraits: [
        {
          name: 'Low-Light Vision',
          description: 'Nagaji can see twice as far as humans in dim light.'
        },
        {
          name: 'Armored Scales',
          description: '+1 natural armor bonus.'
        },
        {
          name: 'Resistant',
          description: '+2 racial saving throw bonus against mind-affecting and poison.'
        },
        {
          name: 'Serpent\'s Sense',
          description: '+2 racial bonus on Handle Animal with reptiles, +2 on Perception.'
        }
      ],
      languages: {
        starting: ['Common', 'Draconic'],
        bonus: ['Abyssal', 'Aklo', 'Celestial', 'Dwarven', 'Giant', 'Infernal', 'Orc', 'Sylvan', 'Undercommon']
      }
    },
    {
      id: 'samsaran',
      name: 'Samsaran',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid (samsaran)',
      speed: 30,
      abilityMods: { INT: 2, WIS: 2, CON: -2 },
      racialTraits: [
        {
          name: 'Low-Light Vision',
          description: 'Samsarans can see twice as far as humans in dim light.'
        },
        {
          name: 'Lifebound',
          description: '+2 racial bonus on saves against death effects, negative energy, and stabilization.'
        },
        {
          name: 'Samsaran Magic',
          description: 'Comprehend languages, deathwatch, and stabilize as spell-like abilities 1/day.'
        },
        {
          name: 'Shards of the Past',
          description: '+2 racial bonus on two Knowledge skills.'
        }
      ],
      languages: {
        starting: ['Common', 'Samsaran'],
        bonus: 'Any (except secret languages)'
      }
    },
    {
      id: 'strix',
      name: 'Strix',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid (strix)',
      speed: 30,
      flySpeed: 60,
      abilityMods: { DEX: 2, CHA: -2 },
      racialTraits: [
        {
          name: 'Low-Light Vision',
          description: 'Strix can see twice as far as humans in dim light.'
        },
        {
          name: 'Darkvision',
          description: 'Strix can see in the dark up to 60 feet.'
        },
        {
          name: 'Hatred',
          description: '+1 racial bonus on attack rolls against humans.'
        },
        {
          name: 'Nocturnal',
          description: '+2 racial bonus on Perception and Stealth in dim light or darkness.'
        },
        {
          name: 'Suspicious',
          description: '+2 racial bonus on saves against illusion.'
        },
        {
          name: 'Flight',
          description: 'Fly speed 60 feet (average maneuverability).'
        }
      ],
      languages: {
        starting: ['Strix'],
        bonus: ['Auran', 'Common', 'Draconic', 'Giant', 'Gnome', 'Goblin', 'Infernal']
      }
    },
    {
      id: 'suli',
      name: 'Suli',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Outsider (native)',
      speed: 30,
      abilityMods: { STR: 2, CHA: 2, INT: -2 },
      racialTraits: [
        {
          name: 'Low-Light Vision',
          description: 'Sulis can see twice as far as humans in dim light.'
        },
        {
          name: 'Negotiator',
          description: '+2 racial bonus on Diplomacy and Sense Motive.'
        },
        {
          name: 'Elemental Resistance',
          description: 'Acid, cold, electricity, and fire resistance 5.'
        },
        {
          name: 'Elemental Assault',
          description: '1/day swift action to shroud arms in elemental energy for 1d6 damage.'
        }
      ],
      languages: {
        starting: ['Common', 'One elemental language'],
        bonus: ['Aquan', 'Auran', 'Draconic', 'Ignan', 'Terran']
      }
    },
    {
      id: 'svirfneblin',
      name: 'Svirfneblin',
      category: 'Uncommon',
      size: 'Small',
      type: 'Humanoid (gnome)',
      speed: 20,
      abilityMods: { DEX: 2, WIS: 2, STR: -2, CHA: -4 },
      racialTraits: [
        {
          name: 'Small',
          description: '+1 size bonus to AC and attack rolls, -1 penalty to CMB and CMD, +4 size bonus on Stealth.'
        },
        {
          name: 'Darkvision',
          description: 'Svirfneblin can see in the dark up to 120 feet.'
        },
        {
          name: 'Defensive Training',
          description: '+2 dodge bonus to AC.'
        },
        {
          name: 'Svirfneblin Magic',
          description: '+1 to DC of illusion spells, constant nondetection.'
        },
        {
          name: 'Spell Resistance',
          description: 'Spell resistance equal to 11 + class level.'
        },
        {
          name: 'Stonecunning',
          description: '+2 bonus on Perception for unusual stonework.'
        },
        {
          name: 'Fortunate',
          description: '+2 racial bonus on all saving throws.'
        },
        {
          name: 'Skills',
          description: '+2 racial bonus on Stealth, +2 on Craft (alchemy) and Perception.'
        }
      ],
      languages: {
        starting: ['Gnome', 'Undercommon'],
        bonus: ['Aklo', 'Common', 'Draconic', 'Dwarven', 'Elven', 'Giant', 'Goblin', 'Orc', 'Terran']
      }
    },
    {
      id: 'vanara',
      name: 'Vanara',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid (vanara)',
      speed: 30,
      climbSpeed: 20,
      abilityMods: { DEX: 2, WIS: 2, CHA: -2 },
      racialTraits: [
        {
          name: 'Low-Light Vision',
          description: 'Vanaras can see twice as far as humans in dim light.'
        },
        {
          name: 'Nimble',
          description: '+2 racial bonus on Acrobatics and Stealth.'
        },
        {
          name: 'Prehensile Tail',
          description: 'Can retrieve small objects as a swift action.'
        },
        {
          name: 'Climb Speed',
          description: '20 foot climb speed.'
        }
      ],
      languages: {
        starting: ['Common', 'Vanaran'],
        bonus: ['Aklo', 'Celestial', 'Elven', 'Gnome', 'Goblin', 'Sylvan']
      }
    },
    {
      id: 'vishkanya',
      name: 'Vishkanya',
      category: 'Uncommon',
      size: 'Medium',
      type: 'Humanoid (vishkanya)',
      speed: 30,
      abilityMods: { DEX: 2, CHA: 2, WIS: -2 },
      racialTraits: [
        {
          name: 'Low-Light Vision',
          description: 'Vishkanyas can see twice as far as humans in dim light.'
        },
        {
          name: 'Keen Senses',
          description: '+2 racial bonus on Perception checks.'
        },
        {
          name: 'Limber',
          description: '+2 racial bonus on Escape Artist and Stealth.'
        },
        {
          name: 'Poison Resistance',
          description: '+2 racial saving throw bonus against poison.'
        },
        {
          name: 'Poison Use',
          description: 'Cannot accidentally poison themselves.'
        },
        {
          name: 'Toxic',
          description: 'Can apply poisonous saliva to weapon as a swift action.'
        },
        {
          name: 'Weapon Familiarity',
          description: 'Proficient with blowgun, kukri, and shuriken.'
        }
      ],
      languages: {
        starting: ['Common', 'Vishkanya'],
        bonus: ['Aklo', 'Draconic', 'Elven', 'Goblin', 'Sylvan', 'Undercommon']
      }
    },
    {
      id: 'wayang',
      name: 'Wayang',
      category: 'Uncommon',
      size: 'Small',
      type: 'Humanoid (wayang)',
      speed: 20,
      abilityMods: { DEX: 2, INT: 2, WIS: -2 },
      racialTraits: [
        {
          name: 'Small',
          description: '+1 size bonus to AC and attack rolls, -1 penalty to CMB and CMD, +4 size bonus on Stealth.'
        },
        {
          name: 'Darkvision',
          description: 'Wayangs can see in the dark up to 60 feet.'
        },
        {
          name: 'Light and Dark',
          description: '1/day ghost sound, pass without trace, ventriloquism as spell-like abilities.'
        },
        {
          name: 'Lurker',
          description: '+2 racial bonus on Perception and Stealth.'
        },
        {
          name: 'Shadow Magic',
          description: '+1 to DC of spells with shadow descriptor.'
        },
        {
          name: 'Shadow Resistance',
          description: 'Cold and electricity resistance 5.'
        }
      ],
      languages: {
        starting: ['Common', 'Wayang'],
        bonus: 'Any (except secret languages)'
      }
    }
  ]
}

// Helper function to get all races in a flat array
export function getAllRaces() {
  return [
    ...pathfinderRaces.core,
    ...pathfinderRaces.featured,
    ...pathfinderRaces.uncommon
  ]
}

// Helper function to get race by ID
export function getRaceById(id) {
  return getAllRaces().find(race => race.id === id)
}

// Helper function to calculate total ability modifiers for a race
export function getRaceAbilityModifiers(race) {
  if (race.abilityMods.any) {
    // Races with flexible ability score increases (like Human)
    return { flexible: race.abilityMods.any }
  }
  return race.abilityMods
}

// Helper function to get racial traits as formatted text
export function getRaceTraitsText(race) {
  return race.racialTraits.map(trait => 
    `${trait.name}: ${trait.description}`
  ).join('\n')
}