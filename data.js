// --- Data Definitions ---

// Updated SLOTS based on JSON and website structure
const SLOTS = [
    { id: 'Head', name: 'Head', jsonIds: ['Helmet'], secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Default counts, will be overridden by main mod
    { id: 'Chest', name: 'Chest', jsonIds: ['ChestArmor', 'LightChestArmor'], secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Legs', name: 'Legs', jsonIds: ['Legs'], secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Feet', name: 'Feet', jsonIds: ['Boots'], secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Gloves', name: 'Gloves', jsonIds: ['Gloves'], secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Added
    { id: 'Amulet', name: 'Amulet', jsonIds: ['Accesory1', 'Accesory2'], secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Map both accessories here
    { id: 'Ring1', name: 'Ring 1', jsonIds: ['Accesory1', 'Accesory2'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 }, // Rings have different counts
    { id: 'Ring2', name: 'Ring 2', jsonIds: ['Accesory1', 'Accesory2'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'Shield', name: 'Shield', jsonIds: ['Shield'], secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Added
    { id: 'Holster', name: 'Holster', jsonIds: ['Holster'], secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Added
    // { id: 'WeaponSlot', name: 'Weapon', jsonIds: [], secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Keep commented unless needed
];

// Tier mapping (Adjusted based on EDifficulty enum)
// Mapping F=1, E=2, D=3, C=4, B=5, A=6, S=7, SS=8, SSS=9
const TIER_MAP = {
    1: { name: 'F', value: 1 },
    2: { name: 'E', value: 2 },
    3: { name: 'D', value: 3 },
    4: { name: 'C', value: 4 },
    5: { name: 'B', value: 5 },
    6: { name: 'A', value: 6 },
    7: { name: 'S', value: 7 },
    8: { name: 'SS', value: 8 },
    9: { name: 'SSS', value: 9 },
    // Add more if needed, e.g., MAX, Z...
};
const MAX_TIER = 9; // Based on TIER_MAP
const MAX_LEVEL = 10;

// --- Modifier Definitions ---
// Updated based on JSON data
// 'type' added ('main' or 'secondary')
// 'positivity' added ('positive' or 'negative') for secondaries
// 'requiredLevelModifier' uses exact JSON value
// 'secondaryPositiveCount' & 'secondaryNegativeCount' added for main modifiers
// 'relatedItemIds' added for slot mapping
// 'allowedSlots' will be generated dynamically later

// Use 'let' here to allow reassignment after processing JSON data
let MODIFIERS = [
    // --- Main Modifiers (Standard Stats - Placeholder, will be overwritten by JSON) ---
    // These are kept temporarily to avoid breaking the initial structure,
    // but will be replaced or updated by the JSON import logic below.

    // --- Main Modifiers (Custom EM_ Classes - Updated from JSON) ---
    { id: 'EM_AcclimatizedLegging', name: 'Acclimatized Legging', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Gain % Damage Mitigation per stage.', isCustom: true, calcFunc: 'calcAcclimatizedLeggingValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['AcclimatizedLegging'], secondaryPositiveCount: 0, secondaryNegativeCount: 0 },
    { id: 'EM_BandOfValiance', name: 'Band of Valiance', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Gain bonus % EXP from Elite/Champion enemies.', isCustom: true, calcFunc: 'calcBandOfValianceValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['BandOfValiance'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_BloodiedTowel', name: 'Bloodied Towel', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Gain % Corruption Multiplier per stage/zone.', isCustom: true, calcFunc: 'calcBloodiedTowelValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['BloodiedTowel'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_ExpertMonocle', name: 'Expert Monocle', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Increases Item Quality when items drop.', isCustom: true, calcFunc: 'calcExpertMonocleValue', requiredLevelModifier: -3, modifierType: 'CustomMain', relatedItemIds: ['ExpertMonocle'], secondaryPositiveCount: 1, secondaryNegativeCount: 0 },
    { id: 'EM_FancyHat', name: 'Fancy Hat', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Reduces Shop prices.', isCustom: true, calcFunc: 'calcFancyHatValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['FancyHat'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_GoldenPlate', name: 'Golden Plate', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Gain flat Gold on Overkill.', isCustom: true, calcFunc: 'calcGoldenPlateValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['GoldenPlate'], secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_GoldenRing', name: 'Golden Ring', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Increases chance for Limit Break items in shop.', isCustom: true, calcFunc: 'calcGoldenRingValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['PriestAttires'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 }, // Linked to PriestAttires item
    { id: 'EM_Halo', name: 'Halo', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Gain % Power, Move Speed, Max Health, and Pickup Range.', isCustom: true, calcFunc: 'calcHaloValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['Halo'], secondaryPositiveCount: 0, secondaryNegativeCount: 0 },
    { id: 'EM_HolyCrossguard', name: 'Holy Crossguard', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Gain flat Power based on active Challenge difficulty multiplier.', isCustom: true, calcFunc: 'calcHolyCrossguardValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['HolyCrossguard'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_KingSlayer', name: 'King Slayer', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Deal % more damage to Elite/Champion enemies that are targeted.', isCustom: true, calcFunc: 'calcKingSlayerValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['KingSlayer_Glove'], secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Linked to KingSlayer_Glove item
    { id: 'EM_KnightPendant', name: 'Knight Pendant', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Start with a specific Knight weapon. (Variant)', isCustom: true, calcFunc: 'calcKnightPendantValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['KnightPendant'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_NinjaTabi', name: 'Ninja Tabi', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Reduces One-Shot Protection cooldown.', isCustom: true, calcFunc: 'calcNinjaTabiValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['NinjaTabi'], secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_NobleSlayer', name: 'Noble Slayer', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Deal % more damage to Elite/Champion enemies.', isCustom: true, calcFunc: 'calcNobleSlayerValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['NobleSlayer_Glove'], secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Linked to NobleSlayer_Glove item
    { id: 'EM_SoulJar', name: 'Soul Jar', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Gain % Soul Coin Gain based on total Overkills (logarithmic).', isCustom: true, calcFunc: 'calcSoulJarValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['SoulJar'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_Specialization', name: 'Specialization', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Gain % more Global Damage if you only have one weapon.', isCustom: true, calcFunc: 'calcSpecializationValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['Specialization_Amulet'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 }, // Assuming an item exists
    { id: 'EM_TowerShield', name: 'Tower Shield', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Reduces the % max health threshold required for One-Shot Protection to trigger.', isCustom: true, calcFunc: 'calcTowerShieldValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['TowerShield'], secondaryPositiveCount: 1, secondaryNegativeCount: 2 },
    { id: 'EM_Trainer', name: 'Trainer', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: [], description: 'Your first weapon starts at a higher level.', isCustom: true, calcFunc: 'calcTrainerValue', requiredLevelModifier: 0, modifierType: 'CustomMain', relatedItemIds: ['Trainer_Glove'], secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Linked to Trainer_Glove item

    // --- God Stones (Main Modifiers - Updated from JSON) ---
    { id: 'EM_FireStone', name: 'Fire Stone', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: [], description: '+% Fire Card Drop Chance, +% Piercing Scaling, +% Power.', isCustom: true, calcFunc: 'calcFireStoneValue', requiredLevelModifier: 6, modifierType: 'CustomMain', relatedItemIds: ['FireStone'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_FieryStone', name: 'Fiery Stone', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: [], description: 'Improved Fire Stone effects.', isCustom: true, calcFunc: 'calcFieryStoneValue', requiredLevelModifier: 9, modifierType: 'CustomMain', relatedItemIds: ['FieryStone'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_WindStone', name: 'Wind Stone', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: [], description: '+% Wind Card Drop Chance, +% Attack Speed, -% Dash Cooldown, +% Move Speed.', isCustom: true, calcFunc: 'calcWindStoneValue', requiredLevelModifier: 6, modifierType: 'CustomMain', relatedItemIds: ['WindStone'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_GaleStone', name: 'Gale Stone', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: [], description: 'Improved Wind Stone effects.', isCustom: true, calcFunc: 'calcGaleStoneValue', requiredLevelModifier: 9, modifierType: 'CustomMain', relatedItemIds: ['GaleStone'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_MoonStone', name: 'Moon Stone', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: [], description: '+% Moon Card Drop Chance, +% Damage Mitigation, +% Defence.', isCustom: true, calcFunc: 'calcMoonStoneValue', requiredLevelModifier: 6, modifierType: 'CustomMain', relatedItemIds: ['MoonStone'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_LunarStone', name: 'Lunar Stone', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: [], description: 'Improved Moon Stone effects.', isCustom: true, calcFunc: 'calcLunarStoneValue', requiredLevelModifier: 9, modifierType: 'CustomMain', relatedItemIds: ['LunarStone'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_SunStone', name: 'Sun Stone', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: [], description: '+% Sun Card Drop Chance, +% Purification, +% XP Gain.', isCustom: true, calcFunc: 'calcSunStoneValue', requiredLevelModifier: 6, modifierType: 'CustomMain', relatedItemIds: ['SunStone'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_SolarStone', name: 'Solar Stone', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: [], description: 'Improved Sun Stone effects.', isCustom: true, calcFunc: 'calcSolarStoneValue', requiredLevelModifier: 9, modifierType: 'CustomMain', relatedItemIds: ['SolarStone'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_StelarStone', name: 'Stelar Stone', type: 'main', positivity: 'positive', rarity: 'Mythical', allowedSlots: [], description: 'Combines and improves Sun and Moon Stone effects.', isCustom: true, calcFunc: 'calcStelarStoneValue', requiredLevelModifier: 12, modifierType: 'CustomMain', relatedItemIds: ['StelarStone'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },
    { id: 'EM_StormStone', name: 'Storm Stone', type: 'main', positivity: 'positive', rarity: 'Mythical', allowedSlots: [], description: 'Combines and improves Fire and Wind Stone effects.', isCustom: true, calcFunc: 'calcStormStoneValue', requiredLevelModifier: 12, modifierType: 'CustomMain', relatedItemIds: ['StormStone'], secondaryPositiveCount: 1, secondaryNegativeCount: 1 },

    // --- Secondary Modifiers (Custom EM_ Classes - Updated from JSON) ---
    { id: 'EM_WeaponFinaleDamage', name: 'Weapon Finale Damage', type: 'secondary', positivity: 'positive', rarity: 'Legendary', allowedSlots: [], description: 'Increases Final Damage of a specific weapon. (Variant)', isCustom: true, calcFunc: 'calcWeaponFinaleDamageValue', requiredLevelModifier: 5, modifierType: 'CustomSecondary', relatedItemIds: [] }, // No specific item link in JSON

    // --- Standard Secondary Modifiers (Will be populated from JSON below) ---
];

// --- JSON Data Integration ---
const jsonData = {
  "ModifierDataExport_Relevant": [
    { "Id": "Ring_M_AttackSpeed", "Rarity": "Uncommon", "StatName": "AttackCoolDown", "StatsApplicationType": "Multiplier", "BaseValue": 0.949999988079071, "ValuePerLevel": 1.0, "RequiredLevelModifier": 3.0, "ModifierType": "Main", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Procedural_Ring" ], "Variants": [] },
    { "Id": "Ring_M_EnemyCount", "Rarity": "Uncommon", "StatName": "EnemyCount", "StatsApplicationType": "Multiplier", "BaseValue": 1.0499999523162842, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Procedural_Ring" ], "Variants": [] },
    { "Id": "Ring_M_EnemyCountLegendary", "Rarity": "Legendary", "StatName": "EnemyCount", "StatsApplicationType": "Multiplier", "BaseValue": 1.1000000238418579, "ValuePerLevel": 1.0, "RequiredLevelModifier": 5.0, "ModifierType": "Main", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Procedural_Ring" ], "Variants": [] },
    { "Id": "Ring_M_GoldGain", "Rarity": "Mythical", "StatName": "GoldGain", "StatsApplicationType": "Multiplier", "BaseValue": 1.1000000238418579, "ValuePerLevel": 1.0, "RequiredLevelModifier": 11.0, "ModifierType": "Main", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Procedural_Ring" ], "Variants": [] },
    { "Id": "Ring_M_MasteryGain", "Rarity": "Epic", "StatName": "MasteryGain", "StatsApplicationType": "Multiplier", "BaseValue": 1.0499999523162842, "ValuePerLevel": 1.0, "RequiredLevelModifier": 7.0, "ModifierType": "Main", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Procedural_Ring" ], "Variants": [] },
    { "Id": "Ring_M_SoulCoin", "Rarity": "Rare", "StatName": "SoulCoinGain", "StatsApplicationType": "Multiplier", "BaseValue": 1.1000000238418579, "ValuePerLevel": 1.0, "RequiredLevelModifier": 5.0, "ModifierType": "Main", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Procedural_Ring" ], "Variants": [] },
    { "Id": "Ring_M_WeaponModifierCount", "Rarity": "Ascended", "StatName": "WeaponPerModifier", "StatsApplicationType": "Base", "BaseValue": 1.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 30.0, "ModifierType": "Main", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Procedural_Ring" ], "Variants": [] },
    { "Id": "M_BloodUmbrella", "Rarity": "Unique", "StatName": "Purification", "StatsApplicationType": "Multiplier", "BaseValue": 1.1000000238418579, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 0, "RelatedItemIds": [ "BloodUmbrella" ], "Variants": [] },
    { "Id": "Boot_M_DashCharge", "Rarity": "Rare", "StatName": "DashCharge", "StatsApplicationType": "Post", "BaseValue": 1.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 2.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralBoot" ], "Variants": [] },
    { "Id": "Boot_M_DashCooldown", "Rarity": "Rare", "StatName": "DashCoolDown", "StatsApplicationType": "Multiplier", "BaseValue": 0.949999988079071, "ValuePerLevel": 1.0, "RequiredLevelModifier": 4.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralBoot" ], "Variants": [] },
    { "Id": "Boot_M_DefenseFlat", "Rarity": "Common", "StatName": "Defence", "StatsApplicationType": "Base", "BaseValue": 0.34999999403953552, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralBoot" ], "Variants": [] },
    { "Id": "Boot_M_MoveSpeed", "Rarity": "Rare", "StatName": "MoveSpeed", "StatsApplicationType": "Multiplier", "BaseValue": 1.0499999523162842, "ValuePerLevel": 1.0, "RequiredLevelModifier": 5.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralBoot" ], "Variants": [] },
    { "Id": "Boot_M_MoveSpeedLegendary", "Rarity": "Legendary", "StatName": "MoveSpeed", "StatsApplicationType": "Multiplier", "BaseValue": 1.1499999761581421, "ValuePerLevel": 1.0, "RequiredLevelModifier": 15.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralBoot" ], "Variants": [] },
    { "Id": "Boot_M_ProjectileSpeed", "Rarity": "Rare", "StatName": "ProjectileSpeed", "StatsApplicationType": "Multiplier", "BaseValue": 1.1000000238418579, "ValuePerLevel": 1.0, "RequiredLevelModifier": 5.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralBoot" ], "Variants": [] },
    { "Id": "M_Adaptive_Greaves", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 1.0, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 3, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Adaptive_Greaves" ], "Variants": [] },
    { "Id": "M_Horizon_Void", "Rarity": "Unique", "StatName": "CardDropChance_Void", "StatsApplicationType": "Multiplier", "BaseValue": 1.5, "ValuePerLevel": 1.0, "RequiredLevelModifier": -2.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Horizon_Void" ], "Variants": [] },
    { "Id": "Chest_M_Area", "Rarity": "Epic", "StatName": "AreaSize", "StatsApplicationType": "Multiplier", "BaseValue": 1.1000000238418579, "ValuePerLevel": 1.0, "RequiredLevelModifier": 10.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHeavyChestPlate" ], "Variants": [] },
    { "Id": "Chest_M_DefenseFlat", "Rarity": "Common", "StatName": "Defence", "StatsApplicationType": "Base", "BaseValue": 0.5, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHeavyChestPlate" ], "Variants": [] },
    { "Id": "Chest_M_DefenseLevel", "Rarity": "Uncommon", "StatName": "Defence", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.10000000149011612, "RequiredLevelModifier": 1.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHeavyChestPlate" ], "Variants": [] },
    { "Id": "Chest_M_DefenseMitigation", "Rarity": "Rare", "StatName": "DamageMitigation", "StatsApplicationType": "Multiplier", "BaseValue": 0.949999988079071, "ValuePerLevel": 1.0, "RequiredLevelModifier": 4.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHeavyChestPlate" ], "Variants": [] },
    { "Id": "Chest_M_Empty", "Rarity": "Legendary", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 10.0, "ModifierType": "Main", "SecondaryPositiveCount": 4, "SecondaryNegativeCount": 0, "RelatedItemIds": [ "ProceduralHeavyChestPlate" ], "Variants": [] },
    { "Id": "Chest_M_EmptyAscended", "Rarity": "Mythical", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": -10.0, "ModifierType": "Main", "SecondaryPositiveCount": 5, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHeavyChestPlate" ], "Variants": [] },
    { "Id": "Chest_M_HealthPoint", "Rarity": "Uncommon", "StatName": "MaxHealth", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.25, "RequiredLevelModifier": 5.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHeavyChestPlate" ], "Variants": [] },
    { "Id": "Chest_M_PickUpDistance", "Rarity": "Rare", "StatName": "PickUpDistance", "StatsApplicationType": "Multiplier", "BaseValue": 1.0499999523162842, "ValuePerLevel": 1.0, "RequiredLevelModifier": 3.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHeavyChestPlate" ], "Variants": [] },
    { "Id": "Chest_M_Regen", "Rarity": "Rare", "StatName": "MaxHealth", "StatsApplicationType": "Multiplier", "BaseValue": 1.0499999523162842, "ValuePerLevel": 1.0, "RequiredLevelModifier": 3.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHeavyChestPlate" ], "Variants": [] }, // Note: JSON says MaxHealth, but likely meant HealthRegen based on name
    { "Id": "M_Adaptive_Chest", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 1.0, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 3, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Adaptive_Plate" ], "Variants": [] },
    { "Id": "Debug_Modifier", "Rarity": "Epic", "StatName": "None", "StatsApplicationType": "Post", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 5, "SecondaryNegativeCount": 5, "RelatedItemIds": [], "Variants": [] },
    { "Id": "Glove_M_AttackSpeed", "Rarity": "Uncommon", "StatName": "AttackCoolDown", "StatsApplicationType": "Multiplier", "BaseValue": 0.949999988079071, "ValuePerLevel": 1.0, "RequiredLevelModifier": 3.0, "ModifierType": "Main", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralGlove" ], "Variants": [] },
    { "Id": "Glove_M_AttackSpeedEpic", "Rarity": "Epic", "StatName": "AttackCoolDown", "StatsApplicationType": "Multiplier", "BaseValue": 0.89999997615814209, "ValuePerLevel": 1.0, "RequiredLevelModifier": 8.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 2, "RelatedItemIds": [ "ProceduralGlove" ], "Variants": [] },
    { "Id": "Glove_M_DefenseFlat", "Rarity": "Common", "StatName": "Defence", "StatsApplicationType": "Base", "BaseValue": 0.10000000149011612, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralGlove" ], "Variants": [] },
    { "Id": "Glove_M_DefenseLevel", "Rarity": "Uncommon", "StatName": "Defence", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.039999999105930328, "RequiredLevelModifier": 1.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralGlove" ], "Variants": [] },
    { "Id": "Glove_M_PickUpDistance", "Rarity": "Rare", "StatName": "PickUpDistance", "StatsApplicationType": "Base", "BaseValue": 0.25, "ValuePerLevel": 0.0, "RequiredLevelModifier": 3.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralGlove" ], "Variants": [] },
    { "Id": "Glove_M_ProjectileCount", "Rarity": "Mythical", "StatName": "AdditionalProjectile", "StatsApplicationType": "Post", "BaseValue": 1.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 15.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 2, "RelatedItemIds": [ "ProceduralGlove" ], "Variants": [] },
    { "Id": "Glove_M_ProjectileLifeTime", "Rarity": "Rare", "StatName": "ProjectileLifeTime", "StatsApplicationType": "Multiplier", "BaseValue": 1.1000000238418579, "ValuePerLevel": 1.0, "RequiredLevelModifier": 5.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralGlove" ], "Variants": [] },
    { "Id": "Glove_M_ProjectilePiercing", "Rarity": "Legendary", "StatName": "ProjectilePiercing", "StatsApplicationType": "Post", "BaseValue": 1.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 9.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralGlove" ], "Variants": [] },
    { "Id": "Glove_M_ProjectileSize", "Rarity": "Epic", "StatName": "ProjectileSize", "StatsApplicationType": "Multiplier", "BaseValue": 1.1499999761581421, "ValuePerLevel": 1.0, "RequiredLevelModifier": 7.0, "ModifierType": "Main", "SecondaryPositiveCount": 3, "SecondaryNegativeCount": 2, "RelatedItemIds": [ "ProceduralGlove" ], "Variants": [] },
    { "Id": "M_Adaptive_Gloves", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Multiplier", "BaseValue": 1.0, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 3, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Adaptive_Gloves" ], "Variants": [] },
    { "Id": "M_DiamondKnuckles", "Rarity": "Unique", "StatName": "PiercingScaling", "StatsApplicationType": "Base", "BaseValue": 0.029999999329447746, "ValuePerLevel": 0.0, "RequiredLevelModifier": -10.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Diamond_Knuckles" ], "Variants": [] },
    { "Id": "Helmet_M_Area", "Rarity": "Uncommon", "StatName": "AreaSize", "StatsApplicationType": "Multiplier", "BaseValue": 1.0499999523162842, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "Helmet_M_CritChance", "Rarity": "Legendary", "StatName": "CriticalChance", "StatsApplicationType": "Multiplier", "BaseValue": 1.25, "ValuePerLevel": 1.0, "RequiredLevelModifier": 8.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 2, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "Helmet_M_DefenseFlat", "Rarity": "Common", "StatName": "Defence", "StatsApplicationType": "Base", "BaseValue": 1.25, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "Helmet_M_DefenseMult", "Rarity": "Rare", "StatName": "Defence", "StatsApplicationType": "Multiplier", "BaseValue": 1.25, "ValuePerLevel": 1.0, "RequiredLevelModifier": 3.0, "ModifierType": "Main", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "Helmet_M_Experience", "Rarity": "Common", "StatName": "XPGain", "StatsApplicationType": "Multiplier", "BaseValue": 1.0499999523162842, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "Helmet_M_ExperienceAscended", "Rarity": "Mythical", "StatName": "XPGain", "StatsApplicationType": "Multiplier", "BaseValue": 1.0, "ValuePerLevel": 1.0149999856948853, "RequiredLevelModifier": 20.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 2, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "Helmet_M_ExperienceLegandary", "Rarity": "Legendary", "StatName": "XPGain", "StatsApplicationType": "Multiplier", "BaseValue": 1.2999999523162842, "ValuePerLevel": 1.0, "RequiredLevelModifier": 10.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "Helmet_M_ExperienceRare", "Rarity": "Rare", "StatName": "XPGain", "StatsApplicationType": "Multiplier", "BaseValue": 1.1499999761581421, "ValuePerLevel": 1.0, "RequiredLevelModifier": 4.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "Helmet_M_MasteryGain", "Rarity": "Uncommon", "StatName": "MasteryGain", "StatsApplicationType": "Multiplier", "BaseValue": 1.1000000238418579, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "Helmet_M_MasteryGainAscended", "Rarity": "Mythical", "StatName": "MasteryGain", "StatsApplicationType": "Multiplier", "BaseValue": 1.3999999761581421, "ValuePerLevel": 1.0, "RequiredLevelModifier": 10.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 2, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "Helmet_M_MasteryGainEpic", "Rarity": "Epic", "StatName": "MasteryGain", "StatsApplicationType": "Multiplier", "BaseValue": 1.2000000476837158, "ValuePerLevel": 1.0, "RequiredLevelModifier": 4.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "Helmet_M_Purification", "Rarity": "Epic", "StatName": "Purification", "StatsApplicationType": "Multiplier", "BaseValue": 1.25, "ValuePerLevel": 1.0, "RequiredLevelModifier": 3.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "Helmet_M_SoulCoin", "Rarity": "Rare", "StatName": "SoulCoinGain", "StatsApplicationType": "Multiplier", "BaseValue": 1.1499999761581421, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "Helmet_M_SoulCoinLegendary", "Rarity": "Mythical", "StatName": "SoulCoinGain", "StatsApplicationType": "Multiplier", "BaseValue": 1.2999999523162842, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 2, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "Helmet_M_WeaponPerModifier", "Rarity": "Mythical", "StatName": "WeaponPerModifier", "StatsApplicationType": "Post", "BaseValue": 1.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 30.0, "ModifierType": "Main", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 3, "RelatedItemIds": [ "ProceduralHelmet" ], "Variants": [] },
    { "Id": "M_Adaptive_Helmet", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 1.0, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 3, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Adaptive_Helm" ], "Variants": [] },
    { "Id": "M_AcclimatizedLegging", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 0, "SecondaryNegativeCount": 0, "RelatedItemIds": [ "AcclimatizedLegging" ], "Variants": [] },
    { "Id": "M_Adaptive_Leggings", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 1.0, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 3, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Adaptive_Leggings" ], "Variants": [] },
    { "Id": "M_TowerShield", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 2, "RelatedItemIds": [ "TowerShield" ], "Variants": [] }
  ],
  "EquipmentDataExport_Relevant": [
    { "Id": "FieryStone", "PossibleMainModifiersWeighted": [ "M_FieryStone" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "C", "MaxTier": "A" },
    { "Id": "FireStone", "PossibleMainModifiersWeighted": [ "M_FireStone" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "F", "MaxTier": "D" },
    { "Id": "GaleStone", "PossibleMainModifiersWeighted": [ "M_GaleStone" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "C", "MaxTier": "A" },
    { "Id": "LunarStone", "PossibleMainModifiersWeighted": [ "M_LunarStone" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "C", "MaxTier": "A" },
    { "Id": "MoonStone", "PossibleMainModifiersWeighted": [ "M_MoonStone" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "F", "MaxTier": "D" },
    { "Id": "SolarStone", "PossibleMainModifiersWeighted": [ "M_SolarStone" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "C", "MaxTier": "A" },
    { "Id": "StelarStone", "PossibleMainModifiersWeighted": [ "M_StelarStone" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "S", "MaxTier": "SSS" },
    { "Id": "StormStone", "PossibleMainModifiersWeighted": [ "M_StormStone" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "S", "MaxTier": "SSS" },
    { "Id": "SunStone", "PossibleMainModifiersWeighted": [ "M_SunStone" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "F", "MaxTier": "D" },
    { "Id": "WindStone", "PossibleMainModifiersWeighted": [ "M_WindStone" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "F", "MaxTier": "D" },
    { "Id": "Procedural_Ring", "PossibleMainModifiersWeighted": [ "Ring_M_AttackSpeed", "Ring_M_EnemyCount", "Ring_M_EnemyCountLegendary", "Ring_M_GoldGain", "Ring_M_MasteryGain", "Ring_M_SoulCoin", "Ring_M_WeaponModifierCount" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "BandOfValiance", "PossibleMainModifiersWeighted": [ "M_BandOfValiance" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "BloodUmbrella", "PossibleMainModifiersWeighted": [ "M_BloodUmbrella" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "HolyCrossguard", "PossibleMainModifiersWeighted": [ "M_HolyCrossguard" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "KnightPendant", "PossibleMainModifiersWeighted": [ "M_KnightPendant" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "SoulJar", "PossibleMainModifiersWeighted": [ "M_SoulJar" ], "PossibleSlotIds": [ "Accesory1", "Accesory2" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "ProceduralChestPlate", "PossibleMainModifiersWeighted": [ "LChest_M_AttackSpeed", "LChest_M_DashCharge", "LChest_M_DefenseFlat", "LChest_M_DefenseFlatEpic", "LChest_M_MoveSpeed", "LChest_M_MoveSpeedLegendary", "LChest_M_PickUpArea", "LChest_M_PickUpAreaEpic" ], "PossibleSlotIds": [ "ChestArmor", "LightChestArmor" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "ProceduralHeavyChestPlate", "PossibleMainModifiersWeighted": [ "Chest_M_DefenseFlat", "Chest_M_DefenseLevel", "Chest_M_DefenseMitigation", "Chest_M_HealthPoint", "Chest_M_PickUpDistance", "Chest_M_Regen", "Chest_M_Empty", "Chest_M_EmptyAscended", "Chest_M_Area" ], "PossibleSlotIds": [ "ChestArmor" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "Adaptive_LeatherChest", "PossibleMainModifiersWeighted": [ "M_Adaptive_LeatherArmor" ], "PossibleSlotIds": [ "LightChestArmor", "ChestArmor" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "Adaptive_Plate", "PossibleMainModifiersWeighted": [ "M_Adaptive_Chest" ], "PossibleSlotIds": [ "ChestArmor" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "BloodiedTowel", "PossibleMainModifiersWeighted": [ "M_BloodiedTowel" ], "PossibleSlotIds": [ "LightChestArmor", "ChestArmor" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "Dirian_Harness", "PossibleMainModifiersWeighted": [ "M_Dirian_Harness" ], "PossibleSlotIds": [ "LightChestArmor", "ChestArmor" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "GoldenPlate", "PossibleMainModifiersWeighted": [ "M_GoldenPlate" ], "PossibleSlotIds": [ "ChestArmor" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "PriestAttires", "PossibleMainModifiersWeighted": [ "M_GoldenRing" ], "PossibleSlotIds": [ "LightChestArmor", "ChestArmor" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "ProceduralBoot", "PossibleMainModifiersWeighted": [ "Boot_M_DashCooldown", "Boot_M_DefenseFlat", "Boot_M_MoveSpeed", "Boot_M_MoveSpeedLegendary", "Boot_M_DashCharge", "Boot_M_ProjectileSpeed" ], "PossibleSlotIds": [ "Boots" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "Adaptive_Greaves", "PossibleMainModifiersWeighted": [ "M_Adaptive_Greaves" ], "PossibleSlotIds": [ "Boots" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "Horizon_Void", "PossibleMainModifiersWeighted": [ "M_Horizon_Void" ], "PossibleSlotIds": [ "Boots" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "NinjaTabi", "PossibleMainModifiersWeighted": [ "M_NinjaTabi" ], "PossibleSlotIds": [ "Boots" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "ProceduralGlove", "PossibleMainModifiersWeighted": [ "Glove_M_AttackSpeed", "Glove_M_AttackSpeedEpic", "Glove_M_ProjectileCount", "Glove_M_ProjectileLifeTime", "Glove_M_ProjectileSize", "Glove_M_ProjectilePiercing", "Glove_M_DefenseFlat", "Glove_M_DefenseLevel", "Glove_M_PickUpDistance" ], "PossibleSlotIds": [ "Gloves" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "Adaptive_Gloves", "PossibleMainModifiersWeighted": [ "M_Adaptive_Gloves" ], "PossibleSlotIds": [ "Gloves" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "Diamond_Knuckles", "PossibleMainModifiersWeighted": [ "M_DiamondKnuckles" ], "PossibleSlotIds": [ "Gloves" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "KingSlayer_Glove", "PossibleMainModifiersWeighted": [ "M_KingSlayer" ], "PossibleSlotIds": [ "Gloves" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "NobleSlayer_Glove", "PossibleMainModifiersWeighted": [ "M_NobleSlayer" ], "PossibleSlotIds": [ "Gloves" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "Trainer_Glove", "PossibleMainModifiersWeighted": [ "M_Trainer" ], "PossibleSlotIds": [ "Gloves" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "ProceduralHelmet", "PossibleMainModifiersWeighted": [ "Helmet_M_CritChance", "Helmet_M_DefenseFlat", "Helmet_M_DefenseMult", "Helmet_M_Experience", "Helmet_M_ExperienceAscended", "Helmet_M_ExperienceLegandary", "Helmet_M_ExperienceRare", "Helmet_M_MasteryGain", "Helmet_M_MasteryGainAscended", "Helmet_M_MasteryGainEpic", "Helmet_M_Purification", "Helmet_M_SoulCoin", "Helmet_M_SoulCoinLegendary", "Helmet_M_WeaponPerModifier", "Helmet_M_Area" ], "PossibleSlotIds": [ "Helmet" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "Adaptive_Helm", "PossibleMainModifiersWeighted": [ "M_Adaptive_Helmet" ], "PossibleSlotIds": [ "Helmet" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "ExpertMonocle", "PossibleMainModifiersWeighted": [ "M_ExpertMonocle" ], "PossibleSlotIds": [ "Helmet" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "FancyHat", "PossibleMainModifiersWeighted": [ "M_FancyHat" ], "PossibleSlotIds": [ "Helmet" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "Halo", "PossibleMainModifiersWeighted": [ "M_Halo" ], "PossibleSlotIds": [ "Helmet" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "Holster", "PossibleMainModifiersWeighted": [ "Holster_M_Ammo", "Holster_M_Ammo 1", "Holster_M_AmmoCost", "Holster_M_AmmoEpic", "Holster_M_AttackSpeed", "Holster_M_AttackSpeed_Ascended", "Holster_M_Power", "Holster_M_PowerRare", "Holster_M_PowerRareFlat", "Holster_M_ReloadSpeed" ], "PossibleSlotIds": [ "Holster" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "ProceduralLeg", "PossibleMainModifiersWeighted": [ "Legging_M_Area", "Legging_M_DefenseFlat", "Legging_M_DefenseMult", "Legging_M_HealthRegen", "Legging_M_MoveSpeed", "Legging_M_MoveSpeedLegendary" ], "PossibleSlotIds": [ "Legs" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "AcclimatizedLegging", "PossibleMainModifiersWeighted": [ "M_AcclimatizedLegging" ], "PossibleSlotIds": [ "Legs" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "Adaptive_Leggings", "PossibleMainModifiersWeighted": [ "M_Adaptive_Leggings" ], "PossibleSlotIds": [ "Legs" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "ProceduralShield", "PossibleMainModifiersWeighted": [ "Shield_M_DefenseFlat", "Shield_M_DefenseMult", "Shield_M_DefenseMultEpic", "Shield_M_DefenseScale", "Shield_M_MoonTag" ], "PossibleSlotIds": [ "Shield" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" },
    { "Id": "TowerShield", "PossibleMainModifiersWeighted": [ "M_TowerShield" ], "PossibleSlotIds": [ "Shield" ], "MinTier": "UNDEFINED", "MaxTier": "UNDEFINED" }
  ],
  "SlotDataExport_Relevant": [
    { "Id": "Accesory1", "Name": "Accessory" },
    { "Id": "Accesory2", "Name": "Accessory" },
    { "Id": "Boots", "Name": "Boots" },
    { "Id": "ChestArmor", "Name": "Chest Armor" },
    { "Id": "Gloves", "Name": "Gloves" },
    { "Id": "Helmet", "Name": "Helmet" },
    { "Id": "Holster", "Name": "Holster" },
    { "Id": "Legs", "Name": "Leggings" },
    { "Id": "LightChestArmor", "Name": "Light Chest Armor" },
    { "Id": "Shield", "Name": "Shield" }
  ]
};

// --- Data Processing ---

// 1. Create Maps for faster lookups
const jsonModifiersMap = new Map(jsonData.ModifierDataExport_Relevant.map(m => [m.Id, m]));
const jsonEquipmentMap = new Map(jsonData.EquipmentDataExport_Relevant.map(e => [e.Id, e]));
const jsonSlotMap = new Map(jsonData.SlotDataExport_Relevant.map(s => [s.Id, s]));

// 2. Define Website Slot Mapping
const websiteSlotMapping = {
    Helmet: ['Head'],
    ChestArmor: ['Chest'],
    LightChestArmor: ['Chest'], // Map both to Chest
    Legs: ['Legs'],
    Boots: ['Feet'],
    Gloves: ['Gloves'],
    Accesory1: ['Amulet', 'Ring1', 'Ring2'], // Map accessories broadly
    Accesory2: ['Amulet', 'Ring1', 'Ring2'],
    Shield: ['Shield'],
    Holster: ['Holster']
    // WeaponSlot: ['WeaponSlot'] // If needed
};

// 3. Process and Update/Add Modifiers
const finalModifiers = [];
const existingModifierIds = new Set(MODIFIERS.map(m => m.id));
const jsonModifierIds = new Set(jsonData.ModifierDataExport_Relevant.map(m => m.Id));

// Update existing or add new from JSON
jsonData.ModifierDataExport_Relevant.forEach(jsonMod => {
    const existingMod = MODIFIERS.find(m => m.id === jsonMod.Id);
    const isCustom = jsonMod.Id.startsWith('EM_');

    const newModData = {
        id: jsonMod.Id,
        name: existingMod?.name || jsonMod.Id.replace(/_/g, ' '), // Use existing name or generate one
        type: jsonMod.ModifierType === 'Main' ? 'main' : 'secondary',
        positivity: existingMod?.positivity || (jsonMod.Id.includes('_SecNeg') ? 'negative' : 'positive'), // Infer positivity for non-custom secondaries
        rarity: jsonMod.Rarity,
        allowedSlots: [], // Will be populated later
        description: existingMod?.description || `Stat: ${jsonMod.StatName}`, // Use existing or basic desc
        statName: jsonMod.StatName === 'None' ? null : jsonMod.StatName, // Handle "None" stat
        statsApplicationType: jsonMod.StatsApplicationType,
        baseValue: jsonMod.BaseValue,
        valuePerLevel: jsonMod.ValuePerLevel,
        requiredLevelModifier: jsonMod.RequiredLevelModifier,
        modifierType: jsonMod.ModifierType, // Store original type if needed
        relatedItemIds: jsonMod.RelatedItemIds || [],
        secondaryPositiveCount: jsonMod.ModifierType === 'Main' ? jsonMod.SecondaryPositiveCount : undefined,
        secondaryNegativeCount: jsonMod.ModifierType === 'Main' ? jsonMod.SecondaryNegativeCount : undefined,
        isCustom: isCustom || jsonMod.ModifierType.startsWith('Custom'), // Mark custom types
        calcFunc: existingMod?.calcFunc || (isCustom || jsonMod.ModifierType.startsWith('Custom') ? `calc${jsonMod.Id.substring(2)}Value` : null), // Keep existing or generate calcFunc name
        scaleWithItemTierAndLevel: existingMod?.scaleWithItemTierAndLevel ?? true // Default to true unless specified otherwise
    };

    // Refine positivity for custom main mods if needed (most seem positive)
    if (newModData.type === 'main' && newModData.positivity === 'negative') {
         // Example: If M_Horizon_Void should be considered positive despite negative req level
         if (newModData.id === 'M_Horizon_Void') newModData.positivity = 'positive';
         // Add more exceptions if needed
    }


    finalModifiers.push(newModData);
});

// Add any existing website modifiers that weren't in the JSON (optional, if needed)
MODIFIERS.forEach(webMod => {
    if (!jsonModifierIds.has(webMod.id) && !webMod.id.startsWith('Stat_')) { // Keep custom ones not in JSON? Exclude basic Stat_ ones unless they were updated
        console.warn(`Modifier "${webMod.id}" exists on website but not in JSON export. Keeping it.`);
        finalModifiers.push(webMod); // Keep it, but its data might be inaccurate
    }
});


// 4. Generate Allowed Slots
finalModifiers.forEach(modifier => {
    const allowed = new Set();
    // Use optional chaining for safer access
    if (modifier?.relatedItemIds?.length > 0) {
        modifier.relatedItemIds.forEach(itemId => {
            const equipment = jsonEquipmentMap.get(itemId);
            if (equipment?.PossibleSlotIds) { // Use optional chaining
                equipment.PossibleSlotIds.forEach(jsonSlotId => {
                    const websiteSlots = websiteSlotMapping[jsonSlotId];
                    if (websiteSlots) {
                        websiteSlots.forEach(wsId => allowed.add(wsId));
                    } else {
                        console.warn(`No website slot mapping found for JSON slot ID: ${jsonSlotId} (Item: ${itemId}, Modifier: ${modifier.id})`);
                    }
                });
            } else {
                 // This might happen for modifiers linked to items not in the equipment export (e.g., Specialization_Amulet)
                 // console.warn(`Equipment item ID "${itemId}" not found in JSON export (Modifier: ${modifier.id}). Cannot determine allowed slots from it.`);
            }
        });
    } else if (modifier.type === 'secondary') {
         // If a secondary has no direct item link (common), assume it can go anywhere a secondary of its positivity can go.
         // This is an approximation as the *real* limitation comes from the main mod's possible secondaries.
         // console.warn(`Secondary modifier "${modifier.id}" has no relatedItemIds. Allowing all slots as a fallback.`);
         // SLOTS.forEach(slot => allowed.add(slot.id)); // Allow all as fallback (less accurate)
         // OR leave it empty and rely on filtering during population
         modifier.allowedSlots = []; // Leave empty, population logic will handle it based on main mod
         return; // Skip setting allowedSlots directly
    } else if (!modifier.isCustom && modifier.type === 'main' && modifier.statName) {
         // Fallback for standard main stats not linked via JSON (shouldn't happen with good JSON)
         console.warn(`Main stat modifier "${modifier.id}" has no relatedItemIds. Allowing all slots as a fallback.`);
         SLOTS.forEach(slot => allowed.add(slot.id));
    }


    modifier.allowedSlots = Array.from(allowed);

    // Special Case: Rings have different secondary counts
    if (modifier.type === 'main' && (modifier.allowedSlots.includes('Ring1') || modifier.allowedSlots.includes('Ring2'))) {
        // Find the corresponding Ring slot definition
        const ringSlot1 = SLOTS.find(s => s.id === 'Ring1');
        // const ringSlot2 = SLOTS.find(s => s.id === 'Ring2'); // ringSlot2 was unused
        if (ringSlot1) {
            modifier.secondaryPositiveCount = ringSlot1.secondaryPositiveCount;
            modifier.secondaryNegativeCount = ringSlot1.secondaryNegativeCount;
        }
         // No need to check Ring2 separately as they have the same counts
    } else if (modifier.type === 'main' && modifier.allowedSlots.length > 0) {
        // For other slots, try to get counts from the first allowed slot definition
        const firstAllowedSlotId = modifier.allowedSlots[0];
        const slotDef = SLOTS.find(s => s.id === firstAllowedSlotId);
         if (slotDef && modifier.secondaryPositiveCount === undefined) { // Only if not already set by JSON
             modifier.secondaryPositiveCount = slotDef.secondaryPositiveCount;
             modifier.secondaryNegativeCount = slotDef.secondaryNegativeCount;
         } else if (modifier.secondaryPositiveCount === undefined) {
             // Fallback if slot definition not found or counts missing
             modifier.secondaryPositiveCount = 2;
             modifier.secondaryNegativeCount = 1;
         }
    }


});


// Replace the old MODIFIERS array
const MODIFIERS_UPDATED = finalModifiers;


// --- Calculation & Formatting Helpers ---

// Mimics RGUtils.GetFormatedNumber - simplified
function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    if (Math.abs(num) < 0.01 && num !== 0) {
        return num.toExponential(2);
    }
    const fixed = num.toFixed(2);
    return parseFloat(fixed).toString(); // Remove trailing zeros like .00
}

// Mimics EquipmentModifier.GetFixedValue / GetVariableValue / GetFinalValue
// Adjusted scaling factors based on C# code analysis
// SonarLint: Cognitive Complexity was high, simplified slightly and added comments
function calculateModifierValue(modifier, itemTier, itemLevel, playerLevel = 1) {
    // Guard clauses for invalid inputs
    if (!modifier || (!modifier.statName && !modifier.isCustom)) return 0;
    if (modifier.isCustom) return 0; // Custom values handled by specific calcFunc

    const scale = modifier.scaleWithItemTierAndLevel !== false;
    const isMultiplier = modifier.statsApplicationType === 'Multiplier';
    const baseValue = modifier.baseValue ?? (isMultiplier ? 1 : 0);
    const valuePerLevel = modifier.valuePerLevel ?? (isMultiplier ? 1 : 0);
    itemTier = Number(itemTier) || 1;
    itemLevel = Number(itemLevel) || 1;

    let fixedValue = isMultiplier ? 1 : 0;
    let variableValue = isMultiplier ? 1 : 0;

    // --- Fixed Value Part ---
    // Calculate the part of the value derived from the modifier's BaseValue
    if (baseValue !== (isMultiplier ? 1 : 0)) {
        if (isMultiplier) {
            // C# Example: MathF.Pow(this.GetBaseValue(), scale ? (float)(0.8 + (0.01 * (itemLevel - 1)) + 0.2 * itemTier) : 1f);
            const exponent = scale ? (0.8 + (0.01 * (itemLevel - 1)) + 0.2 * itemTier) : 1;
            fixedValue = Math.pow(baseValue, exponent);
        } else { // Base or Post
            // C# Example: this.GetBaseValue() * (scale ? (float)(1 + 0.05 * (itemLevel - 1) + 0.1 * itemTier) : 1f); -> Adjusted based on common patterns
            const multiplier = scale ? (1 + 0.05 * (itemLevel - 1) + 0.1 * itemTier) : 1;
            fixedValue = baseValue * multiplier;
        }
    }

    // --- Variable Value Part ---
    // Calculate the part of the value derived from the modifier's ValuePerLevel (scaled by playerLevel)
    if (valuePerLevel !== (isMultiplier ? 1 : 0) && playerLevel > 0) {
        if (isMultiplier) {
            // C# Example: MathF.Pow(MathF.Pow(this.GetValuePerLevel(), playerLevel), scale ? (float)(0.875 + (0.005 * (itemLevel - 1)) + 0.125 * itemTier) : 1f);
            const baseVarMult = Math.pow(valuePerLevel, playerLevel);
            const exponent = scale ? (0.875 + (0.005 * (itemLevel - 1)) + 0.125 * itemTier) : 1;
            variableValue = Math.pow(baseVarMult, exponent);
        } else { // Base or Post
            // C# Example: (float)((double)this.GetValuePerLevel() * (double)playerLevel * (scale ? 0.5 + 0.025 * (itemLevel - 1) + 0.5 * itemTier : 1.0));
            const multiplier = scale ? (0.5 + 0.025 * (itemLevel - 1) + 0.5 * itemTier) : 1.0;
            variableValue = valuePerLevel * playerLevel * multiplier;
        }
    }

    // --- Combine ---
    let finalValue;
    if (isMultiplier) {
        const calculated = fixedValue * variableValue;
        // Handle potential NaN or 0 results for multipliers, default to 1 (no change)
        // Extracted nested ternary for SonarLint S3358
        if (isNaN(calculated) || calculated === 0) {
            finalValue = 1;
        } else {
            finalValue = calculated;
        }
    } else { // Base or Post
        finalValue = (fixedValue || 0) + (variableValue || 0);
    }

    // Ensure value is not NaN
    // Extracted nested ternary for SonarLint S3358
    if (isNaN(finalValue)) {
        return isMultiplier ? 1 : 0;
    } else {
        return finalValue;
    }
}


// --- Required Level Calculation ---
// REVISED: Subtracts cost of negative secondaries
function getBaseRequiredLevel(selectedModifiers) {
    let baseLevel = 0;
    selectedModifiers.forEach(mod => {
        if (mod?.requiredLevelModifier !== undefined) { // Use optional chaining
            // Main mods and positive secondaries ADD cost
            if (mod.type === 'main' || mod.positivity === 'positive') {
                baseLevel += mod.requiredLevelModifier;
            }
            // Negative secondaries SUBTRACT cost (using their positive requiredLevelModifier value)
            else if (mod.positivity === 'negative') {
                baseLevel -= mod.requiredLevelModifier; // Subtract the positive cost value
            }
        }
    });
    // Ensure required level doesn't go below 0 due to negative mods
    return Math.max(0, baseLevel);
}

// float GetTierCardLevelEffect(int level, int tier) - Matches C#
function getTierLevelEffect(itemTier, itemLevel) {
    itemTier = Number(itemTier) || 1;
    itemLevel = Number(itemLevel) || 1;
    // Use the positive tier formula part from C#
    // C#: (float) (1.0 + (0.025 * (double) level + (double) tier * 0.5));
    return (1.0 + (0.025 * itemLevel) + (0.5 * itemTier));
}

// int RequiredCardLevel => Mathf.RoundToInt(GetBaseRequiredCardLevel() * GetTierCardLevelEffect(level, tier));
function calculateRequiredLevel(selectedModifiers, itemTier, itemLevel) {
    const baseReq = getBaseRequiredLevel(selectedModifiers);
    const effect = getTierLevelEffect(itemTier, itemLevel);
    const calculatedLevel = Math.round(baseReq * effect);
    // Ensure final level is at least 1 if any modifier contributing positively exists
    const hasPositiveContribution = selectedModifiers.some(mod => mod && mod.requiredLevelModifier > 0 && (mod.type === 'main' || mod.positivity === 'positive'));
    return (hasPositiveContribution && calculatedLevel < 1) ? 1 : calculatedLevel;
}


// --- Custom Calculation Functions (Translate from C# GetModifierText) ---
// Helper for God Stones - Mimics EM_GodStone.EquivalentLevel
function equivalentLevel(tier, level, minTier, maxTier) {
    const currentVal = tier * 10.0 + level * 0.65; // Matches C# 0.64999...
    const minVal = minTier * 10.0;
    const maxVal = maxTier * 10.0 + 6.5;
    // RemapClamp equivalent
    const range = maxVal - minVal;
    // Avoid division by zero if min/max tiers are the same
    const rawRemap = range === 0 ? 0 : ((currentVal - minVal) / range) * 10.0;
    return Math.max(0.0, Math.min(10.0, rawRemap)); // Clamp between 0 and 10
}

// Map for cleaner stat name replacements
const statDisplayNameMap = {
    'AttackCoolDown': 'Attack Speed',
    'DashCoolDown': 'Dash Cooldown',
    'MaxHealth': 'Max HP',
    'XPGain': 'XP Gain',
    'PickUpDistance': 'Pickup Range',
    'CardDropChance_Void': 'Void Drop Chance',
    'CardDropChance_Fire': 'Fire Drop Chance',
    'CardDropChance_Wind': 'Wind Drop Chance',
    'CardDropChance_Moon': 'Moon Drop Chance',
    'CardDropChance_Sun': 'Sun Drop Chance',
    // Add more specific replacements as needed
};

// SonarLint: Cognitive Complexity was high, simplified slightly
function getDisplayTextForStandardStat(modifier, itemTier, itemLevel) {
    // Use optional chaining for safer access
    if (!modifier?.statName) return 'N/A';

    const finalValue = calculateModifierValue(modifier, itemTier, itemLevel);
    let displayValue = finalValue;
    let prefix = "";
    let suffix = "";

    // Get base display name, apply common replacements first
    let statDisplayName = statDisplayNameMap[modifier.statName] || modifier.statName;
    // Generic replacements (add spaces before capitals)
    statDisplayName = statDisplayName.replace(/([A-Z])/g, ' $1').trim();

    const isMultiplier = modifier.statsApplicationType === 'Multiplier';
    const isNearZero = Math.abs(finalValue) < 0.001;
    const isNearOne = Math.abs(finalValue - 1) < 0.001;

    if (isMultiplier) {
        suffix = "%";
        if (isNearOne) {
            displayValue = 0; // No change
            prefix = "+";
        } else {
            // Calculate percentage change from 1
            displayValue = (finalValue - 1) * 100;
            prefix = displayValue > 0 ? "+" : ""; // Add + only if positive % change

            // Special handling for stats where lower multiplier is better
            const lowerIsBetter = ['Attack Speed', 'Dash Cooldown'].includes(statDisplayName);
            const isMitigation = modifier.statName === 'DamageMitigation';

            if ((lowerIsBetter || isMitigation) && finalValue < 1) {
                displayValue = (1 - finalValue) * 100; // Show reduction %
                prefix = lowerIsBetter ? "-" : "+"; // Indicate reduction (-) or positive effect (+)
            } else if (isMitigation && finalValue > 1) {
                displayValue = (finalValue - 1) * 100; // Show increased damage taken %
                prefix = "-"; // Indicate negative effect (less mitigation)
                statDisplayName += " (Taken)"; // Clarify it's damage taken increase
            }
        }
    } else { // Base or Post
        prefix = finalValue > 0 && !isNearZero ? "+" : "";
        // Suffix might depend on stat (e.g., 's' for duration) - skip for simplicity
    }

    // Avoid showing prefix for zero values unless it's a percentage
    if (isNearZero && !isMultiplier) {
        prefix = "";
    }

    return `${prefix}${formatNumber(displayValue)}${suffix} ${statDisplayName}`;
}
function calcAcclimatizedLeggingValue(modifier, itemTier, itemLevel) {
    const gain = Math.min(2.0, 0.2 + itemTier * 0.1 + 0.005 * itemLevel);
    return `+${formatNumber(gain)}% Damage Mitigation (per Stage)`;
}
function calcBandOfValianceValue(modifier, itemTier, itemLevel) {
    const bonus = (2.0 + itemTier * 0.25 + 0.015 * itemLevel);
    const percentBonus = (bonus - 1.0) * 100.0;
    return `+${formatNumber(percentBonus)}% Elite/Champion EXP`;
}
function calcBloodiedTowelValue(modifier, itemTier, itemLevel) {
    const gain = 0.02 + itemTier * 0.01 + 0.0005 * itemLevel;
    return `+${formatNumber(gain * 100)}% Corruption Multiplier (per Stage/Zone)`;
}
function calcExpertMonocleValue(modifier, itemTier, itemLevel) {
    const bonus = itemTier * 0.5 + 0.025 * itemLevel;
    return `+${formatNumber(bonus)} Item Quality`;
}
function calcFancyHatValue(modifier, itemTier, itemLevel) {
    const discount = Math.min(0.5, 0.15 + itemTier * 0.025 + 0.001 * itemLevel);
    return `${formatNumber(discount * 100)}% Shop Discount`;
}
function calcGoldenPlateValue(modifier, itemTier, itemLevel) {
    const gain = 1.0 + itemTier * 0.25 + 0.015 * itemLevel;
    return `+${formatNumber(gain)} Gold on Overkill`;
}
function calcGoldenRingValue(modifier, itemTier, itemLevel) {
    const chance = Math.min(0.5, 0.05 + itemTier * 0.05 + 0.003 * itemLevel);
    return `+${formatNumber(chance * 100)}% Limit Break Chance (Shop)`;
}
function calcHaloValue(modifier, itemTier, itemLevel) {
    const bonus = 0.05 + itemTier * 0.02 + 0.001 * itemLevel;
    return `+${formatNumber(bonus * 100)}% Power, Move Speed, Max HP, Pickup Range`;
}
function calcHolyCrossguardValue(modifier, itemTier, itemLevel) {
    const gain = 0.2 + itemTier * 0.1 + 0.005 * itemLevel;
    // Note: The actual value depends on challenge multiplier, which we can't know here.
    // Display the base gain per multiplier point.
    return `+${formatNumber(gain)} Final Power (per Challenge Multiplier)`;
}
function calcKingSlayerValue(modifier, itemTier, itemLevel) {
    const bonus = 0.3 + itemTier * 0.1 + 0.008 * itemLevel;
    return `+${formatNumber(bonus * 100)}% Damage vs Targeted Elites/Champions`;
}
function calcKnightPendantValue(modifier, itemTier, itemLevel) {
    // Variant selection would be needed here in a full implementation
    return `Start with specific [Knight Weapon] (Variant)`;
}
function calcNinjaTabiValue(modifier, itemTier, itemLevel) {
    const reduction = Math.min(0.5, 0.05 + itemTier * 0.05 + 0.0035 * itemLevel);
    return `-${formatNumber(reduction * 100)}% One-Shot Protection Cooldown`;
}
function calcNobleSlayerValue(modifier, itemTier, itemLevel) {
    const bonus = 0.2 + itemTier * 0.06 + 0.005 * itemLevel;
    return `+${formatNumber(bonus * 100)}% Damage vs Elites/Champions`;
}
function calcSoulJarValue(modifier, itemTier, itemLevel) {
    const gainPerLog = 0.05 + 0.0075 * itemTier + 0.0005 * itemLevel;
    // The actual value depends on overkill count, which we can't know.
    // Display the gain per log2 unit.
    return `+${formatNumber(gainPerLog * 100)}% Soul Coin Gain (per log2(Overkills))`;
}
function calcSpecializationValue(modifier, itemTier, itemLevel) {
    const multiplier = 1.2 + itemTier * 0.05 + 0.003 * itemLevel;
    const percentBonus = (multiplier - 1.0) * 100.0;
    return `+${formatNumber(percentBonus)}% Global Damage (if 1 weapon)`;
}
function calcTowerShieldValue(modifier, itemTier, itemLevel) {
    const reduction = Math.min(0.5, 0.05 + itemTier * 0.05 + 0.0035 * itemLevel);
    return `-${formatNumber(reduction * 100)}% One-Shot Protection Threshold`;
}
function calcTrainerValue(modifier, itemTier, itemLevel) {
    // C# code: Mathf.FloorToInt((float) (1.25 + 0.75 * (double) itemTier));
    // C# code adds (bonusLevel - 1) to the card level gain.
    const bonusLevel = Math.floor(1.25 + 0.75 * itemTier);
    return `First Weapon starts +${formatNumber(bonusLevel -1)} Levels`;
}
function calcWeaponFinaleDamageValue(modifier, itemTier, itemLevel) {
    const value = 0.25 + itemTier * 0.5 + itemLevel * 0.05;
     // Variant selection would be needed here in a full implementation
    return `+${formatNumber(value)} Final Damage to [Weapon] (Variant)`;
}
function formatGodStoneLine(value, statName, isPercent = true, isMultiplier = true) {
    let displayValue = value;
    let prefix = "";
    const isNearZero = Math.abs(value) < 0.001;
    const isNearOne = Math.abs(value - 1.0) < 0.001;

    if (isMultiplier) {
        if (isNearOne) { // Treat near 1 as 0% change
            displayValue = 0;
        } else {
            displayValue = (value - 1.0) * 100.0;
        }
    } else if (!isMultiplier && isNearZero) { // Treat near 0 as 0 for base stats
        displayValue = 0;
    }

    if (displayValue > 0) prefix = "+";

    // Special case for cooldown reduction (multiplier < 1)
    if (statName.includes("Cooldown") && isMultiplier && value < 1 && !isNearOne) {
        displayValue = (1.0 - value) * 100.0;
        prefix = "-"; // Show as reduction
    }
     // Special case for mitigation (multiplier < 1 is good)
    if (statName.includes("Mitigation") && isMultiplier && value < 1 && !isNearOne) {
        displayValue = (1.0 - value) * 100.0;
        prefix = "+"; // Show as positive mitigation %
    }

    // Apply display name mapping if available, otherwise format
    let statDisplayName = statDisplayNameMap[statName] || statName;
    statDisplayName = statDisplayName.replace(/([A-Z])/g, ' $1').trim();
    statDisplayName = statDisplayName.replace('Card Drop Chance', 'Drop Chance'); // Generic shortening

    // Avoid prefix for zero values
    if (Math.abs(displayValue) < 0.001) {
        prefix = "";
    }

    return `${prefix}${formatNumber(displayValue)}${isPercent ? '%' : ''} ${statDisplayName}`;
}
function calcFireStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 1, 3);
    const dropFire = 1.05 + 0.05 * level;
    const piercingScaling = 0.005 + 0.0025 * level;
    const power = 1.01 + 0.01 * level;

    return [
        formatGodStoneLine(dropFire, "Fire Drop Chance"),
        formatGodStoneLine(piercingScaling * 100, "Piercing Scaling", true, false), // Base stat shown as %
        formatGodStoneLine(power, "Power")
    ].join('<br>'); // Use <br> for line breaks in HTML
}
function calcFieryStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 4, 6);
    const dropFire = 1.5 + 0.1 * level;
    const piercingScaling = 0.03 + 0.005 * level;
    const power = 1.1 + 0.05 * level;
     return [
        formatGodStoneLine(dropFire, "Fire Drop Chance"),
        formatGodStoneLine(piercingScaling * 100, "Piercing Scaling", true, false),
        formatGodStoneLine(power, "Power")
    ].join('<br>');
}
function calcWindStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 1, 3);
    const dropChance = 1.05 + 0.05 * level;
    const attackSpeedMult = 1.0 / (0.99 - 0.005 * level); // Calculate effective multiplier
    const dashCooldown = 0.99 - 0.005 * level;
    const moveSpeed = 1.01 + 0.01 * level;

    return [
        formatGodStoneLine(dropChance, "Wind Drop Chance"),
        formatGodStoneLine(attackSpeedMult, "AttackCoolDown"), // Use internal name for formatting logic
        formatGodStoneLine(dashCooldown, "DashCoolDown"), // Use internal name for formatting logic
        formatGodStoneLine(moveSpeed, "Move Speed")
    ].join('<br>');
}
function calcGaleStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 4, 6);
    const dropChance = 1.5 + 0.1 * level;
    const attackSpeedMult = 1.0 / (0.95 - 0.02 * level);
    const dashCooldown = 0.95 - 0.02 * level;
    const moveSpeed = 1.1 + 0.025 * level;
     return [
        formatGodStoneLine(dropChance, "Wind Drop Chance"),
        formatGodStoneLine(attackSpeedMult, "AttackCoolDown"),
        formatGodStoneLine(dashCooldown, "DashCoolDown"),
        formatGodStoneLine(moveSpeed, "Move Speed")
    ].join('<br>');
}
function calcMoonStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 1, 3);
    const dropChance = 1.05 + 0.05 * level;
    const mitigation = 0.99 - 0.01 * level; // Multiplier
    const defence = 1.025 + 0.025 * level; // Multiplier

    return [
        formatGodStoneLine(dropChance, "Moon Drop Chance"),
        formatGodStoneLine(mitigation, "DamageMitigation"), // Use internal name
        formatGodStoneLine(defence, "Defence")
    ].join('<br>');
}
function calcLunarStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 4, 6);
    const dropChance = 1.5 + 0.1 * level;
    const mitigation = 0.9 - 0.02 * level;
    const defence = 1.25 + 0.05 * level;
     return [
        formatGodStoneLine(dropChance, "Moon Drop Chance"),
        formatGodStoneLine(mitigation, "DamageMitigation"),
        formatGodStoneLine(defence, "Defence")
    ].join('<br>');
}
function calcSunStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 1, 3);
    const dropChance = 1.05 + 0.05 * level;
    const purification = 1.0 / (0.99 - 0.01 * level);
    const xpMult = 1.05 + 0.01 * level;

    return [
        formatGodStoneLine(dropChance, "Sun Drop Chance"),
        formatGodStoneLine(purification, "Purification"),
        formatGodStoneLine(xpMult, "XPGain") // Use internal name
    ].join('<br>');
}
function calcSolarStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 4, 6);
    const dropChance = 1.5 + 0.1 * level;
    const purification = 1.0 / (0.9 - 0.02 * level);
    const xpMult = 1.15 + 0.02 * level;
     return [
        formatGodStoneLine(dropChance, "Sun Drop Chance"),
        formatGodStoneLine(purification, "Purification"),
        formatGodStoneLine(xpMult, "XPGain")
    ].join('<br>');
}
function calcStelarStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 7, 9);
    const dropChance = 1.75 + 0.1 * level;
    const purification = 1.0 / (0.85 - 0.02 * level);
    const xpMult = 1.25 + 0.025 * level;
    const mitigation = 0.85 - 0.02 * level;
    const defence = 1.45 + 0.05 * level;

    return [
        formatGodStoneLine(dropChance, "Sun/Moon Drop Chance"),
        formatGodStoneLine(purification, "Purification"),
        formatGodStoneLine(xpMult, "XPGain"),
        formatGodStoneLine(mitigation, "DamageMitigation"),
        formatGodStoneLine(defence, "Defence")
    ].join('<br>');
}
function calcStormStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 7, 9);
    const dropChance = 1.75 + 0.1 * level;
    const attackSpeedMult = 1.0 / (0.85 - 0.02 * level);
    const power = 1.25 + 0.025 * level;
    const piercingScaling = 0.06 + 0.005 * level;
    const dashCooldown = 0.85 - 0.02 * level;
    const moveSpeed = 1.25 + 0.025 * level;

    return [
        formatGodStoneLine(dropChance, "Fire/Wind Drop Chance"),
        formatGodStoneLine(piercingScaling * 100, "Piercing Scaling", true, false),
        formatGodStoneLine(power, "Power"),
        formatGodStoneLine(attackSpeedMult, "AttackCoolDown"),
        formatGodStoneLine(dashCooldown, "DashCoolDown"),
        formatGodStoneLine(moveSpeed, "Move Speed")
    ].join('<br>');
}


// --- Main Function to Get Display Text ---
function getModifierEffectText(modifier, itemTier = 1, itemLevel = 1) {
    itemTier = Number(itemTier) || 1;
    itemLevel = Number(itemLevel) || 1;

    // Use optional chaining
    if (modifier?.isCustom && typeof window[modifier.calcFunc] === 'function') {
        try {
            return window[modifier.calcFunc](modifier, itemTier, itemLevel);
        } catch (e) {
            console.error(`Error calculating custom modifier ${modifier.id}:`, e);
            return `${modifier.name} (Calculation Error)`;
        }
    // Use optional chaining
    } else if (modifier?.statName && modifier?.statsApplicationType) {
        return getDisplayTextForStandardStat(modifier, itemTier, itemLevel);
    // Use optional chaining
    } else if (modifier?.statName === null && modifier?.type === 'main') {
         // Handle "None" main stats like Chest_M_Empty
         return `Provides Secondary Slots Only`;
    } else if (modifier) {
        return modifier.name; // Fallback to name if no calculation possible
    } else {
        return ' '; // Return non-breaking space for empty
    }
}


// --- Global Helper ---
function getModifierById(id) {
    return MODIFIERS_UPDATED.find(m => m.id === id); // Use the updated list
}

// No changes needed for getRarityColor / getPositivityColor
function getRarityColor(rarity) {
    switch (rarity) {
        case 'Common': return 'var(--rarity-common)';
        case 'Uncommon': return 'var(--rarity-uncommon)';
        case 'Rare': return 'var(--rarity-rare)';
        case 'Epic': return 'var(--rarity-epic)';
        case 'Legendary': return 'var(--rarity-legendary)';
        case 'Mythical': return 'var(--rarity-mythical)';
        case 'Ascended': return 'var(--rarity-ascended)';
        case 'Unique': return 'var(--rarity-unique)';
        default: return 'var(--text-color)';
    }
}

function getPositivityColor(positivity) {
    switch (positivity) {
        case 'positive': return 'var(--positive-color)';
        case 'negative': return 'var(--negative-color)';
        default: return 'var(--text-color)';
    }
}

// --- Final Data Setup ---
// Assign the processed modifiers back to the global scope
// This overwrites the initial placeholder 'let MODIFIERS'
MODIFIERS = MODIFIERS_UPDATED;

// Generate allowedSlots after MODIFIERS is finalized
// This loop seems redundant as allowedSlots were already generated above (lines 283-341)
// and assigned to finalModifiers, which was then assigned to MODIFIERS.
// However, let's keep it but ensure it uses the final MODIFIERS array.
// Re-evaluating: The first loop (283-341) populates allowedSlots based on relatedItemIds.
// This second loop seems intended as a fallback or broader assignment,
// especially for secondaries. Let's refine the logic here.

MODIFIERS.forEach(modifier => {
    // If allowedSlots is already populated (from relatedItemIds), skip broader assignment.
    if (modifier.allowedSlots && modifier.allowedSlots.length > 0) {
        return;
    }

    const allowed = new Set();
    // Use optional chaining
    if (modifier?.type === 'secondary') {
        // Fallback for secondaries without specific item links.
        // Allow all slots initially. Filtering during population in script.js will be more accurate.
         SLOTS.forEach(slot => allowed.add(slot.id));
         // console.warn(`Secondary modifier "${modifier.id}" has no relatedItemIds or existing allowedSlots. Allowing all slots as a fallback.`);
    } else if (modifier?.type === 'main' && !modifier.isCustom && modifier.statName) {
         // Fallback for standard main stats not linked via JSON and not already assigned slots
         SLOTS.forEach(slot => allowed.add(slot.id));
         console.warn(`Main stat modifier "${modifier.id}" has no relatedItemIds or existing allowedSlots. Allowing all slots as a fallback.`);
    }
    // Only assign if we generated a fallback list
    if (allowed.size > 0) {
        modifier.allowedSlots = Array.from(allowed);
    } else if (!modifier.allowedSlots) {
        // Ensure allowedSlots always exists, even if empty
        modifier.allowedSlots = [];
    }
});


// Add default secondary counts to SLOTS if not overridden by main mod
SLOTS.forEach(slot => {
    if (slot.secondaryPositiveCount === undefined) slot.secondaryPositiveCount = 2;
    if (slot.secondaryNegativeCount === undefined) slot.secondaryNegativeCount = 1;
     // Ring specific counts (already defined in initial SLOTS, but this ensures it)
    if (slot.id === 'Ring1' || slot.id === 'Ring2') {
        slot.secondaryPositiveCount = 1;
        slot.secondaryNegativeCount = 1;
    }
});

// Define RARITY_ORDER globally if not already defined (needed for sorting in script.js)
const RARITY_ORDER = [
    'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical', 'Ascended', 'Unique'
];