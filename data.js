// --- Data Definitions ---

const SLOTS = [
    { id: 'Head', name: 'Head', secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Chest', name: 'Chest', secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Legs', name: 'Legs', secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Feet', name: 'Feet', secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Amulet', name: 'Amulet', secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Ring1', name: 'Ring 1', secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    { id: 'Ring2', name: 'Ring 2', secondaryPositiveCount: 2, secondaryNegativeCount: 1 },
    // { id: 'WeaponSlot', name: 'Weapon', secondaryPositiveCount: 2, secondaryNegativeCount: 1 }, // Uncomment if needed
];

// --- Modifier Definitions ---
// Added 'requiredLevelModifier' based on rarity (estimation)
// Common: 1, Uncommon: 2, Rare: 4, Epic: 6, Legendary: 8, Mythical: 10, Ascended: 12, Unique: 15
// Negative Secondaries now have a POSITIVE value representing their impact, which will be SUBTRACTED in calculation.

const MODIFIERS = [
    // --- Main Modifiers (Standard Stats) ---
    { id: 'Stat_MaxHealth_Main', name: 'Max Health', type: 'main', positivity: 'positive', rarity: 'Common', allowedSlots: ['Head', 'Chest', 'Legs', 'Feet', 'Amulet', 'Ring1', 'Ring2'], description: 'Increases Maximum Health.', statName: 'MaxHealth', statsApplicationType: 'Base', baseValue: 5, valuePerLevel: 0.5, requiredLevelModifier: 1 },
    { id: 'Stat_HealthRegen_Main', name: 'Health Regen', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Chest', 'Amulet', 'Ring1', 'Ring2'], description: 'Increases Health Regeneration.', statName: 'HealthRegen', statsApplicationType: 'Base', baseValue: 0.1, valuePerLevel: 0.01, requiredLevelModifier: 2 },
    { id: 'Stat_Defence_Main', name: 'Defence', type: 'main', positivity: 'positive', rarity: 'Common', allowedSlots: ['Head', 'Chest', 'Legs', 'Feet', 'Amulet'], description: 'Increases Defence.', statName: 'Defence', statsApplicationType: 'Base', baseValue: 1, valuePerLevel: 0.1, requiredLevelModifier: 1 },
    { id: 'Stat_DamageMitigation_Main', name: 'Damage Mitigation', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Chest', 'Amulet'], description: 'Reduces incoming damage by a percentage.', statName: 'DamageMitigation', statsApplicationType: 'Multiplier', baseValue: 0.98, valuePerLevel: 1, requiredLevelModifier: 4 }, // Multiplier < 1 is reduction
    { id: 'Stat_XPGain_Main', name: 'XP Gain', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Head', 'Amulet', 'Ring1', 'Ring2'], description: 'Increases Experience gained.', statName: 'XPGain', statsApplicationType: 'Multiplier', baseValue: 1.05, valuePerLevel: 1.001, requiredLevelModifier: 2 },
    { id: 'Stat_PickUpDistance_Main', name: 'Pickup Range', type: 'main', positivity: 'positive', rarity: 'Common', allowedSlots: ['Feet', 'Amulet', 'Ring1', 'Ring2'], description: 'Increases the range for picking up items/XP.', statName: 'PickUpDistance', statsApplicationType: 'Multiplier', baseValue: 1.1, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_MoveSpeed_Main', name: 'Move Speed', type: 'main', positivity: 'positive', rarity: 'Common', allowedSlots: ['Legs', 'Feet', 'Amulet', 'Ring1', 'Ring2'], description: 'Increases Movement Speed.', statName: 'MoveSpeed', statsApplicationType: 'Multiplier', baseValue: 1.03, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_Power_Main', name: 'Power', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Head', 'Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Increases overall damage/effectiveness.', statName: 'Power', statsApplicationType: 'Multiplier', baseValue: 1.04, valuePerLevel: 1.001, requiredLevelModifier: 2 },
    { id: 'Stat_CriticalChance_Main', name: 'Crit Chance', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Head', 'Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Increases Critical Strike Chance.', statName: 'CriticalChance', statsApplicationType: 'Base', baseValue: 0.03, valuePerLevel: 0.001, requiredLevelModifier: 4 },
    { id: 'Stat_CriticalDamage_Main', name: 'Crit Damage', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Increases Critical Strike Damage.', statName: 'CriticalDamage', statsApplicationType: 'Multiplier', baseValue: 1.10, valuePerLevel: 1, requiredLevelModifier: 4 },
    { id: 'Stat_AttackCoolDown_Main', name: 'Attack Speed', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Head', 'Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Reduces Attack Cooldown (Increases Attack Speed).', statName: 'AttackCoolDown', statsApplicationType: 'Multiplier', baseValue: 0.97, valuePerLevel: 1, requiredLevelModifier: 2 }, // Lower is faster
    { id: 'Stat_AreaSize_Main', name: 'Area Size', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Head', 'Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Increases the Area of Effect for abilities.', statName: 'AreaSize', statsApplicationType: 'Multiplier', baseValue: 1.08, valuePerLevel: 1, requiredLevelModifier: 2 },
    { id: 'Stat_ProjectileSpeed_Main', name: 'Projectile Speed', type: 'main', positivity: 'positive', rarity: 'Common', allowedSlots: ['Head', 'Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Increases the speed of projectiles.', statName: 'ProjectileSpeed', statsApplicationType: 'Multiplier', baseValue: 1.1, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_ProjectileLifeTime_Main', name: 'Projectile Duration', type: 'main', positivity: 'positive', rarity: 'Common', allowedSlots: ['Head', 'Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Increases the duration/range of projectiles.', statName: 'ProjectileLifeTime', statsApplicationType: 'Multiplier', baseValue: 1.1, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_AdditionalProjectile_Main', name: 'Additional Projectiles', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Head', 'Amulet', 'WeaponSlot'], description: 'Adds extra projectiles to attacks.', statName: 'AdditionalProjectile', statsApplicationType: 'Base', baseValue: 1, valuePerLevel: 0, requiredLevelModifier: 6 }, // Often flat +1
    { id: 'Stat_ProjectilePiercing_Main', name: 'Projectile Piercing', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Head', 'Amulet', 'WeaponSlot'], description: 'Increases how many enemies projectiles can pierce.', statName: 'ProjectilePiercing', statsApplicationType: 'Base', baseValue: 1, valuePerLevel: 0.1, requiredLevelModifier: 2 },
    { id: 'Stat_GoldGain_Main', name: 'Gold Gain', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Increases Gold gained.', statName: 'GoldGain', statsApplicationType: 'Multiplier', baseValue: 1.1, valuePerLevel: 1.001, requiredLevelModifier: 2 },
    { id: 'Stat_SoulCoinGain_Main', name: 'Soul Coin Gain', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Increases Soul Coins gained.', statName: 'SoulCoinGain', statsApplicationType: 'Multiplier', baseValue: 1.05, valuePerLevel: 1.001, requiredLevelModifier: 4 },
    { id: 'Stat_Corruption_Main', name: 'Corruption', type: 'main', positivity: 'negative', rarity: 'Common', allowedSlots: ['Head', 'Chest', 'Legs', 'Feet', 'Amulet', 'Ring1', 'Ring2'], description: 'Increases Corruption level.', statName: 'Corruption', statsApplicationType: 'Base', baseValue: 5, valuePerLevel: 0.5, requiredLevelModifier: 1 }, // Give negative main a small cost
    { id: 'Stat_Purification_Main', name: 'Purification', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Increases Purification (counteracts Corruption).', statName: 'Purification', statsApplicationType: 'Multiplier', baseValue: 1.05, valuePerLevel: 1, requiredLevelModifier: 4 },

    // --- Main Modifiers (Custom EM_ Classes) ---
    { id: 'EM_AcclimatizedLegging', name: 'Acclimatized Legging', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Legs'], description: 'Gain % Damage Mitigation per stage.', isCustom: true, calcFunc: 'calcAcclimatizedLeggingValue', requiredLevelModifier: 5 },
    { id: 'EM_BandOfValiance', name: 'Band of Valiance', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Ring1', 'Ring2'], description: 'Gain bonus % EXP from Elite/Champion enemies.', isCustom: true, calcFunc: 'calcBandOfValianceValue', requiredLevelModifier: 3 },
    { id: 'EM_BloodiedTowel', name: 'Bloodied Towel', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Amulet'], description: 'Gain % Corruption Multiplier per stage/zone.', isCustom: true, calcFunc: 'calcBloodiedTowelValue', requiredLevelModifier: 3 }, // Positive effect, negative consequence
    { id: 'EM_ExpertMonocle', name: 'Expert Monocle', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Head'], description: 'Increases Item Quality when items drop.', isCustom: true, calcFunc: 'calcExpertMonocleValue', requiredLevelModifier: 5 },
    { id: 'EM_FancyHat', name: 'Fancy Hat', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Head'], description: 'Reduces Shop prices.', isCustom: true, calcFunc: 'calcFancyHatValue', requiredLevelModifier: 3 },
    { id: 'EM_GoldenPlate', name: 'Golden Plate', type: 'main', positivity: 'positive', rarity: 'Uncommon', allowedSlots: ['Chest'], description: 'Gain flat Gold on Overkill.', isCustom: true, calcFunc: 'calcGoldenPlateValue', requiredLevelModifier: 3 },
    { id: 'EM_GoldenRing', name: 'Golden Ring', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Ring1', 'Ring2'], description: 'Increases chance for Limit Break items in shop.', isCustom: true, calcFunc: 'calcGoldenRingValue', requiredLevelModifier: 5 },
    { id: 'EM_Halo', name: 'Halo', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Head'], description: 'Gain % Power, Move Speed, Max Health, and Pickup Range.', isCustom: true, calcFunc: 'calcHaloValue', requiredLevelModifier: 7 },
    { id: 'EM_HolyCrossguard', name: 'Holy Crossguard', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'WeaponSlot'], description: 'Gain flat Power based on active Challenge difficulty multiplier.', isCustom: true, calcFunc: 'calcHolyCrossguardValue', requiredLevelModifier: 5 },
    { id: 'EM_KingSlayer', name: 'King Slayer', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Deal % more damage to Elite/Champion enemies that are targeted.', isCustom: true, calcFunc: 'calcKingSlayerValue', requiredLevelModifier: 7 },
    { id: 'EM_KnightPendant', name: 'Knight Pendant', type: 'main', positivity: 'positive', rarity: 'Unique', allowedSlots: ['Amulet'], description: 'Start with a specific Knight weapon. (Variant)', isCustom: true, calcFunc: 'calcKnightPendantValue', requiredLevelModifier: 15 },
    { id: 'EM_NinjaTabi', name: 'Ninja Tabi', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Feet'], description: 'Reduces One-Shot Protection cooldown.', isCustom: true, calcFunc: 'calcNinjaTabiValue', requiredLevelModifier: 5 },
    { id: 'EM_NobleSlayer', name: 'Noble Slayer', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2', 'WeaponSlot'], description: 'Deal % more damage to Elite/Champion enemies.', isCustom: true, calcFunc: 'calcNobleSlayerValue', requiredLevelModifier: 5 },
    { id: 'EM_SoulJar', name: 'Soul Jar', type: 'main', positivity: 'positive', rarity: 'Mythical', allowedSlots: ['Amulet'], description: 'Gain % Soul Coin Gain based on total Overkills (logarithmic).', isCustom: true, calcFunc: 'calcSoulJarValue', requiredLevelModifier: 10 },
    { id: 'EM_Specialization', name: 'Specialization', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Head', 'Amulet', 'WeaponSlot'], description: 'Gain % more Global Damage if you only have one weapon.', isCustom: true, calcFunc: 'calcSpecializationValue', requiredLevelModifier: 7 },
    { id: 'EM_TowerShield', name: 'Tower Shield', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Chest'], description: 'Reduces the % max health threshold required for One-Shot Protection to trigger.', isCustom: true, calcFunc: 'calcTowerShieldValue', requiredLevelModifier: 5 },
    { id: 'EM_Trainer', name: 'Trainer', type: 'main', positivity: 'positive', rarity: 'Legendary', allowedSlots: ['Head', 'Amulet'], description: 'Your first weapon starts at a higher level.', isCustom: true, calcFunc: 'calcTrainerValue', requiredLevelModifier: 8 },

    // --- God Stones (Main Modifiers) ---
    { id: 'EM_FireStone', name: 'Fire Stone', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: '+% Fire Card Drop Chance, +% Piercing Scaling, +% Power.', isCustom: true, calcFunc: 'calcFireStoneValue', requiredLevelModifier: 6 }, // Multi-stat
    { id: 'EM_FieryStone', name: 'Fiery Stone', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Improved Fire Stone effects.', isCustom: true, calcFunc: 'calcFieryStoneValue', requiredLevelModifier: 9 },
    { id: 'EM_WindStone', name: 'Wind Stone', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: '+% Wind Card Drop Chance, +% Attack Speed, -% Dash Cooldown, +% Move Speed.', isCustom: true, calcFunc: 'calcWindStoneValue', requiredLevelModifier: 6 },
    { id: 'EM_GaleStone', name: 'Gale Stone', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Improved Wind Stone effects.', isCustom: true, calcFunc: 'calcGaleStoneValue', requiredLevelModifier: 9 },
    { id: 'EM_MoonStone', name: 'Moon Stone', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: '+% Moon Card Drop Chance, +% Damage Mitigation, +% Defence.', isCustom: true, calcFunc: 'calcMoonStoneValue', requiredLevelModifier: 6 },
    { id: 'EM_LunarStone', name: 'Lunar Stone', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Improved Moon Stone effects.', isCustom: true, calcFunc: 'calcLunarStoneValue', requiredLevelModifier: 9 },
    { id: 'EM_SunStone', name: 'Sun Stone', type: 'main', positivity: 'positive', rarity: 'Rare', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: '+% Sun Card Drop Chance, +% Purification, +% XP Gain.', isCustom: true, calcFunc: 'calcSunStoneValue', requiredLevelModifier: 6 },
    { id: 'EM_SolarStone', name: 'Solar Stone', type: 'main', positivity: 'positive', rarity: 'Epic', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Improved Sun Stone effects.', isCustom: true, calcFunc: 'calcSolarStoneValue', requiredLevelModifier: 9 },
    { id: 'EM_StelarStone', name: 'Stelar Stone', type: 'main', positivity: 'positive', rarity: 'Mythical', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Combines and improves Sun and Moon Stone effects.', isCustom: true, calcFunc: 'calcStelarStoneValue', requiredLevelModifier: 12 },
    { id: 'EM_StormStone', name: 'Storm Stone', type: 'main', positivity: 'positive', rarity: 'Mythical', allowedSlots: ['Amulet', 'Ring1', 'Ring2'], description: 'Combines and improves Fire and Wind Stone effects.', isCustom: true, calcFunc: 'calcStormStoneValue', requiredLevelModifier: 12 },


    // --- Secondary Modifiers (Standard Stats) ---
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

    // Negative - Using POSITIVE requiredLevelModifier values now, will subtract in calculation
    { id: 'Stat_MaxHealth_SecNeg', name: 'Max Health', type: 'secondary', positivity: 'negative', rarity: 'Common', description: 'Decreases Maximum Health.', statName: 'MaxHealth', statsApplicationType: 'Base', baseValue: -3, valuePerLevel: -0.3, requiredLevelModifier: 1 },
    { id: 'Stat_HealthRegen_SecNeg', name: 'Health Regen', type: 'secondary', positivity: 'negative', rarity: 'Uncommon', description: 'Decreases Health Regeneration.', statName: 'HealthRegen', statsApplicationType: 'Base', baseValue: -0.05, valuePerLevel: -0.005, requiredLevelModifier: 1 },
    { id: 'Stat_Defence_SecNeg', name: 'Defence', type: 'secondary', positivity: 'negative', rarity: 'Common', description: 'Decreases Defence.', statName: 'Defence', statsApplicationType: 'Base', baseValue: -0.5, valuePerLevel: -0.05, requiredLevelModifier: 1 },
    { id: 'Stat_DamageMitigation_SecNeg', name: 'Damage Mitigation', type: 'secondary', positivity: 'negative', rarity: 'Rare', description: 'Increases damage taken by a percentage.', statName: 'DamageMitigation', statsApplicationType: 'Multiplier', baseValue: 1.01, valuePerLevel: 1, requiredLevelModifier: 2 }, // Multiplier > 1 is increase
    { id: 'Stat_XPGain_SecNeg', name: 'XP Gain', type: 'secondary', positivity: 'negative', rarity: 'Uncommon', description: 'Decreases Experience gained.', statName: 'XPGain', statsApplicationType: 'Multiplier', baseValue: 0.97, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_PickUpDistance_SecNeg', name: 'Pickup Range', type: 'secondary', positivity: 'negative', rarity: 'Common', description: 'Decreases the range for picking up items/XP.', statName: 'PickUpDistance', statsApplicationType: 'Multiplier', baseValue: 0.95, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_MoveSpeed_SecNeg', name: 'Move Speed', type: 'secondary', positivity: 'negative', rarity: 'Common', description: 'Decreases Movement Speed.', statName: 'MoveSpeed', statsApplicationType: 'Multiplier', baseValue: 0.98, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_Power_SecNeg', name: 'Power', type: 'secondary', positivity: 'negative', rarity: 'Uncommon', description: 'Decreases overall damage/effectiveness.', statName: 'Power', statsApplicationType: 'Multiplier', baseValue: 0.98, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_CriticalChance_SecNeg', name: 'Crit Chance', type: 'secondary', positivity: 'negative', rarity: 'Rare', description: 'Decreases Critical Strike Chance.', statName: 'CriticalChance', statsApplicationType: 'Base', baseValue: -0.02, valuePerLevel: -0.001, requiredLevelModifier: 2 },
    { id: 'Stat_CriticalDamage_SecNeg', name: 'Crit Damage', type: 'secondary', positivity: 'negative', rarity: 'Rare', description: 'Decreases Critical Strike Damage.', statName: 'CriticalDamage', statsApplicationType: 'Multiplier', baseValue: 0.95, valuePerLevel: 1, requiredLevelModifier: 2 },
    { id: 'Stat_AttackCoolDown_SecNeg', name: 'Attack Speed', type: 'secondary', positivity: 'negative', rarity: 'Uncommon', description: 'Increases Attack Cooldown (Decreases Attack Speed).', statName: 'AttackCoolDown', statsApplicationType: 'Multiplier', baseValue: 1.02, valuePerLevel: 1, requiredLevelModifier: 1 }, // Higher is slower
    { id: 'Stat_AreaSize_SecNeg', name: 'Area Size', type: 'secondary', positivity: 'negative', rarity: 'Uncommon', description: 'Decreases the Area of Effect for abilities.', statName: 'AreaSize', statsApplicationType: 'Multiplier', baseValue: 0.96, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_ProjectileSpeed_SecNeg', name: 'Projectile Speed', type: 'secondary', positivity: 'negative', rarity: 'Common', description: 'Decreases the speed of projectiles.', statName: 'ProjectileSpeed', statsApplicationType: 'Multiplier', baseValue: 0.95, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_ProjectileLifeTime_SecNeg', name: 'Projectile Duration', type: 'secondary', positivity: 'negative', rarity: 'Common', description: 'Decreases the duration/range of projectiles.', statName: 'ProjectileLifeTime', statsApplicationType: 'Multiplier', baseValue: 0.95, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_GoldGain_SecNeg', name: 'Gold Gain', type: 'secondary', positivity: 'negative', rarity: 'Uncommon', description: 'Decreases Gold gained.', statName: 'GoldGain', statsApplicationType: 'Multiplier', baseValue: 0.95, valuePerLevel: 1, requiredLevelModifier: 1 },
    { id: 'Stat_SoulCoinGain_SecNeg', name: 'Soul Coin Gain', type: 'secondary', positivity: 'negative', rarity: 'Rare', description: 'Decreases Soul Coins gained.', statName: 'SoulCoinGain', statsApplicationType: 'Multiplier', baseValue: 0.97, valuePerLevel: 1, requiredLevelModifier: 2 },
    { id: 'Stat_Corruption_SecNeg', name: 'Corruption', type: 'secondary', positivity: 'negative', rarity: 'Common', description: 'Increases Corruption level.', statName: 'Corruption', statsApplicationType: 'Base', baseValue: 3, valuePerLevel: 0.3, requiredLevelModifier: 1 },

    // --- Secondary Modifiers (Custom EM_ Classes) ---
    { id: 'EM_WeaponFinaleDamage', name: 'Weapon Finale Damage', type: 'secondary', positivity: 'positive', rarity: 'Legendary', description: 'Increases Final Damage of a specific weapon. (Variant)', isCustom: true, calcFunc: 'calcWeaponFinaleDamageValue', requiredLevelModifier: 5 },

];

const RARITY_ORDER = [
    'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical', 'Ascended', 'Unique'
];

// Tier mapping (Adjust as needed based on EDifficulty enum values and desired range)
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
            fixedValue = scale
                ? Math.pow(baseValue, (0.8 + (0.01 * (itemLevel - 1)) + 0.2 * itemTier))
                : baseValue;
        } else { // Base or Post
             fixedValue = baseValue * (scale ? (1 + 0.05 * (itemLevel - 1) + 0.1 * itemTier) : 1);
        }
    } else {
         fixedValue = (modifier.statsApplicationType === 'Multiplier') ? 1 : 0;
    }

    // Variable Value Part (Player Level = 1 for planner display)
     if (valuePerLevel !== (modifier.statsApplicationType === 'Multiplier' ? 1 : 0) && playerLevel > 0) {
         if (modifier.statsApplicationType === 'Multiplier') {
             const baseVarMult = Math.pow(valuePerLevel, playerLevel);
             variableValue = scale
                 ? Math.pow(baseVarMult, (0.875 + (0.005 * (itemLevel - 1)) + 0.125 * itemTier))
                 : baseVarMult;
         } else { // Base or Post
             variableValue = valuePerLevel * playerLevel * (scale ? (0.5 + 0.025 * (itemLevel - 1) + 0.5 * itemTier) : 1.0);
         }
     } else {
         variableValue = (modifier.statsApplicationType === 'Multiplier') ? 1 : 0;
     }

    // Combine
    let finalValue = 0;
    if (modifier.statsApplicationType === 'Multiplier') {
        const calculated = fixedValue * variableValue;
        finalValue = (isNaN(calculated) || calculated === 0) ? 1 : calculated;
    } else { // Base or Post
        finalValue = (fixedValue || 0) + (variableValue || 0);
    }

    return finalValue;
}


// --- Required Level Calculation ---
// REVISED: Subtracts cost of negative secondaries
function getBaseRequiredLevel(selectedModifiers) {
    let baseLevel = 0;
    selectedModifiers.forEach(mod => {
        if (mod && mod.requiredLevelModifier !== undefined) {
            if (mod.type === 'main' || mod.positivity === 'positive') {
                baseLevel += mod.requiredLevelModifier;
            } else if (mod.positivity === 'negative') {
                // Subtract the "cost" of the negative modifier
                baseLevel -= Math.abs(mod.requiredLevelModifier); // Use abs just in case
            }
        }
    });
    // Ensure required level doesn't go below 0 due to negative mods
    return Math.max(0, baseLevel);
}

// float GetTierCardLevelEffect(int level, int tier)
function getTierLevelEffect(itemTier, itemLevel) {
    itemTier = Number(itemTier) || 1;
    itemLevel = Number(itemLevel) || 1;
    // Use the positive tier formula part from C#
    return (1.0 + (0.025 * itemLevel) + (0.5 * itemTier));
}

// int RequiredCardLevel => Mathf.RoundToInt(GetBaseRequiredCardLevel() * GetTierCardLevelEffect(level, tier));
function calculateRequiredLevel(selectedModifiers, itemTier, itemLevel) {
    const baseReq = getBaseRequiredLevel(selectedModifiers);
    const effect = getTierLevelEffect(itemTier, itemLevel);
    // Ensure final level is at least 1 if any modifier is selected
    const calculatedLevel = Math.round(baseReq * effect);
    return (baseReq > 0 && calculatedLevel < 1) ? 1 : calculatedLevel;
}


// --- Custom Calculation Functions (Translate from C# GetModifierText) ---
// (No changes needed in these functions themselves, only in how requiredLevel is calculated)
// ... (all calc*Value functions remain the same as previous version) ...
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
    return `+${formatNumber(gain)} Final Power (per Challenge Multiplier)`;
}
function calcKingSlayerValue(modifier, itemTier, itemLevel) {
    const bonus = 0.3 + itemTier * 0.1 + 0.008 * itemLevel;
    return `+${formatNumber(bonus * 100)}% Damage vs Targeted Elites/Champions`;
}
function calcKnightPendantValue(modifier, itemTier, itemLevel) {
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
    const bonusLevel = Math.floor(1.25 + 0.75 * itemTier);
    return `First Weapon starts +${formatNumber(bonusLevel -1)} Levels`; // C# adds (bonusLevel - 1)
}
function calcWeaponFinaleDamageValue(modifier, itemTier, itemLevel) {
    const value = 0.25 + itemTier * 0.5 + itemLevel * 0.05;
    return `+${formatNumber(value)} Final Damage to [Weapon] (Variant)`;
}
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

     let statDisplayName = statName.replace(/([A-Z])/g, ' $1').trim();
     statDisplayName = statDisplayName.replace('Card Drop Chance', 'Drop Chance');

    return `${prefix}${formatNumber(displayValue)}${isPercent ? '%' : ''} ${statDisplayName}`;
}
function calcFireStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 1, 3);
    const dropFire = 1.05 + 0.05 * level;
    const piercingScaling = 0.005 + 0.0025 * level;
    const power = 1.01 + 0.01 * level;

    return [
        formatGodStoneLine(dropFire, "Fire Drop Chance"),
        formatGodStoneLine(piercingScaling * 100, "Piercing Scaling", true, false),
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
    const attackSpeedMult = 1.0 / (0.99 - 0.005 * level);
    const dashCooldown = 0.99 - 0.005 * level;
    const moveSpeed = 1.01 + 0.01 * level;

    return [
        formatGodStoneLine(dropChance, "Wind Drop Chance"),
        formatGodStoneLine(attackSpeedMult, "Attack Speed"),
        formatGodStoneLine(dashCooldown, "Dash Cooldown"), // Will show as reduction
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
        formatGodStoneLine(attackSpeedMult, "Attack Speed"),
        formatGodStoneLine(dashCooldown, "Dash Cooldown"),
        formatGodStoneLine(moveSpeed, "Move Speed")
    ].join('<br>');
}
function calcMoonStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 1, 3);
    const dropChance = 1.05 + 0.05 * level;
    const mitigation = 0.99 - 0.01 * level; // Multiplier
    const mitigationPercent = (1.0 - mitigation) * 100.0;
    const defence = 1.025 + 0.025 * level; // Multiplier

    return [
        formatGodStoneLine(dropChance, "Moon Drop Chance"),
        `+${formatNumber(mitigationPercent)}% Damage Mitigation`,
        formatGodStoneLine(defence, "Defence")
    ].join('<br>');
}
function calcLunarStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 4, 6);
    const dropChance = 1.5 + 0.1 * level;
    const mitigation = 0.9 - 0.02 * level;
    const mitigationPercent = (1.0 - mitigation) * 100.0;
    const defence = 1.25 + 0.05 * level;
     return [
        formatGodStoneLine(dropChance, "Moon Drop Chance"),
        `+${formatNumber(mitigationPercent)}% Damage Mitigation`,
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
        formatGodStoneLine(xpMult, "XP Gain")
    ].join('<br>');
}
function calcSolarStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 4, 6);
    const dropChance = 1.5 + 0.1 * level;
    const purification = 1.0 / (0.9 - 0.02 * level);
    const xpMult = 1.15 + 0.02 * level; // Note: C# has 1.14999.. + 0.0199.. -> 1.15 + 0.02
     return [
        formatGodStoneLine(dropChance, "Sun Drop Chance"),
        formatGodStoneLine(purification, "Purification"),
        formatGodStoneLine(xpMult, "XP Gain")
    ].join('<br>');
}
function calcStelarStoneValue(modifier, itemTier, itemLevel) {
    const level = equivalentLevel(itemTier, itemLevel, 7, 9);
    const dropChance = 1.75 + 0.1 * level;
    const purification = 1.0 / (0.85 - 0.02 * level);
    const xpMult = 1.25 + 0.025 * level;
    const mitigation = 0.85 - 0.02 * level;
    const mitigationPercent = (1.0 - mitigation) * 100.0;
    const defence = 1.45 + 0.05 * level;

    return [
        formatGodStoneLine(dropChance, "Sun/Moon Drop Chance"),
        formatGodStoneLine(purification, "Purification"),
        formatGodStoneLine(xpMult, "XP Gain"),
        `+${formatNumber(mitigationPercent)}% Damage Mitigation`,
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