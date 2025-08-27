// Visual Analysis Tool JavaScript

let artworkData = null;
let currentArtwork = null;

// Initialize the analysis tool
document.addEventListener('DOMContentLoaded', function() {
    loadArtworkData();
    setupEventListeners();
});

// Load artwork data from JSON
async function loadArtworkData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        artworkData = data.items;
        populateArtworkSelector();
    } catch (error) {
        console.error('Error loading artwork data:', error);
    }
}

// Populate the artwork selector dropdown
function populateArtworkSelector() {
    const selector = document.getElementById('artwork-selector');
    
    artworkData.forEach(artwork => {
        const option = document.createElement('option');
        option.value = artwork.id;
        option.textContent = `${artwork.title} (${artwork.artistOrCulture})`;
        selector.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Artwork selection
    document.getElementById('artwork-selector').addEventListener('change', function() {
        const artworkId = this.value;
        if (artworkId) {
            selectArtwork(artworkId);
        }
    });
    
    // Random artwork selection
    document.getElementById('random-artwork').addEventListener('click', function() {
        if (artworkData && artworkData.length > 0) {
            const randomIndex = Math.floor(Math.random() * artworkData.length);
            const randomArtwork = artworkData[randomIndex];
            document.getElementById('artwork-selector').value = randomArtwork.id;
            selectArtwork(randomArtwork.id);
        }
    });
    
    // Analysis actions
    document.getElementById('save-analysis').addEventListener('click', saveAnalysis);
    document.getElementById('print-analysis').addEventListener('click', printAnalysis);
    document.getElementById('clear-analysis').addEventListener('click', clearAnalysis);
    
    // Auto-save functionality
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', autoSave);
    });
}

// Select and display an artwork
function selectArtwork(artworkId) {
    currentArtwork = artworkData.find(artwork => artwork.id === artworkId);
    
    if (currentArtwork) {
        displayArtwork(currentArtwork);
        showAnalysisFramework();
        loadSavedAnalysis();
    }
}

// Display the selected artwork
function displayArtwork(artwork) {
    document.getElementById('artwork-image').src = artwork.image || 'placeholder.jpg';
    document.getElementById('artwork-image').alt = artwork.title;
    document.getElementById('artwork-title').textContent = artwork.title;
    document.getElementById('artwork-culture').textContent = artwork.artistOrCulture || 'Unknown';
    document.getElementById('artwork-date').textContent = artwork.dateOriginal || 'Unknown';
    document.getElementById('artwork-material').textContent = artwork.mediumOrMaterial || 'Unknown';
    document.getElementById('artwork-location').textContent = artwork.locationOrSite || 'Unknown';
    
    document.getElementById('selected-artwork').style.display = 'block';
}

