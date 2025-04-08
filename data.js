// --- Data Definitions ---

const SLOTS = [
    { id: 'Head', name: 'Head' },
    { id: 'Chest', name: 'Chest' },
    { id: 'Legs', name: 'Legs' },
    { id: 'Feet', name: 'Feet' },
    { id: 'Amulet', name: 'Amulet' },
    { id: 'Ring1', name: 'Ring 1' },
    { id: 'Ring2', name: 'Ring 2' },
    { id: 'WeaponSlot', name: 'Weapon' }, // FIX: Uncommented WeaponSlot
];

// --- Modifier Definitions ---
// NOTE: requiredLevelModifier is an ESTIMATION based on rarity, as actual values are in game data assets.
// Common: 1, Uncommon: 2, Rare: 4, Epic: 6, Legendary: 8, Mythical: 10, Ascended: 12, Unique: 15 (Base estimates)
// NOTE: Negative Secondaries now have a POSITIVE value representing their impact cost, which will be SUMMED in calculation per C# logic (FIX #3).
// NOTE: secondaryPositiveCount/secondaryNegativeCount added to main modifiers, defaulting to 2/1 based on C# EquipmentModifierSO_Main.cs unless overridden (FIX #1). Actual counts might vary per specific main modifier SO in game.

const MODIFIERS = [
    // --- Main Modifiers (Standard Stats) ---
    // NOTE: baseValue for Multipliers is the base for the Math.pow calculation, but the specific value might still be an estimation from observed game behavior.
    { id: 'Stat_MaxHealth_Main', name: 'Max Health', type: 'main', positivity: 'positive', rarity: 'Common', allowedSlots: ['Head', 'Chest', 'Legs', 'Feet', 'Amulet', 'Ring1', 'Ring2'], description: 'Increases Maximum Health.', statName: 'MaxHealth', statsApplicationType: 'Base', baseValue: 5, valuePerLevel: 0.5, requiredLevelModifier: 1, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_HealthRegen_Main', name: 'Health Regen', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Chest', 'Amulet', 'Ring1', 'Ring2'], description: 'Increases Health Regeneration.', statName: 'HealthRegen', statsApplicationType: 'Base', baseValue: 0.1, valuePerLevel: 0.01, requiredLevelModifier: 2, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_Defence_Main', name: 'Defence', type: 'main', positivity: 'positive', rarity: 'Common', allowedSlots: ['Head', 'Chest', 'Legs', 'Feet', 'Amulet'], description: 'Increases Defence.', statName: 'Defence', statsApplicationType: 'Base', baseValue: 1, valuePerLevel: 0.1, requiredLevelModifier: 1, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_DamageMitigation_Main', name: 'Damage Mitigation', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Chest', 'Amulet'], description: 'Reduces incoming damage by a percentage.', statName: 'DamageMitigation', statsApplicationType: 'Multiplier', baseValue: 0.98, valuePerLevel: 1, requiredLevelModifier: 4, secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Multiplier < 1 is reduction
    { id: 'Stat_XPGain_Main', name: 'XP Gain', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Head', 'Amulet', 'Ring1', 'Ring2'], description: 'Increases Experience gained.', statName: 'XPGain', statsApplicationType: 'Multiplier', baseValue: 1.05, valuePerLevel: 1.001, requiredLevelModifier: 2, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_PickUpDistance_Main', name: 'Pickup Range', type: 'main', positivity: 'positive', rarity: 'Common', allowedSlots: ['Feet', 'Amulet', 'Ring1', 'Ring2'], description: 'Increases the range for picking up items/XP.', statName: 'PickUpDistance', statsApplicationType: 'Multiplier', baseValue: 1.1, valuePerLevel: 1, requiredLevelModifier: 1, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_MoveSpeed_Main', name: 'Move Speed', type: 'main', positivity: 'positive', rarity: 'Common', allowedSlots: ['Legs', 'Feet', 'Amulet', 'Ring1', 'Ring2'], description: 'Increases Movement Speed.', statName: 'MoveSpeed', statsApplicationType: 'Multiplier', baseValue: 1.03, valuePerLevel: 1, requiredLevelModifier: 1, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_Power_Main', name: 'Power', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Head', 'Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Increases overall damage/effectiveness.', statName: 'Power', statsApplicationType: 'Multiplier', baseValue: 1.04, valuePerLevel: 1.001, requiredLevelModifier: 2, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_CriticalChance_Main', name: 'Crit Chance', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Head', 'Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Increases Critical Strike Chance.', statName: 'CriticalChance', statsApplicationType: 'Base', baseValue: 0.03, valuePerLevel: 0.001, requiredLevelModifier: 4, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_CriticalDamage_Main', name: 'Crit Damage', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Increases Critical Strike Damage.', statName: 'CriticalDamage', statsApplicationType: 'Multiplier', baseValue: 1.10, valuePerLevel: 1, requiredLevelModifier: 4, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_AttackCoolDown_Main', name: 'Attack Speed', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Head', 'Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Reduces Attack Cooldown (Increases Attack Speed).', statName: 'AttackCoolDown', statsApplicationType: 'Multiplier', baseValue: 0.97, valuePerLevel: 1, requiredLevelModifier: 2, secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Lower is faster
    { id: 'Stat_AreaSize_Main', name: 'Area Size', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Head', 'Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Increases the Area of Effect for abilities.', statName: 'AreaSize', statsApplicationType: 'Multiplier', baseValue: 1.08, valuePerLevel: 1, requiredLevelModifier: 2, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_ProjectileSpeed_Main', name: 'Projectile Speed', type: 'main', positivity: 'positive', rarity: 'Common', allowedSlots: ['Head', 'Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Increases the speed of projectiles.', statName: 'ProjectileSpeed', statsApplicationType: 'Multiplier', baseValue: 1.1, valuePerLevel: 1, requiredLevelModifier: 1, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_ProjectileLifeTime_Main', name: 'Projectile Duration', type: 'main', positivity: 'positive', rarity: 'Common', allowedSlots: ['Head', 'Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Increases the duration/range of projectiles.', statName: 'ProjectileLifeTime', statsApplicationType: 'Multiplier', baseValue: 1.1, valuePerLevel: 1, requiredLevelModifier: 1, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_AdditionalProjectile_Main', name: 'Additional Projectiles', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Head', 'Amulet', 'WeaponSlot'], description: 'Adds extra projectiles to attacks.', statName: 'AdditionalProjectile', statsApplicationType: 'Base', baseValue: 1, valuePerLevel: 0, requiredLevelModifier: 6, secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Often flat +1
    { id: 'Stat_ProjectilePiercing_Main', name: 'Projectile Piercing', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Head', 'Amulet', 'WeaponSlot'], description: 'Increases how many enemies projectiles can pierce.', statName: 'ProjectilePiercing', statsApplicationType: 'Base', baseValue: 1, valuePerLevel: 0.1, requiredLevelModifier: 2, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_GoldGain_Main', name: 'Gold Gain', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Increases Gold gained.', statName: 'GoldGain', statsApplicationType: 'Multiplier', baseValue: 1.1, valuePerLevel: 1.001, requiredLevelModifier: 2, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_SoulCoinGain_Main', name: 'Soul Coin Gain', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Increases Soul Coins gained.', statName: 'SoulCoinGain', statsApplicationType: 'Multiplier', baseValue: 1.05, valuePerLevel: 1.001, requiredLevelModifier: 4, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Stat_Corruption_Main', name: 'Corruption', type: 'main', positivity: 'negative', rarity: 'Common', allowedSlots: ['Head', 'Chest', 'Legs', 'Feet', 'Amulet', 'Ring1', 'Ring2'], description: 'Increases Corruption level.', statName: 'Corruption', statsApplicationType: 'Base', baseValue: 5, valuePerLevel: 0.5, requiredLevelModifier: 1, secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Give negative main a small cost
    { id: 'Stat_Purification_Main', name: 'Purification', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Increases Purification (counteracts Corruption).', statName: 'Purification', statsApplicationType: 'Multiplier', baseValue: 1.05, valuePerLevel: 1, requiredLevelModifier: 4, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },

    // --- Main Modifiers (Custom EM_ Classes) ---
    // NOTE: Rarity and requiredLevelModifier are ESTIMATIONS for custom modifiers. Actual values are in game data assets.
    // NOTE: secondaryPositiveCount/secondaryNegativeCount are assumed default 2/1 unless game data suggests otherwise.
    { id: 'EM_AcclimatizedLegging', name: 'Acclimatized Legging', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Legs'], description: 'Gain % Damage Mitigation per stage.', isCustom: true, calcFunc: 'calcAcclimatizedLeggingValue', requiredLevelModifier: 5, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_BandOfValiance', name: 'Band of Valiance', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Ring1', 'Ring2'], description: 'Gain bonus % EXP from Elite/Champion enemies.', isCustom: true, calcFunc: 'calcBandOfValianceValue', requiredLevelModifier: 3, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_BloodiedTowel', name: 'Bloodied Towel', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Amulet'], description: 'Gain % Corruption Multiplier per stage/zone.', isCustom: true, calcFunc: 'calcBloodiedTowelValue', requiredLevelModifier: 3, secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Positive effect, negative consequence
    { id: 'EM_ExpertMonocle', name: 'Expert Monocle', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Head'], description: 'Increases Item Quality when items drop.', isCustom: true, calcFunc: 'calcExpertMonocleValue', requiredLevelModifier: 5, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_FancyHat', name: 'Fancy Hat', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Head'], description: 'Reduces Shop prices.', isCustom: true, calcFunc: 'calcFancyHatValue', requiredLevelModifier: 3, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_GoldenPlate', name: 'Golden Plate', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Chest'], description: 'Gain flat Gold on Overkill.', isCustom: true, calcFunc: 'calcGoldenPlateValue', requiredLevelModifier: 3, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_GoldenRing', name: 'Golden Ring', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Ring1', 'Ring2'], description: 'Increases chance for Limit Break items in shop.', isCustom: true, calcFunc: 'calcGoldenRingValue', requiredLevelModifier: 5, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_Halo', name: 'Halo', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Head'], description: 'Gain % Power, Move Speed, Max Health, and Pickup Range.', isCustom: true, calcFunc: 'calcHaloValue', requiredLevelModifier: 7, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_HolyCrossguard', name: 'Holy Crossguard', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'WeaponSlot'], description: 'Gain flat Power based on active Challenge difficulty multiplier.', isCustom: true, calcFunc: 'calcHolyCrossguardValue', requiredLevelModifier: 5, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_KingSlayer', name: 'King Slayer', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Deal % more damage to Elite/Champion enemies that are targeted.', isCustom: true, calcFunc: 'calcKingSlayerValue', requiredLevelModifier: 7, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_KnightPendant', name: 'Knight Pendant', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: ['Amulet'], description: 'Start with a specific Knight weapon. (Variant)', isCustom: true, calcFunc: 'calcKnightPendantValue', requiredLevelModifier: 15, secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Unique might have different counts, but 2/1 is default assumption
    { id: 'EM_NinjaTabi', name: 'Ninja Tabi', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Feet'], description: 'Reduces One-Shot Protection cooldown.', isCustom: true, calcFunc: 'calcNinjaTabiValue', requiredLevelModifier: 5, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_NobleSlayer', name: 'Noble Slayer', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Deal % more damage to Elite/Champion enemies.', isCustom: true, calcFunc: 'calcNobleSlayerValue', requiredLevelModifier: 5, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_SoulJar', name: 'Soul Jar', type: 'main', positivity: 'positive', rarity: 'Mythical', allowedSlots: ['Amulet'], description: 'Gain % Soul Coin Gain based on total Overkills (logarithmic).', isCustom: true, calcFunc: 'calcSoulJarValue', requiredLevelModifier: 10, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_Specialization', name: 'Specialization', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Head', 'Amulet', 'WeaponSlot'], description: 'Gain % more Global Damage if you only have one weapon.', isCustom: true, calcFunc: 'calcSpecializationValue', requiredLevelModifier: 7, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_TowerShield', name: 'Tower Shield', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Chest'], description: 'Reduces the % max health threshold required for One-Shot Protection to trigger.', isCustom: true, calcFunc: 'calcTowerShieldValue', requiredLevelModifier: 5, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_Trainer', name: 'Trainer', type: 'main', positivity: 'positive', rarity: 'Legendary', allowedSlots: ['Head', 'Amulet'], description: 'Your first weapon starts at a higher level.', isCustom: true, calcFunc: 'calcTrainerValue', requiredLevelModifier: 8, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },

    // --- God Stones (Main Modifiers) ---
    // NOTE: Rarity and requiredLevelModifier are ESTIMATIONS for custom modifiers. Actual values are in game data assets.
    // NOTE: secondaryPositiveCount/secondaryNegativeCount are assumed default 2/1 unless game data suggests otherwise.
    { id: 'EM_FireStone', name: 'Fire Stone', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: '+% Fire Card Drop Chance, +% Piercing Scaling, +% Power.', isCustom: true, calcFunc: 'calcFireStoneValue', requiredLevelModifier: 6, secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Multi-stat
    { id: 'EM_FieryStone', name: 'Fiery Stone', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Improved Fire Stone effects.', isCustom: true, calcFunc: 'calcFieryStoneValue', requiredLevelModifier: 9, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_WindStone', name: 'Wind Stone', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: '+% Wind Card Drop Chance, +% Attack Speed, -% Dash Cooldown, +% Move Speed.', isCustom: true, calcFunc: 'calcWindStoneValue', requiredLevelModifier: 6, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_GaleStone', name: 'Gale Stone', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Improved Wind Stone effects.', isCustom: true, calcFunc: 'calcGaleStoneValue', requiredLevelModifier: 9, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_MoonStone', name: 'Moon Stone', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: '+% Moon Card Drop Chance, +% Damage Mitigation, +% Defence.', isCustom: true, calcFunc: 'calcMoonStoneValue', requiredLevelModifier: 6, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_LunarStone', name: 'Lunar Stone', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Improved Moon Stone effects.', isCustom: true, calcFunc: 'calcLunarStoneValue', requiredLevelModifier: 9, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_SunStone', name: 'Sun Stone', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: '+% Sun Card Drop Chance, +% Purification, +% XP Gain.', isCustom: true, calcFunc: 'calcSunStoneValue', requiredLevelModifier: 6, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_SolarStone', name: 'Solar Stone', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Improved Sun Stone effects.', isCustom: true, calcFunc: 'calcSolarStoneValue', requiredLevelModifier: 9, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_StelarStone', name: 'Stelar Stone', type: 'main', positivity: 'positive', rarity: 'Mythical', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Combines and improves Sun and Moon Stone effects.', isCustom: true, calcFunc: 'calcStelarStoneValue', requiredLevelModifier: 12, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'EM_StormStone', name: 'Storm Stone', type: 'main', positivity: 'positive', rarity: 'Mythical', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Combines and improves Fire and Wind Stone effects.', isCustom: true, calcFunc: 'calcStormStoneValue', requiredLevelModifier: 12, secondaryPositiveCount: 2, secondaryNegativeCount: 1 },


    // --- Secondary Modifiers (Standard Stats) ---
    // NOTE: Values are estimations and might not always be lower than main stats in the actual game.
    // Positive
    { id: 'Stat_MaxHealth_SecPos', name: 'Max Health', type: 'secondary', positivity: 'positive', rarity: 'Common', description: 'Increases Maximum Health.', statName: 'MaxHealth', statsApplicationType: 'Base', baseValue: 3, valuePerLevel: 0.3, requiredLevelModifier: 0.5 },
    { id: 'Stat_HealthRegen_SecPos', name: 'Health Regen', type: 'secondary', positivity: 'positive', rarity: 'Uncommon', description: 'Increases Health Regeneration.', statName: 'HealthRegen', statsApplicationType: 'Base', baseValue: 0.05, valuePerLevel: 0.005, requiredLevelModifier: 1 },
    { id: 'Stat_Defence_SecPos', name: 'Defence', type: 'secondary', positivity: 'positive', rarity: 'Common', description: 'Increases Defence.', statName: 'Defence', statsApplicationType: 'Base', baseValue: 0.5, valuePerLevel: 0.05, requiredLevelModifier: 0.5 },
    { id: 'Stat_DamageMitigation_SecPos', name: 'Damage Mitigation', type: 'secondary', positivity: 'positive', rarity: 'Rare', description: 'Reduces incoming damage by a percentage.', statName: 'DamageMitigation', statsApplicationType: 'Multiplier', baseValue: 0.99, valuePerLevel: 1, requiredLevelModifier: 2 },
    { id: 'Stat_XPGain_SecPos', name: 'XP Gain', type: 'secondary', positivity: 'positive', rarity: 'Uncommon', description: 'Increases Experience gained.', statName: 'XPGain', statsApplicationType: 'Multiplier', baseValue: 1.03, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_PickUpDistance_SecPos', name: 'Pickup Range', type: 'secondary', positivity: 'positive', rarity: 'Common', description: 'Increases the range for picking up items/XP.', statName: 'PickUpDistance', statsApplicationType: 'Multiplier', baseValue: 1.05, valuePerLevel: 1, requiredLevelModifier: 0.5 },
    { id: 'Stat_MoveSpeed_SecPos', name: 'Move Speed', type: 'secondary', positivity: 'positive', rarity: 'Common', description: 'Increases Movement Speed.', statName: 'MoveSpeed', statsApplicationType: 'Multiplier', baseValue: 1.02, valuePerLevel: 1, requiredLevelModifier: 0.5 },
    { id: 'Stat_Power_SecPos', name: 'Power', type: 'secondary', positivity: 'positive', rarity: 'Uncommon', description: 'Increases overall damage/effectiveness.', statName: 'Power', statsApplicationType: 'Multiplier', baseValue: 1.02, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_CriticalChance_SecPos', name: 'Crit Chance', type: 'secondary', positivity: 'positive', rarity: 'Rare', description: 'Increases Critical Strike Chance.', statName: 'CriticalChance', statsApplicationType: 'Base', baseValue: 0.02, valuePerLevel: 0.001, requiredLevelModifier: 2 },
    { id: 'Stat_CriticalDamage_SecPos', name: 'Crit Damage', type: 'secondary', positivity: 'positive', rarity: 'Rare', description: 'Increases Critical Strike Damage.', statName: 'CriticalDamage', statsApplicationType: 'Multiplier', baseValue: 1.05, valuePerLevel: 1, requiredLevelModifier: 2 },
    { id: 'Stat_AttackCoolDown_SecPos', name: 'Attack Speed', type: 'secondary', positivity: 'positive', rarity: 'Uncommon', description: 'Reduces Attack Cooldown (Increases Attack Speed).', statName: 'AttackCoolDown', statsApplicationType: 'Multiplier', baseValue: 0.98, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_AreaSize_SecPos', name: 'Area Size', type: 'secondary', positivity: 'positive', rarity: 'Uncommon', description: 'Increases the Area of Effect for abilities.', statName: 'AreaSize', statsApplicationType: 'Multiplier', baseValue: 1.04, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_ProjectileSpeed_SecPos', name: 'Projectile Speed', type: 'secondary', positivity: 'positive', rarity: 'Common', description: 'Increases the speed of projectiles.', statName: 'ProjectileSpeed', statsApplicationType: 'Multiplier', baseValue: 1.05, valuePerLevel: 1, requiredLevelModifier: 0.5 },
    { id: 'Stat_ProjectileLifeTime_SecPos', name: 'Projectile Duration', type: 'secondary', positivity: 'positive', rarity: 'Common', description: 'Increases the duration/range of projectiles.', statName: 'ProjectileLifeTime', statsApplicationType: 'Multiplier', baseValue: 1.05, valuePerLevel: 1, requiredLevelModifier: 0.5 },
    { id: 'Stat_AdditionalProjectile_SecPos', name: 'Additional Projectiles', type: 'secondary', positivity: 'positive', rarity: 'Epic', description: 'Adds extra projectiles to attacks.', statName: 'AdditionalProjectile', statsApplicationType: 'Base', baseValue: 1, valuePerLevel: 0, requiredLevelModifier: 3 },
    { id: 'Stat_ProjectilePiercing_SecPos', name: 'Projectile Piercing', type: 'secondary', positivity: 'positive', rarity: 'Uncommon', description: 'Increases how many enemies projectiles can pierce.', statName: 'ProjectilePiercing', statsApplicationType: 'Base', baseValue: 1, valuePerLevel: 0, requiredLevelModifier: 1 }, // Flat value, low req
    { id: 'Stat_KnockBack_SecPos', name: 'Knockback', type: 'secondary', positivity: 'positive', rarity: 'Common', description: 'Increases knockback dealt.', statName: 'KnockBack', statsApplicationType: 'Multiplier', baseValue: 1.1, valuePerLevel: 1, requiredLevelModifier: 0.5 },
    { id: 'Stat_GoldGain_SecPos', name: 'Gold Gain', type: 'secondary', positivity: 'positive', rarity: 'Uncommon', description: 'Increases Gold gained.', statName: 'GoldGain', statsApplicationType: 'Multiplier', baseValue: 1.05, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_SoulCoinGain_SecPos', name: 'Soul Coin Gain', type: 'secondary', positivity: 'positive', rarity: 'Rare', description: 'Increases Soul Coins gained.', statName: 'SoulCoinGain', statsApplicationType: 'Multiplier', baseValue: 1.03, valuePerLevel: 1, requiredLevelModifier: 2 },
    { id: 'Stat_Purification_SecPos', name: 'Purification', type: 'secondary', positivity: 'positive', rarity: 'Rare', description: 'Increases Purification (counteracts Corruption).', statName: 'Purification', statsApplicationType: 'Multiplier', baseValue: 1.03, valuePerLevel: 1, requiredLevelModifier: 2 },
    { id: 'Stat_DefencePiercing_SecPos', name: 'Defence Piercing', type: 'secondary', positivity: 'positive', rarity: 'Rare', description: 'Ignores a flat amount of enemy Defence.', statName: 'DefencePiercing', statsApplicationType: 'Base', baseValue: 1, valuePerLevel: 0.1, requiredLevelModifier: 2 },
    { id: 'Stat_DefenceShredding_SecPos', name: 'Defence Shredding', type: 'secondary', positivity: 'positive', rarity: 'Epic', description: 'Reduces enemy Defence on hit.', statName: 'DefenceShredding', statsApplicationType: 'Base', baseValue: 0.5, valuePerLevel: 0.05, requiredLevelModifier: 3 },
    { id: 'Stat_PiercingScaling_SecPos', name: 'Piercing Scaling', type: 'secondary', positivity: 'positive', rarity: 'Legendary', description: 'Gain Projectile Piercing based on other stats.', statName: 'PiercingScaling', statsApplicationType: 'Base', baseValue: 0.01, valuePerLevel: 0.001, requiredLevelModifier: 4 },

    // Negative - Using POSITIVE requiredLevelModifier values now, will be SUMMED in calculation per C# logic (FIX #3).
    { id: 'Stat_MaxHealth_SecNeg', name: 'Max Health', type: 'secondary', positivity: 'negative', rarity: 'Common', description: 'Decreases Maximum Health.', statName: 'MaxHealth', statsApplicationType: 'Base', baseValue: -3, valuePerLevel: -0.3, requiredLevelModifier: 1 }, // FIX #3: Changed from -1 to 1
    { id: 'Stat_HealthRegen_SecNeg', name: 'Health Regen', type: 'secondary', positivity: 'negative', rarity: 'Uncommon', description: 'Decreases Health Regeneration.', statName: 'HealthRegen', statsApplicationType: 'Base', baseValue: -0.05, valuePerLevel: -0.005, requiredLevelModifier: 1 }, // FIX #3: Changed from -1 to 1
    { id: 'Stat_Defence_SecNeg', name: 'Defence', type: 'secondary', positivity: 'negative', rarity: 'Common', description: 'Decreases Defence.', statName: 'Defence', statsApplicationType: 'Base', baseValue: -0.5, valuePerLevel: -0.05, requiredLevelModifier: 1 }, // FIX #3: Changed from -1 to 1
    { id: 'Stat_DamageMitigation_SecNeg', name: 'Damage Mitigation', type: 'secondary', positivity: 'negative', rarity: 'Rare', description: 'Increases damage taken by a percentage.', statName: 'DamageMitigation', statsApplicationType: 'Multiplier', baseValue: 1.01, valuePerLevel: 1, requiredLevelModifier: 2 }, // FIX #3: Changed from -2 to 2
    { id: 'Stat_XPGain_SecNeg', name: 'XP Gain', type: 'secondary', positivity: 'negative', rarity: 'Uncommon', description: 'Decreases Experience gained.', statName: 'XPGain', statsApplicationType: 'Multiplier', baseValue: 0.97, valuePerLevel: 1, requiredLevelModifier: 1 }, // FIX #3: Changed from -1 to 1
    { id: 'Stat_PickUpDistance_SecNeg', name: 'Pickup Range', type: 'secondary', positivity: 'negative', rarity: 'Common', description: 'Decreases the range for picking up items/XP.', statName: 'PickUpDistance', statsApplicationType: 'Multiplier', baseValue: 0.95, valuePerLevel: 1, requiredLevelModifier: 1 }, // FIX #3: Changed from -1 to 1
    { id: 'Stat_MoveSpeed_SecNeg', name: 'Move Speed', type: 'secondary', positivity: 'negative', rarity: 'Common', description: 'Decreases Movement Speed.', statName: 'MoveSpeed', statsApplicationType: 'Multiplier', baseValue: 0.98, valuePerLevel: 1, requiredLevelModifier: 1 }, // FIX #3: Changed from -1 to 1
    { id: 'Stat_Power_SecNeg', name: 'Power', type: 'secondary', positivity: 'negative', rarity: 'Uncommon', description: 'Decreases overall damage/effectiveness.', statName: 'Power', statsApplicationType: 'Multiplier', baseValue: 0.98, valuePerLevel: 1, requiredLevelModifier: 1 }, // FIX #3: Changed from -1 to 1
    { id: 'Stat_CriticalChance_SecNeg', name: 'Crit Chance', type: 'secondary', positivity: 'negative', rarity: 'Rare', description: 'Decreases Critical Strike Chance.', statName: 'CriticalChance', statsApplicationType: 'Base', baseValue: -0.02, valuePerLevel: -0.001, requiredLevelModifier: 2 }, // FIX #3: Changed from -2 to 2
    { id: 'Stat_CriticalDamage_SecNeg', name: 'Crit Damage', type: 'secondary', positivity: 'negative', rarity: 'Rare', description: 'Decreases Critical Strike Damage.', statName: 'CriticalDamage', statsApplicationType: 'Multiplier', baseValue: 0.95, valuePerLevel: 1, requiredLevelModifier: 2 }, // FIX #3: Changed from -2 to 2
    { id: 'Stat_AttackCoolDown_SecNeg', name: 'Attack Speed', type: 'secondary', positivity: 'negative', rarity: 'Uncommon', description: 'Increases Attack Cooldown (Decreases Attack Speed).', statName: 'AttackCoolDown', statsApplicationType: 'Multiplier', baseValue: 1.02, valuePerLevel: 1, requiredLevelModifier: 1 }, // FIX #3: Changed from -1 to 1
    { id: 'Stat_AreaSize_SecNeg', name: 'Area Size', type: 'secondary', positivity: 'negative', rarity: 'Uncommon', description: 'Decreases the Area of Effect for abilities.', statName: 'AreaSize', statsApplicationType: 'Multiplier', baseValue: 0.96, valuePerLevel: 1, requiredLevelModifier: 1 }, // FIX #3: Changed from -1 to 1
    { id: 'Stat_ProjectileSpeed_SecNeg', name: 'Projectile Speed', type: 'secondary', positivity: 'negative', rarity: 'Common', description: 'Decreases the speed of projectiles.', statName: 'ProjectileSpeed', statsApplicationType: 'Multiplier', baseValue: 0.95, valuePerLevel: 1, requiredLevelModifier: 1 }, // FIX #3: Changed from -1 to 1
    { id: 'Stat_ProjectileLifeTime_SecNeg', name: 'Projectile Duration', type: 'secondary', positivity: 'negative', rarity: 'Common', description: 'Decreases the duration/range of projectiles.', statName: 'ProjectileLifeTime', statsApplicationType: 'Multiplier', baseValue: 0.95, valuePerLevel: 1, requiredLevelModifier: 1 }, // FIX #3: Changed from -1 to 1
    { id: 'Stat_GoldGain_SecNeg', name: 'Gold Gain', type: 'secondary', positivity: 'negative', rarity: 'Uncommon', description: 'Decreases Gold gained.', statName: 'GoldGain', statsApplicationType: 'Multiplier', baseValue: 0.95, valuePerLevel: 1, requiredLevelModifier: 1 }, // FIX #3: Changed from -1 to 1
    { id: 'Stat_SoulCoinGain_SecNeg', name: 'Soul Coin Gain', type: 'secondary', positivity: 'negative', rarity: 'Rare', description: 'Decreases Soul Coins gained.', statName: 'SoulCoinGain', statsApplicationType: 'Multiplier', baseValue: 0.97, valuePerLevel: 1, requiredLevelModifier: 2 }, // FIX #3: Changed from -2 to 2
    { id: 'Stat_Corruption_SecNeg', name: 'Corruption', type: 'secondary', positivity: 'negative', rarity: 'Common', description: 'Increases Corruption level.', statName: 'Corruption', statsApplicationType: 'Base', baseValue: 3, valuePerLevel: 0.3, requiredLevelModifier: 1 }, // FIX #3: Changed from -1 to 1

    // --- Secondary Modifiers (Custom EM_ Classes) ---
    // NOTE: Rarity and requiredLevelModifier are ESTIMATIONS for custom modifiers. Actual values are in game data assets.
    { id: 'EM_WeaponFinaleDamage', name: 'Weapon Finale Damage', type: 'secondary', positivity: 'positive', rarity: 'Legendary', description: 'Increases Final Damage of a specific weapon. (Variant)', isCustom: true, calcFunc: 'calcWeaponFinaleDamageValue', requiredLevelModifier: 5 },

];

const RARITY_ORDER = [
    'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical', 'Ascended', 'Unique'
];

// Tier mapping (Adjust as needed based on EDifficulty enum values and desired range)
// Mapping F=1, E=2, D=3, C=4, B=5, A=6, S=7, SS=8, SSS=9, MAX=10, Z=11, ZZ=12, ZZZ=13
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
    10: { name: 'MAX', value: 10 },
    11: { name: 'Z', value: 11 },
    12: { name: 'ZZ', value: 12 },
    13: { name: 'ZZZ', value: 13 },
};
const MAX_TIER = 13; // Based on extended TIER_MAP
const MAX_LEVEL = 10;

// --- Calculation & Formatting Helpers ---

// Mimics RGUtils.GetFormatedNumber - simplified
function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    if (Math.abs(num) < 0.01 && num !== 0) {
        return num.toExponential(2);
    }
    const fixed = num.toFixed(2);
    return parseFloat(fixed).toString();
}

// Mimics EquipmentModifier.GetFixedValue / GetVariableValue / GetFinalValue
// FIX #4: Updated Base/Post calculation logic to match C# source
function calculateModifierValue(modifier, itemTier, itemLevel, playerLevel = 1) {
    if (!modifier || !modifier.statsApplicationType || !modifier.statName) return 0;

    const scale = modifier.scaleWithItemTierAndLevel !== false;
    let fixedValue = 0;
    let variableValue = 0;
    const baseValue = modifier.baseValue ?? (modifier.statsApplicationType === 'Multiplier' ? 1 : 0);
    const valuePerLevel = modifier.valuePerLevel ?? (modifier.statsApplicationType === 'Multiplier' ? 1 : 0);
    itemTier = Number(itemTier) || 1;
    itemLevel = Number(itemLevel) || 1;

    // Fixed Value Part
    if (baseValue !== (modifier.statsApplicationType === 'Multiplier' ? 1 : 0)) {
        if (modifier.statsApplicationType === 'Multiplier') {
            // C# Multiplier Fixed: MathF.Pow(this.GetBaseValue(), this.ScaleWithItemTierAndLevel ? (float) (0.800000011920929 + (0.0099999997764825821 * ((double) itemLevel - 1.0) + 0.20000000298023224 * (double) (int) itemTier)) : 1f);
            fixedValue = scale
                ? Math.pow(baseValue, (0.8 + (0.01 * (itemLevel - 1)) + 0.2 * itemTier)) // Simplified exponents from C#
                : baseValue;
        } else { // Base or Post - Corrected based on C# EquipmentModifier.cs GetFixedValue
             // C# Base/Post Fixed: this.GetBaseValue() * (this.ScaleWithItemTierAndLevel ? (float) (0.05000000074505806 * ((double) itemLevel - 1.0)) + (float) (int) itemTier : 1f);
             fixedValue = scale
                ? baseValue * ( (0.05 * (itemLevel - 1)) + itemTier ) // Direct translation
                : baseValue;
             // Ensure fixedValue isn't negative if baseValue is positive and factors result in negative (unlikely but safe)
             if (baseValue > 0 && fixedValue < 0 && scale) fixedValue = 0;
        }
    } else {
         fixedValue = (modifier.statsApplicationType === 'Multiplier') ? 1 : 0;
    }

    // Variable Value Part (Player Level = 1 for planner display)
     if (valuePerLevel !== (modifier.statsApplicationType === 'Multiplier' ? 1 : 0) && playerLevel > 0) {
         if (modifier.statsApplicationType === 'Multiplier') {
             // C# Multiplier Variable: MathF.Pow(MathF.Pow(this.GetValuePerLevel(), playerLevel), this.ScaleWithItemTierAndLevel ? (float) (0.875 + (0.004999999888241291 * ((double) itemLevel - 1.0) + 0.125 * (double) (int) itemTier)) : 1f);
             const baseVarMult = Math.pow(valuePerLevel, playerLevel);
             variableValue = scale
                 ? Math.pow(baseVarMult, (0.875 + (0.005 * (itemLevel - 1)) + 0.125 * itemTier)) // Simplified exponents from C#
                 : baseVarMult;
         } else { // Base or Post - Corrected based on C# EquipmentModifier.cs GetVariableValue
             // C# Base/Post Variable: (float) ((double) this.GetValuePerLevel() * (double) playerLevel * (this.ScaleWithItemTierAndLevel ? 0.5 + 0.02500000037252903 * ((double) itemLevel - 1.0) + 0.5 * (double) (int) itemTier : 1.0));
             variableValue = valuePerLevel * playerLevel * (scale ? (0.5 + 0.025 * (itemLevel - 1) + 0.5 * itemTier) : 1.0); // Direct translation
         }
     } else {
         variableValue = (modifier.statsApplicationType === 'Multiplier') ? 1 : 0;
     }

    // Combine - C# EquipmentModifier.cs GetFinalValue
    let finalValue = 0;
    if (modifier.statsApplicationType === 'Multiplier') {
        // C# Multiplier Final: this.GetFixedValue(...) * this.GetVariableValue(...)
        const calculated = fixedValue * variableValue;
        // Handle potential NaN or 0 results for multipliers, default back to 1 (no effect)
        finalValue = (isNaN(calculated) || calculated === 0) ? 1 : calculated;
    } else { // Base or Post
        // C# Base/Post Final: this.GetFixedValue(...) + this.GetVariableValue(...)
        finalValue = (fixedValue || 0) + (variableValue || 0);
        // NOTE: The *application timing* of 'Post' differs in PlayerStats.cs (applied after Base/Multiplier),
        // but for displaying the modifier's value itself, this calculation is correct per EquipmentModifier.cs.
    }

    return finalValue;
}


// --- Required Level Calculation ---
// FIX #2: Revised to sum requiredLevelModifier from ALL selected modifiers (main + secondaries) per C# Equipment.cs GetBaseRequiredCardLevel
function getBaseRequiredLevel(selectedModifiers) {
    let baseLevel = 0;
    // selectedModifiers is expected to be an array containing the main modifier object (or null)
    // and all selected secondary modifier objects (or null).
    selectedModifiers.forEach(mod => {
        // Check if mod exists and has the requiredLevelModifier property
        if (mod && mod.requiredLevelModifier !== undefined) {
            // Sum the modifier's cost. Negative secondaries should have positive costs (FIX #3 applied above).
            baseLevel += mod.requiredLevelModifier;
        }
    });
    // Ensure required level doesn't go below 0
    return Math.max(0, baseLevel);
}

// float GetTierCardLevelEffect(int level, int tier) - From Equipment.cs
function getTierLevelEffect(itemTier, itemLevel) {
    itemTier = Number(itemTier) || 1;
    itemLevel = Number(itemLevel) || 1;
    // Use the positive tier formula part from C# (negative tiers aren't implemented here)
    // C#: (1.0 + (0.025 * level) + (0.5 * tier))
    // Let's use the C# formula directly: (1.0 + (0.02500000037252903 * (double) level + (double) tier * 0.5))
    return (1.0 + (0.025 * itemLevel) + (0.5 * itemTier));
}

// int RequiredCardLevel => Mathf.RoundToInt(GetBaseRequiredCardLevel() * GetTierCardLevelEffect(level, tier));
// FIX #2: Uses the corrected getBaseRequiredLevel which sums all selected modifiers.
function calculateRequiredLevel(selectedModifiers, itemTier, itemLevel) {
    const baseReq = getBaseRequiredLevel(selectedModifiers); // Uses the corrected summation function
    const effect = getTierLevelEffect(itemTier, itemLevel);
    // Ensure final level is at least 1 if any modifier is selected and baseReq > 0
    const calculatedLevel = Math.round(baseReq * effect);
    const hasModifiers = selectedModifiers.some(mod => mod !== null);
    // Ensure non-negative, and at least 1 if applicable
    return (hasModifiers && baseReq > 0 && calculatedLevel < 1) ? 1 : Math.max(0, calculatedLevel);
}

// --- God Stone Helpers (Inaccuracy #5 - equivalentLevel logic seems correct per C#) ---
// Mimics RGUtils.RemapClamp
function remapClamp(value, fromA, toA, fromB, toB) {
    const remappedValue = ((value - fromA) / (toA - fromA)) * (toB - fromB) + fromB;
    if (fromB < toB) {
        return Math.max(fromB, Math.min(remappedValue, toB));
    } else {
        return Math.max(toB, Math.min(remappedValue, fromB));
    }
}

// Mimics EM_GodStone.EquivalentLevel
function equivalentLevel(itemTier, itemLevel, minTier, maxTier) {
    itemTier = Number(itemTier) || 1;
    itemLevel = Number(itemLevel) || 1;
    minTier = Number(minTier) || 1;
    maxTier = Number(maxTier) || 3; // Default range from EM_GodStone

    // C# Logic:
    // double num1 = (double) tier * 10.0 + (double) level * 0.64999997615814209;
    // float num2 = this.GetMinTier() * 10f;
    // float num3 = (float) ((double) this.GetMaxTier() * 10.0 + 6.5);
    // return RGUtils.RemapClamp((float) num1, (float) fromA, (float) toA, 0.0f, 10f);

    const value = itemTier * 10.0 + itemLevel * 0.65; // Simplified 0.65
    const fromA = minTier * 10.0;
    const toA = maxTier * 10.0 + 6.5;
    const fromB = 0.0;
    const toB = 10.0;

    return remapClamp(value, fromA, toA, fromB, toB);
}


// --- Custom Calculation Functions (Translate from C# GetModifierText) ---
// (No changes needed in these functions themselves, only in how requiredLevel is calculated and God Stones use equivalentLevel)

function getDisplayTextForStandardStat(modifier, itemTier, itemLevel) {
    if (!modifier) return 'N/A';
    const finalValue = calculateModifierValue(modifier, itemTier, itemLevel);
    let displayValue = finalValue;
    let prefix = "";
    let suffix = "";
    let statDisplayName = modifier.statName || modifier.name;

    // Simple replacements for display
    statDisplayName = statDisplayName.replace(/([A-Z])/g, ' $1').trim(); // Add spaces
    statDisplayName = statDisplayName.replace('Cool Down', 'Cooldown');
    statDisplayName = statDisplayName.replace('Max Health', 'Max HP'); // Common abbreviation

    if (modifier.statsApplicationType === 'Multiplier') {
        if (finalValue === 1) {
             displayValue = 0; // No change
             prefix = "+";
             suffix = "%";
        } else {
            displayValue = (finalValue - 1) * 100;
            prefix = displayValue > 0 ? "+" : ""; // Add + only if positive % change
            suffix = "%";

            // Special handling for cooldown/mitigation where lower is better
            if (['AttackCooldown', 'DashCooldown'].includes(modifier.statName) && finalValue < 1) {
                 displayValue = (1 - finalValue) * 100; // Show reduction %
                 prefix = "-"; // Indicate reduction
            } else if (modifier.statName === 'DamageMitigation' && finalValue < 1) {
                displayValue = (1 - finalValue) * 100; // Show mitigation %
                prefix = "+"; // Indicate positive effect (more mitigation)
            } else if (modifier.statName === 'DamageMitigation' && finalValue > 1) {
                 displayValue = (finalValue - 1) * 100; // Show increased damage taken %
                 prefix = "-"; // Indicate negative effect (less mitigation)
                 statDisplayName += " (Taken)"; // Clarify it's damage taken increase
            }
        }
    } else { // Base or Post
        prefix = finalValue > 0 ? "+" : "";
        // Suffix might depend on stat (e.g., 's' for duration) - skip for simplicity
    }

    return `${prefix}${formatNumber(displayValue)}${suffix} ${statDisplayName}`;
}
// C# EM_AcclimatizedLegging.GetDamageMitigationGain: Mathf.Min(2f, (float) (0.20000000298023224 + (double) itemTier * 0.10000000149011612 + 0.004999999888241291 * (double) itemLevel));
function calcAcclimatizedLeggingValue(modifier, itemTier, itemLevel) {
    const gain = Math.min(2.0, 0.2 + itemTier * 0.1 + 0.005 * itemLevel);
    return `+${formatNumber(gain)}% Damage Mitigation (per Stage)`; // C# displays % directly
}
// C# EM_BandOfValiance.GetBonusChampionEliteExp: (float) (2.0 + (double) itemTier * 0.25 + 0.014999999664723873 * (double) itemLevel);
function calcBandOfValianceValue(modifier, itemTier, itemLevel) {
    const bonusMultiplier = (2.0 + itemTier * 0.25 + 0.015 * itemLevel);
    const percentBonus = (bonusMultiplier - 1.0) * 100.0; // C# text shows percentage increase
    return `+${formatNumber(percentBonus)}% Elite/Champion EXP`;
}
// C# EM_BloodiedTowel.GetCorruptionGain: (float) (0.019999999552965164 + (double) itemTier * 0.0099999997764825821 + 0.00050000002374872565 * (double) itemLevel);
function calcBloodiedTowelValue(modifier, itemTier, itemLevel) {
    const gain = 0.02 + itemTier * 0.01 + 0.0005 * itemLevel;
    return `+${formatNumber(gain * 100)}% Corruption Multiplier (per Stage/Zone)`;
}
// C# EM_ExpertMonocle.GetBonusQuality: (float) ((double) itemTier * 0.5 + 0.02500000037252903 * (double) itemLevel);
function calcExpertMonocleValue(modifier, itemTier, itemLevel) {
    const bonus = itemTier * 0.5 + 0.025 * itemLevel;
    return `+${formatNumber(bonus)} Item Quality`;
}
// C# EM_FancyHat.GetBonusDiscount: Mathf.Min(0.5f, (float) (0.15000000596046448 + (double) itemTier * 0.02500000037252903 + 1.0 / 1000.0 * (double) itemLevel));
function calcFancyHatValue(modifier, itemTier, itemLevel) {
    const discount = Math.min(0.5, 0.15 + itemTier * 0.025 + 0.001 * itemLevel);
    return `${formatNumber(discount * 100)}% Shop Discount`;
}
// C# EM_GoldenPlate.GetGoldGain: (float) (1.0 + (double) itemTier * 0.25 + 0.014999999664723873 * (double) itemLevel);
function calcGoldenPlateValue(modifier, itemTier, itemLevel) {
    const gain = 1.0 + itemTier * 0.25 + 0.015 * itemLevel;
    return `+${formatNumber(gain)} Gold on Overkill`;
}
// C# EM_GoldenRing.GetBonusChance: Mathf.Min(0.5f, (float) (0.05000000074505806 + (double) itemTier * 0.05000000074505806 + 3.0 / 1000.0 * (double) itemLevel));
function calcGoldenRingValue(modifier, itemTier, itemLevel) {
    const chance = Math.min(0.5, 0.05 + itemTier * 0.05 + 0.003 * itemLevel);
    return `+${formatNumber(chance * 100)}% Limit Break Chance (Shop)`;
}
// C# EM_Halo.GetBonusStats: (float) (0.05000000074505806 + (double) itemTier * 0.019999999552965164 + 1.0 / 1000.0 * (double) itemLevel);
function calcHaloValue(modifier, itemTier, itemLevel) {
    const bonus = 0.05 + itemTier * 0.02 + 0.001 * itemLevel;
    return `+${formatNumber(bonus * 100)}% Power, Move Speed, Max HP, Pickup Range`;
}
// C# EM_HolyCrossguard.GetPowerGain: (float) (0.20000000298023224 + (double) itemTier * 0.10000000149011612 + 0.004999999888241291 * (double) itemLevel);
function calcHolyCrossguardValue(modifier, itemTier, itemLevel) {
    const gain = 0.2 + itemTier * 0.1 + 0.005 * itemLevel;
    return `+${formatNumber(gain)} Final Power (per Challenge Multiplier)`;
}
// C# EM_KingSlayer.GetBonusChampionDamage: (float) (0.30000001192092896 + (double) itemTier * 0.10000000149011612 + 0.00800000037997961 * (double) itemLevel);
function calcKingSlayerValue(modifier, itemTier, itemLevel) {
    const bonus = 0.3 + itemTier * 0.1 + 0.008 * itemLevel;
    return `+${formatNumber(bonus * 100)}% Damage vs Targeted Elites/Champions`;
}
// C# EM_KnightPendant: Logic determines weapon variant. Text shows selected weapon.
function calcKnightPendantValue(modifier, itemTier, itemLevel) {
    // NOTE: Actual weapon variant determined by game logic not replicated here.
    // We can only show a generic placeholder.
    return `Start with specific [Knight Weapon] (Variant)`;
}
// C# EM_NinjaTabi.GetCooldownReduction: Mathf.Min(0.5f, (float) (0.05000000074505806 + (double) itemTier * 0.05000000074505806 + 0.0035000001080334187 * (double) itemLevel));
function calcNinjaTabiValue(modifier, itemTier, itemLevel) {
    const reduction = Math.min(0.5, 0.05 + itemTier * 0.05 + 0.0035 * itemLevel);
    return `-${formatNumber(reduction * 100)}% One-Shot Protection Cooldown`; // Displayed as reduction %
}
// C# EM_NobleSlayer.GetBonusChampionDamage: (float) (0.20000000298023224 + (double) itemTier * 0.059999998658895493 + 0.004999999888241291 * (double) itemLevel);
function calcNobleSlayerValue(modifier, itemTier, itemLevel) {
    const bonus = 0.2 + itemTier * 0.06 + 0.005 * itemLevel;
    return `+${formatNumber(bonus * 100)}% Damage vs Elites/Champions`;
}
// C# EM_SoulJar.GetSCMultiplierGain: (float) (0.05000000074505806 + 0.0074999998323619366 * (double) itemTier + 0.00050000002374872565 * (double) itemLevel);
function calcSoulJarValue(modifier, itemTier, itemLevel) {
    // NOTE: Depends on runtime Overkill count (log2), showing base potential here.
    const gainPerLog = 0.05 + 0.0075 * itemTier + 0.0005 * itemLevel;
    return `+${formatNumber(gainPerLog * 100)}% Soul Coin Gain (per log2(Overkills))`;
}
// C# EM_Specialization.GetDamageMultiplier: (float) (1.2000000476837158 + (double) itemTier * 0.05000000074505806 + 3.0 / 1000.0 * (double) itemLevel);
function calcSpecializationValue(modifier, itemTier, itemLevel) {
    // NOTE: Depends on runtime weapon count.
    const multiplier = 1.2 + itemTier * 0.05 + 0.003 * itemLevel;
    const percentBonus = (multiplier - 1.0) * 100.0;
    return `+${formatNumber(percentBonus)}% Global Damage (if 1 weapon)`;
}
// C# EM_TowerShield.GetRequirementReduction: Mathf.Min(0.5f, (float) (0.05000000074505806 + (double) itemTier * 0.05000000074505806 + 0.0035000001080334187 * (double) itemLevel));
function calcTowerShieldValue(modifier, itemTier, itemLevel) {
    const reduction = Math.min(0.5, 0.05 + itemTier * 0.05 + 0.0035 * itemLevel);
    return `-${formatNumber(reduction * 100)}% One-Shot Protection Threshold`; // Displayed as reduction %
}
// C# EM_Trainer.GetBonusLevel: Mathf.FloorToInt((float) (1.25 + 0.75 * (double) itemTier)); Text shows bonus level.
function calcTrainerValue(modifier, itemTier, itemLevel) {
    // NOTE: Depends on runtime first weapon selection.
    const bonusLevel = Math.floor(1.25 + 0.75 * itemTier);
    // C# adds (bonusLevel - 1) to the levelToAdd FloatValue, so display "+X Levels"
    return `First Weapon starts +${formatNumber(bonusLevel - 1)} Levels`;
}
// C# EM_WeaponFinaleDamage: Value = (float) (0.25 + (double) itemTier * 0.5 + (double) itemLevel * 0.05000000074505806)
function calcWeaponFinaleDamageValue(modifier, itemTier, itemLevel) {
    // NOTE: Actual weapon variant determined by game logic not replicated here.
    const value = 0.25 + itemTier * 0.5 + itemLevel * 0.05;
    return `+${formatNumber(value)} Final Damage to [Weapon] (Variant)`;
}

// --- God Stone Calculation Functions (Updated for Inaccuracy #5 - equivalentLevel logic seems correct) ---

function formatGodStoneLine(value, statName, isPercent = true, isMultiplier = true) {
    let displayValue = value;
    let prefix = "";
    if (isMultiplier && value !== 1) { // Only format if it's not exactly 1
        displayValue = (value - 1.0) * 100.0;
    } else if (!isMultiplier && value === 0) {
        // Don't show +0%
    } else if (value === 1 && isMultiplier) {
         displayValue = 0; // Represent 1x as +0%
    }

    if (displayValue > 0) prefix = "+";

    // Special case for cooldown reduction (multiplier < 1)
    if (statName === "Dash Cooldown" && isMultiplier && value < 1) {
        displayValue = (1.0 - value) * 100.0;
        prefix = "-"; // Show as reduction
    }
     // Special case for attack speed (multiplier > 1 means faster, show as +%)
     // C# uses AttackDelay (lower is faster), but displays Attack Speed (higher is faster)
     // GetAS = 1 / GetAttackDelay. If GetAttackDelay < 1, GetAS > 1.
     if (statName === "Attack Speed" && isMultiplier && value > 1) {
         displayValue = (value - 1.0) * 100.0;
         prefix = "+"; // Show as increase
     }
     // Special case for Damage Mitigation (multiplier < 1 means more mitigation, show as +%)
     // C# uses DamageMitigation multiplier (e.g., 0.9 means 10% mitigation)
     // GetDM = 1 - DamageMitigation multiplier.
     if (statName === "Damage Mitigation" && isMultiplier && value < 1) {
         displayValue = (1.0 - value) * 100.0;
         prefix = "+"; // Show as increase
     }


     let statDisplayName = statName.replace(/([A-Z])/g, ' $1').trim();
     statDisplayName = statDisplayName.replace('Card Drop Chance', 'Drop Chance');

    return `${prefix}${formatNumber(displayValue)}${isPercent ? '%' : ''} ${statDisplayName}`;
}

// C# EM_FireStone.GetDropFire(float level) => (float) (1.0499999523162842 + 0.05000000074505806 * (double) level);
function getFireStoneDropFire(level) { return 1.05 + 0.05 * level; }
// C# EM_FireStone.GetPiercingScaling(float level) => (float) (0.004999999888241291 + 1.0 / 400.0 * (double) level);
function getFireStonePiercingScaling(level) { return 0.005 + 0.0025 * level; }
// C# EM_FireStone.GetPower(float level) => (float) (1.0099999904632568 + 0.0099999997764825821 * (double) level);
function getFireStonePower(level) { return 1.01 + 0.01 * level; }

function calcFireStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 1, 3); // Use equivalentLevel with correct range (1-3)
    const dropFire = getFireStoneDropFire(level);
    const piercingScaling = getFireStonePiercingScaling(level);
    const power = getFireStonePower(level);

    return [
        formatGodStoneLine(dropFire, "Fire Drop Chance"),
        formatGodStoneLine(piercingScaling * 100, "Piercing Scaling", true, false), // Piercing scaling is base stat, display as %
        formatGodStoneLine(power, "Power")
    ].join('<br>');
}

// C# EM_FieryStone.GetDropFire(float level) => (float) (1.5 + 0.10000000149011612 * (double) level);
function getFieryStoneDropFire(level) { return 1.5 + 0.1 * level; }
// C# EM_FieryStone.GetPiercingScaling(float level) => (float) (0.029999999329447746 + 0.004999999888241291 * (double) level);
function getFieryStonePiercingScaling(level) { return 0.03 + 0.005 * level; }
// C# EM_FieryStone.GetPower(float level) => (float) (1.1000000238418579 + 0.05000000074505806 * (double) level);
function getFieryStonePower(level) { return 1.1 + 0.05 * level; }

function calcFieryStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 4, 6); // Use equivalentLevel with correct range (4-6)
    const dropFire = getFieryStoneDropFire(level);
    const piercingScaling = getFieryStonePiercingScaling(level);
    const power = getFieryStonePower(level);
     return [
        formatGodStoneLine(dropFire, "Fire Drop Chance"),
        formatGodStoneLine(piercingScaling * 100, "Piercing Scaling", true, false),
        formatGodStoneLine(power, "Power")
    ].join('<br>');
}

// C# EM_WindStone.GetCardDropChance(float level) => (float) (1.0499999523162842 + 0.05000000074505806 * (double) level);
function getWindStoneDropChance(level) { return 1.05 + 0.05 * level; }
// C# EM_WindStone.GetAttackDelay(float level) => (float) (0.99000000953674316 - 0.004999999888241291 * (double) level);
function getWindStoneAttackDelay(level) { return 0.99 - 0.005 * level; }
// C# EM_WindStone.GetAS(float level) => 1f / this.GetAttackDelay(level);
function getWindStoneAttackSpeedMultiplier(level) { return 1.0 / getWindStoneAttackDelay(level); }
// C# EM_WindStone.GetDashCooldown(float level) => (float) (0.99000000953674316 - 0.004999999888241291 * (double) level);
function getWindStoneDashCooldown(level) { return 0.99 - 0.005 * level; }
// C# EM_WindStone.GetMoveSpeed(float level) => (float) (1.0099999904632568 + 0.0099999997764825821 * (double) level);
function getWindStoneMoveSpeed(level) { return 1.01 + 0.01 * level; }

function calcWindStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 1, 3); // Range 1-3
    const dropChance = getWindStoneDropChance(level);
    const attackSpeedMult = getWindStoneAttackSpeedMultiplier(level);
    const dashCooldown = getWindStoneDashCooldown(level);
    const moveSpeed = getWindStoneMoveSpeed(level);

    return [
        formatGodStoneLine(dropChance, "Wind Drop Chance"),
        formatGodStoneLine(attackSpeedMult, "Attack Speed"), // Formatter handles >1 as +%
        formatGodStoneLine(dashCooldown, "Dash Cooldown"), // Formatter handles <1 as -%
        formatGodStoneLine(moveSpeed, "Move Speed")
    ].join('<br>');
}

// C# EM_GaleStone.GetCardDropChance(float level) => (float) (1.5 + 0.10000000149011612 * (double) level);
function getGaleStoneDropChance(level) { return 1.5 + 0.1 * level; }
// C# EM_GaleStone.GetAttackDelay(float level) => (float) (0.949999988079071 - 0.019999999552965164 * (double) level);
function getGaleStoneAttackDelay(level) { return 0.95 - 0.02 * level; }
// C# EM_GaleStone.GetAS(float level) => 1f / this.GetAttackDelay(level);
function getGaleStoneAttackSpeedMultiplier(level) { return 1.0 / getGaleStoneAttackDelay(level); }
// C# EM_GaleStone.GetDashCooldown(float level) => (float) (0.949999988079071 - 0.019999999552965164 * (double) level);
function getGaleStoneDashCooldown(level) { return 0.95 - 0.02 * level; }
// C# EM_GaleStone.GetMoveSpeed(float level) => (float) (1.1000000238418579 + 0.02500000037252903 * (double) level);
function getGaleStoneMoveSpeed(level) { return 1.1 + 0.025 * level; }

function calcGaleStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 4, 6); // Range 4-6
    const dropChance = getGaleStoneDropChance(level);
    const attackSpeedMult = getGaleStoneAttackSpeedMultiplier(level);
    const dashCooldown = getGaleStoneDashCooldown(level);
    const moveSpeed = getGaleStoneMoveSpeed(level);
     return [
        formatGodStoneLine(dropChance, "Wind Drop Chance"),
        formatGodStoneLine(attackSpeedMult, "Attack Speed"),
        formatGodStoneLine(dashCooldown, "Dash Cooldown"),
        formatGodStoneLine(moveSpeed, "Move Speed")
    ].join('<br>');
}

