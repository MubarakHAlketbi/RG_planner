/*
 * Rogue Genesia Equipment Planner Script
 *
 * Changes:
 * - Implemented custom dropdown component to replace native <select> for modifiers.
 * - Addresses styling inconsistencies, HTML rendering in options, and width issues.
 * - Updated event handlers and population logic for custom dropdowns.
 * - Ensured effect display area is correctly positioned and populated.
 */
document.addEventListener('DOMContentLoaded', () => {
    const plannerContainer = document.getElementById('planner-container');
    const filterInput = document.getElementById('modifier-filter');
    const clearAllButton = document.getElementById('clear-all-btn');
    const playerSoulLevelInput = document.getElementById('player-soul-level');

    const DEFAULT_TIER = 1; // F Tier
    const DEFAULT_LEVEL = 1;

    // --- Initialization ---
    function initPlanner() {
        plannerContainer.innerHTML = '';
        SLOTS.forEach(slot => {
            const slotElement = createSlotElement(slot);
            plannerContainer.appendChild(slotElement);
        });

        // Initialize custom selects AFTER initial structure is built
        initCustomSelects();

        // Initial calculations after elements AND custom selects are ready
        document.querySelectorAll('.equipment-slot').forEach(updateSlotCalculations);

        // Add global event listeners
        filterInput.addEventListener('input', handleFilterChange);
        clearAllButton.addEventListener('click', handleClearAll);
        playerSoulLevelInput.addEventListener('input', updateAllActiveStates);
        document.addEventListener('click', handleDocumentClick); // For closing dropdowns

        handleFilterChange(); // Apply initial filter
        updateAllActiveStates(); // Initial check
    }

    // --- Element Creation ---
    function createSlotElement(slot) {
        const slotDiv = document.createElement('div');
        slotDiv.classList.add('equipment-slot');
        slotDiv.dataset.slotId = slot.id;

        const title = document.createElement('h3');
        title.textContent = slot.name;
        slotDiv.appendChild(title);

        // Tier and Level Inputs (No changes needed here)
        const tierLevelDiv = document.createElement('div');
        tierLevelDiv.classList.add('tier-level-inputs');
        // ... (tier/level select and input creation remains the same) ...
        const tierLabel = document.createElement('label');
        tierLabel.setAttribute('for', `${slot.id}-tier`);
        tierLabel.textContent = 'Tier:';
        tierLevelDiv.appendChild(tierLabel);

        const tierSelect = document.createElement('select');
        tierSelect.id = `${slot.id}-tier`;
        tierSelect.classList.add('item-tier-select');
        for (const tierVal in TIER_MAP) {
            const option = document.createElement('option');
            option.value = TIER_MAP[tierVal].value;
            option.textContent = TIER_MAP[tierVal].name;
            if (TIER_MAP[tierVal].value === DEFAULT_TIER) option.selected = true;
            tierSelect.appendChild(option);
        }
        tierSelect.addEventListener('change', handleTierLevelChange);
        tierLevelDiv.appendChild(tierSelect);

        const levelLabel = document.createElement('label');
        levelLabel.setAttribute('for', `${slot.id}-level`);
        levelLabel.textContent = 'Level:';
        tierLevelDiv.appendChild(levelLabel);

        const levelInput = document.createElement('input');
        levelInput.type = 'number';
        levelInput.id = `${slot.id}-level`;
        levelInput.classList.add('item-level-input');
        levelInput.min = 1;
        levelInput.max = MAX_LEVEL;
        levelInput.value = DEFAULT_LEVEL;
        levelInput.addEventListener('input', handleTierLevelChange);
        tierLevelDiv.appendChild(levelInput);

        slotDiv.appendChild(tierLevelDiv);


        // Required Level Display
        const reqLevelDiv = document.createElement('div');
        reqLevelDiv.classList.add('required-level-display');
        reqLevelDiv.innerHTML = `Required Soul Level: <span class="req-level-value">0</span>`;
        slotDiv.appendChild(reqLevelDiv);

        // Main Modifier
        slotDiv.appendChild(createModifierGroup(slot, 'main'));

        // Variant Selection Placeholder (will be populated dynamically)
        const variantContainer = document.createElement('div');
        variantContainer.classList.add('variant-selection-container');
        variantContainer.style.display = 'none'; // Hide initially
        slotDiv.appendChild(variantContainer);

        // Secondary Positive Modifiers Container
        const positiveContainer = document.createElement('div');
        positiveContainer.classList.add('modifier-group', 'secondary-modifiers-container', 'positive-secondary-container');
        const positiveLabel = document.createElement('label');
        positiveLabel.textContent = `Secondary Positive`; // Count will be added dynamically
        positiveContainer.appendChild(positiveLabel);
        slotDiv.appendChild(positiveContainer);

        // Secondary Negative Modifiers Container
        const negativeContainer = document.createElement('div');
        negativeContainer.classList.add('modifier-group', 'secondary-modifiers-container', 'negative-secondary-container');
        const negativeLabel = document.createElement('label');
        negativeLabel.textContent = `Secondary Negative`; // Count will be added dynamically
        negativeContainer.appendChild(negativeLabel);
        slotDiv.appendChild(negativeContainer);

        return slotDiv;
    }

    // Modified to create placeholder for custom select
    function createModifierGroup(slot, type, positivity = null, index = 0) {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('modifier-selection-group');
        if (type === 'secondary') {
            groupDiv.classList.add('secondary-modifier-slot');
        }

        const selectId = `${slot.id}-${type}-${positivity ? positivity + '-' : ''}${index}`;

        // 1. Create the hidden native select (for data storage and initial population)
        const nativeSelect = document.createElement('select');
        nativeSelect.id = selectId;
        nativeSelect.dataset.modifierType = type;
        if (positivity) nativeSelect.dataset.positivity = positivity;
        nativeSelect.classList.add('native-modifier-select', 'hidden-native-select'); // Hide it

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        let selectTypeText;
        if (type === 'main') {
            selectTypeText = 'Main';
        } else {
            selectTypeText = positivity === 'positive' ? 'Positive' : 'Negative';
        }
        defaultOption.textContent = `--- Select ${selectTypeText} ---`;
        nativeSelect.appendChild(defaultOption);

        // Populate the hidden select (options will be used by custom select init)
        populateNativeModifierOptions(nativeSelect, slot, type, positivity);
        // Add change listener to the NATIVE select to trigger updates when custom select changes its value
        nativeSelect.addEventListener('change', handleSelectChange);

        // 2. Create the Modifier Effect Display Area (ABOVE the custom select)
        const effectDisplay = document.createElement('div');
        effectDisplay.classList.add('modifier-effect-display');
        effectDisplay.innerHTML = ' '; // Use non-breaking space to ensure height
        groupDiv.appendChild(effectDisplay);

        // 3. Create the Custom Select Placeholder Structure
        const customSelectContainer = document.createElement('div');
        customSelectContainer.classList.add('custom-select-container');
        customSelectContainer.dataset.selectId = selectId; // Link to the native select

        const customSelectValue = document.createElement('div');
        customSelectValue.classList.add('custom-select-value');
        customSelectValue.textContent = defaultOption.textContent; // Set initial text
        customSelectValue.tabIndex = 0; // Make it focusable

        const customSelectOptions = document.createElement('div');
        customSelectOptions.classList.add('custom-select-options');
        // Options will be added during initCustomSelects

        customSelectContainer.appendChild(customSelectValue);
        customSelectContainer.appendChild(customSelectOptions);

        // Add the custom select structure AND the hidden native select to the group
        groupDiv.appendChild(customSelectContainer);
        groupDiv.appendChild(nativeSelect); // Keep hidden select in DOM

        return groupDiv;
    }

    // --- Data Population (for hidden native select) ---
    function populateNativeModifierOptions(nativeSelectElement, slot, type, positivity) {
        // This function is similar to the old populateModifierOptions,
        // but it only populates the hidden NATIVE select.
        // The custom select options are built later in initCustomSelects.

        let addedModifiers = []; // Keep track of modifiers

        // Filter allowed modifiers first
        MODIFIERS.forEach(modifier => {
            let isAllowed = false;
            if (type === 'main') {
                isAllowed = (modifier.type === 'main' || modifier.modifierType === 'CustomMain') && modifier.allowedSlots.includes(slot.id);
            } else { // secondary
                isAllowed = (modifier.type === 'secondary' || modifier.modifierType === 'CustomSecondary') && modifier.positivity === positivity;
            }
            if (isAllowed) {
                addedModifiers.push(modifier);
            }
        });

        // Sort modifiers
        addedModifiers.sort((a, b) => {
            const rarityA = RARITY_ORDER.indexOf(a.rarity);
            const rarityB = RARITY_ORDER.indexOf(b.rarity);
            if (rarityA !== rarityB) return rarityA - rarityB;
            return (a.displayName || a.name).localeCompare(b.displayName || b.name);
        });

        // Clear existing options except the default
        while (nativeSelectElement.options.length > 1) {
            nativeSelectElement.remove(1);
        }

        // Group by Rarity using <optgroup> in the hidden select
        let currentOptgroup = null;
        let currentRarity = null;

        addedModifiers.forEach(modifier => {
            if (modifier.rarity !== currentRarity) {
                currentRarity = modifier.rarity;
                currentOptgroup = document.createElement('optgroup');
                currentOptgroup.label = `${currentRarity}`;
                nativeSelectElement.appendChild(currentOptgroup);
            }

            const option = document.createElement('option');
            option.value = modifier.id;

            // Store necessary data on the native option for the custom builder
            option.dataset.rarity = modifier.rarity;
            option.dataset.positivity = modifier.positivity;
            option.dataset.name = (modifier.displayName || modifier.name).toLowerCase();
            option.dataset.displayName = modifier.displayName || modifier.name; // Store display name
            option.dataset.description = modifier.description || 'No description available.';
            option.dataset.hasVariants = modifier.hasVariants || false; // Store variant info

            // Calculate base display text (used for filtering and potentially initial display)
            const baseDisplayText = getModifierEffectText(modifier, DEFAULT_TIER, DEFAULT_LEVEL, null);
            option.dataset.effectText = (baseDisplayText || '').toLowerCase(); // Store effect text for filtering
            const uniqueIndicator = modifier.rarity === 'Unique' ? '⭐ ' : '';
            option.textContent = uniqueIndicator + (baseDisplayText || modifier.displayName || ''); // Text for native option (mostly for debug)

            if (currentOptgroup) {
                currentOptgroup.appendChild(option);
            } else {
                nativeSelectElement.appendChild(option);
            }
        });
    }

    // --- Custom Select Initialization ---
    function initCustomSelects() {
        document.querySelectorAll('.custom-select-container').forEach(container => {
            const nativeSelect = document.getElementById(container.dataset.selectId);
            const valueDisplay = container.querySelector('.custom-select-value');
            const optionsContainer = container.querySelector('.custom-select-options');
            if (!nativeSelect || !valueDisplay || !optionsContainer) return;

            optionsContainer.innerHTML = ''; // Clear any previous options

            // Create custom options from the native select's options
            Array.from(nativeSelect.options).forEach(nativeOption => {
                const customOption = document.createElement('div');
                customOption.classList.add('custom-select-option');
                customOption.dataset.value = nativeOption.value;

                // Copy data attributes needed for styling and filtering
                for (const dataAttr in nativeOption.dataset) {
                    customOption.dataset[dataAttr] = nativeOption.dataset[dataAttr];
                }
                // Add rarity/positivity classes for styling
                if (nativeOption.dataset.rarity) {
                    customOption.classList.add(`rarity-${nativeOption.dataset.rarity.toLowerCase()}`);
                }
                 if (nativeOption.dataset.positivity) {
                    customOption.classList.add(`positivity-${nativeOption.dataset.positivity.toLowerCase()}`);
                }


                // Set innerHTML to allow HTML rendering (e.g., for <br>)
                // Use the stored display name or effect text
                const uniqueIndicator = nativeOption.dataset.rarity === 'Unique' ? '⭐ ' : '';
                const textContent = uniqueIndicator + (nativeOption.dataset.effectText && nativeOption.value ? nativeOption.dataset.effectText.replace(/<br>/gi, '\n') : nativeOption.dataset.displayName || nativeOption.textContent); // Use effect text if available, else display name. Replace <br> for display.
                // For the actual display, we might want the raw effect text with HTML
                const rawEffectHtml = nativeOption.value ? getModifierEffectText(getModifierById(nativeOption.value), DEFAULT_TIER, DEFAULT_LEVEL, null) : (nativeOption.dataset.displayName || nativeOption.textContent);
                customOption.innerHTML = uniqueIndicator + (rawEffectHtml || ' '); // Use innerHTML here

                customOption.title = nativeOption.dataset.description || ''; // Set tooltip

                if (nativeOption.value === '') {
                    customOption.classList.add('default-option');
                }

                // Add click listener to each option
                customOption.addEventListener('click', () => {
                    // Update the hidden native select's value
                    nativeSelect.value = customOption.dataset.value;

                    // Update the value display
                    valueDisplay.innerHTML = customOption.innerHTML; // Copy HTML content
                    valueDisplay.dataset.value = customOption.dataset.value; // Store value on display too
                    // Update styling of the value display based on selected option
                    valueDisplay.className = 'custom-select-value'; // Reset classes
                    if (customOption.dataset.rarity) {
                         valueDisplay.classList.add(`selected-rarity-${customOption.dataset.rarity.toLowerCase()}`);
                         valueDisplay.style.borderColor = getRarityColor(customOption.dataset.rarity);
                    } else {
                         valueDisplay.style.borderColor = ''; // Reset border color
                    }
                     if (customOption.dataset.positivity) {
                         valueDisplay.classList.add(`selected-positivity-${customOption.dataset.positivity.toLowerCase()}`);
                    }


                    // Close the dropdown
                    container.classList.remove('active');

                    // Manually trigger the 'change' event on the hidden native select
                    const changeEvent = new Event('change', { bubbles: true });
                    nativeSelect.dispatchEvent(changeEvent);
                });

                optionsContainer.appendChild(customOption);
            });

            // Add click listener to the value display to toggle dropdown
            valueDisplay.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent document click handler from closing it immediately
                closeAllDropdowns(container); // Close others before opening this one
                container.classList.toggle('active');
            });
             valueDisplay.addEventListener('keydown', (e) => {
                 if (e.key === 'Enter' || e.key === ' ') {
                     e.preventDefault();
                     e.stopPropagation();
                     closeAllDropdowns(container);
                     container.classList.toggle('active');
                 }
             });
        });
    }

    // Helper to close all active custom dropdowns, optionally excluding one
    function closeAllDropdowns(excludeContainer = null) {
        document.querySelectorAll('.custom-select-container.active').forEach(activeContainer => {
            if (activeContainer !== excludeContainer) {
                activeContainer.classList.remove('active');
            }
        });
    }

    // Handle clicks outside dropdowns
    function handleDocumentClick(event) {
        // If the click is not inside an active custom select container, close all dropdowns
        if (!event.target.closest('.custom-select-container.active')) {
            closeAllDropdowns();
        }
    }


    // --- Event Handlers ---
    function handleSelectChange(event) {
        // This event is now triggered by the NATIVE select (either directly or via custom select interaction)
        const nativeSelect = event.target;
        const slotElement = nativeSelect.closest('.equipment-slot');
        if (slotElement) {
            updateSlotCalculations(slotElement);
        }
    }

    function handleTierLevelChange(event) {
        const input = event.target;
        const slotElement = input.closest('.equipment-slot');

        if (input.classList.contains('item-level-input')) {
             let value = parseInt(input.value, 10);
             if (isNaN(value) || value < 1) value = 1;
             if (value > MAX_LEVEL) value = MAX_LEVEL;
             input.value = value; // Correct the value if out of bounds
        }

        if (slotElement) {
            updateSlotCalculations(slotElement);
        }
    }

    // Updated to filter custom options
    function handleFilterChange() {
        const filterValue = filterInput.value.toLowerCase();
        document.querySelectorAll('.custom-select-options').forEach(optionsContainer => {
            let hasVisibleOption = false;
            optionsContainer.querySelectorAll('.custom-select-option').forEach(option => {
                const isDefault = option.classList.contains('default-option');
                const matches = isDefault || matchesFilter(option, filterValue); // Always show default or if matches
                option.classList.toggle('hidden-option', !matches);
                if (matches && !isDefault) {
                    hasVisibleOption = true;
                }
            });
             // Optionally hide the whole container if only the default is visible?
             // optionsContainer.closest('.custom-select-container').style.display = hasVisibleOption ? '' : 'none'; // Example
        });
    }

    // Helper to check if a custom option matches the filter
    function matchesFilter(option, filterValue) {
        if (!option || filterValue === '') return true;
        const name = option.dataset.name || '';
        const effectText = option.dataset.effectText || ''; // Use stored effect text
        // Check name and effect text
        return name.includes(filterValue) || effectText.includes(filterValue);
    }


     function handleClearAll() {
        // Reset native selects (which updates custom selects via event trigger)
        const allNativeSelects = document.querySelectorAll('select.native-modifier-select');
        allNativeSelects.forEach(select => {
            if (select.value !== '') {
                select.value = '';
                // Manually trigger change to update custom display and recalculate
                const changeEvent = new Event('change', { bubbles: true });
                select.dispatchEvent(changeEvent);
            }
        });

        // Reset Tier/Level
        const allTiers = document.querySelectorAll('select.item-tier-select');
        const allLevels = document.querySelectorAll('input.item-level-input');
        allTiers.forEach(select => select.value = DEFAULT_TIER);
        allLevels.forEach(input => input.value = DEFAULT_LEVEL);

        // Clear variant selectors explicitly if they exist
         document.querySelectorAll('.variant-selection-container').forEach(container => {
             const variantSelect = container.querySelector('select.variant-modifier-select');
             if (variantSelect && variantSelect.value !== '') {
                 variantSelect.value = '';
                 // Trigger change on the main modifier's native select to force full recalc
                 const mainSelectId = container.closest('.equipment-slot')?.querySelector('.main-modifier-select')?.id;
                 if (mainSelectId) {
                     const mainNativeSelect = document.getElementById(mainSelectId);
                     if(mainNativeSelect) {
                         const changeEvent = new Event('change', { bubbles: true });
                         mainNativeSelect.dispatchEvent(changeEvent);
                     }
                 }
             }
             container.style.display = 'none'; // Hide variant container
             container.innerHTML = ''; // Clear content
         });


        // Recalculate everything AFTER resetting values (should be handled by change events)
        // document.querySelectorAll('.equipment-slot').forEach(updateSlotCalculations); // Might be redundant if change events work

        filterInput.value = '';
        handleFilterChange(); // Re-apply empty filter to show all options again
        updateAllActiveStates(); // Update active states
    }

    // --- Calculation & Update Logic ---

    // Dynamically add/remove secondary slots based on main mod counts
    function updateSecondarySlots(slotElement, positiveCount, negativeCount) {
        const slotId = slotElement.dataset.slotId;
        const slot = SLOTS.find(s => s.id === slotId);
        if (!slot) return;

        const positiveContainer = slotElement.querySelector('.positive-secondary-container');
        const negativeContainer = slotElement.querySelector('.negative-secondary-container');
        if (!positiveContainer || !negativeContainer) return;

        positiveContainer.querySelector('label').textContent = `Secondary Positive (${positiveCount} max)`;
        negativeContainer.querySelector('label').textContent = `Secondary Negative (${negativeCount} max)`;

        // Preserve selected values from the hidden NATIVE selects
        const preservedValues = { positive: [], negative: [] };
        positiveContainer.querySelectorAll('select.native-modifier-select').forEach((select, index) => {
            if (index < positiveCount) preservedValues.positive[index] = select.value;
        });
        negativeContainer.querySelectorAll('select.native-modifier-select').forEach((select, index) => {
            if (index < negativeCount) preservedValues.negative[index] = select.value;
        });

        // Clear existing secondary slots (groups containing custom select + hidden native)
        positiveContainer.querySelectorAll('.modifier-selection-group').forEach(el => el.remove());
        negativeContainer.querySelectorAll('.modifier-selection-group').forEach(el => el.remove());

        // Add new positive slots
        for (let i = 0; i < positiveCount; i++) {
            const group = createModifierGroup(slot, 'secondary', 'positive', i);
            positiveContainer.appendChild(group);
            // Restore value if it existed (set on the hidden native select)
            const nativeSelect = group.querySelector('select.native-modifier-select');
            if (nativeSelect && preservedValues.positive[i]) {
                nativeSelect.value = preservedValues.positive[i];
                // Note: Custom select display update happens in initCustomSelects or updateSlotCalculations
            }
        }

        // Add new negative slots
        for (let i = 0; i < negativeCount; i++) {
            const group = createModifierGroup(slot, 'secondary', 'negative', i);
            negativeContainer.appendChild(group);
            const nativeSelect = group.querySelector('select.native-modifier-select');
            if (nativeSelect && preservedValues.negative[i]) {
                nativeSelect.value = preservedValues.negative[i];
            }
        }

        // Re-initialize custom selects for the newly added slots
        initCustomSelects();
        handleFilterChange(); // Re-apply filter
    }

    // --- Variant Selection Logic (Issue #4 - Adapted for Custom Selects) ---

    // Gets possible variants based on modifier ID (No change needed here)
    function getPossibleVariants(modifierId) {
        const modifier = getModifierById(modifierId);
        if (!modifier || !modifier.hasVariants) {
            return [];
        }
        console.log(`Fetching variants for ${modifierId}`);
        if (modifierId === 'M_KnightPendant') {
            return [ { id: 'Weapon_Sword', name: 'Sword' }, { id: 'Weapon_Axe', name: 'Axe' }, { id: 'Weapon_Bow', name: 'Bow' } ];
        } else if (modifierId === 'EM_WeaponFinaleDamage') {
             return MODIFIERS
                .filter(m => m.type === 'main' && m.statName && m.statName !== 'None' && !m.isCustom)
                .map(m => ({ id: m.id, name: m.displayName || m.name }))
                .sort((a, b) => a.name.localeCompare(b.name));
        }
        return [];
    }

    // Populates the variant dropdown (Standard Select is OK here, or could be custom too)
    function populateVariantOptions(variantSelect, modifierId) {
        const variants = getPossibleVariants(modifierId);
        while (variantSelect.options.length > 1) variantSelect.remove(1); // Clear existing
        variants.forEach(variant => {
            const option = document.createElement('option');
            option.value = variant.id;
            option.textContent = variant.name;
            variantSelect.appendChild(option);
        });
    }

    // Creates, updates, or removes the variant selector UI (Using standard select for simplicity here)
    function updateVariantSelector(slotElement, mainModifier) {
        const variantContainer = slotElement.querySelector('.variant-selection-container');
        if (!variantContainer) return;

        const mainModifierId = mainModifier?.id; // Get ID before potentially clearing
        const currentVariantSelect = variantContainer.querySelector('select.variant-modifier-select');
        const currentVariantValue = currentVariantSelect?.value; // Preserve value

        if (mainModifier?.hasVariants) {
            variantContainer.style.display = 'block';
            // Only rebuild if it doesn't exist or the main mod changed
            if (!currentVariantSelect || variantContainer.dataset.currentMainMod !== mainModifierId) {
                variantContainer.innerHTML = ''; // Clear previous content
                variantContainer.dataset.currentMainMod = mainModifierId; // Track current mod

                const groupDiv = document.createElement('div');
                groupDiv.classList.add('variant-selection-group');

                const label = document.createElement('label');
                label.setAttribute('for', `${slotElement.dataset.slotId}-variant`);
                label.textContent = 'Select Variant:';
                groupDiv.appendChild(label);

                const select = document.createElement('select');
                select.id = `${slotElement.dataset.slotId}-variant`;
                select.classList.add('variant-modifier-select'); // Use standard select

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = '--- Select Variant ---';
                select.appendChild(defaultOption);

                populateVariantOptions(select, mainModifier.id);
                // Restore previous value if applicable
                 if (currentVariantValue && select.querySelector(`option[value="${currentVariantValue}"]`)) {
                     select.value = currentVariantValue;
                 }

                // Add change listener to trigger main recalc
                select.addEventListener('change', (e) => {
                     const mainSelectId = slotElement.querySelector('.custom-select-container')?.dataset.selectId;
                     const mainNativeSelect = mainSelectId ? document.getElementById(mainSelectId) : null;
                     if (mainNativeSelect) {
                         // Trigger change on main select to force update
                         const changeEvent = new Event('change', { bubbles: true });
                         mainNativeSelect.dispatchEvent(changeEvent);
                     }
                 });

                groupDiv.appendChild(select);
                variantContainer.appendChild(groupDiv);
            }
        } else {
            variantContainer.innerHTML = ''; // Clear content
            variantContainer.style.display = 'none';
            delete variantContainer.dataset.currentMainMod; // Clear tracking
        }
    }

    // --- Main Update Function ---
    function updateSlotCalculations(slotElement) {
        const tierSelect = slotElement.querySelector('.item-tier-select');
        const levelInput = slotElement.querySelector('.item-level-input');
        const itemTier = parseInt(tierSelect?.value, 10) || DEFAULT_TIER;
        const itemLevel = parseInt(levelInput?.value, 10) || DEFAULT_LEVEL;

        const selectedModifiers = [];

        // Get main modifier from the HIDDEN NATIVE select
        const mainNativeSelect = slotElement.querySelector('select.native-modifier-select[data-modifier-type="main"]');
        const mainModifierId = mainNativeSelect?.value;
        const mainModifier = mainModifierId ? getModifierById(mainModifierId) : null;
        selectedModifiers.push(mainModifier);

        // Update variant selector UI based on main modifier
        updateVariantSelector(slotElement, mainModifier);

        // Read selected variant *after* selector is potentially updated
        const variantSelect = slotElement.querySelector('select.variant-modifier-select');
        const selectedVariantId = variantSelect?.value || null;

        // Update secondary slot counts
        const defaultSlotDef = SLOTS.find(s => s.id === slotElement.dataset.slotId);
        const positiveCount = mainModifier?.secondaryPositiveCount ?? defaultSlotDef?.secondaryPositiveCount ?? 0;
        const negativeCount = mainModifier?.secondaryNegativeCount ?? defaultSlotDef?.secondaryNegativeCount ?? 0;
        updateSecondarySlots(slotElement, positiveCount, negativeCount); // This re-inits custom selects inside

        // --- Update Main Modifier Display ---
        const mainCustomContainer = slotElement.querySelector('.custom-select-container[data-select-id="' + mainNativeSelect?.id + '"]');
        const mainEffectDisplay = mainCustomContainer?.previousElementSibling; // Effect display is before container
        const mainValueDisplay = mainCustomContainer?.querySelector('.custom-select-value');

        if (mainEffectDisplay?.classList.contains('modifier-effect-display')) {
            mainEffectDisplay.innerHTML = mainModifier ? getModifierEffectText(mainModifier, itemTier, itemLevel, selectedVariantId) : ' ';
        }
        // Update value display styling (border, etc.) - This should ideally happen during selection, but double-check here
        if (mainValueDisplay) {
             mainValueDisplay.className = 'custom-select-value'; // Reset
             mainValueDisplay.style.borderColor = '';
             mainValueDisplay.title = ''; // Reset title
             if (mainModifier) {
                 const rarity = mainModifier.rarity;
                 if (rarity) {
                     mainValueDisplay.classList.add(`selected-rarity-${rarity.toLowerCase()}`);
                     mainValueDisplay.style.borderColor = getRarityColor(rarity);
                 }
                 let titleText = `Rarity: ${rarity}`;
                 if(mainModifier.description) titleText += `\nDesc: ${mainModifier.description}`;
                 mainValueDisplay.title = titleText;

                 // Update displayed text if needed (e.g., if it wasn't set correctly on select)
                 const currentDisplayContent = mainModifier ? (mainValueDisplay.dataset.value === mainModifier.id ? mainValueDisplay.innerHTML : getModifierEffectText(mainModifier, DEFAULT_TIER, DEFAULT_LEVEL, null)) : '--- Select Main ---';
                 const uniqueIndicator = mainModifier.rarity === 'Unique' ? '⭐ ' : '';
                 mainValueDisplay.innerHTML = uniqueIndicator + (currentDisplayContent || mainModifier.displayName || ' ');

             } else {
                 // Reset display for default option
                 mainValueDisplay.innerHTML = mainNativeSelect?.options[0]?.textContent || '--- Select Main ---';
             }
        }


        // --- Update Secondary Modifiers Display ---
        // Select secondary modifiers *after* slots are potentially recreated
        slotElement.querySelectorAll('select.native-modifier-select[data-modifier-type="secondary"]').forEach(nativeSelect => {
            const modifierId = nativeSelect.value;
            const modifier = modifierId ? getModifierById(modifierId) : null;
            selectedModifiers.push(modifier);

            const customContainer = slotElement.querySelector(`.custom-select-container[data-select-id="${nativeSelect.id}"]`);
            const effectDisplay = customContainer?.previousElementSibling;
            const valueDisplay = customContainer?.querySelector('.custom-select-value');

            if (effectDisplay?.classList.contains('modifier-effect-display')) {
                effectDisplay.innerHTML = modifier ? getModifierEffectText(modifier, itemTier, itemLevel, null) : ' ';
            }
             // Update value display styling
             if (valueDisplay) {
                 valueDisplay.className = 'custom-select-value'; // Reset
                 valueDisplay.style.borderColor = '';
                 valueDisplay.title = '';
                 if (modifier) {
                     const rarity = modifier.rarity;
                     const positivity = modifier.positivity;
                     if (rarity) {
                         valueDisplay.classList.add(`selected-rarity-${rarity.toLowerCase()}`);
                         valueDisplay.style.borderColor = getRarityColor(rarity);
                     }
                     if (positivity) {
                         valueDisplay.classList.add(`selected-positivity-${positivity.toLowerCase()}`);
                     }
                     let titleText = `Rarity: ${rarity}`;
                     if (positivity) titleText += ` | Type: ${positivity.charAt(0).toUpperCase() + positivity.slice(1)}`;
                     if(modifier.description) titleText += `\nDesc: ${modifier.description}`;
                     valueDisplay.title = titleText;

                     // Update displayed text if needed
                     const currentDisplayContent = modifier ? (valueDisplay.dataset.value === modifier.id ? valueDisplay.innerHTML : getModifierEffectText(modifier, DEFAULT_TIER, DEFAULT_LEVEL, null)) : '--- Select Secondary ---';
                     const uniqueIndicator = modifier.rarity === 'Unique' ? '⭐ ' : '';
                     valueDisplay.innerHTML = uniqueIndicator + (currentDisplayContent || modifier.displayName || ' ');

                 } else {
                     // Reset display for default option
                     valueDisplay.innerHTML = nativeSelect.options[0]?.textContent || '--- Select Secondary ---';
                 }
             }
        });

        // Calculate and display Required Soul Level
        const validModifiers = selectedModifiers.filter(mod => mod !== null);
        const requiredLevel = calculateRequiredLevel(validModifiers, itemTier, itemLevel);
        const reqLevelValueSpan = slotElement.querySelector('.req-level-value');
        if (reqLevelValueSpan) {
            reqLevelValueSpan.textContent = requiredLevel;
        }

        updateSlotActiveState(slotElement, requiredLevel);
    }


    function updateSlotActiveState(slotElement, requiredLevel) {
        const playerLevel = parseInt(playerSoulLevelInput.value, 10) || 1;
        const isActive = playerLevel >= requiredLevel;
        slotElement.classList.toggle('inactive-slot', !isActive);
        const reqLevelValueSpan = slotElement.querySelector('.req-level-value');
        if (reqLevelValueSpan) {
            reqLevelValueSpan.style.color = isActive ? 'var(--accent-color)' : 'var(--negative-color)';
        }
    }

    function updateAllActiveStates() {
        document.querySelectorAll('.equipment-slot').forEach(slotElement => {
             const reqLevelValueSpan = slotElement.querySelector('.req-level-value');
             const requiredLevel = reqLevelValueSpan ? parseInt(reqLevelValueSpan.textContent, 10) : 0;
             updateSlotActiveState(slotElement, requiredLevel);
        });
    }

    // --- Start the planner ---
    initPlanner();
});