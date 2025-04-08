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
            if (parseInt(tierVal) === DEFAULT_TIER) option.selected = true;
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

        // Secondary Positive Modifiers
        const positiveGroup = document.createElement('div');
        positiveGroup.classList.add('modifier-group', 'secondary-modifiers-container');
        const positiveLabel = document.createElement('label');
        positiveLabel.textContent = `Secondary Positive (${slot.secondaryPositiveCount} max)`;
        positiveGroup.appendChild(positiveLabel);
        for (let i = 0; i < slot.secondaryPositiveCount; i++) {
            positiveGroup.appendChild(createModifierGroup(slot, 'secondary', 'positive', i));
        }
        slotDiv.appendChild(positiveGroup);

        // Secondary Negative Modifiers
        const negativeGroup = document.createElement('div');
        negativeGroup.classList.add('modifier-group', 'secondary-modifiers-container');
        const negativeLabel = document.createElement('label');
        negativeLabel.textContent = `Secondary Negative (${slot.secondaryNegativeCount} max)`;
        negativeGroup.appendChild(negativeLabel);
        for (let i = 0; i < slot.secondaryNegativeCount; i++) {
            negativeGroup.appendChild(createModifierGroup(slot, 'secondary', 'negative', i));
        }
        slotDiv.appendChild(negativeGroup);

        return slotDiv;
    }

    function createModifierGroup(slot, type, positivity = null, index = 0) {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('modifier-group');
        if (type === 'secondary') {
            groupDiv.classList.add('secondary-modifier-slot');
        }

        const label = document.createElement('label');
        const selectId = `${slot.id}-${type}-${positivity ? positivity + '-' : ''}${index}`;
        label.setAttribute('for', selectId);
        if (type === 'main') {
             label.textContent = 'Main Modifier:';
             groupDiv.appendChild(label);
        }
        // Secondary labels are handled by the container

        const select = document.createElement('select');
        select.id = selectId;
        select.dataset.modifierType = type;
        if (positivity) select.dataset.positivity = positivity;
        select.classList.add(type === 'main' ? 'main-modifier-select' : 'secondary-modifier-select');

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = `--- Select ${type === 'main' ? 'Main' : 'Secondary'} ---`;
        select.appendChild(defaultOption);

        // Modifier effect display area
        const effectDisplay = document.createElement('div');
        effectDisplay.classList.add('modifier-effect-display');
        effectDisplay.innerHTML = ' '; // Placeholder
        groupDiv.appendChild(effectDisplay);

        populateModifierOptions(select, slot, type, positivity);
        select.addEventListener('change', handleSelectChange);
        groupDiv.appendChild(select);

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
            if (modifier.rarity !== currentRarity) {
                currentRarity = modifier.rarity;
                currentOptgroup = document.createElement('optgroup');
                currentOptgroup.label = `${currentRarity}`;
                selectElement.appendChild(currentOptgroup);
            }

            const option = document.createElement('option');
            option.value = modifier.id;

            const baseDisplayText = getModifierEffectText(modifier, DEFAULT_TIER, DEFAULT_LEVEL);
            const uniqueIndicator = modifier.rarity === 'Unique' ? '⭐ ' : '';
            option.textContent = uniqueIndicator + baseDisplayText;


            option.title = modifier.description || 'No description available.'; // Tooltip
            option.classList.add('modifier-option', `rarity-${modifier.rarity.toLowerCase()}`);
            option.dataset.rarity = modifier.rarity;
            option.dataset.positivity = modifier.positivity;
            option.dataset.name = modifier.name.toLowerCase();
            option.dataset.effectText = baseDisplayText.toLowerCase();

            // Apply filtering
            const matchesFilter = currentFilter === '' ||
                                  option.dataset.name.includes(currentFilter) ||
                                  option.dataset.effectText.includes(currentFilter);

            if (!matchesFilter) {
                option.classList.add('hidden-option');
            }

            if (currentOptgroup) {
                 currentOptgroup.appendChild(option);
            } else {
                 selectElement.appendChild(option); // Fallback
            }
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
             input.value = value;
        }

        updateSlotCalculations(slotElement);
    }

    function handleFilterChange() {
        const filterValue = filterInput.value.toLowerCase();
        const allSelects = document.querySelectorAll('select');

        allSelects.forEach(select => {
            let hasVisibleOptions = false;
            const optgroups = select.querySelectorAll('optgroup');
            const options = select.querySelectorAll('option:not([value=""])');

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
                        hasVisibleOptions = true;
                    }
                });
                 optgroup.style.display = groupHasVisibleOptions ? '' : 'none';
            });
        });
    }

     function handleClearAll() {
        const allSelects = document.querySelectorAll('select.main-modifier-select, select.secondary-modifier-select');
        const allTiers = document.querySelectorAll('select.item-tier-select');
        const allLevels = document.querySelectorAll('input.item-level-input');

        allSelects.forEach(select => {
            select.value = '';
            select.className = select.className.replace(/selected-rarity-\w+/g, '').trim();
            select.className = select.className.replace(/selected-positivity-\w+/g, '').trim();
            select.style.borderColor = '';
            select.title = '';
            const effectDisplay = select.previousElementSibling;
             if (effectDisplay && effectDisplay.classList.contains('modifier-effect-display')) {
                 effectDisplay.innerHTML = ' ';
             }
        });
        allTiers.forEach(select => select.value = DEFAULT_TIER);
        allLevels.forEach(input => input.value = DEFAULT_LEVEL);

        document.querySelectorAll('.equipment-slot').forEach(updateSlotCalculations);

        filterInput.value = '';
        handleFilterChange();
    }

    // --- Calculation & Update Logic ---
    function updateSlotCalculations(slotElement) {
        const tierSelect = slotElement.querySelector('.item-tier-select');
        const levelInput = slotElement.querySelector('.item-level-input');
        const itemTier = parseInt(tierSelect.value, 10) || DEFAULT_TIER;
        const itemLevel = parseInt(levelInput.value, 10) || DEFAULT_LEVEL;

        const selectedModifiers = [];
        const selects = slotElement.querySelectorAll('select.main-modifier-select, select.secondary-modifier-select');

        selects.forEach(select => {
            const selectedOption = select.options[select.selectedIndex];
            const modifierId = selectedOption ? selectedOption.value : '';
            const modifier = modifierId ? getModifierById(modifierId) : null;
            selectedModifiers.push(modifier);

            const effectDisplay = select.previousElementSibling;
            if (effectDisplay && effectDisplay.classList.contains('modifier-effect-display')) {
                effectDisplay.innerHTML = modifier ? getModifierEffectText(modifier, itemTier, itemLevel) : ' ';
            }

            select.className = select.className.replace(/selected-rarity-\w+/g, '').trim();
            select.className = select.className.replace(/selected-positivity-\w+/g, '').trim();
            select.style.borderColor = '';
            select.title = '';

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

        // Calculate and display Required Soul Level
        const requiredLevel = calculateRequiredLevel(selectedModifiers, itemTier, itemLevel);
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