// C# EM_MoonStone.GetCardDropChance(float level) => (float) (1.0499999523162842 + 0.05000000074505806 * (double) level);
function getMoonStoneDropChance(level) { return 1.05 + 0.05 * level; }
// C# EM_MoonStone.DamageMitigation(float level) => (float) (0.99000000953674316 - 0.0099999997764825821 * (double) level);
function getMoonStoneDamageMitigationMultiplier(level) { return 0.99 - 0.01 * level; }
// C# EM_MoonStone.Defence(float level) => (float) (1.0249999761581421 + 0.02500000037252903 * (double) level);
function getMoonStoneDefenceMultiplier(level) { return 1.025 + 0.025 * level; }

function calcMoonStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 1, 3); // Range 1-3
    const dropChance = getMoonStoneDropChance(level);
    const mitigationMult = getMoonStoneDamageMitigationMultiplier(level); // This is the raw multiplier (e.g., 0.98)
    const defenceMult = getMoonStoneDefenceMultiplier(level);

    return [
        formatGodStoneLine(dropChance, "Moon Drop Chance"),
        formatGodStoneLine(mitigationMult, "Damage Mitigation"), // Formatter handles converting <1 to +% mitigation
        formatGodStoneLine(defenceMult, "Defence")
    ].join('<br>');
}

