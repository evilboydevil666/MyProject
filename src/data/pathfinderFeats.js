// Pathfinder 1e Feats Database
// Organized by category with full prerequisites and descriptions

export const pathfinderFeats = {
  // General Feats
  general: [
    {
      name: "Acrobatic",
      type: "General",
      prerequisites: null,
      benefit: "+2 bonus on all Acrobatics and Fly skill checks. If you have 10 or more ranks in one of these skills, the bonus increases to +4.",
      normal: null,
      special: null
    },
    {
      name: "Alertness",
      type: "General",
      prerequisites: null,
      benefit: "+2 bonus on Perception and Sense Motive skill checks. If you have 10 or more ranks in one of these skills, the bonus increases to +4.",
      normal: null,
      special: null
    },
    {
      name: "Animal Affinity",
      type: "General",
      prerequisites: null,
      benefit: "+2 bonus on all Handle Animal and Ride skill checks. If you have 10 or more ranks in one of these skills, the bonus increases to +4.",
      normal: null,
      special: null
    },
    {
      name: "Armor Proficiency (Light)",
      type: "General",
      prerequisites: null,
      benefit: "When you wear light armor, the armor check penalty applies only to Dexterity- and Strength-based skill checks.",
      normal: "A character who is wearing armor with which they are not proficient applies its armor check penalty to attack rolls and to all skill checks that involve moving.",
      special: "All characters except monks, sorcerers, and wizards automatically have Light Armor Proficiency as a bonus feat."
    },
    {
      name: "Armor Proficiency (Medium)",
      type: "General",
      prerequisites: "Light Armor Proficiency",
      benefit: "When you wear medium armor, the armor check penalty applies only to Dexterity- and Strength-based skill checks.",
      normal: "See Armor Proficiency (Light).",
      special: "Barbarians, clerics, druids, fighters, paladins, and rangers automatically have Medium Armor Proficiency as a bonus feat."
    },
    {
      name: "Armor Proficiency (Heavy)",
      type: "General",
      prerequisites: "Light Armor Proficiency, Medium Armor Proficiency",
      benefit: "When you wear heavy armor, the armor check penalty applies only to Dexterity- and Strength-based skill checks.",
      normal: "See Armor Proficiency (Light).",
      special: "Fighters and paladins automatically have Heavy Armor Proficiency as a bonus feat."
    },
    {
      name: "Athletic",
      type: "General",
      prerequisites: null,
      benefit: "+2 bonus on Climb and Swim skill checks. If you have 10 or more ranks in one of these skills, the bonus increases to +4.",
      normal: null,
      special: null
    },
    {
      name: "Deceitful",
      type: "General",
      prerequisites: null,
      benefit: "+2 bonus on all Bluff and Disguise skill checks. If you have 10 or more ranks in one of these skills, the bonus increases to +4.",
      normal: null,
      special: null
    },
    {
      name: "Deft Hands",
      type: "General",
      prerequisites: null,
      benefit: "+2 bonus on all Disable Device and Sleight of Hand skill checks. If you have 10 or more ranks in one of these skills, the bonus increases to +4.",
      normal: null,
      special: null
    },
    {
      name: "Endurance",
      type: "General",
      prerequisites: null,
      benefit: "+4 bonus on Swim checks to resist nonlethal damage from exhaustion; Constitution checks to continue running; Constitution checks to avoid nonlethal damage from forced march; Constitution checks to hold breath; Constitution checks to avoid nonlethal damage from starvation or thirst; Fortitude saves to avoid nonlethal damage from hot or cold environments; and Fortitude saves to resist damage from suffocation. You may sleep in light or medium armor without becoming fatigued.",
      normal: "A character without this feat who sleeps in medium or heavier armor is fatigued the next day.",
      special: null
    },
    {
      name: "Eschew Materials",
      type: "General",
      prerequisites: null,
      benefit: "You can cast any spell with a material component costing 1 gp or less without needing that component.",
      normal: null,
      special: null
    },
    {
      name: "Exotic Weapon Proficiency",
      type: "General",
      prerequisites: "Base attack bonus +1",
      benefit: "Choose one type of exotic weapon. You understand how to use that type of exotic weapon in combat, and can utilize any special tricks or qualities that exotic weapon might allow.",
      normal: "A character who uses a weapon with which he is not proficient takes a -4 penalty on attack rolls.",
      special: "You can gain Exotic Weapon Proficiency multiple times. Each time you take the feat, it applies to a new type of exotic weapon."
    },
    {
      name: "Fleet",
      type: "General",
      prerequisites: null,
      benefit: "While you are wearing light or no armor, your base speed increases by 5 feet.",
      normal: null,
      special: null
    },
    {
      name: "Great Fortitude",
      type: "General",
      prerequisites: null,
      benefit: "+2 bonus on all Fortitude saving throws.",
      normal: null,
      special: null
    },
    {
      name: "Improved Initiative",
      type: "General",
      prerequisites: null,
      benefit: "+4 bonus on initiative checks.",
      normal: null,
      special: null
    },
    {
      name: "Iron Will",
      type: "General",
      prerequisites: null,
      benefit: "+2 bonus on all Will saving throws.",
      normal: null,
      special: null
    },
    {
      name: "Lightning Reflexes",
      type: "General",
      prerequisites: null,
      benefit: "+2 bonus on all Reflex saving throws.",
      normal: null,
      special: null
    },
    {
      name: "Magical Aptitude",
      type: "General",
      prerequisites: null,
      benefit: "+2 bonus on all Spellcraft and Use Magic Device skill checks. If you have 10 or more ranks in one of these skills, the bonus increases to +4.",
      normal: null,
      special: null
    },
    {
      name: "Martial Weapon Proficiency",
      type: "General",
      prerequisites: null,
      benefit: "Choose a type of martial weapon. You understand how to use that type of martial weapon in combat.",
      normal: "When using a weapon with which you are not proficient, you take a -4 penalty on attack rolls.",
      special: "Barbarians, fighters, paladins, and rangers are proficient with all martial weapons. They need not select this feat."
    },
    {
      name: "Persuasive",
      type: "General",
      prerequisites: null,
      benefit: "+2 bonus on Diplomacy and Intimidate skill checks. If you have 10 or more ranks in one of these skills, the bonus increases to +4.",
      normal: null,
      special: null
    },
    {
      name: "Run",
      type: "General",
      prerequisites: null,
      benefit: "When running, you move five times your normal speed (if wearing medium, light, or no armor and carrying no more than a medium load) or four times your speed (if wearing heavy armor or carrying a heavy load). If you make a jump after a running start (see Acrobatics), you gain a +4 bonus on your Acrobatics check. While running, you retain your Dexterity bonus to your Armor Class.",
      normal: "You move four times your speed while running (if wearing medium, light, or no armor and carrying no more than a medium load) or three times your speed (if wearing heavy armor or carrying a heavy load), and you lose your Dexterity bonus to AC.",
      special: null
    },
    {
      name: "Self-Sufficient",
      type: "General",
      prerequisites: null,
      benefit: "+2 bonus on all Heal and Survival skill checks. If you have 10 or more ranks in one of these skills, the bonus increases to +4.",
      normal: null,
      special: null
    },
    {
      name: "Shield Proficiency",
      type: "General",
      prerequisites: null,
      benefit: "When you use a shield (except a tower shield), the shield's armor check penalty only applies to Strength- and Dexterity-based skills.",
      normal: "When you are using a shield with which you are not proficient, you take the shield's armor check penalty on attack rolls and on all skill checks that involve moving.",
      special: "Barbarians, bards, clerics, druids, fighters, paladins, and rangers all automatically have Shield Proficiency as a bonus feat."
    },
    {
      name: "Simple Weapon Proficiency",
      type: "General",
      prerequisites: null,
      benefit: "You are trained in the use of all simple weapons.",
      normal: "When using a weapon with which you are not proficient, you take a -4 penalty on attack rolls.",
      special: "All characters except for druids, monks, and wizards are automatically proficient with all simple weapons."
    },
    {
      name: "Skill Focus",
      type: "General",
      prerequisites: null,
      benefit: "Choose a skill. You get a +3 bonus on all checks involving the chosen skill. If you have 10 or more ranks in that skill, this bonus increases to +6.",
      normal: null,
      special: "You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new skill."
    },
    {
      name: "Stealthy",
      type: "General",
      prerequisites: null,
      benefit: "+2 bonus on all Escape Artist and Stealth skill checks. If you have 10 or more ranks in one of these skills, the bonus increases to +4.",
      normal: null,
      special: null
    },
    {
      name: "Toughness",
      type: "General",
      prerequisites: null,
      benefit: "You gain +3 hit points. For every Hit Die you possess beyond 3, you gain an additional +1 hit point. If you have more than 3 Hit Dice, you gain +1 hit points whenever you gain a Hit Die.",
      normal: null,
      special: null
    }
  ],

  // Combat Feats
  combat: [
    {
      name: "Agile Maneuvers",
      type: "Combat",
      prerequisites: null,
      benefit: "You add your Dexterity bonus to your base attack bonus and size bonus when determining your Combat Maneuver Bonus instead of your Strength bonus.",
      normal: "You add your Strength bonus to your base attack bonus and size bonus when determining your Combat Maneuver Bonus.",
      special: null
    },
    {
      name: "Blind-Fight",
      type: "Combat",
      prerequisites: null,
      benefit: "In melee, every time you miss because of concealment (see Combat), you can reroll your miss chance percentile roll one time to see if you actually hit. An invisible attacker gets no advantages related to hitting you in melee. You do not lose your Dexterity bonus to Armor Class, and the attacker doesn't get the usual +2 bonus for being invisible. The invisible attacker's bonuses do still apply for ranged attacks, however. You do not need to make Acrobatics skill checks to move at full speed while blinded.",
      normal: "Regular attack roll modifiers for invisible attackers trying to hit you apply, and you lose your Dexterity bonus to AC. The speed reduction for darkness and poor visibility also applies.",
      special: null
    },
    {
      name: "Catch Off-Guard",
      type: "Combat",
      prerequisites: null,
      benefit: "You do not suffer any penalties for using an improvised melee weapon. Unarmed opponents are flat-footed against any attacks you make with an improvised melee weapon.",
      normal: "You take a -4 penalty on attack rolls made with an improvised weapon.",
      special: null
    },
    {
      name: "Combat Expertise",
      type: "Combat",
      prerequisites: "Int 13",
      benefit: "You can choose to take a -1 penalty on melee attack rolls and combat maneuver checks to gain a +1 dodge bonus to your Armor Class. When your base attack bonus reaches +4, and every +4 thereafter, the penalty increases by -1 and the dodge bonus increases by +1. You can only choose to use this feat when you declare that you are making an attack or a full-attack action with a melee weapon. The effects of this feat last until your next turn.",
      normal: null,
      special: null
    },
    {
      name: "Combat Reflexes",
      type: "Combat",
      prerequisites: null,
      benefit: "You may make a number of additional attacks of opportunity per round equal to your Dexterity bonus. With this feat, you may also make attacks of opportunity while flat-footed.",
      normal: "A character without this feat can make only one attack of opportunity per round and can't make attacks of opportunity while flat-footed.",
      special: null
    },
    {
      name: "Deadly Aim",
      type: "Combat",
      prerequisites: "Dex 13, base attack bonus +1",
      benefit: "You can choose to take a -1 penalty on all ranged attack rolls to gain a +2 bonus on all ranged damage rolls. When your base attack bonus reaches +4, and every +4 thereafter, the penalty increases by -1 and the bonus to damage increases by +2. You must choose to use this feat before making an attack roll and its effects last until your next turn. The bonus damage does not apply to touch attacks or effects that do not deal hit point damage.",
      normal: null,
      special: null
    },
    {
      name: "Defensive Combat Training",
      type: "Combat",
      prerequisites: null,
      benefit: "You treat your total Hit Dice as your base attack bonus when calculating your Combat Maneuver Defense.",
      normal: null,
      special: null
    },
    {
      name: "Diehard",
      type: "Combat",
      prerequisites: "Endurance",
      benefit: "When your hit point total is below 0, but you are not dead, you automatically stabilize. You do not need to make a Constitution check each round to avoid losing additional hit points. You may choose to act as if you were disabled, rather than dying. You must make this decision as soon as you are reduced to negative hit points (even if it isn't your turn). If you do not choose to act as if you were disabled, you immediately fall unconscious. When using this feat, you are staggered. You can take a move action without further injuring yourself, but if you perform any standard action (or any other action deemed as strenuous, including some swift actions, such as casting a quickened spell) you take 1 point of damage after completing the act. If you reach -10 hit points, you immediately die.",
      normal: "A character without this feat who is reduced to negative hit points is unconscious and dying.",
      special: null
    },
    {
      name: "Dodge",
      type: "Combat",
      prerequisites: "Dex 13",
      benefit: "You gain a +1 dodge bonus to your AC. A condition that makes you lose your Dex bonus to AC also makes you lose the benefits of this feat.",
      normal: null,
      special: null
    },
    {
      name: "Improved Bull Rush",
      type: "Combat",
      prerequisites: "Str 13, Power Attack, base attack bonus +1",
      benefit: "You do not provoke an attack of opportunity when performing a bull rush combat maneuver. In addition, you receive a +2 bonus on checks made to bull rush a foe. You also receive a +2 bonus to your Combat Maneuver Defense whenever an opponent tries to bull rush you.",
      normal: "You provoke an attack of opportunity when performing a bull rush combat maneuver.",
      special: null
    },
    {
      name: "Improved Critical",
      type: "Combat",
      prerequisites: "Proficiency with weapon, base attack bonus +8",
      benefit: "When using the weapon you selected, your threat range is doubled.",
      normal: null,
      special: "You can gain Improved Critical multiple times. The effects do not stack. Each time you take the feat, it applies to a new type of weapon. This effect doesn't stack with any other effect that expands the threat range of a weapon."
    },
    {
      name: "Improved Disarm",
      type: "Combat",
      prerequisites: "Int 13, Combat Expertise",
      benefit: "You do not provoke an attack of opportunity when performing a disarm combat maneuver. In addition, you receive a +2 bonus on checks made to disarm a foe. You also receive a +2 bonus to your Combat Maneuver Defense whenever an opponent tries to disarm you.",
      normal: "You provoke an attack of opportunity when performing a disarm combat maneuver.",
      special: null
    },
    {
      name: "Improved Feint",
      type: "Combat",
      prerequisites: "Int 13, Combat Expertise",
      benefit: "You can make a Bluff check to feint in combat as a move action.",
      normal: "Feinting in combat is a standard action.",
      special: null
    },
    {
      name: "Improved Grapple",
      type: "Combat",
      prerequisites: "Dex 13, Improved Unarmed Strike",
      benefit: "You do not provoke an attack of opportunity when performing a grapple combat maneuver. In addition, you receive a +2 bonus on checks made to grapple a foe. You also receive a +2 bonus to your Combat Maneuver Defense whenever an opponent tries to grapple you.",
      normal: "You provoke an attack of opportunity when performing a grapple combat maneuver.",
      special: null
    },
    {
      name: "Improved Overrun",
      type: "Combat",
      prerequisites: "Str 13, Power Attack, base attack bonus +1",
      benefit: "You do not provoke an attack of opportunity when performing an overrun combat maneuver. In addition, you receive a +2 bonus on checks made to overrun a foe. You also receive a +2 bonus to your Combat Maneuver Defense whenever an opponent tries to overrun you. Targets of your overrun attempt may not choose to avoid you.",
      normal: "You provoke an attack of opportunity when performing an overrun combat maneuver.",
      special: null
    },
    {
      name: "Improved Shield Bash",
      type: "Combat",
      prerequisites: "Shield Proficiency",
      benefit: "When you perform a shield bash, you may still apply the shield's shield bonus to your AC.",
      normal: "Without this feat, a character that performs a shield bash loses the shield's shield bonus to AC until the beginning of their next turn.",
      special: null
    },
    {
      name: "Improved Sunder",
      type: "Combat",
      prerequisites: "Str 13, Power Attack, base attack bonus +1",
      benefit: "You do not provoke an attack of opportunity when performing a sunder combat maneuver. In addition, you receive a +2 bonus on checks made to sunder an item. You also receive a +2 bonus to your Combat Maneuver Defense whenever an opponent tries to sunder your gear.",
      normal: "You provoke an attack of opportunity when performing a sunder combat maneuver.",
      special: null
    },
    {
      name: "Improved Trip",
      type: "Combat",
      prerequisites: "Int 13, Combat Expertise",
      benefit: "You do not provoke an attack of opportunity when performing a trip combat maneuver. In addition, you receive a +2 bonus on checks made to trip a foe. You also receive a +2 bonus to your Combat Maneuver Defense whenever an opponent tries to trip you.",
      normal: "You provoke an attack of opportunity when performing a trip combat maneuver.",
      special: null
    },
    {
      name: "Improved Two-Weapon Fighting",
      type: "Combat",
      prerequisites: "Dex 17, Two-Weapon Fighting, base attack bonus +6",
      benefit: "In addition to the standard single extra attack you get with an off-hand weapon, you get a second attack with it, albeit at a -5 penalty.",
      normal: "Without this feat, you can only get a single extra attack with an off-hand weapon.",
      special: null
    },
    {
      name: "Improved Unarmed Strike",
      type: "Combat",
      prerequisites: null,
      benefit: "You are considered to be armed even when unarmed—you do not provoke attacks of opportunity when you attack foes while unarmed. Your unarmed strikes can deal lethal or nonlethal damage, at your choice.",
      normal: "Without this feat, you are considered unarmed when attacking with an unarmed strike, and you can deal only nonlethal damage with such an attack.",
      special: null
    },
    {
      name: "Intimidating Prowess",
      type: "Combat",
      prerequisites: null,
      benefit: "Add your Strength modifier to Intimidate skill checks in addition to your Charisma modifier.",
      normal: null,
      special: null
    },
    {
      name: "Lunge",
      type: "Combat",
      prerequisites: "Base attack bonus +6",
      benefit: "You can increase the reach of your melee attacks by 5 feet until the end of your turn by taking a -2 penalty to your AC until your next turn. You must decide to use this ability before any attacks are made.",
      normal: null,
      special: null
    },
    {
      name: "Mobility",
      type: "Combat",
      prerequisites: "Dex 13, Dodge",
      benefit: "You get a +4 dodge bonus to Armor Class against attacks of opportunity caused when you move out of or within a threatened area. A condition that makes you lose your Dexterity bonus to Armor Class (if any) also makes you lose dodge bonuses. Dodge bonuses stack with each other, unlike most types of bonuses.",
      normal: null,
      special: null
    },
    {
      name: "Mounted Combat",
      type: "Combat",
      prerequisites: "Ride 1 rank",
      benefit: "Once per round when your mount is hit in combat, you may attempt a Ride check (as an immediate action) to negate the hit. The hit is negated if your Ride check result is greater than the opponent's attack roll.",
      normal: null,
      special: null
    },
    {
      name: "Point-Blank Shot",
      type: "Combat",
      prerequisites: null,
      benefit: "You get a +1 bonus on attack and damage rolls with ranged weapons at ranges of up to 30 feet.",
      normal: null,
      special: null
    },
    {
      name: "Power Attack",
      type: "Combat",
      prerequisites: "Str 13, base attack bonus +1",
      benefit: "You can choose to take a -1 penalty on all melee attack rolls and combat maneuver checks to gain a +2 bonus on all melee damage rolls. This bonus to damage is increased by half (+50%) if you are making an attack with a two-handed weapon, a one handed weapon using two hands, or a primary natural weapon that adds 1-1/2 times your Strength modifier on damage rolls. This bonus to damage is halved (-50%) if you are making an attack with an off-hand weapon or secondary natural weapon. When your base attack bonus reaches +4, and every 4 points thereafter, the penalty increases by -1 and the bonus to damage increases by +2. You must choose to use this feat before making an attack roll, and its effects last until your next turn. The bonus damage does not apply to touch attacks or effects that do not deal hit point damage.",
      normal: null,
      special: null
    },
    {
      name: "Precise Shot",
      type: "Combat",
      prerequisites: "Point-Blank Shot",
      benefit: "You can shoot or throw ranged weapons at an opponent engaged in melee without taking the standard -4 penalty on your attack roll.",
      normal: null,
      special: null
    },
    {
      name: "Quick Draw",
      type: "Combat",
      prerequisites: "Base attack bonus +1",
      benefit: "You can draw a weapon as a free action instead of as a move action. You can draw a hidden weapon (see the Sleight of Hand skill) as a move action. A character who has selected this feat may throw weapons at his full normal rate of attacks (much like a character with a bow). Alchemical items, potions, scrolls, and wands cannot be drawn quickly using this feat.",
      normal: "Without this feat, you may draw a weapon as a move action, or (if your base attack bonus is +1 or higher) as a free action as part of movement. Without this feat, you can draw a hidden weapon as a standard action.",
      special: null
    },
    {
      name: "Rapid Reload",
      type: "Combat",
      prerequisites: "Weapon Proficiency (crossbow type chosen)",
      benefit: "Choose a type of crossbow (hand, light, heavy) or a single type of one-handed or two-handed firearm that you are proficient with. You can reload such a weapon quickly. Reloading a hand or light crossbow is a free action that provokes attacks of opportunity. Reloading a heavy crossbow is a move action that provokes attacks of opportunity. You can reload any type of single barrel firearm as a move action that does not provoke attacks of opportunity regardless of the type chosen. If you have selected a double barrel firearm or firearm with a capacity of more than one barrel, you may reload one barrel as a standard action that does not provoke attacks of opportunity.",
      normal: "A character without this feat needs a move action to reload a hand or light crossbow, a standard action to reload a one-handed firearm, or a full-round action to load a heavy crossbow or two-handed firearm.",
      special: "You can gain Rapid Reload multiple times. Each time you take the feat, it applies to a new type of crossbow or a new type of firearm."
    },
    {
      name: "Rapid Shot",
      type: "Combat",
      prerequisites: "Dex 13, Point-Blank Shot",
      benefit: "When making a full-attack action with a ranged weapon, you can fire one additional time this round at your highest bonus. All of your attack rolls take a -2 penalty when using Rapid Shot.",
      normal: null,
      special: null
    },
    {
      name: "Ride-By Attack",
      type: "Combat",
      prerequisites: "Ride 1 rank, Mounted Combat",
      benefit: "When you are mounted and use the charge action, you may move and attack as if with a standard charge and then move again (continuing the straight line of the charge). Your total movement for the round can't exceed double your mounted speed. You and your mount do not provoke an attack of opportunity from the opponent that you attack.",
      normal: null,
      special: null
    },
    {
      name: "Shield Focus",
      type: "Combat",
      prerequisites: "Shield Proficiency, base attack bonus +1",
      benefit: "Increase the AC bonus granted by any shield you are using by 1.",
      normal: null,
      special: null
    },
    {
      name: "Shield Slam",
      type: "Combat",
      prerequisites: "Improved Shield Bash, Shield Proficiency, Two-Weapon Fighting, base attack bonus +6",
      benefit: "Any opponents hit by your shield bash are also hit with a free bull rush attack, substituting your attack roll for the combat maneuver check. This bull rush does not provoke an attack of opportunity. Opponents who cannot move back due to a wall or other surface are knocked prone after moving the maximum possible distance. You may choose to move with your target if you are able to take a 5-foot step or to move as part of a charge.",
      normal: null,
      special: null
    },
    {
      name: "Shot on the Run",
      type: "Combat",
      prerequisites: "Dex 13, Dodge, Mobility, Point-Blank Shot, base attack bonus +4",
      benefit: "As a full-round action, you can move up to your speed and make a single ranged attack at any point during your movement.",
      normal: "You cannot move before and after an attack with a ranged weapon.",
      special: null
    },
    {
      name: "Spring Attack",
      type: "Combat",
      prerequisites: "Dex 13, Dodge, Mobility, base attack bonus +4",
      benefit: "As a full-round action, you can move up to your speed and make a single melee attack without provoking any attacks of opportunity from the target of your attack. You can move both before and after the attack, but you must move at least 10 feet before the attack and the total distance that you move cannot be greater than your speed. You cannot use this ability to attack a foe that is adjacent to you at the start of your turn.",
      normal: "You cannot move before and after an attack.",
      special: null
    },
    {
      name: "Stand Still",
      type: "Combat",
      prerequisites: "Combat Reflexes",
      benefit: "When a foe provokes an attack of opportunity due to moving through your adjacent squares, you can make a combat maneuver check as your attack of opportunity. If successful, the enemy cannot move for the rest of his turn. An enemy can still take the rest of his action, but cannot move. This feat also applies to any creature that attempts to move from a square that is adjacent to you if such movement provokes an attack of opportunity.",
      normal: null,
      special: null
    },
    {
      name: "Step Up",
      type: "Combat",
      prerequisites: "Base attack bonus +1",
      benefit: "Whenever an adjacent foe attempts to take a 5-foot step away from you, you may also make a 5-foot step as an immediate action so long as you end up adjacent to the foe that triggered this ability. If you take this step, you cannot take a 5-foot step during your next turn. If you take an action to move during your next turn, subtract 5 feet from your total movement.",
      normal: null,
      special: null
    },
    {
      name: "Strike Back",
      type: "Combat",
      prerequisites: "Base attack bonus +11",
      benefit: "You can ready an action to make a melee attack against any foe that attacks you in melee, even if the foe is outside of your reach.",
      normal: null,
      special: null
    },
    {
      name: "Throw Anything",
      type: "Combat",
      prerequisites: null,
      benefit: "You do not suffer any penalties for using an improvised ranged weapon. You receive a +1 circumstance bonus on attack rolls made with thrown splash weapons.",
      normal: "You take a -4 penalty on attack rolls made with an improvised weapon.",
      special: null
    },
    {
      name: "Tower Shield Proficiency",
      type: "Combat",
      prerequisites: "Shield Proficiency",
      benefit: "When you use a tower shield, the shield's armor check penalty only applies to Strength and Dexterity-based skills.",
      normal: "When you are using a shield with which you are not proficient, you take the shield's armor check penalty on attack rolls and on all skill checks that involve moving.",
      special: "Fighters automatically have Tower Shield Proficiency as a bonus feat."
    },
    {
      name: "Two-Weapon Defense",
      type: "Combat",
      prerequisites: "Dex 15, Two-Weapon Fighting",
      benefit: "When wielding a double weapon or two weapons (not including natural weapons or unarmed strikes), you gain a +1 shield bonus to your AC. When you are fighting defensively or using the total defense action, this shield bonus increases to +2.",
      normal: null,
      special: null
    },
    {
      name: "Two-Weapon Fighting",
      type: "Combat",
      prerequisites: "Dex 15",
      benefit: "You can fight with a weapon wielded in each of your hands. You can make one extra attack each round with the secondary weapon. Your penalties on attack rolls for fighting with two weapons are reduced. The penalty for your primary hand lessens by 2 and the one for your off hand lessens by 6.",
      normal: "If you wield a second weapon in your off hand, you can get one extra attack per round with that weapon. When fighting in this way you suffer a -6 penalty with your regular attack or attacks with your primary hand and a -10 penalty to the attack with your off hand. If your off-hand weapon is light, the penalties are reduced by 2 each.",
      special: null
    },
    {
      name: "Two-Weapon Rend",
      type: "Combat",
      prerequisites: "Dex 17, Double Slice, Improved Two-Weapon Fighting, Two-Weapon Fighting, base attack bonus +11",
      benefit: "If you hit an opponent with both your primary hand and your off-hand weapon, you deal an additional 1d10 points of damage plus 1-1/2 times your Strength modifier. You can only deal this additional damage once each round.",
      normal: null,
      special: null
    },
    {
      name: "Vital Strike",
      type: "Combat",
      prerequisites: "Base attack bonus +6",
      benefit: "When you use the attack action, you can make one attack at your highest base attack bonus that deals additional damage. Roll the weapon's damage dice for the attack twice and add the results together before adding bonuses from Strength, weapon abilities (such as flaming), precision-based damage, and other damage bonuses. These extra weapon damage dice are not multiplied on a critical hit, but are added to the total.",
      normal: null,
      special: null
    },
    {
      name: "Weapon Finesse",
      type: "Combat",
      prerequisites: null,
      benefit: "With a light weapon, rapier, whip, or spiked chain made for a creature of your size category, you may use your Dexterity modifier instead of your Strength modifier on attack rolls. If you carry a shield, its armor check penalty applies to your attack rolls.",
      normal: null,
      special: "Natural weapons are considered light weapons."
    },
    {
      name: "Weapon Focus",
      type: "Combat",
      prerequisites: "Proficiency with weapon, base attack bonus +1",
      benefit: "You gain a +1 bonus on all attack rolls you make using the selected weapon.",
      normal: null,
      special: "You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new type of weapon."
    },
    {
      name: "Weapon Specialization",
      type: "Combat",
      prerequisites: "Proficiency with selected weapon, Weapon Focus with selected weapon, fighter level 4th",
      benefit: "You gain a +2 bonus on all damage rolls you make using the selected weapon.",
      normal: null,
      special: "You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new type of weapon."
    },
    {
      name: "Whirlwind Attack",
      type: "Combat",
      prerequisites: "Dex 13, Int 13, Combat Expertise, Dodge, Mobility, Spring Attack, base attack bonus +4",
      benefit: "When you use the full-attack action, you can give up your regular attacks and instead make one melee attack at your highest base attack bonus against each opponent within reach. You must make a separate attack roll against each opponent.",
      normal: null,
      special: null
    }
  ],

  // Critical Feats
  critical: [
    {
      name: "Bleeding Critical",
      type: "Critical",
      prerequisites: "Critical Focus, base attack bonus +11",
      benefit: "Whenever you score a critical hit with a slashing or piercing weapon, your opponent takes 2d6 points of bleed damage (see Conditions) each round on his turn, in addition to the damage dealt by the critical hit. Bleed damage can be stopped by a DC 15 Heal skill check or through any magical healing. The effects of this feat stack.",
      normal: null,
      special: null
    },
    {
      name: "Blinding Critical",
      type: "Critical",
      prerequisites: "Critical Focus, base attack bonus +15",
      benefit: "Whenever you score a critical hit, your opponent is permanently blinded. A successful Fortitude save reduces this to dazzled for 1d4 rounds. The DC of this Fortitude save is equal to 10 + your base attack bonus. This feat has no effect on creatures that do not rely on eyes for sight or creatures with more than two eyes (although multiple critical hits might cause blindness, at the GM's discretion). Blindness can be cured by heal, regeneration, remove blindness, or similar abilities.",
      normal: null,
      special: null
    },
    {
      name: "Critical Focus",
      type: "Critical",
      prerequisites: "Base attack bonus +9",
      benefit: "You receive a +4 circumstance bonus on attack rolls made to confirm critical hits.",
      normal: null,
      special: null
    },
    {
      name: "Critical Mastery",
      type: "Critical",
      prerequisites: "Critical Focus, any two critical feats, 14th-level fighter",
      benefit: "When you score a critical hit, you can apply the effects of two critical feats in addition to the damage dealt.",
      normal: "You can only apply the effects of one critical feat to a given critical hit in addition to the damage dealt.",
      special: null
    },
    {
      name: "Deafening Critical",
      type: "Critical",
      prerequisites: "Critical Focus, base attack bonus +13",
      benefit: "Whenever you score a critical hit against an opponent, the victim is permanently deafened. A successful Fortitude save reduces the deafness to 1 round. The DC of this Fortitude save is equal to 10 + your base attack bonus. This feat has no effect on deaf creatures. This deafness can be cured by heal, regeneration, remove deafness, or a similar ability.",
      normal: null,
      special: null
    },
    {
      name: "Sickening Critical",
      type: "Critical",
      prerequisites: "Critical Focus, base attack bonus +11",
      benefit: "Whenever you score a critical hit, your opponent becomes sickened for 1 minute. The effects of this feat do not stack. Additional hits instead add to the effect's duration.",
      normal: null,
      special: null
    },
    {
      name: "Staggering Critical",
      type: "Critical",
      prerequisites: "Critical Focus, base attack bonus +13",
      benefit: "Whenever you score a critical hit, your opponent becomes staggered for 1d4+1 rounds. A successful Fortitude save reduces the duration to 1 round. The DC of this Fortitude save is equal to 10 + your base attack bonus. The effects of this feat do not stack. Additional hits instead add to the duration.",
      normal: null,
      special: null
    },
    {
      name: "Stunning Critical",
      type: "Critical",
      prerequisites: "Critical Focus, Staggering Critical, base attack bonus +17",
      benefit: "Whenever you score a critical hit, your opponent becomes stunned for 1d4 rounds. A successful Fortitude save reduces this to staggered for 1d4 rounds. The DC of this Fortitude save is equal to 10 + your base attack bonus. The effects of this feat do not stack. Additional hits instead add to the duration.",
      normal: null,
      special: null
    },
    {
      name: "Tiring Critical",
      type: "Critical",
      prerequisites: "Critical Focus, base attack bonus +13",
      benefit: "Whenever you score a critical hit, your opponent becomes fatigued. This feat has no additional effect on a fatigued creature.",
      normal: null,
      special: null
    }
  ],

  // Metamagic Feats
  metamagic: [
    {
      name: "Empower Spell",
      type: "Metamagic",
      prerequisites: null,
      benefit: "All variable, numeric effects of an empowered spell are increased by half including bonuses to those dice rolls. Saving throws and opposed rolls are not affected, nor are spells without random variables. An empowered spell uses up a spell slot two levels higher than the spell's actual level.",
      normal: null,
      special: null
    },
    {
      name: "Enlarge Spell",
      type: "Metamagic",
      prerequisites: null,
      benefit: "You can alter a spell with a range of close, medium, or long to increase its range by 100%. An enlarged spell with a range of close now has a range of 50 ft. + 5 ft./level, while medium-range spells have a range of 200 ft. + 20 ft./level and long-range spells have a range of 800 ft. + 80 ft./level. An enlarged spell uses up a spell slot one level higher than the spell's actual level.",
      normal: null,
      special: null
    },
    {
      name: "Extend Spell",
      type: "Metamagic",
      prerequisites: null,
      benefit: "An extended spell lasts twice as long as normal. A spell with a duration of concentration, instantaneous, or permanent is not affected by this feat. An extended spell uses up a spell slot one level higher than the spell's actual level.",
      normal: null,
      special: null
    },
    {
      name: "Heighten Spell",
      type: "Metamagic",
      prerequisites: null,
      benefit: "A heightened spell has a higher spell level than normal (up to a maximum of 9th level). Unlike other metamagic feats, Heighten Spell actually increases the effective level of the spell that it modifies. All effects dependent on spell level (such as saving throw DCs and ability to penetrate a lesser globe of invulnerability) are calculated according to the heightened level. The heightened spell is as difficult to prepare and cast as a spell of its effective level.",
      normal: null,
      special: null
    },
    {
      name: "Maximize Spell",
      type: "Metamagic",
      prerequisites: null,
      benefit: "All variable, numeric effects of a spell modified by this feat are maximized. Saving throws and opposed rolls are not affected, nor are spells without random variables. A maximized spell uses up a spell slot three levels higher than the spell's actual level. An empowered, maximized spell gains the separate benefits of each feat: the maximum result plus half the normally rolled result.",
      normal: null,
      special: null
    },
    {
      name: "Quicken Spell",
      type: "Metamagic",
      prerequisites: null,
      benefit: "Casting a quickened spell is a swift action. You can perform another action, even casting another spell, in the same round as you cast a quickened spell. A spell whose casting time is more than 1 round or 1 full-round action cannot be quickened. A quickened spell uses up a spell slot four levels higher than the spell's actual level. Casting a quickened spell doesn't provoke an attack of opportunity.",
      normal: null,
      special: "You can apply the effects of this feat to a spell cast spontaneously, so long as it has a casting time that is not more than 1 full-round action, without increasing the spell's casting time."
    },
    {
      name: "Silent Spell",
      type: "Metamagic",
      prerequisites: null,
      benefit: "A silent spell can be cast with no verbal components. Spells without verbal components are not affected. A silent spell uses up a spell slot one level higher than the spell's actual level.",
      normal: null,
      special: "Bard spells cannot be enhanced by this feat."
    },
    {
      name: "Still Spell",
      type: "Metamagic",
      prerequisites: null,
      benefit: "A stilled spell can be cast with no somatic components. Spells without somatic components are not affected. A stilled spell uses up a spell slot one level higher than the spell's actual level.",
      normal: null,
      special: null
    },
    {
      name: "Widen Spell",
      type: "Metamagic",
      prerequisites: null,
      benefit: "You can alter a burst, emanation, line, or spread shaped spell to increase its area. Any numeric measurements of the spell's area increase by 100%. A widened spell uses up a spell slot three levels higher than the spell's actual level.",
      normal: null,
      special: null
    }
  ],

  // Item Creation Feats
  itemCreation: [
    {
      name: "Brew Potion",
      type: "Item Creation",
      prerequisites: "Caster level 3rd",
      benefit: "You can create a potion of any 3rd-level or lower spell that you know and that targets one or more creatures or objects. Brewing a potion takes 2 hours if its base price is 250 gp or less, otherwise brewing a potion takes 1 day for each 1,000 gp in its base price. When you create a potion, you set the caster level, which must be sufficient to cast the spell in question and no higher than your own level. To brew a potion, you must use up raw materials costing one half this base price. When you create a potion, you make any choices that you would normally make when casting the spell. Whoever drinks the potion is the target of the spell.",
      normal: null,
      special: null
    },
    {
      name: "Craft Magic Arms and Armor",
      type: "Item Creation",
      prerequisites: "Caster level 5th",
      benefit: "You can create magic weapons, armor, or shields. Enhancing a weapon, suit of armor, or shield takes 1 day for each 1,000 gp in the price of its magical features. To enhance a weapon, suit of armor, or shield, you must use up raw materials costing half of this total price. The weapon, armor, or shield to be enhanced must be a masterwork item that you provide. Its cost is not included in the above cost. You can also mend a broken magic weapon, suit of armor, or shield if it is one that you could make. Doing so costs half the raw materials and half the time it would take to craft that item in the first place.",
      normal: null,
      special: null
    },
    {
      name: "Craft Rod",
      type: "Item Creation",
      prerequisites: "Caster level 9th",
      benefit: "You can create magic rods. Crafting a rod takes 1 day for each 1,000 gp in its base price. To craft a rod, you must use up raw materials costing half of its base price.",
      normal: null,
      special: null
    },
    {
      name: "Craft Staff",
      type: "Item Creation",
      prerequisites: "Caster level 11th",
      benefit: "You can create any staff whose prerequisites you meet. Crafting a staff takes 1 day for each 1,000 gp in its base price. To craft a staff, you must use up raw materials costing half of its base price. A newly created staff has 10 charges.",
      normal: null,
      special: null
    },
    {
      name: "Craft Wand",
      type: "Item Creation",
      prerequisites: "Caster level 5th",
      benefit: "You can create a wand of any 4th-level or lower spell that you know. Crafting a wand takes 1 day for each 1,000 gp in its base price. To craft a wand, you must use up raw materials costing half of this base price. A newly created wand has 50 charges.",
      normal: null,
      special: null
    },
    {
      name: "Craft Wondrous Item",
      type: "Item Creation",
      prerequisites: "Caster level 3rd",
      benefit: "You can create a wide variety of magic wondrous items. Crafting a wondrous item takes 1 day for each 1,000 gp in its price. To create a wondrous item, you must use up raw materials costing half of its base price. You can also mend a broken wondrous item if it is one that you could make. Doing so costs half the raw materials and half the time it would take to craft that item.",
      normal: null,
      special: null
    },
    {
      name: "Forge Ring",
      type: "Item Creation",
      prerequisites: "Caster level 7th",
      benefit: "You can create magic rings. Crafting a ring takes 1 day for each 1,000 gp in its base price. To craft a ring, you must use up raw materials costing half of its base price. You can also mend a broken ring if it is one that you could make. Doing so costs half the raw materials and half the time it would take to forge that ring in the first place.",
      normal: null,
      special: null
    },
    {
      name: "Scribe Scroll",
      type: "Item Creation",
      prerequisites: "Caster level 1st",
      benefit: "You can create a scroll of any spell that you know. Scribing a scroll takes 2 hours if its base price is 250 gp or less, otherwise scribing a scroll takes 1 day for each 1,000 gp in its base price. To scribe a scroll, you must use up raw materials costing half of this base price.",
      normal: null,
      special: null
    }
  ],

  // Other Special Feats
  special: [
    {
      name: "Arcane Armor Training",
      type: "General",
      prerequisites: "Light Armor Proficiency, caster level 3rd",
      benefit: "As a swift action, reduce the arcane spell failure chance due to the armor you are wearing by 10% for any spells you cast this round. This feat has no effect on arcane spell failure chance from shields or caused by any other source besides armor.",
      normal: null,
      special: null
    },
    {
      name: "Arcane Strike",
      type: "General",
      prerequisites: "Ability to cast arcane spells",
      benefit: "As a swift action, you can imbue your weapons with a fraction of your power. For 1 round, your weapons deal +1 damage and are treated as magic for the purpose of overcoming damage reduction. For every five caster levels you possess, this bonus increases by +1, to a maximum of +5 at 20th level.",
      normal: null,
      special: null
    },
    {
      name: "Channel Smite",
      type: "General",
      prerequisites: "Channel energy class feature",
      benefit: "Before you make a melee attack roll, you can choose to spend one use of your channel energy ability as a swift action. If you channel positive energy and you hit an undead creature, that creature takes an amount of additional damage equal to the damage dealt by your channel positive energy ability. If you channel negative energy and you hit a living creature, that creature takes an amount of additional damage equal to the damage dealt by your channel negative energy ability. Your target can make a Will save, as normal, to halve this additional damage. If your attack misses, the channel energy ability is still expended with no effect.",
      normal: null,
      special: null
    },
    {
      name: "Combat Casting",
      type: "General",
      prerequisites: null,
      benefit: "You get a +4 bonus on concentration checks made to cast a spell or use a spell-like ability when casting on the defensive or while grappled.",
      normal: null,
      special: null
    },
    {
      name: "Command Undead",
      type: "General",
      prerequisites: "Channel negative energy class feature",
      benefit: "As a standard action, you can use one of your uses of channel negative energy to enslave undead within 30 feet. Undead receive a Will save to negate the effect. The DC for this Will save is equal to 10 + 1/2 your cleric level + your Charisma modifier. Undead that fail their saves fall under your control, obeying your commands to the best of their ability, as if under the effects of control undead. Intelligent undead receive a new saving throw each day to resist your command. You can control any number of undead, so long as their total Hit Dice do not exceed your cleric level. If you use channel energy in this way, it has no other effect (it does not heal or harm nearby creatures). If an undead creature is under the control of another creature, you must make an opposed Charisma check whenever your orders conflict.",
      normal: null,
      special: null
    },
    {
      name: "Dazzling Display",
      type: "Combat",
      prerequisites: "Weapon Focus",
      benefit: "While wielding the weapon in which you have Weapon Focus, you can perform a bewildering show of prowess as a full-round action. Make an Intimidate check to demoralize all foes within 30 feet who can see your display.",
      normal: null,
      special: null
    },
    {
      name: "Elemental Channel",
      type: "General",
      prerequisites: "Channel energy class feature",
      benefit: "Choose one elemental subtype, such as air, earth, fire, or water. You can channel your divine energy to harm or heal outsiders that possess your chosen elemental subtype. When you channel energy, you can choose to affect only outsiders possessing your chosen elemental subtype. If you choose to heal or harm creatures of your elemental subtype, your channel energy has no effect on other creatures. The amount of damage healed or dealt and the DC to halve the damage is otherwise unchanged.",
      normal: null,
      special: "You can gain this feat multiple times. Its effects do not stack. Each time you take this feat, it applies to a new elemental subtype."
    },
    {
      name: "Extra Channel",
      type: "General",
      prerequisites: "Channel energy class feature",
      benefit: "You can channel energy two additional times per day.",
      normal: null,
      special: "If a paladin with the ability to channel positive energy takes this feat, she can use lay on hands four additional times per day, but only to channel positive energy."
    },
    {
      name: "Extra Ki",
      type: "General",
      prerequisites: "Ki pool class feature",
      benefit: "Your ki pool increases by 2.",
      normal: null,
      special: "You can gain Extra Ki multiple times. Its effects stack."
    },
    {
      name: "Extra Lay On Hands",
      type: "General",
      prerequisites: "Lay on hands class feature",
      benefit: "You can use your lay on hands ability two additional times per day.",
      normal: null,
      special: "You can gain Extra Lay On Hands multiple times. Its effects stack."
    },
    {
      name: "Extra Mercy",
      type: "General",
      prerequisites: "Lay on hands class feature, mercy class feature",
      benefit: "Select one additional mercy for which you qualify. When you use lay on hands to heal damage to one target, it also receives the additional effects of this mercy.",
      normal: null,
      special: "You can gain this feat multiple times. Its effects do not stack. Each time you take this feat, select a new mercy."
    },
    {
      name: "Extra Performance",
      type: "General",
      prerequisites: "Bardic performance class feature",
      benefit: "You can use bardic performance for 6 additional rounds per day.",
      normal: null,
      special: "You can gain Extra Performance multiple times. Its effects stack."
    },
    {
      name: "Extra Rage",
      type: "General",
      prerequisites: "Rage class feature",
      benefit: "You can rage for 6 additional rounds per day.",
      normal: null,
      special: "You can gain Extra Rage multiple times. Its effects stack."
    },
    {
      name: "Improved Channel",
      type: "General",
      prerequisites: "Channel energy class feature",
      benefit: "Add 2 to the DC of saving throws made to resist the effects of your channel energy ability.",
      normal: null,
      special: null
    },
    {
      name: "Improved Counterspell",
      type: "General",
      prerequisites: null,
      benefit: "When counterspelling, you may use a spell of the same school that is one or more spell levels higher than the target spell.",
      normal: "Without this feat, you may counter a spell only with the same spell or with a spell specifically designated as countering the target spell.",
      special: null
    },
    {
      name: "Improved Familiar",
      type: "General",
      prerequisites: "Ability to acquire a familiar, compatible alignment, sufficiently high level (see below)",
      benefit: "When choosing a familiar, the creatures listed below are also available to you. You may choose a familiar with an alignment up to one step away on each alignment axis (lawful through chaotic, good through evil).",
      normal: null,
      special: "See the Improved Familiar table for available options based on caster level."
    },
    {
      name: "Improved Natural Armor",
      type: "General",
      prerequisites: "Natural armor, Con 13",
      benefit: "Your natural armor bonus increases by +1.",
      normal: null,
      special: "You can gain this feat multiple times. Each time you take the feat, your natural armor bonus increases by another point."
    },
    {
      name: "Improved Natural Attack",
      type: "General",
      prerequisites: "Natural weapon, base attack bonus +4",
      benefit: "Choose one of your natural attacks. The damage for this natural attack increases by one step, as if your size had increased by one category: 1d2 → 1d3 → 1d4 → 1d6 → 1d8 → 2d6 → 3d6 → 4d6 → 6d6 → 8d6 → 12d6.",
      normal: null,
      special: "You can gain this feat multiple times. Each time you take the feat, it applies to a different natural attack."
    },
    {
      name: "Leadership",
      type: "General",
      prerequisites: "Character level 7th",
      benefit: "This feat enables you to attract a loyal cohort and a number of devoted followers. A cohort is generally an NPC with class levels, while followers are typically lower level NPCs. See the Leadership table for the level of cohort and number of followers you can recruit based on your Leadership score (your character level plus your Charisma modifier).",
      normal: null,
      special: "You can only gain followers by taking the Leadership feat."
    },
    {
      name: "Natural Spell",
      type: "General",
      prerequisites: "Wis 13, wild shape class feature",
      benefit: "You can complete the verbal and somatic components of spells while using wild shape. You substitute various noises and gestures for the normal verbal and somatic components of a spell. You can also use any material components or focuses you possess, even if such items are melded within your current form. This feat does not permit the use of magic items while you are in a form that could not ordinarily use them, and you do not gain the ability to speak while using wild shape.",
      normal: null,
      special: null
    },
    {
      name: "Nimble Moves",
      type: "General",
      prerequisites: "Dex 13",
      benefit: "Whenever you move, you may move through 5 feet of difficult terrain each round as if it were normal terrain. This feat allows you to take a 5-foot step into difficult terrain.",
      normal: "You may not take a 5-foot step into difficult terrain.",
      special: null
    },
    {
      name: "Selective Channeling",
      type: "General",
      prerequisites: "Cha 13, channel energy class feature",
      benefit: "When you channel energy, you can choose a number of targets in the area up to your Charisma modifier. These targets are not affected by your channeled energy.",
      normal: "All targets in a 30-foot burst are affected when you channel energy. You can only choose whether or not you are affected.",
      special: null
    },
    {
      name: "Spell Focus",
      type: "General",
      prerequisites: null,
      benefit: "Add +1 to the Difficulty Class for all saving throws against spells from the school of magic you select.",
      normal: null,
      special: "You can gain this feat multiple times. Its effects do not stack. Each time you take the feat, it applies to a new school of magic."
    },
    {
      name: "Spell Mastery",
      type: "General",
      prerequisites: "1st-level wizard",
      benefit: "Each time you take this feat, choose a number of spells equal to your Intelligence modifier that you already know. From that point on, you can prepare these spells without referring to a spellbook.",
      normal: "Without this feat, you must use a spellbook to prepare all your spells, except read magic.",
      special: null
    },
    {
      name: "Spell Penetration",
      type: "General",
      prerequisites: null,
      benefit: "You get a +2 bonus on caster level checks (1d20 + caster level) made to overcome a creature's spell resistance.",
      normal: null,
      special: null
    },
    {
      name: "Turn Undead",
      type: "General",
      prerequisites: "Channel positive energy class feature",
      benefit: "You can, as a standard action, use one of your uses of channel positive energy to cause all undead within 30 feet of you to flee, as if panicked. Undead receive a Will save to negate the effect. The DC for this Will save is equal to 10 + 1/2 your cleric level + your Charisma modifier. Undead that fail their save flee for 1 minute. Intelligent undead receive a new saving throw each round to end the effect. If you use channel energy in this way, it has no other effect (it does not heal or harm nearby creatures).",
      normal: null,
      special: null
    }
  ]
}

// Export a flat array of all feats for easy searching
export const allFeats = [
  ...pathfinderFeats.general,
  ...pathfinderFeats.combat,
  ...pathfinderFeats.critical,
  ...pathfinderFeats.metamagic,
  ...pathfinderFeats.itemCreation,
  ...pathfinderFeats.special
]

// Helper function to find a feat by name
export function getFeatByName(name) {
  return allFeats.find(feat => feat.name === name)
}

// Helper function to get feats by type
export function getFeatsByType(type) {
  return allFeats.filter(feat => feat.type === type)
}

// Helper function to check if prerequisites are met
export function checkPrerequisites(feat, character) {
  if (!feat.prerequisites) return true
  
  // This would need to be implemented based on your character data structure
  // For now, return true to allow selection
  return true
}

// Export feat types for reference
export const featTypes = {
  GENERAL: 'General',
  COMBAT: 'Combat',
  CRITICAL: 'Critical',
  METAMAGIC: 'Metamagic',
  ITEM_CREATION: 'Item Creation'
}

// Export default object
export default {
  pathfinderFeats,
  allFeats,
  getFeatByName,
  getFeatsByType,
  checkPrerequisites,
  featTypes
}