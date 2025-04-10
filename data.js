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
// 'hasVariants' added for modifiers needing variant selection

// Use 'let' here to allow reassignment after processing JSON data
// Initialize as empty, it will be populated entirely from JSON processing below.
let MODIFIERS = [];

// --- JSON Data Integration ---
const jsonData = {
  "ModifierDataExport_Relevant": [
    // ... (Keep the full JSON data as provided before) ...
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
    { "Id": "M_ExpertMonocle", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": -3.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 0, "RelatedItemIds": [ "ExpertMonocle" ], "Variants": [] },
    { "Id": "M_FancyHat", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "FancyHat" ], "Variants": [] },
    { "Id": "M_Halo", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 0, "SecondaryNegativeCount": 0, "RelatedItemIds": [ "Halo" ], "Variants": [] },
    { "Id": "M_AcclimatizedLegging", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 0, "SecondaryNegativeCount": 0, "RelatedItemIds": [ "AcclimatizedLegging" ], "Variants": [] },
    { "Id": "M_Adaptive_Leggings", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 1.0, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.0, "ModifierType": "Main", "SecondaryPositiveCount": 3, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Adaptive_Leggings" ], "Variants": [] },
    { "Id": "M_TowerShield", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 2, "RelatedItemIds": [ "TowerShield" ], "Variants": [] },
    // --- Manually added entries for missing custom/variant modifiers from source code ---
    { "Id": "M_BandOfValiance", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "BandOfValiance" ], "Variants": [] },
    { "Id": "M_BloodiedTowel", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "BloodiedTowel" ], "Variants": [] },
    { "Id": "M_GoldenPlate", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "GoldenPlate" ], "Variants": [] },
    { "Id": "M_GoldenRing", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "PriestAttires" ], "Variants": [] }, // Linked to PriestAttires based on EquipmentData
    { "Id": "M_HolyCrossguard", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "HolyCrossguard" ], "Variants": [] },
    { "Id": "M_KingSlayer", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "KingSlayer_Glove" ], "Variants": [] },
    { "Id": "M_KnightPendant", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "KnightPendant" ], "Variants": [], "hasVariants": true }, // Mark as having variants
    { "Id": "M_NinjaTabi", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "NinjaTabi" ], "Variants": [] },
    { "Id": "M_NobleSlayer", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "NobleSlayer_Glove" ], "Variants": [] },
    { "Id": "M_SoulJar", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "SoulJar" ], "Variants": [] },
    { "Id": "M_Specialization", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ /* Need to find related item if any */ ], "Variants": [] }, // Assuming this exists based on EM_Specialization.cs
    { "Id": "M_Trainer", "Rarity": "Unique", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 0.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 1, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "Trainer_Glove" ], "Variants": [] },
    { "Id": "EM_WeaponFinaleDamage", "Rarity": "Rare", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 2.0, "ModifierType": "Secondary", "positivity": "positive", "RelatedItemIds": [ /* Not directly linked */ ], "Variants": [], "hasVariants": true }, // Example secondary with variants
    // --- God Stones ---
    { "Id": "M_FieryStone", "Rarity": "Epic", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 5.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "FieryStone" ], "Variants": [] },
    { "Id": "M_FireStone", "Rarity": "Uncommon", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 1.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "FireStone" ], "Variants": [] },
    { "Id": "M_GaleStone", "Rarity": "Epic", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 5.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "GaleStone" ], "Variants": [] },
    { "Id": "M_LunarStone", "Rarity": "Epic", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 5.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "LunarStone" ], "Variants": [] },
    { "Id": "M_MoonStone", "Rarity": "Uncommon", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 1.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "MoonStone" ], "Variants": [] },
    { "Id": "M_SolarStone", "Rarity": "Epic", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 5.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "SolarStone" ], "Variants": [] },
    { "Id": "M_StelarStone", "Rarity": "Legendary", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 10.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "StelarStone" ], "Variants": [] },
    { "Id": "M_StormStone", "Rarity": "Legendary", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 10.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "StormStone" ], "Variants": [] },
    { "Id": "M_SunStone", "Rarity": "Uncommon", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 1.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "SunStone" ], "Variants": [] },
    { "Id": "M_WindStone", "Rarity": "Uncommon", "StatName": "None", "StatsApplicationType": "Base", "BaseValue": 0.0, "ValuePerLevel": 0.0, "RequiredLevelModifier": 1.0, "ModifierType": "CustomMain", "SecondaryPositiveCount": 2, "SecondaryNegativeCount": 1, "RelatedItemIds": [ "WindStone" ], "Variants": [] },
    // --- Add other missing secondary modifiers if identified ---
    // Example: { "Id": "SecPos_Example", "Rarity": "Common", "StatName": "MoveSpeed", "StatsApplicationType": "Multiplier", "BaseValue": 1.02, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.5, "ModifierType": "Secondary", "positivity": "positive", "RelatedItemIds": [], "Variants": [] },
    // Example: { "Id": "SecNeg_Example", "Rarity": "Common", "StatName": "AttackCoolDown", "StatsApplicationType": "Multiplier", "BaseValue": 1.02, "ValuePerLevel": 1.0, "RequiredLevelModifier": 0.5, "ModifierType": "Secondary", "positivity": "negative", "RelatedItemIds": [], "Variants": [] },
  ],
  "EquipmentDataExport_Relevant": [
    // ... (Keep the full JSON data as provided before) ...
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
    // ... (Keep the full JSON data as provided before) ...
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

// 3. Process and Update/Add Modifiers from JSON
const finalModifiers = [];
const jsonModifierIds = new Set(jsonData.ModifierDataExport_Relevant.map(m => m.Id));

// Helper function to generate a default name from ID
function generateNameFromId(id) {
    // Remove common prefixes like M_, EM_, Chest_, Ring_, etc.
    let name = id.replace(/^(M_|EM_|Chest_|Ring_|Boot_|Glove_|Helmet_|Legging_|Shield_|Holster_)/, '');
    // Add spaces before capital letters (camelCase to Title Case)
    name = name.replace(/([A-Z])/g, ' $1');
    // Replace underscores with spaces
    name = name.replace(/_/g, ' ');
    // Trim whitespace and capitalize first letter
    name = name.trim();
    return name.charAt(0).toUpperCase() + name.slice(1);
}

// Manual display name overrides (Issue #6 Improvement)
const displayNameOverrides = {
    "Chest_M_Regen": "Chest Health Regen", // Example
    "EM_WeaponFinaleDamage": "Weapon Finale Damage", // Example
    // Add more overrides as needed
};

// Process modifiers defined in the JSON data
jsonData.ModifierDataExport_Relevant.forEach(jsonMod => {
    const isCustom = jsonMod.Id.startsWith('EM_') || jsonMod.ModifierType.startsWith('Custom');
    const generatedName = generateNameFromId(jsonMod.Id);
    const displayName = displayNameOverrides[jsonMod.Id] || generatedName; // Use override or generated name

    const newModData = {
        id: jsonMod.Id,
        name: generatedName, // Keep generated name for potential internal use/filtering
        displayName: displayName, // Use this for UI display
        type: jsonMod.ModifierType === 'Main' ? 'main' : 'secondary',
        positivity: jsonMod.positivity || (jsonMod.ModifierType === 'Secondary' && jsonMod.Id.includes('SecNeg') ? 'negative' : 'positive'),
        rarity: jsonMod.Rarity,
        allowedSlots: [], // Will be populated later
        description: `Stat: ${jsonMod.StatName}`, // Basic description
        statName: jsonMod.StatName === 'None' ? null : jsonMod.StatName, // Handle "None" stat
        statsApplicationType: jsonMod.StatsApplicationType,
        baseValue: jsonMod.BaseValue,
        valuePerLevel: jsonMod.ValuePerLevel,
        requiredLevelModifier: jsonMod.RequiredLevelModifier,
        modifierType: jsonMod.ModifierType, // Store original type if needed
        relatedItemIds: jsonMod.RelatedItemIds || [],
        secondaryPositiveCount: jsonMod.ModifierType === 'Main' ? jsonMod.SecondaryPositiveCount : undefined,
        secondaryNegativeCount: jsonMod.ModifierType === 'Main' ? jsonMod.SecondaryNegativeCount : undefined,
        isCustom: isCustom,
        // Generate calcFunc name for custom mods if not provided
        calcFunc: isCustom ? `calc${jsonMod.Id.replace(/^M_|^EM_/, '')}Value` : null,
        scaleWithItemTierAndLevel: jsonMod.ScaleWithItemTierAndLevel !== false, // Default to true unless specified otherwise in JSON (assuming it exists)
        hasVariants: jsonMod.hasVariants || false, // Check for manually added flag
    };

    // Refine positivity for specific cases if needed
    if (newModData.id === 'M_Horizon_Void') newModData.positivity = 'positive';
    if (newModData.id === 'EM_WeaponFinaleDamage') newModData.positivity = 'positive'; // Ensure secondary variant example is positive

    finalModifiers.push(newModData);
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
                        // Keep warning for unmapped slots
                        console.warn(`No website slot mapping found for JSON slot ID: ${jsonSlotId} (Item: ${itemId}, Modifier: ${modifier.id})`);
                    }
                });
            }
            // No warning needed if equipment itself isn't found, might be intentional
        });
    } else if (modifier.type === 'secondary') {
         // Secondary mods without explicit item links: leave allowedSlots empty.
         // Population logic in script.js will handle filtering based on main mod.
         modifier.allowedSlots = [];
         return; // Skip setting allowedSlots directly
    } else if (!modifier.isCustom && modifier.type === 'main' && modifier.statName) {
         // Fallback for standard main stats not linked via JSON (shouldn't happen with good JSON)
         console.warn(`Main stat modifier "${modifier.id}" has no relatedItemIds. Allowing all slots as a fallback.`);
         SLOTS.forEach(slot => allowed.add(slot.id));
    }


    modifier.allowedSlots = Array.from(allowed);

    // Override secondary counts based on slot type (Rings vs others)
    // This should happen *after* allowedSlots are determined.
    if (modifier.type === 'main') {
        const isRing = modifier.allowedSlots.some(sId => sId === 'Ring1' || sId === 'Ring2');
        if (isRing) {
            const ringSlotDef = SLOTS.find(s => s.id === 'Ring1'); // Get counts from Ring1 def
            if (ringSlotDef) {
                modifier.secondaryPositiveCount = ringSlotDef.secondaryPositiveCount;
                modifier.secondaryNegativeCount = ringSlotDef.secondaryNegativeCount;
            }
        } else if (modifier.allowedSlots.length > 0) {
            // For non-rings, use counts from the first allowed slot definition,
            // but only if the JSON didn't already provide counts.
            if (modifier.secondaryPositiveCount === undefined || modifier.secondaryNegativeCount === undefined) {
                const firstAllowedSlotId = modifier.allowedSlots[0];
                const slotDef = SLOTS.find(s => s.id === firstAllowedSlotId);
                if (slotDef) {
                    modifier.secondaryPositiveCount = modifier.secondaryPositiveCount ?? slotDef.secondaryPositiveCount;
                    modifier.secondaryNegativeCount = modifier.secondaryNegativeCount ?? slotDef.secondaryNegativeCount;
                } else {
                    // Absolute fallback if slotDef not found
                    modifier.secondaryPositiveCount = modifier.secondaryPositiveCount ?? 2;
                    modifier.secondaryNegativeCount = modifier.secondaryNegativeCount ?? 1;
                }
            }
        } else {
             // Main mod with no allowed slots? Fallback counts.
             modifier.secondaryPositiveCount = modifier.secondaryPositiveCount ?? 2;
             modifier.secondaryNegativeCount = modifier.secondaryNegativeCount ?? 1;
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

// --- REVISED calculateModifierValue Helpers (Issue #1) ---
// Based on EquipmentModifier.cs GetFixedValue / GetVariableValue / GetFinalValue

function calculateFixedValuePart(modifier, itemTier, itemLevel) {
    const baseValue = modifier.baseValue ?? (modifier.statsApplicationType === 'Multiplier' ? 1 : 0);
    if (modifier.statsApplicationType === 'Multiplier') {
        if (baseValue === 1) return 1;
        const exponent = modifier.scaleWithItemTierAndLevel
            ? (0.8 + (0.01 * (itemLevel - 1)) + 0.2 * itemTier)
            : 1;
        return Math.pow(baseValue, exponent);
    } else { // Base or Post
        if (baseValue === 0) return 0;
        // NOTE: C# code seems to have different scaling for Base/Post in GetFixedValue vs GetVariableValue.
        // GetFixedValue uses: (0.05 * (level - 1)) + tier -> This seems wrong, likely a typo in decompiled code?
        // Let's assume it should be similar to the multiplier scaling structure or simpler.
        // Using a simpler scaling based on common patterns: 1 + (0.05 * (level - 1)) + (0.1 * tier)
        // If ScaleWithItemTierAndLevel is false, multiplier is 1.
        const multiplier = modifier.scaleWithItemTierAndLevel
            ? (1 + (0.05 * (itemLevel - 1)) + (0.1 * itemTier)) // Adjusted assumption
            : 1;
        return baseValue * multiplier;
    }
}

function calculateVariableValuePart(modifier, playerLevel, itemTier, itemLevel) {
    const valuePerLevel = modifier.valuePerLevel ?? (modifier.statsApplicationType === 'Multiplier' ? 1 : 0);
    if (playerLevel <= 0) return (modifier.statsApplicationType === 'Multiplier' ? 1 : 0);

    if (modifier.statsApplicationType === 'Multiplier') {
        if (valuePerLevel === 1) return 1;
        const baseVarMult = Math.pow(valuePerLevel, playerLevel);
        const exponent = modifier.scaleWithItemTierAndLevel
            ? (0.875 + (0.005 * (itemLevel - 1)) + 0.125 * itemTier)
            : 1;
        return Math.pow(baseVarMult, exponent);
    } else { // Base or Post
        if (valuePerLevel === 0) return 0;
        const multiplier = modifier.scaleWithItemTierAndLevel
            ? (0.5 + (0.025 * (itemLevel - 1)) + 0.5 * itemTier)
            : 1.0;
        return valuePerLevel * playerLevel * multiplier;
    }
}

// REVISED Main calculation function using C# logic (Issue #1)
function calculateModifierValue(modifier, itemTier, itemLevel, playerLevel = 1) {
    // Guard clauses
    if (!modifier || (!modifier.statName && !modifier.isCustom)) return 0;
    if (modifier.isCustom) return 0; // Custom values handled by specific calcFunc

    itemTier = Number(itemTier) || 1;
    itemLevel = Number(itemLevel) || 1;
    playerLevel = Number(playerLevel) || 1; // Ensure playerLevel is used

    const fixedValue = calculateFixedValuePart(modifier, itemTier, itemLevel);
    const variableValue = calculateVariableValuePart(modifier, playerLevel, itemTier, itemLevel);

    // Combine based on C# GetFinalValue
    let finalValue;
    if (modifier.statsApplicationType === 'Multiplier') {
        const calculated = fixedValue * variableValue;
        // Handle potential NaN or zero results for multipliers, default to 1
        finalValue = (isNaN(calculated) || calculated === 0) ? 1 : calculated;
    } else { // Base or Post
        finalValue = (fixedValue || 0) + (variableValue || 0);
    }

    // Ensure value is not NaN
    return isNaN(finalValue) ? (modifier.statsApplicationType === 'Multiplier' ? 1 : 0) : finalValue;
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
                // Check if the negative mod *itself* has a negative cost (unlikely but possible)
                // Standard behavior: Subtract the listed (usually positive) cost value.
                 baseLevel -= mod.requiredLevelModifier;
            }
        }
    });
    // Ensure required level doesn't go below 0 due to negative mods
    return Math.max(0, baseLevel);
}