// Show the analysis framework
function showAnalysisFramework() {
    document.getElementById('analysis-framework').style.display = 'block';
    
    // Scroll to the analysis section
    document.getElementById('analysis-framework').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Auto-save analysis responses
function autoSave() {
    if (currentArtwork) {
        const analysisData = collectAnalysisData();
        localStorage.setItem(`analysis_${currentArtwork.id}`, JSON.stringify(analysisData));
    }
}

// Collect all analysis data from form
function collectAnalysisData() {
    return {
        artworkId: currentArtwork.id,
        artworkTitle: currentArtwork.title,
        timestamp: new Date().toISOString(),
        responses: {
            firstImpression: document.getElementById('first-impression').value,
            attentionFocus: document.getElementById('attention-focus').value,
            visualElements: document.getElementById('visual-elements').value,
            composition: document.getElementById('composition').value,
            materialsTechnique: document.getElementById('materials-technique').value,
            culturalSignificance: document.getElementById('cultural-significance').value,
            aestheticPrinciples: document.getElementById('aesthetic-principles').value,
            socialContext: document.getElementById('social-context').value,
            symbolsMotifs: document.getElementById('symbols-motifs').value,
            symbolicMeaning: document.getElementById('symbolic-meaning').value,
            aestheticValues: document.getElementById('aesthetic-values').value,
            artisticSuccess: document.getElementById('artistic-success').value,
            understandingChange: document.getElementById('understanding-change').value
        }
    };
}

// Load saved analysis for current artwork
function loadSavedAnalysis() {
    if (currentArtwork) {
        const savedData = localStorage.getItem(`analysis_${currentArtwork.id}`);
        if (savedData) {
            const analysisData = JSON.parse(savedData);
            populateAnalysisForm(analysisData.responses);
        } else {
            clearAnalysisForm();
        }
    }
}

// Populate analysis form with saved data
function populateAnalysisForm(responses) {
    Object.keys(responses).forEach(key => {
        const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
        if (element) {
            element.value = responses[key] || '';
        }
    });
}

// Clear analysis form
function clearAnalysisForm() {
    const textareas = document.querySelectorAll('#analysis-framework textarea');
    textareas.forEach(textarea => {
        textarea.value = '';
    });
}

// Save analysis to local storage and download
function saveAnalysis() {
    if (!currentArtwork) {
        alert('Please select an artwork first.');
        return;
    }
    
    const analysisData = collectAnalysisData();
    
    // Save to localStorage
    localStorage.setItem(`analysis_${currentArtwork.id}`, JSON.stringify(analysisData));
    
    // Create downloadable file
    const analysisText = formatAnalysisForExport(analysisData);
    const blob = new Blob([analysisText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_${currentArtwork.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Analysis saved successfully!');
}

// Format analysis for export
function formatAnalysisForExport(analysisData) {
    const { responses } = analysisData;
    
    return `VISUAL ANALYSIS REPORT
` +
           `========================

` +
           `Artwork: ${analysisData.artworkTitle}
` +
           `Date of Analysis: ${new Date(analysisData.timestamp).toLocaleDateString()}

` +
           `STEP 1: INITIAL OBSERVATION
` +
           `----------------------------
` +
           `First Impression:\n${responses.firstImpression || 'No response'}\n\n` +
           `Attention Focus:\n${responses.attentionFocus || 'No response'}\n\n` +
           `STEP 2: FORMAL ANALYSIS
` +
           `-----------------------
` +
           `Visual Elements:\n${responses.visualElements || 'No response'}\n\n` +
           `Composition:\n${responses.composition || 'No response'}\n\n` +
           `Materials & Technique:\n${responses.materialsTechnique || 'No response'}\n\n` +
           `STEP 3: CULTURAL CONTEXT
` +
           `-------------------------
` +
           `Cultural Significance:\n${responses.culturalSignificance || 'No response'}\n\n` +
           `Aesthetic Principles:\n${responses.aestheticPrinciples || 'No response'}\n\n` +
           `Social Context:\n${responses.socialContext || 'No response'}\n\n` +
           `STEP 4: SYMBOLIC ANALYSIS
` +
           `--------------------------
` +
           `Symbols & Motifs:\n${responses.symbolsMotifs || 'No response'}\n\n` +
           `Symbolic Meaning:\n${responses.symbolicMeaning || 'No response'}\n\n` +
           `STEP 5: AESTHETIC EVALUATION
` +
           `-----------------------------
` +
           `Aesthetic Values:\n${responses.aestheticValues || 'No response'}\n\n` +
           `Artistic Success:\n${responses.artisticSuccess || 'No response'}\n\n` +
           `Understanding Change:\n${responses.understandingChange || 'No response'}\n`;
}

// Print analysis
function printAnalysis() {
    if (!currentArtwork) {
        alert('Please select an artwork first.');
        return;
    }
    
    const analysisData = collectAnalysisData();
    const printContent = formatAnalysisForPrint(analysisData);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Visual Analysis - ${analysisData.artworkTitle}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                    h1 { color: #333; border-bottom: 2px solid #333; }
                    h2 { color: #666; margin-top: 30px; }
                    .metadata { background: #f5f5f5; padding: 15px; margin: 20px 0; }
                    .response { margin: 15px 0; }
                    .question { font-weight: bold; color: #444; }
                    .answer { margin: 5px 0 15px 20px; }
                </style>
            </head>
            <body>
                ${printContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Format analysis for printing
function formatAnalysisForPrint(analysisData) {
    const { responses } = analysisData;
    
    return `
        <h1>Visual Analysis Report</h1>
        <div class="metadata">
            <strong>Artwork:</strong> ${analysisData.artworkTitle}<br>
            <strong>Date of Analysis:</strong> ${new Date(analysisData.timestamp).toLocaleDateString()}
        </div>
        
        <h2>Step 1: Initial Observation</h2>
        <div class="response">
            <div class="question">First Impression:</div>
            <div class="answer">${responses.firstImpression || 'No response'}</div>
        </div>
        <div class="response">
            <div class="question">Attention Focus:</div>
            <div class="answer">${responses.attentionFocus || 'No response'}</div>
        </div>
        
        <h2>Step 2: Formal Analysis</h2>
        <div class="response">
            <div class="question">Visual Elements:</div>
            <div class="answer">${responses.visualElements || 'No response'}</div>
        </div>
        <div class="response">
            <div class="question">Composition:</div>
            <div class="answer">${responses.composition || 'No response'}</div>
        </div>
        <div class="response">
            <div class="question">Materials & Technique:</div>
            <div class="answer">${responses.materialsTechnique || 'No response'}</div>
        </div>
        
        <h2>Step 3: Cultural Context</h2>
        <div class="response">
            <div class="question">Cultural Significance:</div>
            <div class="answer">${responses.culturalSignificance || 'No response'}</div>
        </div>
        <div class="response">
            <div class="question">Aesthetic Principles:</div>
            <div class="answer">${responses.aestheticPrinciples || 'No response'}</div>
        </div>
        <div class="response">
            <div class="question">Social Context:</div>
            <div class="answer">${responses.socialContext || 'No response'}</div>
        </div>
        
        <h2>Step 4: Symbolic Analysis</h2>
        <div class="response">
            <div class="question">Symbols & Motifs:</div>
            <div class="answer">${responses.symbolsMotifs || 'No response'}</div>
        </div>
        <div class="response">
            <div class="question">Symbolic Meaning:</div>
            <div class="answer">${responses.symbolicMeaning || 'No response'}</div>
        </div>
        
        <h2>Step 5: Aesthetic Evaluation</h2>
        <div class="response">
            <div class="question">Aesthetic Values:</div>
            <div class="answer">${responses.aestheticValues || 'No response'}</div>
        </div>
        <div class="response">
            <div class="question">Artistic Success:</div>
            <div class="answer">${responses.artisticSuccess || 'No response'}</div>
        </div>
        <div class="response">
            <div class="question">Understanding Change:</div>
            <div class="answer">${responses.understandingChange || 'No response'}</div>
        </div>
    `;
}

// Clear analysis responses
function clearAnalysis() {
    if (confirm('Are you sure you want to clear all analysis responses? This action cannot be undone.')) {
        clearAnalysisForm();
        if (currentArtwork) {
            localStorage.removeItem(`analysis_${currentArtwork.id}`);
        }
    }
}