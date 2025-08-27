// Load and display educational content
let educationalData = null;

async function loadEducationalContent() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        educationalData = data.educational_content;
        populateEducationPage();
    } catch (error) {
        console.error('Error loading educational content:', error);
    }
}

function populateEducationPage() {
    if (!educationalData) return;

    // Populate Philosophy section
    const philosophyDesc = document.getElementById('philosophy-description');
    const philosophyConcepts = document.getElementById('philosophy-concepts');
    
    if (philosophyDesc) {
        philosophyDesc.textContent = educationalData.philosophy.description;
    }
    
    if (philosophyConcepts) {
        philosophyConcepts.innerHTML = '';
        educationalData.philosophy.key_concepts.forEach(concept => {
            const li = document.createElement('li');
            li.textContent = concept;
            philosophyConcepts.appendChild(li);
        });
    }

    // Populate Aesthetics section
    const aestheticsDesc = document.getElementById('aesthetics-description');
    const aestheticsCriteria = document.getElementById('aesthetics-criteria');
    
    if (aestheticsDesc) {
        aestheticsDesc.textContent = educationalData.aesthetics.description;
    }
    
    if (aestheticsCriteria) {
        aestheticsCriteria.innerHTML = '';
        educationalData.aesthetics.criteria.forEach(criterion => {
            const li = document.createElement('li');
            li.textContent = criterion;
            aestheticsCriteria.appendChild(li);
        });
    }

    // Populate Art Types section
    const artTypesGrid = document.getElementById('art-types-grid');
    if (artTypesGrid) {
        artTypesGrid.innerHTML = '';
        Object.entries(educationalData.art_types).forEach(([type, description]) => {
            const typeCard = document.createElement('div');
            typeCard.className = 'art-type-card';
            typeCard.innerHTML = `
                <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                <p>${description}</p>
            `;
            artTypesGrid.appendChild(typeCard);
        });
    }

    // Populate Materials section
    const traditionalMaterials = document.getElementById('traditional-materials');
    const modernMaterials = document.getElementById('modern-materials');
    
    if (traditionalMaterials) {
        traditionalMaterials.innerHTML = '';
        educationalData.materials.traditional.forEach(material => {
            const tag = document.createElement('span');
            tag.className = 'material-tag';
            tag.textContent = material;
            traditionalMaterials.appendChild(tag);
        });
    }
    
    if (modernMaterials) {
        modernMaterials.innerHTML = '';
        educationalData.materials.modern.forEach(material => {
            const tag = document.createElement('span');
            tag.className = 'material-tag modern';
            tag.textContent = material;
            modernMaterials.appendChild(tag);
        });
    }

    // Populate Artist Roles section
    const traditionalDesc = document.getElementById('traditional-description');
    const traditionalChars = document.getElementById('traditional-characteristics');
    const maleRoles = document.getElementById('male-roles');
    const femaleRoles = document.getElementById('female-roles');
    const contemporaryDesc = document.getElementById('contemporary-description');
    const contemporaryChars = document.getElementById('contemporary-characteristics');
    
    if (traditionalDesc) {
        traditionalDesc.textContent = educationalData.artist_roles.traditional.description;
    }
    
    if (traditionalChars) {
        traditionalChars.innerHTML = '';
        educationalData.artist_roles.traditional.characteristics.forEach(char => {
            const li = document.createElement('li');
            li.textContent = char;
            traditionalChars.appendChild(li);
        });
    }
    
    if (maleRoles) {
        maleRoles.textContent = educationalData.artist_roles.traditional.gender_roles.male_artists;
    }
    
    if (femaleRoles) {
        femaleRoles.textContent = educationalData.artist_roles.traditional.gender_roles.female_artists;
    }
    
    if (contemporaryDesc) {
        contemporaryDesc.textContent = educationalData.artist_roles.contemporary.description;
    }
    
    if (contemporaryChars) {
        contemporaryChars.innerHTML = '';
        educationalData.artist_roles.contemporary.characteristics.forEach(char => {
            const li = document.createElement('li');
            li.textContent = char;
            contemporaryChars.appendChild(li);
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadEducationalContent);