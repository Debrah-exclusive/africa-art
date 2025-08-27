// Interactive African Art Timeline JavaScript

// Historical periods and cultural movements data
const timelineData = [
    {
        id: 'ancient-egypt-old',
        title: 'Old Kingdom Egypt',
        period: 'ancient',
        region: 'north',
        movement: 'kingdoms',
        startYear: -2649,
        endYear: -2150,
        displayDate: '2649-2150 BCE',
        description: 'The Old Kingdom period of ancient Egypt, featuring the construction of the great pyramids and the development of hieratic art styles.',
        keyFeatures: [
            'Construction of pyramids at Giza',
            'Development of hieroglyphic art',
            'Funerary complex of Djoser at Saqqara',
            'Establishment of artistic conventions',
            'Hierarchical scale in art'
        ],
        significance: 'Established foundational principles of African monumental architecture and artistic representation.',
        examples: ['Pyramid of Khufu', 'Great Sphinx', 'Funerary Complex of Djoser']
    },
    {
        id: 'ancient-egypt-middle',
        title: 'Middle Kingdom Egypt',
        period: 'ancient',
        region: 'north',
        movement: 'kingdoms',
        startYear: -2040,
        endYear: -1640,
        displayDate: '2040-1640 BCE',
        description: 'Period of reunification and cultural renaissance in ancient Egypt.',
        keyFeatures: [
            'Reunification of Upper and Lower Egypt',
            'Development of literature and art',
            'Expansion of trade networks',
            'Refinement of artistic techniques'
        ],
        significance: 'Marked a period of cultural and artistic revival after political fragmentation.',
        examples: ['Funeral Boat of Meket-re', 'Middle Kingdom sculptures']
    },
    {
        id: 'ancient-egypt-new',
        title: 'New Kingdom Egypt',
        period: 'ancient',
        region: 'north',
        movement: 'kingdoms',
        startYear: -1550,
        endYear: -1070,
        displayDate: '1550-1070 BCE',
        description: 'The height of Egyptian power and artistic achievement.',
        keyFeatures: [
            'Greatest military and political expansion',
            'Elaborate tomb paintings',
            'Tutankhamun\'s funerary mask',
            'Temple construction at Karnak and Luxor',
            'International trade and cultural exchange'
        ],
        significance: 'Represents the pinnacle of ancient Egyptian artistic and cultural achievement.',
        examples: ['Tutankhamun\'s Funerary Mask', 'Valley of the Kings tombs']
    },
    {
        id: 'kingdom-kush',
        title: 'Kingdom of Kush',
        period: 'ancient',
        region: 'north',
        movement: 'kingdoms',
        startYear: -1070,
        endYear: 350,
        displayDate: '1070 BCE - 350 CE',
        description: 'Nubian kingdom that ruled both Nubia and Egypt, creating a unique blend of African and Egyptian artistic traditions.',
        keyFeatures: [
            'Ruled Egypt as the 25th Dynasty',
            'Built pyramids at Meroe',
            'Developed distinctive Nubian artistic style',
            'Iron working technology',
            'Trade connections across Africa'
        ],
        significance: 'Demonstrated African political and cultural influence over Egypt and the ancient world.',
        examples: ['Pyramids of Meroe', 'Nubian royal sculptures']
    },
    {
        id: 'aksum-empire',
        title: 'Kingdom of Aksum',
        period: 'ancient',
        region: 'east',
        movement: 'kingdoms',
        startYear: 100,
        endYear: 960,
        displayDate: '100-960 CE',
        description: 'Powerful trading empire in the Horn of Africa, known for its monumental stelae and early adoption of Christianity.',
        keyFeatures: [
            'Monumental stone stelae',
            'Early Christian art and architecture',
            'International trade networks',
            'Coinage and inscriptions',
            'Rock-hewn churches'
        ],
        significance: 'Major center of early Christian art in Africa and international trade.',
        examples: ['Stelae of Aksum', 'Church of St. Mary of Zion']
    },
    {
        id: 'lalibela-churches',
        title: 'Zagwe Dynasty & Lalibela',
        period: 'medieval',
        region: 'east',
        movement: 'christian',
        startYear: 1137,
        endYear: 1270,
        displayDate: '1137-1270 CE',
        description: 'Ethiopian dynasty famous for the rock-hewn churches of Lalibela.',
        keyFeatures: [
            'Rock-hewn church architecture',
            'Christian manuscript illumination',
            'Monolithic church construction',
            'Integration of local and Christian traditions'
        ],
        significance: 'Created some of Africa\'s most remarkable architectural achievements.',
        examples: ['Church of St. George, Lalibela', 'Ethiopian manuscripts']
    },
    {
        id: 'swahili-coast',
        title: 'Swahili Coast Civilization',
        period: 'medieval',
        region: 'east',
        movement: 'islamic',
        startYear: 800,
        endYear: 1500,
        displayDate: '800-1500 CE',
        description: 'Islamic trading cities along the East African coast, known for distinctive architecture and decorative arts.',
        keyFeatures: [
            'Coral stone architecture',
            'Islamic decorative motifs',
            'Pillar tombs',
            'Mosque construction',
            'Kanga textile traditions'
        ],
        significance: 'Demonstrated the integration of Islamic and African artistic traditions.',
        examples: ['Great Mosque of Kilwa', 'Pillar tombs', 'Swahili architecture']
    },
    {
        id: 'great-zimbabwe',
        title: 'Great Zimbabwe',
        period: 'medieval',
        region: 'southern',
        movement: 'kingdoms',
        startYear: 1200,
        endYear: 1450,
        displayDate: '1200-1450 CE',
        description: 'Largest ancient stone construction south of the Sahara, center of a powerful trading empire.',
        keyFeatures: [
            'Massive stone wall construction',
            'No mortar building technique',
            'Zimbabwe bird sculptures',
            'Gold trade networks',
            'Urban planning'
        ],
        significance: 'Largest ancient stone construction in sub-Saharan Africa, demonstrating sophisticated engineering.',
        examples: ['Great Enclosure', 'Hill Complex', 'Zimbabwe Birds']
    },
    {
        id: 'kongo-kingdom',
        title: 'Kingdom of Kongo',
        period: 'medieval',
        region: 'central',
        movement: 'kingdoms',
        startYear: 1390,
        endYear: 1857,
        displayDate: '1390-1857 CE',
        description: 'Powerful Central African kingdom known for its sophisticated political system and distinctive art forms.',
        keyFeatures: [
            'Sophisticated political organization',
            'Nkisi power figures',
            'Raffia textile production',
            'Ivory carving traditions',
            'Christian-influenced art after Portuguese contact'
        ],
        significance: 'One of the most sophisticated pre-colonial African political systems.',
        examples: ['Nkisi figures', 'Kongo textiles', 'Ivory scepters']
    },
    {
        id: 'asante-kingdom',
        title: 'Asante Kingdom',
        period: 'early-modern',
        region: 'west',
        movement: 'kingdoms',
        startYear: 1670,
        endYear: 1957,
        displayDate: '1670-1957 CE',
        description: 'Powerful West African kingdom renowned for its gold work, kente cloth, and royal regalia.',
        keyFeatures: [
            'Golden Stool (Sika Dwa)',
            'Kente cloth weaving',
            'Gold weight sculptures',
            'Royal regalia and ceremonies',
            'Adinkra symbols'
        ],
        significance: 'Exemplified the height of West African royal artistic traditions.',
        examples: ['Golden Stool', 'Kente cloth', 'Gold weights', 'Adinkra cloth']
    },
    {
        id: 'dahomey-kingdom',
        title: 'Kingdom of Dahomey',
        period: 'early-modern',
        region: 'west',
        movement: 'kingdoms',
        startYear: 1600,
        endYear: 1904,
        displayDate: '1600-1904 CE',
        description: 'West African kingdom famous for its military prowess and distinctive royal arts.',
        keyFeatures: [
            'Royal palace decorations',
            'Appliqué banners and flags',
            'Bocio protective figures',
            'Military regalia',
            'Court ceremonies'
        ],
        significance: 'Known for powerful military organization and distinctive royal artistic traditions.',
        examples: ['Appliqué banners', 'Bocio figures', 'Royal regalia']
    },
    {
        id: 'colonial-period',
        title: 'Colonial Period',
        period: 'colonial',
        region: 'all',
        movement: 'colonial-resistance',
        startYear: 1800,
        endYear: 1960,
        displayDate: '1800-1960 CE',
        description: 'Period of European colonization that dramatically impacted African artistic traditions.',
        keyFeatures: [
            'Suppression of traditional practices',
            'Introduction of European artistic styles',
            'Mission school art education',
            'Tourist art development',
            'Cultural resistance through art'
        ],
        significance: 'Marked a major disruption and transformation of African artistic traditions.',
        examples: ['Mission school art', 'Tourist carvings', 'Resistance art']
    },
    {
        id: 'independence-movements',
        title: 'Independence Movements',
        period: 'contemporary',
        region: 'all',
        movement: 'independence',
        startYear: 1950,
        endYear: 1990,
        displayDate: '1950-1990 CE',
        description: 'Period of African independence movements that sparked cultural renaissance and artistic revival.',
        keyFeatures: [
            'Cultural nationalism in art',
            'Revival of traditional forms',
            'Pan-African artistic movements',
            'Establishment of art schools',
            'Government patronage of arts'
        ],
        significance: 'Marked the revival and reinterpretation of African artistic traditions.',
        examples: ['Independence monuments', 'Cultural festivals', 'National art schools']
    },
    {
        id: 'contemporary-art',
        title: 'Contemporary African Art',
        period: 'contemporary',
        region: 'all',
        movement: 'contemporary-art',
        startYear: 1990,
        endYear: 2024,
        displayDate: '1990-Present',
        description: 'Current period of African art characterized by global engagement and diverse artistic expressions.',
        keyFeatures: [
            'International art market participation',
            'Biennales and art fairs',
            'Digital and new media art',
            'Diaspora artistic communities',
            'Contemporary themes and global issues'
        ],
        significance: 'Represents African art\'s full integration into global contemporary art discourse.',
        examples: ['Venice Biennale participation', 'Dakar Biennale', 'Contemporary galleries']
    }
];