// REVISED float GetTierCardLevelEffect(int level, int tier) - Matches C# (Issue #2)
function getTierLevelEffect(itemTier, itemLevel) {
    itemTier = Number(itemTier) || 1;
    itemLevel = Number(itemLevel) || 1;
    // C#: return tier < 0 ? (float) (1.0 + (0.02500000037252903 * (double) (10 - level) + (double) -tier * 0.5)) : (float) (1.0 + (0.02500000037252903 * (double) level + (double) tier * 0.5));
    if (itemTier < 0) { // Assuming tier values map directly (e.g. -1, -2...)
        // Note: TIER_MAP currently only has positive values. This logic anticipates potential negative tiers.
        // If tiers are F=1, E=2 etc., negative tiers aren't directly represented.
        // If the *input* itemTier value could be negative based on game logic not shown, this handles it.
        // For now, with TIER_MAP, this branch might not be hit.
        return (1.0 + (0.025 * (10 - itemLevel)) + (-itemTier * 0.5));
    } else {
        return (1.0 + (0.025 * itemLevel) + (itemTier * 0.5));
    }
}

// int RequiredCardLevel => Mathf.RoundToInt(GetBaseRequiredCardLevel() * GetTierCardLevelEffect(level, tier));
function calculateRequiredLevel(selectedModifiers, itemTier, itemLevel) {
    const baseReq = getBaseRequiredLevel(selectedModifiers);
    const effect = getTierLevelEffect(itemTier, itemLevel);
    const calculatedLevel = Math.round(baseReq * effect);
    // Ensure final level is at least 1 if any modifier contributing positively exists
    const hasPositiveContribution = selectedModifiers.some(mod => mod && mod.requiredLevelModifier > 0 && (mod.type === 'main' || mod.positivity === 'positive'));
    // Also ensure level is not negative if baseReq * effect somehow becomes negative
    const finalLevel = Math.max(0, calculatedLevel);
    return (hasPositiveContribution && finalLevel < 1) ? 1 : finalLevel;
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
    'DamageMitigation': 'Damage Mitigation',
    'Defence': 'Defence',
    'CriticalChance': 'Crit Chance',
    'SoulCoinGain': 'Soul Coin Gain',
    'MasteryGain': 'Mastery Gain',
    'AreaSize': 'Area Size',
    'ProjectileSpeed': 'Projectile Speed',
    'MoveSpeed': 'Move Speed',
    'AdditionalProjectile': 'Add. Projectile',
    'ProjectileLifeTime': 'Projectile Lifetime',
    'ProjectilePiercing': 'Projectile Piercing',
    'ProjectileSize': 'Projectile Size',
    'PiercingScaling': 'Piercing Scaling',
    'GoldGain': 'Gold Gain',
    'EnemyCount': 'Enemy Count',
    'WeaponPerModifier': '+ Weapon Mod Slot', // Special case display
    'DashCharge': 'Dash Charge',
    // Add more specific replacements as needed
};

