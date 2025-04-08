document.addEventListener('DOMContentLoaded', () => {
    const plannerContainer = document.getElementById('planner-container');
    const filterInput = document.getElementById('modifier-filter');
    const clearAllButton = document.getElementById('clear-all-btn');
    const playerSoulLevelInput = document.getElementById('player-soul-level');

    const DEFAULT_TIER = 1; // F Tier
    const DEFAULT_LEVEL = 1;
    const DEFAULT_SECONDARY_POSITIVE_COUNT = 2; // Default if main mod doesn't specify
    const DEFAULT_SECONDARY_NEGATIVE_COUNT = 1; // Default if main mod doesn't specify

    // --- Initialization ---
    function initPlanner() {
        plannerContainer.innerHTML = '';
        SLOTS.forEach(slot => {
            const slotElement = createSlotElement(slot);
            plannerContainer.appendChild(slotElement);
            updateSlotCalculations(slotElement); // Initial calculation and secondary slot visibility
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
        // Use the extended TIER_MAP from data.js
        for (const tierVal in TIER_MAP) {
            const option = document.createElement('option');
            option.value = TIER_MAP[tierVal].value;
            option.textContent = TIER_MAP[tierVal].name;
            if (parseInt(TIER_MAP[tierVal].value) === DEFAULT_TIER) option.selected = true; // Compare value, not key
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

        // Secondary Positive Modifiers - Create fixed number initially (e.g., max expected)
        const positiveGroup = document.createElement('div');
        positiveGroup.classList.add('modifier-group', 'secondary-modifiers-container', 'positive-secondary-container');
        const positiveLabel = document.createElement('label');
        positiveLabel.textContent = `Secondary Positive`; // Label updated dynamically
        positiveGroup.appendChild(positiveLabel);
        // Create a reasonable max number of slots, they will be hidden/shown
        const maxPositiveSlots = 3;
        for (let i = 0; i < maxPositiveSlots; i++) {
            positiveGroup.appendChild(createModifierGroup(slot, 'secondary', 'positive', i));
        }
        slotDiv.appendChild(positiveGroup);

        // Secondary Negative Modifiers - Create fixed number initially
        const negativeGroup = document.createElement('div');
        negativeGroup.classList.add('modifier-group', 'secondary-modifiers-container', 'negative-secondary-container');
        const negativeLabel = document.createElement('label');
        negativeLabel.textContent = `Secondary Negative`; // Label updated dynamically
        negativeGroup.appendChild(negativeLabel);
        // Create a reasonable max number of slots
        const maxNegativeSlots = 2;
        for (let i = 0; i < maxNegativeSlots; i++) {
            negativeGroup.appendChild(createModifierGroup(slot, 'secondary', 'negative', i));
        }
        slotDiv.appendChild(negativeGroup);

        return slotDiv;
    }

    function createModifierGroup(slot, type, positivity = null, index = 0) {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('modifier-selection-group'); // Renamed class for clarity
        if (type === 'secondary') {
            groupDiv.classList.add('secondary-modifier-slot');
            groupDiv.dataset.index = index; // Store index for showing/hiding
            groupDiv.style.display = 'none'; // Hide secondary slots initially
        }

        const label = document.createElement('label');
        const selectId = `${slot.id}-${type}-${positivity ? positivity + '-' : ''}${index}`;
        label.setAttribute('for', selectId);
        if (type === 'main') {
             label.textContent = 'Main Modifier:';
             groupDiv.appendChild(label);
        }
        // Secondary labels are handled by the container label now

        const select = document.createElement('select');
        select.id = selectId;
        select.dataset.modifierType = type;
        if (positivity) select.dataset.positivity = positivity;
        select.classList.add(type === 'main' ? 'main-modifier-select' : 'secondary-modifier-select');

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = `--- Select ${type === 'main' ? 'Main' : (positivity === 'positive' ? 'Positive' : 'Negative')} ---`;
        select.appendChild(defaultOption);

        // Modifier effect display area
        const effectDisplay = document.createElement('div');
        effectDisplay.classList.add('modifier-effect-display');
        effectDisplay.innerHTML = ' '; // Placeholder
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
                isAllowed = modifier.type === 'main' && (!modifier.allowedSlots || modifier.allowedSlots.includes(slot.id));
            } else { // secondary
                isAllowed = modifier.type === 'secondary' && modifier.positivity === positivity;
            }
            if (isAllowed) {
                addedModifiers.push(modifier);
            }
        });

        // Sort modifiers primarily by rarity order, then by name
        addedModifiers.sort((a, b) => {
            const rarityA = RARITY_ORDER.indexOf(a.rarity);
            const rarityB = RARITY_ORDER.indexOf(b.rarity);
            if (rarityA !== rarityB) {
                return rarityA - rarityB;
            }
            return a.name.localeCompare(b.name); // Secondary sort by name
        });

        // Group by Rarity using <optgroup>
        let currentOptgroup = null;
        let currentRarity = null;

        addedModifiers.forEach(modifier => {
            // Create optgroup if rarity changes
            if (modifier.rarity !== currentRarity) {
                currentRarity = modifier.rarity;
                currentOptgroup = document.createElement('optgroup');
                currentOptgroup.label = `${currentRarity}`;
                selectElement.appendChild(currentOptgroup);
            }

            const option = document.createElement('option');
            option.value = modifier.id;

            // Get base display text using default tier/level for the option text
            const baseDisplayText = getModifierEffectText(modifier, DEFAULT_TIER, DEFAULT_LEVEL);
            const uniqueIndicator = modifier.rarity === 'Unique' ? '⭐ ' : '';
            option.textContent = uniqueIndicator + baseDisplayText;


            option.title = modifier.description || 'No description available.'; // Tooltip
            option.classList.add('modifier-option', `rarity-${modifier.rarity.toLowerCase()}`);
            option.dataset.rarity = modifier.rarity;
            option.dataset.positivity = modifier.positivity;
            option.dataset.name = modifier.name.toLowerCase();
            // Store the base text for filtering, without tier/level scaling applied yet
            option.dataset.effectText = baseDisplayText.toLowerCase();

            // Apply filtering
            const matchesFilter = currentFilter === '' ||
                                  option.dataset.name.includes(currentFilter) ||
                                  option.dataset.effectText.includes(currentFilter);

            option.classList.toggle('hidden-option', !matchesFilter);

            if (currentOptgroup) {
                 currentOptgroup.appendChild(option);
            } else {
                 selectElement.appendChild(option); // Fallback if no optgroup (shouldn't happen with sort)
            }
        });
    }

     // --- Event Handlers ---
    function handleSelectChange(event) {
        const select = event.target;
        const slotElement = select.closest('.equipment-slot');
        updateSlotCalculations(slotElement); // Recalculate everything, including secondary visibility
    }

    function handleTierLevelChange(event) {
        const input = event.target;
        const slotElement = input.closest('.equipment-slot');

        // Validate level input
        if (input.classList.contains('item-level-input')) {
             let value = parseInt(input.value, 10);
             if (isNaN(value) || value < 1) value = 1;
             if (value > MAX_LEVEL) value = MAX_LEVEL;
             input.value = value; // Correct the input value if needed
        }

        updateSlotCalculations(slotElement);
    }

    function handleFilterChange() {
        const filterValue = filterInput.value.toLowerCase();
        const allSelects = document.querySelectorAll('select');

        allSelects.forEach(select => {
            let hasVisibleOptionsInSelect = false;
            const optgroups = select.querySelectorAll('optgroup');

            // Handle options directly under select (like the default "-- Select --")
            select.querySelectorAll(':scope > option:not([value=""])').forEach(option => {
                 const name = option.dataset.name || '';
                 const effectText = option.dataset.effectText || '';
                 const matches = filterValue === '' || name.includes(filterValue) || effectText.includes(filterValue);
                 option.classList.toggle('hidden-option', !matches);
                 if(matches) hasVisibleOptionsInSelect = true;
            });


            optgroups.forEach(optgroup => {
                let groupHasVisibleOptions = false;
                const groupOptions = optgroup.querySelectorAll('option');
                groupOptions.forEach(option => {
                    const name = option.dataset.name || '';
                    const effectText = option.dataset.effectText || '';
                    const matches = filterValue === '' || name.includes(filterValue) || effectText.includes(filterValue);

                    option.classList.toggle('hidden-option', !matches);
                    if (matches) {
                        groupHasVisibleOptions = true;
                        hasVisibleOptionsInSelect = true; // Mark select as having visible options
                    }
                });
                 // Hide optgroup if it has no visible options
                 optgroup.style.display = groupHasVisibleOptions ? '' : 'none';
            });

             // Optional: Hide the entire select if no options match? Might be confusing.
             // select.style.display = hasVisibleOptionsInSelect ? '' : 'none';
        });
    }


     function handleClearAll() {
        const allSelects = document.querySelectorAll('select.main-modifier-select, select.secondary-modifier-select');
        const allTiers = document.querySelectorAll('select.item-tier-select');
        const allLevels = document.querySelectorAll('input.item-level-input');

        allSelects.forEach(select => {
            select.value = ''; // Reset selection
            // Clear dynamic classes and styles
            select.className = select.className.replace(/selected-rarity-\w+/g, '').trim();
            select.className = select.className.replace(/selected-positivity-\w+/g, '').trim();
            select.style.borderColor = '';
            select.title = '';
            // Clear effect display
            const effectDisplay = select.closest('.modifier-selection-group')?.querySelector('.modifier-effect-display');
             if (effectDisplay) {
                 effectDisplay.innerHTML = ' '; // Reset placeholder
             }
        });
        allTiers.forEach(select => select.value = DEFAULT_TIER);
        allLevels.forEach(input => input.value = DEFAULT_LEVEL);

        // Update calculations and visibility for all slots
        document.querySelectorAll('.equipment-slot').forEach(updateSlotCalculations);

        filterInput.value = ''; // Clear filter input
        handleFilterChange(); // Re-apply filter (shows all options)
        updateAllActiveStates(); // Update active/inactive based on cleared levels
    }

    // --- Calculation & Update Logic ---
    function updateSlotCalculations(slotElement) {
        const tierSelect = slotElement.querySelector('.item-tier-select');
        const levelInput = slotElement.querySelector('.item-level-input');
        const itemTier = parseInt(tierSelect.value, 10) || DEFAULT_TIER;
        const itemLevel = parseInt(levelInput.value, 10) || DEFAULT_LEVEL;

        const selectedModifiers = [];
        const mainSelect = slotElement.querySelector('select.main-modifier-select');
        const secondaryPositiveSelects = slotElement.querySelectorAll('.positive-secondary-container .secondary-modifier-select');
        const secondaryNegativeSelects = slotElement.querySelectorAll('.negative-secondary-container .secondary-modifier-select');

        // Process Main Modifier
        const mainModifierId = mainSelect.value;
        const mainModifier = mainModifierId ? getModifierById(mainModifierId) : null;
        selectedModifiers.push(mainModifier);
        updateModifierDisplay(mainSelect, mainModifier, itemTier, itemLevel);

        // Determine secondary counts based on main modifier
        const positiveCount = mainModifier?.secondaryPositiveCount ?? DEFAULT_SECONDARY_POSITIVE_COUNT;
        const negativeCount = mainModifier?.secondaryNegativeCount ?? DEFAULT_SECONDARY_NEGATIVE_COUNT;

        // Update labels for secondary containers
        const positiveContainerLabel = slotElement.querySelector('.positive-secondary-container > label');
        if (positiveContainerLabel) positiveContainerLabel.textContent = `Secondary Positive (${positiveCount} max)`;
        const negativeContainerLabel = slotElement.querySelector('.negative-secondary-container > label');
        if (negativeContainerLabel) negativeContainerLabel.textContent = `Secondary Negative (${negativeCount} max)`;


        // Process and Show/Hide Positive Secondaries
        secondaryPositiveSelects.forEach((select, index) => {
            const groupDiv = select.closest('.modifier-selection-group');
            if (index < positiveCount) {
                groupDiv.style.display = ''; // Show slot
                const modifierId = select.value;
                const modifier = modifierId ? getModifierById(modifierId) : null;
                selectedModifiers.push(modifier);
                updateModifierDisplay(select, modifier, itemTier, itemLevel);
            } else {
                groupDiv.style.display = 'none'; // Hide slot
                if (select.value) { // If a hidden slot had a selection, clear it
                    select.value = '';
                    updateModifierDisplay(select, null, itemTier, itemLevel); // Update display to clear it
                }
                selectedModifiers.push(null); // Add null placeholder for calculation
            }
        });

        // Process and Show/Hide Negative Secondaries
        secondaryNegativeSelects.forEach((select, index) => {
             const groupDiv = select.closest('.modifier-selection-group');
            if (index < negativeCount) {
                groupDiv.style.display = ''; // Show slot
                const modifierId = select.value;
                const modifier = modifierId ? getModifierById(modifierId) : null;
                selectedModifiers.push(modifier);
                updateModifierDisplay(select, modifier, itemTier, itemLevel);
            } else {
                groupDiv.style.display = 'none'; // Hide slot
                 if (select.value) { // If a hidden slot had a selection, clear it
                    select.value = '';
                    updateModifierDisplay(select, null, itemTier, itemLevel); // Update display to clear it
                }
                selectedModifiers.push(null); // Add null placeholder
            }
        });

        // Calculate and display Required Soul Level using only the *actually selected* modifiers
        const finalSelectedModifiers = selectedModifiers.filter(mod => mod !== null);
        const requiredLevel = calculateRequiredLevel(finalSelectedModifiers, itemTier, itemLevel);
        const reqLevelValueSpan = slotElement.querySelector('.req-level-value');
        if (reqLevelValueSpan) {
            reqLevelValueSpan.textContent = requiredLevel;
        }

        updateSlotActiveState(slotElement, requiredLevel);
    }

    // Helper to update display for a single modifier select element
    function updateModifierDisplay(selectElement, modifier, itemTier, itemLevel) {
        const groupDiv = selectElement.closest('.modifier-selection-group');
        const effectDisplay = groupDiv?.querySelector('.modifier-effect-display');

        if (effectDisplay) {
            effectDisplay.innerHTML = modifier ? getModifierEffectText(modifier, itemTier, itemLevel) : ' ';
        }

        // Clear previous dynamic styles/classes
        selectElement.className = selectElement.className.replace(/selected-rarity-\w+/g, '').trim();
        selectElement.className = selectElement.className.replace(/selected-positivity-\w+/g, '').trim();
        selectElement.style.borderColor = '';
        selectElement.title = ''; // Clear old title

        if (modifier) {
            const rarity = modifier.rarity;
            const positivity = modifier.positivity;
            if (rarity) {
                selectElement.classList.add(`selected-rarity-${rarity.toLowerCase()}`);
                selectElement.style.borderColor = getRarityColor(rarity); // Apply border color
            }
             if (positivity) {
                 selectElement.classList.add(`selected-positivity-${positivity.toLowerCase()}`);
            }
             // Build tooltip
             let titleText = `Rarity: ${rarity}`;
             if (positivity) {
                 titleText += ` | Type: ${positivity.charAt(0).toUpperCase() + positivity.slice(1)}`;
             }
             if(modifier.description) {
                  titleText += `\nDesc: ${modifier.description}`;
             }
             // Add estimated required level contribution to tooltip
             if (modifier.requiredLevelModifier !== undefined) {
                 titleText += `\nEst. Base Lvl Mod: ${modifier.requiredLevelModifier}`;
             }
             selectElement.title = titleText;
        }
    }


    function updateSlotActiveState(slotElement, requiredLevel) {
        const playerLevel = parseInt(playerSoulLevelInput.value, 10) || 1;
        const isActive = playerLevel >= requiredLevel;
        slotElement.classList.toggle('inactive-slot', !isActive);
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