// DOM elements
let periodFilter, regionFilter, movementFilter, resetButton, timelineContainer, periodDetails;

// Initialize the timeline
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    renderTimeline();
    setupEventListeners();
});

function initializeElements() {
    periodFilter = document.getElementById('periodFilter');
    regionFilter = document.getElementById('regionFilter');
    movementFilter = document.getElementById('movementFilter');
    resetButton = document.getElementById('resetFilters');
    timelineContainer = document.getElementById('timelineContainer');
    periodDetails = document.getElementById('periodDetails');
}

function setupEventListeners() {
    periodFilter.addEventListener('change', renderTimeline);
    regionFilter.addEventListener('change', renderTimeline);
    movementFilter.addEventListener('change', renderTimeline);
    resetButton.addEventListener('click', resetFilters);
    
    document.getElementById('closeDetails').addEventListener('click', closePeriodDetails);
}

function renderTimeline() {
    const filteredData = filterTimelineData();
    
    if (filteredData.length === 0) {
        timelineContainer.innerHTML = '<div class="no-results">No periods match the selected filters.</div>';
        return;
    }
    
    // Sort by start year
    filteredData.sort((a, b) => a.startYear - b.startYear);
    
    let timelineHTML = '<div class="timeline-line"></div>';
    
    filteredData.forEach((period, index) => {
        const periodElement = createPeriodElement(period, index);
        timelineHTML += periodElement;
    });
    
    timelineContainer.innerHTML = timelineHTML;
    
    // Add click listeners to period cards
    document.querySelectorAll('.timeline-period').forEach(card => {
        card.addEventListener('click', function() {
            const periodId = this.dataset.periodId;
            showPeriodDetails(periodId);
        });
    });
}

function filterTimelineData() {
    const periodValue = periodFilter.value;
    const regionValue = regionFilter.value;
    const movementValue = movementFilter.value;
    
    return timelineData.filter(period => {
        const periodMatch = periodValue === 'all' || period.period === periodValue;
        const regionMatch = regionValue === 'all' || period.region === regionValue || period.region === 'all';
        const movementMatch = movementValue === 'all' || period.movement === movementValue;
        
        return periodMatch && regionMatch && movementMatch;
    });
}

function createPeriodElement(period, index) {
    const isEven = index % 2 === 0;
    const side = isEven ? 'left' : 'right';
    
    return `
        <div class="timeline-period ${side}" data-period-id="${period.id}">
            <div class="timeline-marker"></div>
            <div class="timeline-card">
                <div class="period-header">
                    <h3>${period.title}</h3>
                    <span class="period-date">${period.displayDate}</span>
                </div>
                <div class="period-content">
                    <p>${period.description}</p>
                    <div class="period-tags">
                        <span class="tag period-tag">${period.period}</span>
                        <span class="tag region-tag">${period.region}</span>
                        <span class="tag movement-tag">${period.movement}</span>
                    </div>
                </div>
                <div class="period-footer">
                    <button class="learn-more-btn">Learn More</button>
                </div>
            </div>
        </div>
    `;
}