// --- Refactored getDisplayTextForStandardStat Helpers (for SonarLint S3776) ---

function formatMultiplierStatDisplay(finalValue, statName, internalStatName) {
    let displayValue;
    let prefix = "";
    let suffix = "%";
    let statDisplayName = statDisplayNameMap[internalStatName] || statName; // Use mapped name or formatted name
    const isNearOne = Math.abs(finalValue - 1) < 0.001;

    if (isNearOne) {
        displayValue = 0; // No change
        prefix = "+";
    } else {
        displayValue = (finalValue - 1) * 100;
        prefix = displayValue > 0 ? "+" : "";

        // Special handling for stats where lower multiplier is better
        const lowerIsBetterStats = ['AttackCoolDown', 'DashCoolDown']; // Use internal names
        const isMitigation = internalStatName === 'DamageMitigation';

        if (lowerIsBetterStats.includes(internalStatName) && finalValue < 1) {
            displayValue = (1 - finalValue) * 100; // Show reduction %
            prefix = "-"; // Indicate reduction (-)
        } else if (isMitigation && finalValue < 1) {
             displayValue = (1 - finalValue) * 100; // Show reduction %
             prefix = "+"; // Indicate positive effect (+)
        } else if (isMitigation && finalValue > 1) {
            // displayValue is already calculated as positive % increase
            prefix = "-"; // Indicate negative effect (less mitigation)
            statDisplayName += " (Taken)"; // Clarify it's damage taken increase
        }
    }
    return `${prefix}${formatNumber(displayValue)}${suffix} ${statDisplayName}`;
}

function formatBaseOrPostStatDisplay(finalValue, statName, internalStatName) {
    const isNearZero = Math.abs(finalValue) < 0.001;
    let prefix = finalValue > 0 && !isNearZero ? "+" : "";
    let suffix = ""; // Add suffix if needed for specific stats (e.g., 's' for time)
    let statDisplayName = statDisplayNameMap[internalStatName] || statName; // Use mapped name or formatted name

    // Special case for WeaponPerModifier
    if (internalStatName === 'WeaponPerModifier') {
        return `+${formatNumber(finalValue)} Weapon Modifier Slot`;
    }
    if (internalStatName === 'DashCharge') {
         return `+${formatNumber(finalValue)} Dash Charge`;
    }
     if (internalStatName === 'AdditionalProjectile') {
         return `+${formatNumber(finalValue)} Projectile`;
     }
      if (internalStatName === 'ProjectilePiercing') {
         return `+${formatNumber(finalValue)} Pierce`;
     }


    return `${prefix}${formatNumber(finalValue)}${suffix} ${statDisplayName}`;
}

// Main display text function using helpers
function getDisplayTextForStandardStat(modifier, itemTier, itemLevel) {
    if (!modifier?.statName) return 'N/A';

    // Use the REVISED calculation function
    const finalValue = calculateModifierValue(modifier, itemTier, itemLevel);
    const isMultiplier = modifier.statsApplicationType === 'Multiplier';

    // Format the base stat name (add spaces, etc.) - do this once
    let formattedStatName = modifier.statName.replace(/([A-Z])/g, ' $1').trim();

    if (isMultiplier) {
        return formatMultiplierStatDisplay(finalValue, formattedStatName, modifier.statName);
    } else { // Base or Post
        return formatBaseOrPostStatDisplay(finalValue, formattedStatName, modifier.statName);
    }
}

