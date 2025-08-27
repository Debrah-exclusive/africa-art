// Load and display glossary content
let glossaryData = null;
let allTerms = [];

async function loadGlossaryContent() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        glossaryData = data.educational_content.glossary;
        prepareTermsData();
        populateGlossary();
        setupEventListeners();
    } catch (error) {
        console.error('Error loading glossary content:', error);
    }
}

function prepareTermsData() {
    allTerms = [];
    Object.entries(glossaryData).forEach(([category, terms]) => {
        Object.entries(terms).forEach(([term, definition]) => {
            allTerms.push({
                term,
                definition,
                category
            });
        });
    });
}

function populateGlossary() {
    if (!glossaryData) return;

    Object.entries(glossaryData).forEach(([category, terms]) => {
        const categoryContainer = document.getElementById(category);
        if (categoryContainer) {
            categoryContainer.innerHTML = '';
            Object.entries(terms).forEach(([term, definition]) => {
                const termElement = createTermElement(term, definition, category);
                categoryContainer.appendChild(termElement);
            });
        }
    });
}

function createTermElement(term, definition, category) {
    const termDiv = document.createElement('div');
    termDiv.className = 'glossary-term';
    termDiv.setAttribute('data-category', category);
    termDiv.innerHTML = `
        <h4 class="term-title">${formatTermTitle(term)}</h4>
        <p class="term-definition">${definition}</p>
    `;
    return termDiv;
}

function formatTermTitle(term) {
    return term.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Category filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleCategoryFilter);
    });
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const allTermElements = document.querySelectorAll('.glossary-term');
    
    allTermElements.forEach(termElement => {
        const termTitle = termElement.querySelector('.term-title').textContent.toLowerCase();
        const termDefinition = termElement.querySelector('.term-definition').textContent.toLowerCase();
        
        if (termTitle.includes(searchTerm) || termDefinition.includes(searchTerm)) {
            termElement.style.display = 'block';
            highlightSearchTerm(termElement, searchTerm);
        } else {
            termElement.style.display = 'none';
        }
    });
    
    // Show/hide sections based on visible terms
    updateSectionVisibility();
}

function highlightSearchTerm(termElement, searchTerm) {
    if (!searchTerm) {
        // Remove existing highlights
        const highlighted = termElement.querySelectorAll('.highlight');
        highlighted.forEach(el => {
            el.outerHTML = el.innerHTML;
        });
        return;
    }
    
    const termTitle = termElement.querySelector('.term-title');
    const termDefinition = termElement.querySelector('.term-definition');
    
    [termTitle, termDefinition].forEach(element => {
        const text = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const highlightedText = text.replace(regex, '<span class="highlight">$1</span>');
        element.innerHTML = highlightedText;
    });
}

function handleCategoryFilter(event) {
    const selectedCategory = event.target.getAttribute('data-category');
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide sections and terms
    const sections = document.querySelectorAll('.glossary-section');
    sections.forEach(section => {
        if (selectedCategory === 'all') {
            section.style.display = 'block';
        } else {
            const sectionCategory = section.querySelector('.glossary-category').id;
            section.style.display = sectionCategory === selectedCategory ? 'block' : 'none';
        }
    });
    
    // Clear search when filtering
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
        // Reset all term visibility
        document.querySelectorAll('.glossary-term').forEach(term => {
            term.style.display = 'block';
        });
    }
}

function updateSectionVisibility() {
    const sections = document.querySelectorAll('.glossary-section');
    sections.forEach(section => {
        const visibleTerms = section.querySelectorAll('.glossary-term[style*="block"], .glossary-term:not([style])');
        section.style.display = visibleTerms.length > 0 ? 'block' : 'none';
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadGlossaryContent);