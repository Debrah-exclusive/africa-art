// Artists page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effects for cards
    const cards = document.querySelectorAll('.content-card, .gender-card, .function-card, .category-card, .region-card, .change-example');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        });
    });

    // Add expand/collapse functionality for detailed sections
    const sectionHeaders = document.querySelectorAll('.artist-section h2');
    sectionHeaders.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            const section = this.parentElement;
            const content = section.querySelector('.content-card, .gender-roles-container, .regional-grid');
            
            if (content) {
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    this.textContent = this.textContent.replace('▶ ', '▼ ');
                } else {
                    content.style.display = 'none';
                    this.textContent = '▶ ' + this.textContent.replace('▼ ', '');
                }
            }
        });
    });

    // Add search functionality
    function addSearchFunctionality() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" id="artist-search" placeholder="Search artists, regions, or specializations..." />
            <button id="clear-search">Clear</button>
        `;
        
        const header = document.querySelector('header');
        header.appendChild(searchContainer);
        
        const searchInput = document.getElementById('artist-search');
        const clearButton = document.getElementById('clear-search');
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const sections = document.querySelectorAll('.artist-section');
            
            sections.forEach(section => {
                const text = section.textContent.toLowerCase();
                if (text.includes(searchTerm) || searchTerm === '') {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
        
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            const sections = document.querySelectorAll('.artist-section');
            sections.forEach(section => {
                section.style.display = 'block';
            });
        });
    }

    // Initialize search functionality
    addSearchFunctionality();

    // Add print functionality
    function addPrintButton() {
        const printButton = document.createElement('button');
        printButton.textContent = 'Print Artist Guide';
        printButton.className = 'print-button';
        printButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #8B4513;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        `;
        
        printButton.addEventListener('click', function() {
            window.print();
        });
        
        document.body.appendChild(printButton);
    }

    // Initialize print functionality
    addPrintButton();

    // Add animation on scroll
    function animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        const animatedElements = document.querySelectorAll('.artist-section, .content-card, .gender-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Initialize scroll animations
    animateOnScroll();

    console.log('Artists page loaded successfully');
});