// --- Custom Calculation Functions ---
// Added notes for dynamic effects (Issue #3)

function calcAcclimatizedLeggingValue(modifier, itemTier, itemLevel) {
    // TODO: Effect is dynamic based on GameData.Stage
    const gain = Math.min(2.0, 0.2 + itemTier * 0.1 + 0.005 * itemLevel);
    return `+${formatNumber(gain)}% Damage Mitigation (per Stage - Base Value Shown)`;
}
function calcBandOfValianceValue(modifier, itemTier, itemLevel) {
    const bonus = (2.0 + itemTier * 0.25 + 0.015 * itemLevel);
    const percentBonus = (bonus - 1.0) * 100.0;
    return `+${formatNumber(percentBonus)}% Elite/Champion EXP`;
}
function calcBloodiedTowelValue(modifier, itemTier, itemLevel) {
    // TODO: Effect is dynamic based on GameData.Stage + GameData.Zone
    const gain = 0.02 + itemTier * 0.01 + 0.0005 * itemLevel;
    return `+${formatNumber(gain * 100)}% Corruption Multiplier (per Stage/Zone - Base Value Shown)`;
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
    // TODO: Effect is dynamic based on Challenge Multipliers
    const gain = 0.2 + itemTier * 0.1 + 0.005 * itemLevel;
    return `+${formatNumber(gain)} Final Power (per Challenge Multiplier - Base Value Shown)`;
}
function calcKingSlayerValue(modifier, itemTier, itemLevel) {
    // TODO: Effect only applies to *targeted* Elites/Champions
    const bonus = 0.3 + itemTier * 0.1 + 0.008 * itemLevel;
    return `+${formatNumber(bonus * 100)}% Damage vs Targeted Elites/Champions`;
}
function calcKnightPendantValue(modifier, itemTier, itemLevel, selectedVariantId = null) { // Accept variant
    // TODO: Implement logic to get weapon name from selectedVariantId
    const weaponName = selectedVariantId ? (getModifierById(selectedVariantId)?.displayName || selectedVariantId) : "[Select Weapon Variant]";
    return `Start with specific [${weaponName}]`;
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
    // TODO: Effect is dynamic based on log2(Overkills)
    const gainPerLog = 0.05 + 0.0075 * itemTier + 0.0005 * itemLevel;
    return `+${formatNumber(gainPerLog * 100)}% Soul Coin Gain (per log2(Overkills) - Base Value Shown)`;
}
function calcSpecializationValue(modifier, itemTier, itemLevel) {
    // TODO: Effect is dynamic based on having only 1 weapon equipped
    const multiplier = 1.2 + itemTier * 0.05 + 0.003 * itemLevel;
    const percentBonus = (multiplier - 1.0) * 100.0;
    return `+${formatNumber(percentBonus)}% Global Damage (if 1 weapon - Base Value Shown)`;
}
function calcTowerShieldValue(modifier, itemTier, itemLevel) {
    const reduction = Math.min(0.5, 0.05 + itemTier * 0.05 + 0.0035 * itemLevel);
    return `-${formatNumber(reduction * 100)}% One-Shot Protection Threshold`;
}
// REVISED Trainer text (Issue #8)
function calcTrainerValue(modifier, itemTier, itemLevel) {
    const bonusLevel = Math.floor(1.25 + 0.75 * itemTier); // C# uses FloorToInt
    return `First Weapon starts +${bonusLevel} Levels`; // Matches C# text format
}
function calcWeaponFinaleDamageValue(modifier, itemTier, itemLevel, selectedVariantId = null) { // Accept variant
    // TODO: Implement logic to get weapon name from selectedVariantId
    const weaponName = selectedVariantId ? (getModifierById(selectedVariantId)?.displayName || selectedVariantId) : "[Select Weapon Variant]";
    const value = 0.25 + itemTier * 0.5 + itemLevel * 0.05;
    return `+${formatNumber(value)} Final Damage to [${weaponName}]`;
}