// C# EM_LunarStone.GetCardDropChance(float level) => (float) (1.5 + 0.10000000149011612 * (double) level);
function getLunarStoneDropChance(level) { return 1.5 + 0.1 * level; }
// C# EM_LunarStone.DamageMitigation(float level) => (float) (0.89999997615814209 - 0.019999999552965164 * (double) level);
function getLunarStoneDamageMitigationMultiplier(level) { return 0.9 - 0.02 * level; }
// C# EM_LunarStone.Defence(float level) => (float) (1.25 + 0.05000000074505806 * (double) level);
function getLunarStoneDefenceMultiplier(level) { return 1.25 + 0.05 * level; }

function calcLunarStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 4, 6); // Range 4-6
    const dropChance = getLunarStoneDropChance(level);
    const mitigationMult = getLunarStoneDamageMitigationMultiplier(level);
    const defenceMult = getLunarStoneDefenceMultiplier(level);
     return [
        formatGodStoneLine(dropChance, "Moon Drop Chance"),
        formatGodStoneLine(mitigationMult, "Damage Mitigation"),
        formatGodStoneLine(defenceMult, "Defence")
    ].join('<br>');
}

// C# EM_SunStone.GetCardDropChance(float level) => (float) (1.0499999523162842 + 0.05000000074505806 * (double) level);
function getSunStoneDropChance(level) { return 1.05 + 0.05 * level; }
// C# EM_SunStone.Purification(float level) => (float) (1.0 / (0.99000000953674316 - 0.0099999997764825821 * (double) level));
function getSunStonePurificationMultiplier(level) { return 1.0 / (0.99 - 0.01 * level); }
// C# EM_SunStone.XPMultiplier(float level) => (float) (1.0499999523162842 + 0.0099999997764825821 * (double) level);
function getSunStoneXpMultiplier(level) { return 1.05 + 0.01 * level; }

function calcSunStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 1, 3); // Range 1-3
    const dropChance = getSunStoneDropChance(level);
    const purification = getSunStonePurificationMultiplier(level);
    const xpMult = getSunStoneXpMultiplier(level);

    return [
        formatGodStoneLine(dropChance, "Sun Drop Chance"),
        formatGodStoneLine(purification, "Purification"),
        formatGodStoneLine(xpMult, "XP Gain")
    ].join('<br>');
}

// C# EM_SolarStone.GetCardDropChance(float level) => (float) (1.5 + 0.10000000149011612 * (double) level);
function getSolarStoneDropChance(level) { return 1.5 + 0.1 * level; }
// C# EM_SolarStone.Purification(float level) => (float) (1.0 / (0.89999997615814209 - 0.019999999552965164 * (double) level));
function getSolarStonePurificationMultiplier(level) { return 1.0 / (0.9 - 0.02 * level); }
// C# EM_SolarStone.XPMultiplier(float level) => (float) (1.1499999761581421 + 0.019999999552965164 * (double) level);
function getSolarStoneXpMultiplier(level) { return 1.15 + 0.02 * level; } // Simplified from C# near-float values

function calcSolarStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 4, 6); // Range 4-6
    const dropChance = getSolarStoneDropChance(level);
    const purification = getSolarStonePurificationMultiplier(level);
    const xpMult = getSolarStoneXpMultiplier(level);
     return [
        formatGodStoneLine(dropChance, "Sun Drop Chance"),
        formatGodStoneLine(purification, "Purification"),
        formatGodStoneLine(xpMult, "XP Gain")
    ].join('<br>');
}