function showPeriodDetails(periodId) {
    const period = timelineData.find(p => p.id === periodId);
    if (!period) return;
    
    const detailsTitle = document.getElementById('detailsTitle');
    const detailsContent = document.getElementById('detailsContent');
    
    detailsTitle.textContent = period.title;
    
    detailsContent.innerHTML = `
        <div class="details-overview">
            <div class="details-meta">
                <span class="detail-date">${period.displayDate}</span>
                <span class="detail-region">Region: ${period.region}</span>
                <span class="detail-movement">Movement: ${period.movement}</span>
            </div>
            <p class="details-description">${period.description}</p>
        </div>
        
        <div class="details-section">
            <h4>Key Features</h4>
            <ul class="features-list">
                ${period.keyFeatures.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        
        <div class="details-section">
            <h4>Historical Significance</h4>
            <p>${period.significance}</p>
        </div>
        
        <div class="details-section">
            <h4>Notable Examples</h4>
            <ul class="examples-list">
                ${period.examples.map(example => `<li>${example}</li>`).join('')}
            </ul>
        </div>
    `;
    
    periodDetails.style.display = 'block';
    periodDetails.scrollIntoView({ behavior: 'smooth' });
}

function closePeriodDetails() {
    periodDetails.style.display = 'none';
}

function resetFilters() {
    periodFilter.value = 'all';
    regionFilter.value = 'all';
    movementFilter.value = 'all';
    renderTimeline();
    closePeriodDetails();
}

// Add smooth scrolling for timeline navigation
function scrollToTimeline() {
    timelineContainer.scrollIntoView({ behavior: 'smooth' });
}

// Export functionality for educational use
function exportTimelineData() {
    const filteredData = filterTimelineData();
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Title,Period,Region,Movement,Start Year,End Year,Description\n"
        + filteredData.map(period => 
            `"${period.title}","${period.period}","${period.region}","${period.movement}",${period.startYear},${period.endYear},"${period.description}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "african_art_timeline.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add export button functionality if needed
if (document.getElementById('exportTimeline')) {
    document.getElementById('exportTimeline').addEventListener('click', exportTimelineData);
}