// --- God Stone Formatting ---
// (No changes needed here, logic seems okay for formatting)
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

// --- God Stone Calculations (REVISED Issue #5) ---
// Adjusted formulas to match C# source code more closely

function calcFireStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 1, 3); // MinTier F=1, MaxTier D=3
    const dropFire = 1.05 + 0.05 * level;
    const piercingScaling = 0.005 + 0.0025 * level; // 1/400 = 0.0025
    const power = 1.01 + 0.01 * level;

    return [
        formatGodStoneLine(dropFire, "CardDropChance_Fire"),
        formatGodStoneLine(piercingScaling * 100, "PiercingScaling", true, false), // Base stat shown as %
        formatGodStoneLine(power, "Power")
    ].join('<br>');
}
function calcFieryStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 4, 6); // MinTier C=4, MaxTier A=6
    const dropFire = 1.5 + 0.1 * level;
    const piercingScaling = 0.03 + 0.005 * level;
    const power = 1.1 + 0.05 * level;
     return [
        formatGodStoneLine(dropFire, "CardDropChance_Fire"),
        formatGodStoneLine(piercingScaling * 100, "PiercingScaling", true, false),
        formatGodStoneLine(power, "Power")
    ].join('<br>');
}
function calcWindStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 1, 3); // MinTier F=1, MaxTier D=3
    const dropChance = 1.05 + 0.05 * level;
    const attackDelay = 0.99 - 0.005 * level; // C# uses delay
    const attackSpeedMult = 1.0 / attackDelay; // Calculate effective multiplier for display
    const dashCooldown = 0.99 - 0.005 * level;
    const moveSpeed = 1.01 + 0.01 * level;

    return [
        formatGodStoneLine(dropChance, "CardDropChance_Wind"),
        formatGodStoneLine(attackSpeedMult, "AttackCoolDown"), // Pass multiplier for display logic
        formatGodStoneLine(dashCooldown, "DashCoolDown"), // Pass delay for display logic
        formatGodStoneLine(moveSpeed, "MoveSpeed")
    ].join('<br>');
}
function calcGaleStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 4, 6); // MinTier C=4, MaxTier A=6
    const dropChance = 1.5 + 0.1 * level;
    const attackDelay = 0.95 - 0.02 * level;
    const attackSpeedMult = 1.0 / attackDelay;
    const dashCooldown = 0.95 - 0.02 * level;
    const moveSpeed = 1.1 + 0.025 * level;
     return [
        formatGodStoneLine(dropChance, "CardDropChance_Wind"),
        formatGodStoneLine(attackSpeedMult, "AttackCoolDown"),
        formatGodStoneLine(dashCooldown, "DashCoolDown"),
        formatGodStoneLine(moveSpeed, "MoveSpeed")
    ].join('<br>');
}
function calcMoonStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 1, 3); // MinTier F=1, MaxTier D=3
    const dropChance = 1.05 + 0.05 * level;
    const mitigation = 0.99 - 0.01 * level; // Multiplier
    const defence = 1.025 + 0.025 * level; // Multiplier

    return [
        formatGodStoneLine(dropChance, "CardDropChance_Moon"),
        formatGodStoneLine(mitigation, "DamageMitigation"), // Pass multiplier
        formatGodStoneLine(defence, "Defence")
    ].join('<br>');
}
function calcLunarStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 4, 6); // MinTier C=4, MaxTier A=6
    const dropChance = 1.5 + 0.1 * level;
    const mitigation = 0.9 - 0.02 * level;
    const defence = 1.25 + 0.05 * level;
     return [
        formatGodStoneLine(dropChance, "CardDropChance_Moon"),
        formatGodStoneLine(mitigation, "DamageMitigation"),
        formatGodStoneLine(defence, "Defence")
    ].join('<br>');
}
function calcSunStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 1, 3); // MinTier F=1, MaxTier D=3
    const dropChance = 1.05 + 0.05 * level;
    const purificationDelay = 0.99 - 0.01 * level; // C# uses delay-like logic
    const purification = 1.0 / purificationDelay; // Calculate effective multiplier
    const xpMult = 1.05 + 0.01 * level;

    return [
        formatGodStoneLine(dropChance, "CardDropChance_Sun"),
        formatGodStoneLine(purification, "Purification"), // Pass multiplier
        formatGodStoneLine(xpMult, "XPGain")
    ].join('<br>');
}
function calcSolarStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 4, 6); // MinTier C=4, MaxTier A=6
    const dropChance = 1.5 + 0.1 * level;
    const purificationDelay = 0.9 - 0.02 * level;
    const purification = 1.0 / purificationDelay;
    const xpMult = 1.15 + 0.02 * level;
     return [
        formatGodStoneLine(dropChance, "CardDropChance_Sun"),
        formatGodStoneLine(purification, "Purification"),
        formatGodStoneLine(xpMult, "XPGain")
    ].join('<br>');
}
function calcStelarStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 7, 9); // MinTier S=7, MaxTier SSS=9
    const dropChance = 1.75 + 0.1 * level;
    const purificationDelay = 0.85 - 0.02 * level;
    const purification = 1.0 / purificationDelay;
    const xpMult = 1.25 + 0.025 * level;
    const mitigation = 0.85 - 0.02 * level;
    const defence = 1.45 + 0.05 * level;

    return [
        formatGodStoneLine(dropChance, "CardDropChance_Sun"), // C# uses Sun/Moon, display Sun for simplicity or combine
        formatGodStoneLine(purification, "Purification"),
        formatGodStoneLine(xpMult, "XPGain"),
        formatGodStoneLine(dropChance, "CardDropChance_Moon"), // Add Moon line
        formatGodStoneLine(mitigation, "DamageMitigation"),
        formatGodStoneLine(defence, "Defence")
    ].join('<br>');
}
function calcStormStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 7, 9); // MinTier S=7, MaxTier SSS=9
    const dropChance = 1.75 + 0.1 * level;
    const attackDelay = 0.85 - 0.02 * level;
    const attackSpeedMult = 1.0 / attackDelay;
    const power = 1.25 + 0.025 * level;
    const piercingScaling = 0.06 + 0.005 * level;
    const dashCooldown = 0.85 - 0.02 * level;
    const moveSpeed = 1.25 + 0.025 * level;

    return [
        formatGodStoneLine(dropChance, "CardDropChance_Fire"), // C# uses Fire/Wind
        formatGodStoneLine(piercingScaling * 100, "PiercingScaling", true, false),
        formatGodStoneLine(power, "Power"),
        formatGodStoneLine(dropChance, "CardDropChance_Wind"), // Add Wind line
        formatGodStoneLine(attackSpeedMult, "AttackCoolDown"),
        formatGodStoneLine(dashCooldown, "DashCoolDown"),
        formatGodStoneLine(moveSpeed, "MoveSpeed")
    ].join('<br>');
}


// --- Main Function to Get Display Text ---
// Modified to accept selectedVariantId (Issue #4)
function getModifierEffectText(modifier, itemTier = 1, itemLevel = 1, selectedVariantId = null) {
    itemTier = Number(itemTier) || 1;
    itemLevel = Number(itemLevel) || 1;

    // Use optional chaining
    // Check for custom calculation function *first*
    if (modifier?.isCustom && modifier.calcFunc && typeof window[modifier.calcFunc] === 'function') {
        try {
            // Ensure the function exists on the window object before calling
            // Pass variant ID to custom functions that might need it
            return window[modifier.calcFunc](modifier, itemTier, itemLevel, selectedVariantId);
        } catch (e) {
            console.error(`Error calculating custom modifier ${modifier.id} using ${modifier.calcFunc}:`, e);
            return `${modifier.displayName} (Calculation Error)`;
        }
    // Then check for standard stats
    } else if (modifier?.statName && modifier?.statsApplicationType) {
        return getDisplayTextForStandardStat(modifier, itemTier, itemLevel);
    // Handle "None" main stats
    } else if (modifier?.statName === null && modifier?.type === 'main') {
         return `Provides Secondary Slots Only`;
    // Fallback to name if no calculation possible
    } else if (modifier?.displayName) { // Use displayName
        return modifier.displayName;
    } else {
        return ' '; // Return non-breaking space for empty/invalid
    }
}