// C# EM_StelarStone.GetCardDropChance(float level) => (float) (1.75 + 0.10000000149011612 * (double) level);
function getStelarStoneDropChance(level) { return 1.75 + 0.1 * level; }
// C# EM_StelarStone.Purification(float level) => (float) (1.0 / (0.85000002384185791 - 0.019999999552965164 * (double) level));
function getStelarStonePurificationMultiplier(level) { return 1.0 / (0.85 - 0.02 * level); }
// C# EM_StelarStone.XPMultiplier(float level) => (float) (1.25 + 0.02500000037252903 * (double) level);
function getStelarStoneXpMultiplier(level) { return 1.25 + 0.025 * level; }
// C# EM_StelarStone.DamageMitigation(float level) => (float) (0.85000002384185791 - 0.019999999552965164 * (double) level);
function getStelarStoneDamageMitigationMultiplier(level) { return 0.85 - 0.02 * level; }
// C# EM_StelarStone.Defence(float level) => (float) (1.4500000476837158 + 0.05000000074505806 * (double) level);
function getStelarStoneDefenceMultiplier(level) { return 1.45 + 0.05 * level; }

function calcStelarStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 7, 9); // Range 7-9
    const dropChance = getStelarStoneDropChance(level);
    const purification = getStelarStonePurificationMultiplier(level);
    const xpMult = getStelarStoneXpMultiplier(level);
    const mitigationMult = getStelarStoneDamageMitigationMultiplier(level);
    const defenceMult = getStelarStoneDefenceMultiplier(level);

    return [
        formatGodStoneLine(dropChance, "Sun/Moon Drop Chance"),
        formatGodStoneLine(purification, "Purification"),
        formatGodStoneLine(xpMult, "XP Gain"),
        formatGodStoneLine(mitigationMult, "Damage Mitigation"),
        formatGodStoneLine(defenceMult, "Defence")
    ].join('<br>');
}

