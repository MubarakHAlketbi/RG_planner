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
            updateSlotCalculations(slotElement); // Initial calculation
        });
        filterInput.addEventListener('input', handleFilterChange);
        clearAllButton.addEventListener('click', handleClearAll);
        playerSoulLevelInput.addEventListener('input', updateAllActiveStates);
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

        // Tier and Level Inputs
        const tierLevelDiv = document.createElement('div');
        tierLevelDiv.classList.add('tier-level-inputs');

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
            // Use TIER_MAP[tierVal].value for comparison
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

        // Initial population of secondary slots based on default slot counts
        updateSecondarySlots(slotElement, slot.secondaryPositiveCount, slot.secondaryNegativeCount);

        return slotDiv;
    }

     function createModifierGroup(slot, type, positivity = null, index = 0) {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('modifier-selection-group'); // Renamed class
        if (type === 'secondary') {
            groupDiv.classList.add('secondary-modifier-slot');
        }

        const selectId = `${slot.id}-${type}-${positivity ? positivity + '-' : ''}${index}`;

        const select = document.createElement('select');
        select.id = selectId;
        select.dataset.modifierType = type;
        if (positivity) select.dataset.positivity = positivity;
        select.classList.add(type === 'main' ? 'main-modifier-select' : 'secondary-modifier-select');

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        // Extract nested ternary for SonarLint S3358
        let selectTypeText;
        if (type === 'main') {
            selectTypeText = 'Main';
        } else {
            selectTypeText = positivity === 'positive' ? 'Positive' : 'Negative';
        }
        defaultOption.textContent = `--- Select ${selectTypeText} ---`;
        select.appendChild(defaultOption);

        // Modifier effect display area
        const effectDisplay = document.createElement('div');
        effectDisplay.classList.add('modifier-effect-display');
        effectDisplay.innerHTML = ' '; // Placeholder
        groupDiv.appendChild(effectDisplay); // Display above select

        populateModifierOptions(select, slot, type, positivity);
        select.addEventListener('change', handleSelectChange);
        groupDiv.appendChild(select); // Select below display

        return groupDiv;
    }

    // --- Data Population ---
    function populateModifierOptions(selectElement, slot, type, positivity) {
        const currentFilter = filterInput.value.toLowerCase();
        let addedModifiers = []; // Keep track of modifiers to group them

        // Filter allowed modifiers first
        MODIFIERS.forEach(modifier => {
            let isAllowed = false;
            if (type === 'main') {
                // Main mods must be 'main' type AND allowed in this specific slot
                isAllowed = modifier.type === 'main' && modifier.allowedSlots.includes(slot.id);
            } else { // secondary
                // Secondary mods must be 'secondary' type AND match positivity
                // We don't filter by allowedSlots here, as that depends on the *main* mod chosen.
                // The filtering happens dynamically when the main mod changes.
                isAllowed = modifier.type === 'secondary' && modifier.positivity === positivity;
            }
            if (isAllowed) {
                addedModifiers.push(modifier);
            }
        });

        // Sort modifiers primarily by rarity order, then by name
        addedModifiers.sort((a, b) => {
            // Ensure RARITY_ORDER is defined (should be in data.js)
            const rarityA = RARITY_ORDER.indexOf(a.rarity);
            const rarityB = RARITY_ORDER.indexOf(b.rarity);
            if (rarityA !== rarityB) {
                return rarityA - rarityB;
            }
            return a.name.localeCompare(b.name); // Secondary sort by name
        });

        // Clear existing options except the default
        while (selectElement.options.length > 1) {
            selectElement.remove(1);
        }


        // Group by Rarity using <optgroup>
        let currentOptgroup = null;
        let currentRarity = null;

        addedModifiers.forEach(modifier => {
            if (modifier.rarity !== currentRarity) {
                currentRarity = modifier.rarity;
                currentOptgroup = document.createElement('optgroup');
                currentOptgroup.label = `${currentRarity}`;
                selectElement.appendChild(currentOptgroup);
            }

            const option = document.createElement('option');
            option.value = modifier.id;

            // Use default tier/level for display text in the dropdown list
            const baseDisplayText = getModifierEffectText(modifier, DEFAULT_TIER, DEFAULT_LEVEL);
            const uniqueIndicator = modifier.rarity === 'Unique' ? '⭐ ' : '';
            option.textContent = uniqueIndicator + baseDisplayText;


            option.title = modifier.description || 'No description available.'; // Tooltip
            option.classList.add('modifier-option', `rarity-${modifier.rarity.toLowerCase()}`);
            option.dataset.rarity = modifier.rarity;
            option.dataset.positivity = modifier.positivity;
            option.dataset.name = modifier.name.toLowerCase();
            option.dataset.effectText = baseDisplayText.toLowerCase();

            // Apply filtering (visibility handled by handleFilterChange)
            option.classList.toggle('hidden-option', !matchesFilter(option, currentFilter));


            if (currentOptgroup) {
                 currentOptgroup.appendChild(option);
            } else {
                 selectElement.appendChild(option); // Fallback
            }
        });

         // Hide optgroups with no visible options
         updateOptgroupVisibility(selectElement);
    }

    // Helper to check if an option matches the filter
    function matchesFilter(option, filterValue) {
        if (filterValue === '') return true;
        const name = option.dataset.name || '';
        const effectText = option.dataset.effectText || '';
        return name.includes(filterValue) || effectText.includes(filterValue);
    }

    // Helper to update visibility of options within a select based on filter
    function updateOptionVisibility(selectElement, filterValue) {
        const options = selectElement.querySelectorAll('option:not([value=""])'); // Exclude default option
        options.forEach(option => {
            option.classList.toggle('hidden-option', !matchesFilter(option, filterValue));
        });
    }

    // Helper to update visibility of optgroups
    function updateOptgroupVisibility(selectElement) {
        const optgroups = selectElement.querySelectorAll('optgroup');
        optgroups.forEach(optgroup => {
            const visibleOptions = optgroup.querySelectorAll('option:not(.hidden-option)');
            optgroup.style.display = visibleOptions.length > 0 ? '' : 'none';
        });
    }


     // --- Event Handlers ---
    function handleSelectChange(event) {
        const select = event.target;
        const slotElement = select.closest('.equipment-slot');
        updateSlotCalculations(slotElement);
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

        updateSlotCalculations(slotElement);
    }

    // Refactored to reduce nesting (Sonar S2004)
    function handleFilterChange() {
        const filterValue = filterInput.value.toLowerCase();
        document.querySelectorAll('.equipment-slot').forEach(slotElement => {
            const selects = slotElement.querySelectorAll('select.main-modifier-select, select.secondary-modifier-select');
            selects.forEach(select => {
                updateOptionVisibility(select, filterValue); // Update individual option visibility
                updateOptgroupVisibility(select); // Update optgroup visibility based on contained options
            });
        });
    }


     function handleClearAll() {
        const allSelects = document.querySelectorAll('select.main-modifier-select, select.secondary-modifier-select');
        const allTiers = document.querySelectorAll('select.item-tier-select');
        const allLevels = document.querySelectorAll('input.item-level-input');

        allSelects.forEach(select => {
            select.value = ''; // Reset selection
            // Trigger change to update display and calculations
            select.dispatchEvent(new Event('change'));
        });
        allTiers.forEach(select => select.value = DEFAULT_TIER);
        allLevels.forEach(input => input.value = DEFAULT_LEVEL);

        // Recalculate everything after resetting
        document.querySelectorAll('.equipment-slot').forEach(updateSlotCalculations);

        filterInput.value = '';
        handleFilterChange(); // Re-apply empty filter
    }

    // --- Calculation & Update Logic ---

    // NEW function to dynamically add/remove secondary slots
    function updateSecondarySlots(slotElement, positiveCount, negativeCount) {
        const slot = SLOTS.find(s => s.id === slotElement.dataset.slotId);
        const positiveContainer = slotElement.querySelector('.positive-secondary-container');
        const negativeContainer = slotElement.querySelector('.negative-secondary-container');

        // Update labels
        positiveContainer.querySelector('label').textContent = `Secondary Positive (${positiveCount} max)`;
        negativeContainer.querySelector('label').textContent = `Secondary Negative (${negativeCount} max)`;

        // Clear existing secondary slots (excluding the label)
        positiveContainer.querySelectorAll('.modifier-selection-group').forEach(el => el.remove());
        negativeContainer.querySelectorAll('.modifier-selection-group').forEach(el => el.remove());

        // Add new positive slots
        for (let i = 0; i < positiveCount; i++) {
            positiveContainer.appendChild(createModifierGroup(slot, 'secondary', 'positive', i));
        }

        // Add new negative slots
        for (let i = 0; i < negativeCount; i++) {
            negativeContainer.appendChild(createModifierGroup(slot, 'secondary', 'negative', i));
        }
         handleFilterChange(); // Re-apply filter to newly added selects
    }


    function updateSlotCalculations(slotElement) {
        const tierSelect = slotElement.querySelector('.item-tier-select');
        const levelInput = slotElement.querySelector('.item-level-input');
        const itemTier = parseInt(tierSelect.value, 10) || DEFAULT_TIER;
        const itemLevel = parseInt(levelInput.value, 10) || DEFAULT_LEVEL;

        const selectedModifiers = [];
        const mainSelect = slotElement.querySelector('select.main-modifier-select');
        const mainModifierId = mainSelect.value;
        const mainModifier = mainModifierId ? getModifierById(mainModifierId) : null;
        selectedModifiers.push(mainModifier); // Add main mod (or null)

        // Update secondary slot counts based on selected main modifier
        const defaultSlotDef = SLOTS.find(s => s.id === slotElement.dataset.slotId);
        // Use optional chaining for safer access (Sonar S6582)
        const positiveCount = mainModifier?.secondaryPositiveCount ?? defaultSlotDef?.secondaryPositiveCount ?? 0; // Fallback to 0 if defaultSlotDef is somehow missing
        const negativeCount = mainModifier?.secondaryNegativeCount ?? defaultSlotDef?.secondaryNegativeCount ?? 0;
        updateSecondarySlots(slotElement, positiveCount, negativeCount); // Recreate secondary slots

        // Now select secondary modifiers and update their display
        const secondarySelects = slotElement.querySelectorAll('select.secondary-modifier-select');
        secondarySelects.forEach(select => {
            const selectedOption = select.options[select.selectedIndex];
            const modifierId = selectedOption ? selectedOption.value : '';
            const modifier = modifierId ? getModifierById(modifierId) : null;
            selectedModifiers.push(modifier); // Add secondary mod (or null)

            const effectDisplay = select.previousElementSibling;
             if (effectDisplay?.classList.contains('modifier-effect-display')) { // Optional chaining
                 effectDisplay.innerHTML = modifier ? getModifierEffectText(modifier, itemTier, itemLevel) : ' ';
             }

            // Update select styling based on selected modifier
            select.className = select.className.replace(/selected-rarity-\w+/g, '').trim();
            select.className = select.className.replace(/selected-positivity-\w+/g, '').trim();
            select.style.borderColor = ''; // Reset border
            select.title = ''; // Reset title

            if (modifier) {
                const rarity = modifier.rarity;
                const positivity = modifier.positivity;
                if (rarity) {
                    select.classList.add(`selected-rarity-${rarity.toLowerCase()}`);
                    select.style.borderColor = getRarityColor(rarity);
                }
                 if (positivity) {
                     select.classList.add(`selected-positivity-${positivity.toLowerCase()}`);
                }
                 let titleText = `Rarity: ${rarity}`;
                 if (positivity) {
                     titleText += ` | Type: ${positivity.charAt(0).toUpperCase() + positivity.slice(1)}`;
                 }
                 if(modifier.description) {
                      titleText += `\nEffect Desc: ${modifier.description}`;
                 }
                 select.title = titleText;
            }
        });

         // Update Main Modifier display and styling (needs to be done after secondary slots are potentially recreated)
         const mainEffectDisplay = mainSelect.previousElementSibling;
         // Use optional chaining (Sonar S6582)
         if (mainEffectDisplay?.classList.contains('modifier-effect-display')) {
             mainEffectDisplay.innerHTML = mainModifier ? getModifierEffectText(mainModifier, itemTier, itemLevel) : ' ';
         }
         mainSelect.className = mainSelect.className.replace(/selected-rarity-\w+/g, '').trim();
         mainSelect.style.borderColor = '';
         mainSelect.title = '';
         if (mainModifier) {
             const rarity = mainModifier.rarity;
             if (rarity) {
                 mainSelect.classList.add(`selected-rarity-${rarity.toLowerCase()}`);
                 mainSelect.style.borderColor = getRarityColor(rarity);
             }
             let titleText = `Rarity: ${rarity}`;
             if(mainModifier.description) {
                  titleText += `\nEffect Desc: ${mainModifier.description}`;
             }
             mainSelect.title = titleText;
         }


        // Calculate and display Required Soul Level using only non-null modifiers
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
         // Also update the required level text color
        const reqLevelValueSpan = slotElement.querySelector('.req-level-value');
        if (reqLevelValueSpan) {
            reqLevelValueSpan.style.color = isActive ? 'var(--accent-color)' : 'var(--negative-color)';
        }
    }

    function updateAllActiveStates() {
        document.querySelectorAll('.equipment-slot').forEach(slotElement => {
             const reqLevelValueSpan = slotElement.querySelector('.req-level-value');
             // Use optional chaining
             const requiredLevel = reqLevelValueSpan ? parseInt(reqLevelValueSpan.textContent, 10) : 0;
             updateSlotActiveState(slotElement, requiredLevel);
        });
    }


    // --- Start the planner ---
    initPlanner();
});