// --- Global Helper ---
function getModifierById(id) {
    // Use the final processed list
    return MODIFIERS_UPDATED.find(m => m.id === id);
}

// --- Variant Helper Stub ---
// Actual implementation will likely live in script.js or be more complex
function getPossibleVariantsForModifier(modifierId) {
    const modifier = getModifierById(modifierId);
    if (!modifier || !modifier.hasVariants) {
        return [];
    }

    // TODO: Implement actual variant fetching logic based on C# GetVariantsList
    // This is placeholder logic
    if (modifierId === 'M_KnightPendant') {
        // Simulate fetching Knight weapons
        return [
            { id: 'Weapon_Sword', name: 'Sword' }, // Example weapon IDs/names
            { id: 'Weapon_Axe', name: 'Axe' },
            { id: 'Weapon_Bow', name: 'Bow' }
        ];
    } else if (modifierId === 'EM_WeaponFinaleDamage') {
         // Simulate fetching all weapons
         return MODIFIERS_UPDATED
             .filter(m => m.modifierType === 'Main' && m.statName && m.statName !== 'None' && !m.isCustom) // Crude filter for 'weapons'
             .map(m => ({ id: m.id, name: m.displayName }));
    }

    return []; // Default empty list
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

// Generate allowedSlots fallback (Second Pass - Refined Logic)
// This loop ensures that mods without relatedItemIds still get some allowedSlots assigned,
// primarily as a fallback for display/filtering, though runtime logic might be stricter.
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
         // REMOVED console warning for SonarLint S125
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

// Make custom calculation functions globally accessible (if not already)
// This ensures they can be called by name in getModifierEffectText
// Assign functions directly to the window object
window.calcAcclimatizedLeggingValue = calcAcclimatizedLeggingValue;
window.calcBandOfValianceValue = calcBandOfValianceValue;
window.calcBloodiedTowelValue = calcBloodiedTowelValue;
window.calcExpertMonocleValue = calcExpertMonocleValue;
window.calcFancyHatValue = calcFancyHatValue;
window.calcGoldenPlateValue = calcGoldenPlateValue;
window.calcGoldenRingValue = calcGoldenRingValue;
window.calcHaloValue = calcHaloValue;
window.calcHolyCrossguardValue = calcHolyCrossguardValue;
window.calcKingSlayerValue = calcKingSlayerValue;
window.calcKnightPendantValue = calcKnightPendantValue;
window.calcNinjaTabiValue = calcNinjaTabiValue;
window.calcNobleSlayerValue = calcNobleSlayerValue;
window.calcSoulJarValue = calcSoulJarValue;
window.calcSpecializationValue = calcSpecializationValue;
window.calcTowerShieldValue = calcTowerShieldValue;
window.calcTrainerValue = calcTrainerValue;
window.calcWeaponFinaleDamageValue = calcWeaponFinaleDamageValue;
window.calcFireStoneValue = calcFireStoneValue;
window.calcFieryStoneValue = calcFieryStoneValue;
window.calcWindStoneValue = calcWindStoneValue;
window.calcGaleStoneValue = calcGaleStoneValue;
window.calcMoonStoneValue = calcMoonStoneValue;
window.calcLunarStoneValue = calcLunarStoneValue;
window.calcSunStoneValue = calcSunStoneValue;
window.calcSolarStoneValue = calcSolarStoneValue;
window.calcStelarStoneValue = calcStelarStoneValue;
window.calcStormStoneValue = calcStormStoneValue;
// Add any other custom calc functions referenced in MODIFIERS here...
// Example for M_ mods from JSON that might need custom logic if not standard stats:
// window.calcBloodUmbrellaValue = calcBloodUmbrellaValue; // If it had custom logic
// window.calcAdaptive_GreavesValue = calcAdaptive_GreavesValue; // etc.