// C# EM_StormStone.GetCardDropChance(float level) => (float) (1.75 + 0.10000000149011612 * (double) level);
function getStormStoneDropChance(level) { return 1.75 + 0.1 * level; }
// C# EM_StormStone.GetAttackDelay(float level) => (float) (0.85000002384185791 - 0.019999999552965164 * (double) level);
function getStormStoneAttackDelay(level) { return 0.85 - 0.02 * level; }
// C# EM_StormStone.GetAS(float level) => 1f / this.GetAttackDelay(level);
function getStormStoneAttackSpeedMultiplier(level) { return 1.0 / getStormStoneAttackDelay(level); }
// C# EM_StormStone.GetPower(float level) => (float) (1.25 + 0.02500000037252903 * (double) level);
function getStormStonePower(level) { return 1.25 + 0.025 * level; }
// C# EM_StormStone.GetPiercingScaling(float level) => (float) (0.059999998658895493 + 0.004999999888241291 * (double) level);
function getStormStonePiercingScaling(level) { return 0.06 + 0.005 * level; }
// C# EM_StormStone.GetDashCooldown(float level) => (float) (0.85000002384185791 - 0.019999999552965164 * (double) level);
function getStormStoneDashCooldown(level) { return 0.85 - 0.02 * level; }
// C# EM_StormStone.GetMoveSpeed(float level) => (float) (1.25 + 0.02500000037252903 * (double) level);
function getStormStoneMoveSpeed(level) { return 1.25 + 0.025 * level; }

function calcStormStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 7, 9); // Range 7-9
    const dropChance = getStormStoneDropChance(level);
    const attackSpeedMult = getStormStoneAttackSpeedMultiplier(level);
    const power = getStormStonePower(level);
    const piercingScaling = getStormStonePiercingScaling(level);
    const dashCooldown = getStormStoneDashCooldown(level);
    const moveSpeed = getStormStoneMoveSpeed(level);

    return [
        formatGodStoneLine(dropChance, "Fire/Wind Drop Chance"),
        formatGodStoneLine(piercingScaling * 100, "Piercing Scaling", true, false),
        formatGodStoneLine(power, "Power"),
        formatGodStoneLine(attackSpeedMult, "Attack Speed"),
        formatGodStoneLine(dashCooldown, "Dash Cooldown"),
        formatGodStoneLine(moveSpeed, "Move Speed")
    ].join('<br>');
}


// --- Main Function to Get Display Text ---
function getModifierEffectText(modifier, itemTier = 1, itemLevel = 1) {
    itemTier = Number(itemTier) || 1;
    itemLevel = Number(itemLevel) || 1;

    if (modifier && modifier.isCustom && typeof window[modifier.calcFunc] === 'function') {
        try {
            // Use global window scope explicitly if functions aren't automatically global
            return window[modifier.calcFunc](modifier, itemTier, itemLevel);
        } catch (e) {
            console.error(`Error calculating custom modifier ${modifier.id}:`, e);
            return `${modifier.name} (Calculation Error)`;
        }
    } else if (modifier && modifier.statName && modifier.statsApplicationType) {
        return getDisplayTextForStandardStat(modifier, itemTier, itemLevel);
    } else if (modifier) {
        return modifier.name; // Fallback to name if no calculation possible
    } else {
        return 'N/A'; // Handle case where modifier is null/undefined
    }
}


// --- Global Helper ---
function getModifierById(id) {
    return MODIFIERS.find(m => m.id === id);
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