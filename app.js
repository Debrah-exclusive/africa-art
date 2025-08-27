document.addEventListener('DOMContentLoaded', () => {
    const dataUrl = 'data.json';
    let data = [];
    let currentQuizItem;
    let quizSet = [];
    const colorMap = new Map();
    const colors = [
        '#b7e4c7', '#a2d2ff', '#c9ada7', '#ffc8dd', '#f5e6b7', '#c9e4c5', '#d6a1b9', '#a4c9c7', '#e4c1f9',
        '#c4e4c9', '#b3d3ff', '#d6b8a8', '#ffdbed', '#f2e8c2', '#d5e9d0', '#e0b5c9', '#b3d3d2', '#edc6ff'
    ];
    let colorIndex = 0;

    const timelineDiv = document.getElementById('timeline');
    const qaContainer = document.getElementById('questionContainer');
    const sidebar = document.getElementById('sidebar');
    const sidebarContent = document.getElementById('sidebar-content');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const searchInput = document.getElementById('searchInput');
    const likelyExamToggle = document.getElementById('likelyExamToggle');
    const typeFilter = document.getElementById('typeFilter');
    const centuryFilter = document.getElementById('centuryFilter');
    const newQuestionBtn = document.getElementById('newQuestionBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const feedbackContainer = document.getElementById('feedbackContainer');

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // Load data
    fetch(dataUrl)
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData.items;
            if (timelineDiv) renderTimeline(data);
            if (qaContainer) {
                generateQuestion();
                newQuestionBtn.addEventListener('click', generateQuestion);
                exportCsvBtn.addEventListener('click', exportQuizToCsv);
                document.getElementById('modeToggle').addEventListener('change', generateQuestion);
            }
            // Initialize home page features after data is loaded
            initializeHomePage();
        })
        .catch(error => console.error('Error fetching data:', error));

    // Initialize home page specific features
    function initializeHomePage() {
        if (document.getElementById('artworkCount')) {
            updateArtworkCount();
            populateFeaturedArtworks();
        }
    }

    // Update artwork count in hero section
    function updateArtworkCount() {
        const countElement = document.getElementById('artworkCount');
        if (countElement && data) {
            const count = data.length;
            animateCounter(countElement, count);
        }
    }

    // Animate counter from 0 to target number
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    }

    // Populate featured artworks section
    function populateFeaturedArtworks() {
        const featuredContainer = document.getElementById('featuredArtworks');
        if (!featuredContainer || !data) return;

        // Select 6 featured artworks (mix of different types and periods)
        const featured = selectFeaturedArtworks(data, 6);
        
        featuredContainer.innerHTML = featured.map(item => `
            <div class="featured-item" onclick="showSidebar(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                <div class="featured-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.title}" onerror="this.style.display='none'">` : '🎨'}
                </div>
                <div class="featured-content">
                    <div class="featured-title">${item.title}</div>
                    <div class="featured-culture">${item.artistOrCulture || 'African Art'} • ${item.dateOriginal || 'Historical'}</div>
                    <div class="featured-description">${truncateText(item.notes || 'Explore this significant piece of African artistic heritage.', 100)}</div>
                </div>
            </div>
        `).join('');
    }

    // Select diverse featured artworks
    function selectFeaturedArtworks(data, count) {
        // Filter for items with good descriptions and diverse types
        const candidates = data.filter(item => 
            item.notes && 
            item.notes.length > 50 &&
            item.title &&
            item.title !== 'Unknown'
        );
        
        // Try to get diverse selection
        const featured = [];
        const usedCultures = new Set();
        const usedTypes = new Set();
        
        // First pass: get diverse cultures and types
        for (const item of candidates) {
            if (featured.length >= count) break;
            
            const culture = item.artistOrCulture || 'Unknown';
            const type = item.type || 'artwork';
            
            if (!usedCultures.has(culture) || !usedTypes.has(type)) {
                featured.push(item);
                usedCultures.add(culture);
                usedTypes.add(type);
            }
        }
        
        // Second pass: fill remaining slots
        for (const item of candidates) {
            if (featured.length >= count) break;
            if (!featured.includes(item)) {
                featured.push(item);
            }
        }
        
        return featured.slice(0, count);
    }

    // Truncate text to specified length
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    function getColor(period) {
        if (!period) return '#ccc';
        if (!colorMap.has(period)) {
            colorMap.set(period, colors[colorIndex % colors.length]);
            colorIndex++;
        }
        return colorMap.get(period);
    }

    // --- Timeline Logic ---
    function renderTimeline(items) {
        if (!timelineDiv) return;

        timelineDiv.innerHTML = '';
        const filteredItems = items.filter(item => {
            const searchTerms = searchInput.value.toLowerCase();
            const type = typeFilter.value;
            const century = centuryFilter.value;
            const isLikelyExam = likelyExamToggle.checked;
            const artType = document.getElementById('art-type-filter')?.value || 'all';
            const material = document.getElementById('material-filter')?.value || 'all';
            const region = document.getElementById('region-filter')?.value || 'all';

            const matchesSearch = !searchTerms ||
                item.title.toLowerCase().includes(searchTerms) ||
                (item.artistOrCulture && item.artistOrCulture.toLowerCase().includes(searchTerms)) ||
                (item.keywords && item.keywords.some(k => k.toLowerCase().includes(searchTerms)));

            const matchesType = type === 'all' || item.type === type;
            const matchesCentury = century === 'all' || item.century === century;
            const matchesExam = !isLikelyExam || item.likelyExam;
            
            const matchesArtType = artType === 'all' || (item.keywords && item.keywords.includes(artType));
            
            const matchesMaterial = material === 'all' || (() => {
                if (!item.mediumOrMaterial) return false;
                const itemMaterial = item.mediumOrMaterial.toLowerCase();
                
                switch(material) {
                    case 'wood': return itemMaterial.includes('wood');
                    case 'metal': return itemMaterial.includes('metal') || itemMaterial.includes('bronze') || itemMaterial.includes('brass') || itemMaterial.includes('iron');
                    case 'clay': return itemMaterial.includes('clay') || itemMaterial.includes('terracotta');
                    case 'textiles': return itemMaterial.includes('textile') || itemMaterial.includes('cloth') || itemMaterial.includes('fabric');
                    case 'ivory': return itemMaterial.includes('ivory');
                    case 'stone': return itemMaterial.includes('stone');
                    case 'beads': return itemMaterial.includes('bead');
                    default: return itemMaterial.includes(material);
                }
            })();
            
            const matchesRegion = region === 'all' || (() => {
                if (!item.locationOrSite) return false;
                const location = item.locationOrSite.toLowerCase();
                
                switch(region) {
                    case 'Nigeria': return location.includes('nigeria');
                    case 'Ghana': return location.includes('ghana');
                    case 'Mali': return location.includes('mali');
                    case 'Egypt': return location.includes('egypt');
                    case 'South Africa': return location.includes('south africa');
                    case 'Benin': return location.includes('benin');
                    case 'Ivory Coast': return location.includes('ivory coast') || location.includes('côte d\'ivoire');
                    case 'DRC/Congo': return location.includes('drc') || location.includes('congo');
                    case 'Uganda': return location.includes('uganda');
                    case 'Liberia': return location.includes('liberia');
                    case 'Sierra Leone': return location.includes('sierra leone');
                    default: return item.locationOrSite === region;
                }
            })();

            return matchesSearch && matchesType && matchesCentury && matchesExam && matchesArtType && matchesMaterial && matchesRegion;
        });

        const allYears = filteredItems.flatMap(item => [item.dateNormalized.startYear, item.dateNormalized.endYear]).filter(y => y !== null);
        if (allYears.length === 0) {
             timelineDiv.innerHTML = '<p style="text-align:center; padding-top:100px;">No items found. Adjust your filters.</p>';
             return;
        }
        
        const minYear = Math.min(...allYears);
        const maxYear = Math.max(...allYears);
        const range = maxYear - minYear;
        const timelineWidth = Math.max(2000, range * 2);

        timelineDiv.style.width = `${timelineWidth}px`;
        const centuryYears = new Set();
        filteredItems.forEach(item => {
            const startYear = item.dateNormalized.startYear;
            const endYear = item.dateNormalized.endYear;
            const midpoint = startYear + (endYear - startYear) / 2;
            const leftPosition = ((midpoint - minYear) / range) * timelineWidth;

            // Dot element
            const dot = document.createElement('div');
            dot.classList.add('item-dot');
            if (item.likelyExam) dot.classList.add('likely-exam');
            dot.style.left = `${leftPosition}px`;
            dot.style.backgroundColor = getColor(item.movementOrPeriod);
            dot.style.top = `${Math.random() * (200 - 50) + 50}px`; // Vertical randomness
            dot.style.width = '12px';
            dot.style.height = '12px';
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
            dot.setAttribute('aria-label', `${item.title}, ${item.dateOriginal}`);
            
            // Tooltip
            const tooltip = document.createElement('div');
            tooltip.classList.add('dot-tooltip');
            let dateText = item.dateOriginal;
            if (item.dateNormalized.startYear < 0) {
                dateText = `${Math.abs(item.dateNormalized.startYear)} BCE`;
                if (item.dateNormalized.endYear !== item.dateNormalized.startYear) {
                    dateText += `-${Math.abs(item.dateNormalized.endYear)} BCE`;
                }
            }
            tooltip.innerHTML = `
                ${item.image ? `<img src="${item.image}" alt="Image of ${item.title}" class="tooltip-image" onerror="this.style.display='none'">` : ''}
                <div class="tooltip-title">${item.title}</div>
                ${item.likelyExam ? `<span class="likely-exam-badge">Likely Exam</span>` : ''}
                <div class="tooltip-detail"><strong>Date:</strong> ${dateText}</div>
                <div class="tooltip-detail"><strong>Artist/Culture:</strong> ${item.artistOrCulture || 'Unknown'}</div>
                <div class="tooltip-detail"><strong>Movement:</strong> ${item.movementOrPeriod || 'Unknown'}</div>
                ${item.whyLikelyExam ? `<div class="tooltip-detail"><strong>Why:</strong> ${item.whyLikelyExam}</div>` : ''}
                ${item.cultural_context ? `<div class="tooltip-detail"><strong>Cultural Significance:</strong> ${item.cultural_context.spiritual_significance}</div>` : ''}
                ${item.aesthetic_analysis ? `<div class="tooltip-detail"><strong>Aesthetic Elements:</strong> ${item.aesthetic_analysis.visual_elements}</div>` : ''}
            `;
            dot.appendChild(tooltip);

            dot.addEventListener('click', () => showSidebar(item));
            dot.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') showSidebar(item);
            });
            timelineDiv.appendChild(dot);
            
            // Century grouping
            if (item.dateNormalized.isCentury) {
                centuryYears.add(item.century);
            } else if (item.dateNormalized.endYear !== null) {
                for (let i = item.dateNormalized.startYear; i <= item.dateNormalized.endYear; i++) {
                    const century = getCenturyString(i);
                    centuryYears.add(century);
                }
            }
        });
        
        // Render century lines
        const sortedCenturies = Array.from(centuryYears).sort((a, b) => {
            const yearA = a === 'Unknown' ? -Infinity : parseInt(a.match(/-?\d+/)[0]);
            const yearB = b === 'Unknown' ? -Infinity : parseInt(b.match(/-?\d+/)[0]);
            return yearA - yearB;
        });

        sortedCenturies.forEach(centuryLabel => {
            let startYear;
            if (centuryLabel.includes('BCE')) {
                const match = centuryLabel.match(/(\d+)th-?(\d+)?/);
                const centuryStart = parseInt(match[1]) - 1;
                startYear = -(centuryStart * 100);
            } else if (centuryLabel === 'Unknown') {
                 startYear = minYear - 200; // Place Unknown at the very beginning
            } else {
                 const centuryStart = parseInt(centuryLabel.match(/\d+/)[0]) - 1;
                 startYear = centuryStart * 100;
            }
            
            const leftPosition = ((startYear - minYear) / range) * timelineWidth;
            if (leftPosition > 0) { // Don't render a line for Unknown
                const line = document.createElement('div');
                line.classList.add('century-line');
                line.style.left = `${leftPosition}px`;
                const label = document.createElement('div');
                label.classList.add('century-label');
                label.textContent = centuryLabel;
                line.appendChild(label);
                timelineDiv.appendChild(line);
            }
        });

        populateCenturyFilter(sortedCenturies);
    }
    
    function populateCenturyFilter(centuries) {
        if (!centuryFilter) return;
        const currentSelected = centuryFilter.value;
        centuryFilter.innerHTML = '<option value="all">All</option>';
        centuries.forEach(c => {
            const option = document.createElement('option');
            option.value = c;
            option.textContent = c;
            if (c === currentSelected) {
                option.selected = true;
            }
            centuryFilter.appendChild(option);
        });
    }

    function getCenturyString(year) {
        if (year < 0) {
            const century = Math.ceil((Math.abs(year) + 1) / 100);
            return `${century}th century BCE`;
        }
        const century = Math.ceil(year / 100);
        return `${century}th century`;
    }

    function showSidebar(item) {
        sidebarContent.innerHTML = `
            ${item.image ? `<img src="${item.image}" alt="Image of ${item.title}" onerror="this.style.display='none'">` : ''}
            <h3>${item.title}</h3>
            ${item.likelyExam ? `<span class="likely-exam-badge">Likely Exam</span>` : ''}
            <p><strong class="detail-label">Type:</strong> ${item.type}</p>
            <p><strong class="detail-label">Date:</strong> ${item.dateOriginal}</p>
            ${item.dateNormalized.startYear !== null ? `<p><strong class="detail-label">Normalized Date:</strong> ${formatDateNormalized(item.dateNormalized)}</p>` : ''}
            ${item.century ? `<p><strong class="detail-label">Century:</strong> ${item.century}</p>` : ''}
            ${item.artistOrCulture ? `<p><strong class="detail-label">Artist/Culture:</strong> ${item.artistOrCulture}</p>` : ''}
            ${item.locationOrSite ? `<p><strong class="detail-label">Location:</strong> ${item.locationOrSite}</p>` : ''}
            ${item.mediumOrMaterial ? `<p><strong class="detail-label">Medium:</strong> ${item.mediumOrMaterial}</p>` : ''}
            ${item.movementOrPeriod ? `<p><strong class="detail-label">Movement/Period:</strong> ${item.movementOrPeriod}</p>` : ''}
            <p><strong class="detail-label">Summary:</strong> ${item.notes}</p>
            <p><strong class="detail-label">Keywords:</strong> ${item.keywords.join(', ')}</p>
            ${item.whyLikelyExam ? `<p><strong class="detail-label">Why Likely Exam:</strong> ${item.whyLikelyExam}</p>` : ''}
            ${item.slideRefs ? `<p><strong class="detail-label">Slide References:</strong> ${item.slideRefs.join(', ')}</p>` : ''}
            ${item.cultural_context ? `<div class="cultural-context"><h4>Cultural Context</h4><p><strong>Spiritual Significance:</strong> ${item.cultural_context.spiritual_significance}</p><p><strong>Social Function:</strong> ${item.cultural_context.social_function}</p><p><strong>Historical Context:</strong> ${item.cultural_context.historical_context}</p></div>` : ''}
            ${item.aesthetic_analysis ? `<div class="aesthetic-analysis"><h4>Aesthetic Analysis</h4><p><strong>Visual Elements:</strong> ${item.aesthetic_analysis.visual_elements}</p><p><strong>Composition:</strong> ${item.aesthetic_analysis.composition}</p><p><strong>Style Characteristics:</strong> ${item.aesthetic_analysis.style_characteristics}</p></div>` : ''}
            ${item.educational_notes ? `<div class="educational-notes"><h4>Educational Notes</h4><p><strong>Key Concepts:</strong> ${item.educational_notes.key_concepts}</p><p><strong>Comparative Analysis:</strong> ${item.educational_notes.comparative_analysis}</p><p><strong>Discussion Points:</strong> ${item.educational_notes.discussion_points}</p></div>` : ''}
        `;
        sidebar.classList.add('open');
    }

    function formatDateNormalized(dateObj) {
        let start = dateObj.startYear;
        let end = dateObj.endYear;
        let formatted = '';

        if (start === null) return 'Unknown';

        const formatYear = (y) => {
            if (y < 0) return `${Math.abs(y)} BCE`;
            return `${y} CE`;
        };

        if (start === end) {
            formatted = formatYear(start);
        } else {
            formatted = `${formatYear(start)} - ${formatYear(end)}`;
        }

        return formatted;
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => renderTimeline(data));
        likelyExamToggle.addEventListener('change', () => renderTimeline(data));
        typeFilter.addEventListener('change', () => renderTimeline(data));
        centuryFilter.addEventListener('change', () => renderTimeline(data));
        
        // Enhanced filtering system
        const filterContainer = document.createElement('div');
        filterContainer.className = 'enhanced-filter-container';
        
        // Art type filter
        const artTypeFilter = document.createElement('select');
        artTypeFilter.id = 'art-type-filter';
        artTypeFilter.innerHTML = '<option value="all">All Art Types</option>';
        
        const artTypes = [...new Set(data.map(item => {
            if (item.keywords) {
                return item.keywords.find(keyword => 
                    ['sculpture', 'textiles', 'masks', 'pottery', 'beadwork', 'metalwork', 'architecture', 'performance'].includes(keyword)
                );
            }
            return null;
        }).filter(Boolean))].sort();
        
        artTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            artTypeFilter.appendChild(option);
        });
        
        // Material filter
        const materialFilter = document.createElement('select');
        materialFilter.id = 'material-filter';
        materialFilter.innerHTML = '<option value="all">All Materials</option>';
        
        const materials = [...new Set(data.map(item => {
            if (item.mediumOrMaterial) {
                // Extract primary material
                const material = item.mediumOrMaterial.split(',')[0].trim().toLowerCase();
                if (material.includes('wood')) return 'wood';
                if (material.includes('metal') || material.includes('bronze') || material.includes('brass') || material.includes('iron')) return 'metal';
                if (material.includes('clay') || material.includes('terracotta')) return 'clay';
                if (material.includes('textile') || material.includes('cloth') || material.includes('fabric')) return 'textiles';
                if (material.includes('ivory')) return 'ivory';
                if (material.includes('stone')) return 'stone';
                if (material.includes('bead')) return 'beads';
                return material;
            }
            return null;
        }).filter(Boolean))].sort();
        
        materials.forEach(material => {
            const option = document.createElement('option');
            option.value = material;
            option.textContent = material.charAt(0).toUpperCase() + material.slice(1);
            materialFilter.appendChild(option);
        });
        
        // Region filter
        const regionFilter = document.createElement('select');
        regionFilter.id = 'region-filter';
        regionFilter.innerHTML = '<option value="all">All Regions</option>';
        
        const regions = [...new Set(data.map(item => {
            if (item.locationOrSite) {
                // Extract country/region
                const location = item.locationOrSite.toLowerCase();
                if (location.includes('nigeria')) return 'Nigeria';
                if (location.includes('ghana')) return 'Ghana';
                if (location.includes('mali')) return 'Mali';
                if (location.includes('egypt')) return 'Egypt';
                if (location.includes('south africa')) return 'South Africa';
                if (location.includes('benin')) return 'Benin';
                if (location.includes('ivory coast') || location.includes('côte d\'ivoire')) return 'Ivory Coast';
                if (location.includes('drc') || location.includes('congo')) return 'DRC/Congo';
                if (location.includes('uganda')) return 'Uganda';
                if (location.includes('liberia')) return 'Liberia';
                if (location.includes('sierra leone')) return 'Sierra Leone';
                return item.locationOrSite;
            }
            return null;
        }).filter(Boolean))].sort();
        
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionFilter.appendChild(option);
        });
        
        // Add filter labels and controls
        filterContainer.innerHTML = `
            <div class="filter-group">
                <label for="art-type-filter">Art Type:</label>
                ${artTypeFilter.outerHTML}
            </div>
            <div class="filter-group">
                <label for="material-filter">Material:</label>
                ${materialFilter.outerHTML}
            </div>
            <div class="filter-group">
                <label for="region-filter">Region:</label>
                ${regionFilter.outerHTML}
            </div>
            <button id="reset-filters" class="reset-btn">Reset All Filters</button>
        `;
        
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineContainer) {
            timelineContainer.insertBefore(filterContainer, timelineContainer.firstChild);
        }
        
        // Add event listeners for new filters
        document.getElementById('art-type-filter').addEventListener('change', () => renderTimeline(data));
        document.getElementById('material-filter').addEventListener('change', () => renderTimeline(data));
        document.getElementById('region-filter').addEventListener('change', () => renderTimeline(data));
        document.getElementById('reset-filters').addEventListener('click', () => {
            document.getElementById('art-type-filter').value = 'all';
            document.getElementById('material-filter').value = 'all';
            document.getElementById('region-filter').value = 'all';
            renderTimeline(data);
        });
    }


    // --- Q&A Logic ---
    function generateQuestion() {
        feedbackContainer.style.display = 'none';
        
        const modeToggle = document.getElementById('modeToggle');
        const availableItems = modeToggle.checked ? data.filter(item => item.likelyExam) : data;
        
        if (availableItems.length === 0) {
            document.getElementById('questionText').textContent = 'No questions available with the current settings.';
            document.getElementById('answersContainer').innerHTML = '';
            return;
        }

        const questionTypes = ['date', 'artist', 'medium', 'movement', 'philosophy', 'aesthetics', 'cultural_context', 'symbolism'];
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        currentQuizItem = availableItems[Math.floor(Math.random() * availableItems.length)];
        let question = '';
        let correctAnswer = '';
        let distractors = [];

        switch(questionType) {
            case 'date':
                if (currentQuizItem.dateOriginal) {
                    question = `What is the approximate date or century for the artwork: "${currentQuizItem.title}"?`;
                    correctAnswer = currentQuizItem.dateOriginal;
                    distractors = getRandomDistractors(availableItems, 'dateOriginal', correctAnswer, 3);
                }
                break;
            case 'artist':
                if (currentQuizItem.artistOrCulture) {
                    question = `Which artist or culture created the artwork: "${currentQuizItem.title}"?`;
                    correctAnswer = currentQuizItem.artistOrCulture;
                    distractors = getRandomDistractors(availableItems, 'artistOrCulture', correctAnswer, 3);
                }
                break;
            case 'medium':
                if (currentQuizItem.mediumOrMaterial) {
                    question = `What is the primary medium or material of the artwork: "${currentQuizItem.title}"?`;
                    correctAnswer = currentQuizItem.mediumOrMaterial;
                    distractors = getRandomDistractors(availableItems, 'mediumOrMaterial', correctAnswer, 3);
                }
                break;
            case 'movement':
                if (currentQuizItem.movementOrPeriod) {
                    question = `The artwork "${currentQuizItem.title}" is associated with which movement or period?`;
                    correctAnswer = currentQuizItem.movementOrPeriod;
                    distractors = getRandomDistractors(availableItems, 'movementOrPeriod', correctAnswer, 3);
                }
                break;
            case 'philosophy':
                const philosophyQ = generatePhilosophyQuestion(currentQuizItem);
                if (philosophyQ && philosophyQ.text) {
                    question = philosophyQ.text;
                    correctAnswer = philosophyQ.correct;
                    distractors = philosophyQ.distractors;
                }
                break;
            case 'aesthetics':
                const aestheticsQ = generateAestheticsQuestion(currentQuizItem);
                if (aestheticsQ && aestheticsQ.text) {
                    question = aestheticsQ.text;
                    correctAnswer = aestheticsQ.correct;
                    distractors = aestheticsQ.distractors;
                }
                break;
            case 'cultural_context':
                const contextQ = generateCulturalContextQuestion(currentQuizItem);
                if (contextQ && contextQ.text) {
                    question = contextQ.text;
                    correctAnswer = contextQ.correct;
                    distractors = contextQ.distractors;
                }
                break;
            case 'symbolism':
                const symbolismQ = generateSymbolismQuestion(currentQuizItem);
                if (symbolismQ && symbolismQ.text) {
                    question = symbolismQ.text;
                    correctAnswer = symbolismQ.correct;
                    distractors = symbolismQ.distractors;
                }
                break;
        }

        if (question && correctAnswer && Array.isArray(distractors) && distractors.length > 0) {
            const answers = shuffleArray([correctAnswer, ...distractors]);
            displayQuestion(question, answers, correctAnswer);
            quizSet.push({ question, answers, correctAnswer, item: currentQuizItem });
        } else {
            generateQuestion(); // Retry if a question couldn't be generated
        }
    }

    function getRandomDistractors(items, field, correctValue, num) {
        const distractors = new Set();
        const allValues = items.map(item => item[field]).filter(v => v && v !== correctValue);
        
        while (distractors.size < num && allValues.length > 0) {
            const randomValue = allValues[Math.floor(Math.random() * allValues.length)];
            distractors.add(randomValue);
        }
        return Array.from(distractors);
    }
    
    function displayQuestion(question, answers, correctAnswer) {
        const questionText = document.getElementById('questionText');
        const answersContainer = document.getElementById('answersContainer');
        questionText.textContent = question;
        answersContainer.innerHTML = '';

        answers.forEach(answer => {
            const button = document.createElement('button');
            button.classList.add('answer-option');
            button.textContent = answer;
            button.setAttribute('role', 'radio');
            button.setAttribute('aria-checked', 'false');
            button.addEventListener('click', () => checkAnswer(button, answer, correctAnswer));
            answersContainer.appendChild(button);
        });
    }

    function checkAnswer(selectedButton, selectedAnswer, correctAnswer) {
        const allAnswers = document.querySelectorAll('.answer-option');
        allAnswers.forEach(btn => btn.disabled = true);
        
        const feedback = feedbackContainer;
        const isCorrect = selectedAnswer === correctAnswer;

        if (isCorrect) {
            selectedButton.classList.add('correct');
            feedback.innerHTML = `<h3>Correct! ✅</h3><p>The correct answer is indeed "${correctAnswer}".</p>`;
        } else {
            selectedButton.classList.add('incorrect');
            const correctBtn = Array.from(allAnswers).find(btn => btn.textContent === correctAnswer);
            if (correctBtn) correctBtn.classList.add('correct');
            feedback.innerHTML = `<h3>Incorrect. ❌</h3><p>The correct answer is "${correctAnswer}".</p>`;
        }
        
        const summary = currentQuizItem.notes || 'No further notes available.';
        feedback.innerHTML += `<p>${summary}</p>`;
        
        const link = document.createElement('a');
        link.href = 'index.html';
        link.classList.add('feedback-link');
        link.textContent = 'View on Timeline';
        feedback.appendChild(link);
        
        feedback.style.display = 'block';
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Enhanced question generators for philosophy and aesthetics
    function generatePhilosophyQuestion(item) {
        const philosophyQuestions = [
            {
                text: `According to African aesthetic philosophy, what is the primary purpose of art like "${item.title}"?`,
                correct: "To serve functional, spiritual, and social purposes in the community",
                distractors: [
                    "To create realistic representations of nature",
                    "To display individual artistic expression",
                    "To decorate spaces for visual pleasure only"
                ]
            },
            {
                text: `In African art philosophy, how is beauty typically defined in works like "${item.title}"?`,
                correct: "Beauty comes from functionality, symbolism, and cultural meaning",
                distractors: [
                    "Beauty is based on realistic proportions and naturalism",
                    "Beauty is purely subjective and individual",
                    "Beauty follows European classical standards"
                ]
            },
            {
                text: `What role does rhythm play in African aesthetic philosophy as seen in "${item.title}"?`,
                correct: "Rhythm creates visual harmony and reflects life's natural patterns",
                distractors: [
                    "Rhythm is used only in musical performances",
                    "Rhythm disrupts the visual composition",
                    "Rhythm is considered unimportant in visual arts"
                ]
            }
        ];
        
        return philosophyQuestions[Math.floor(Math.random() * philosophyQuestions.length)];
    }
    
    function generateAestheticsQuestion(item) {
        const aestheticsQuestions = [
            {
                text: `What aesthetic principle is most important in African art like "${item.title}"?`,
                correct: "The integration of form, function, and meaning",
                distractors: [
                    "Perfect anatomical accuracy",
                    "Abstract expressionism",
                    "Photographic realism"
                ]
            },
            {
                text: `How do African artists typically approach proportion in works like "${item.title}"?`,
                correct: "Proportions emphasize spiritual and symbolic importance",
                distractors: [
                    "Proportions must follow mathematical ratios",
                    "Proportions should be anatomically correct",
                    "Proportions are randomly determined"
                ]
            },
            {
                text: `What makes African art aesthetically successful according to traditional criteria?`,
                correct: "When it effectively communicates cultural values and serves its intended purpose",
                distractors: [
                    "When it looks exactly like the subject",
                    "When it follows Western art standards",
                    "When it uses expensive materials"
                ]
            }
        ];
        
        return aestheticsQuestions[Math.floor(Math.random() * aestheticsQuestions.length)];
    }
    
    function generateCulturalContextQuestion(item) {
        const contextQuestions = [
            {
                text: `What is the typical social function of African art like "${item.title}"?`,
                correct: "To strengthen community bonds and transmit cultural knowledge",
                distractors: [
                    "To entertain wealthy patrons",
                    "To compete with other artists",
                    "To sell in international markets"
                ]
            },
            {
                text: `How does African art like "${item.title}" relate to daily life?`,
                correct: "It is integrated into ceremonies, rituals, and everyday activities",
                distractors: [
                    "It is kept separate from daily activities",
                    "It is only displayed in special museums",
                    "It has no connection to daily life"
                ]
            },
            {
                text: `What role do artists play in African communities that create works like "${item.title}"?`,
                correct: "They are respected community members who preserve and transmit cultural knowledge",
                distractors: [
                    "They are isolated individuals working alone",
                    "They are considered less important than other professions",
                    "They only work for foreign collectors"
                ]
            }
        ];
        
        return contextQuestions[Math.floor(Math.random() * contextQuestions.length)];
    }
    
    function generateSymbolismQuestion(item) {
        const symbolismQuestions = [
            {
                text: `What do geometric patterns in African art like "${item.title}" typically represent?`,
                correct: "Cosmic order, spiritual beliefs, and cultural identity",
                distractors: [
                    "Random decorative elements",
                    "Mathematical concepts only",
                    "European influence"
                ]
            },
            {
                text: `How do colors function symbolically in African art like "${item.title}"?`,
                correct: "Colors carry specific cultural meanings related to spirituality and social status",
                distractors: [
                    "Colors are chosen purely for visual appeal",
                    "Colors have no symbolic meaning",
                    "Colors follow Western color theory"
                ]
            },
            {
                text: `What do animal motifs in African art typically symbolize?`,
                correct: "Spiritual power, ancestral connections, and cultural values",
                distractors: [
                    "Literal representations of zoo animals",
                    "Hunting trophies",
                    "Decorative elements with no meaning"
                ]
            }
        ];
        
        return symbolismQuestions[Math.floor(Math.random() * symbolismQuestions.length)];
    }

    function exportQuizToCsv() {
        if (quizSet.length === 0) {
            alert('No questions have been generated yet.');
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Question,Correct Answer,Possible Answers\n";

        quizSet.forEach(quizItem => {
            const question = `"${quizItem.question.replace(/"/g, '""')}"`;
            const correctAnswer = `"${quizItem.correctAnswer.replace(/"/g, '""')}"`;
            const answers = `"${quizItem.answers.join(' | ').replace(/"/g, '""')}"`;
            csvContent += `${question},${correctAnswer},${answers}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "art_quiz.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});