// SiteBuilder Pro - Main Application Logic

// Global State
let currentUser = null;
let currentProject = null;
let selectedElement = null;
let elementCounter = 0;

// Application Data
const templatesData = [
    {"id": 1, "name": "Corporate Clean", "category": "Business", "plan": "free", "preview": "/images/corp-clean.jpg", "colors": ["#1e40af", "#ffffff"], "components": ["header", "hero", "services", "about", "contact"]},
    {"id": 2, "name": "Tech Startup", "category": "Business", "plan": "premium", "preview": "/images/tech-startup.jpg", "colors": ["#7c3aed", "#fbbf24"], "components": ["header", "hero", "features", "pricing", "testimonials", "contact"]},
    {"id": 3, "name": "Fashion Store", "category": "E-commerce", "plan": "premium", "preview": "/images/fashion-store.jpg", "colors": ["#ec4899", "#000000"], "components": ["header", "hero", "products", "gallery", "cart", "checkout"]},
    {"id": 4, "name": "Photographer", "category": "Portfolio", "plan": "free", "preview": "/images/photographer.jpg", "colors": ["#ffffff", "#000000"], "components": ["header", "gallery", "about", "services", "contact"]},
    {"id": 5, "name": "Design Studio", "category": "Portfolio", "plan": "premium", "preview": "/images/design-studio.jpg", "colors": ["#f97316", "#374151"], "components": ["header", "portfolio", "process", "team", "contact"]},
    {"id": 6, "name": "Travel Blog", "category": "Blog", "plan": "free", "preview": "/images/travel-blog.jpg", "colors": ["#0891b2", "#f5f5dc"], "components": ["header", "posts", "sidebar", "about", "contact"]},
    {"id": 7, "name": "Food Blog", "category": "Blog", "plan": "free", "preview": "/images/food-blog.jpg", "colors": ["#dc2626", "#fef7cd"], "components": ["header", "recipes", "categories", "about", "contact"]},
    {"id": 8, "name": "Pizzeria", "category": "Ristoranti", "plan": "free", "preview": "/images/pizzeria.jpg", "colors": ["#dc2626", "#ffffff"], "components": ["header", "menu", "location", "reservations", "contact"]},
    {"id": 9, "name": "Fine Dining", "category": "Ristoranti", "plan": "premium", "preview": "/images/fine-dining.jpg", "colors": ["#000000", "#d4af37"], "components": ["header", "menu", "chef", "reservations", "gallery", "contact"]},
    {"id": 10, "name": "Agency Landing", "category": "Landing", "plan": "free", "preview": "/images/agency-landing.jpg", "colors": ["#3b82f6", "#8b5cf6"], "components": ["header", "hero", "services", "portfolio", "contact"]},
    {"id": 11, "name": "App Download", "category": "Landing", "plan": "premium", "preview": "/images/app-download.jpg", "colors": ["#6366f1", "#ffffff"], "components": ["header", "hero", "features", "screenshots", "download"]},
    {"id": 12, "name": "Legal Firm", "category": "Professional", "plan": "premium", "preview": "/images/legal-firm.jpg", "colors": ["#1f2937", "#ffffff"], "components": ["header", "services", "attorneys", "testimonials", "contact"]},
    {"id": 13, "name": "Medical Practice", "category": "Professional", "plan": "premium", "preview": "/images/medical.jpg", "colors": ["#059669", "#ffffff"], "components": ["header", "services", "doctors", "appointments", "insurance"]},
    {"id": 14, "name": "Wedding Planner", "category": "Events", "plan": "premium", "preview": "/images/wedding.jpg", "colors": ["#ec4899", "#ffffff"], "components": ["header", "services", "portfolio", "testimonials", "contact"]},
    {"id": 15, "name": "Fitness Gym", "category": "Health", "plan": "premium", "preview": "/images/gym.jpg", "colors": ["#ef4444", "#000000"], "components": ["header", "classes", "trainers", "membership", "contact"]}
];

const componentsData = [
    {"type": "text", "icon": "📝", "name": "Testo", "free": true},
    {"type": "image", "icon": "🖼️", "name": "Immagine", "free": true}, 
    {"type": "button", "icon": "🔘", "name": "Bottone", "free": true},
    {"type": "section", "icon": "📄", "name": "Sezione", "free": false},
    {"type": "gallery", "icon": "🖼️", "name": "Galleria", "free": false},
    {"type": "form", "icon": "📋", "name": "Form", "free": false},
    {"type": "video", "icon": "🎬", "name": "Video", "free": false},
    {"type": "map", "icon": "🗺️", "name": "Mappa", "free": false},
    {"type": "social", "icon": "📱", "name": "Social", "free": false},
    {"type": "testimonial", "icon": "💬", "name": "Testimonianze", "free": false}
];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    setupEventListeners();
    
    // Check if user is already logged in
    if (currentUser) {
        showDashboard();
    }
});

// Authentication Functions
function signup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    currentUser = {
        id: Date.now(),
        name: formData.get('name') || formData.get('text'),
        email: formData.get('email'),
        plan: 'free',
        projects: [],
        createdAt: new Date().toISOString()
    };
    
    saveUserData();
    closeModal('signup-modal');
    showDashboard();
    
    // Show welcome message
    setTimeout(() => {
        alert('Benvenuto in SiteBuilder Pro! Inizia creando il tuo primo progetto.');
    }, 500);
}

function login(event) {
    event.preventDefault();
    
    // Simulate login - in real app would authenticate with backend
    currentUser = {
        id: Date.now(),
        name: 'Demo User',
        email: 'demo@example.com',
        plan: 'free',
        projects: JSON.parse(localStorage.getItem('userProjects') || '[]'),
        createdAt: new Date().toISOString()
    };
    
    saveUserData();
    closeModal('login-modal');
    showDashboard();
}

function logout() {
    currentUser = null;
    currentProject = null;
    localStorage.removeItem('currentUser');
    showPage('landing-page');
}

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function showLogin() {
    closeAllModals();
    document.getElementById('login-modal').classList.remove('hidden');
}

function showSignup() {
    closeAllModals();
    document.getElementById('signup-modal').classList.remove('hidden');
}

function showDashboard() {
    showPage('dashboard-page');
    updateDashboard();
}

function showTemplates() {
    showPage('templates-page');
    renderTemplates();
}

function showEditor(templateId = null) {
    showPage('editor-page');
    if (templateId) {
        loadTemplate(templateId);
    }
    setupEditor();
    updateElementCounter();
}

// Dashboard Functions
function updateDashboard() {
    if (!currentUser) return;
    
    // Update user plan badge
    const planBadge = document.getElementById('user-plan-badge');
    planBadge.textContent = currentUser.plan === 'premium' ? 'Piano Premium' : 'Piano Gratuito';
    planBadge.className = `user-plan ${currentUser.plan}`;
    
    // Update stats
    const projects = currentUser.projects || [];
    document.getElementById('sites-count').textContent = projects.length;
    document.getElementById('storage-used').textContent = `${Math.min(projects.length * 50, currentUser.plan === 'premium' ? 10000 : 500)}MB`;
    document.getElementById('elements-used').textContent = currentUser.plan === 'premium' ? '∞' : `${elementCounter}/3`;
    
    // Render projects
    renderProjects();
}

function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const projects = currentUser.projects || [];
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📄</div>
                <h3>Nessun progetto ancora</h3>
                <p>Inizia creando il tuo primo sito web</p>
                <button class="btn btn--primary" onclick="showTemplates()">Scegli un template</button>
            </div>
        `;
    } else {
        projectsGrid.innerHTML = projects.map(project => `
            <div class="project-card">
                <div class="project-preview">${getProjectIcon(project.template)}</div>
                <div class="project-info">
                    <div class="project-name">${project.name}</div>
                    <div class="project-meta">Creato il ${new Date(project.createdAt).toLocaleDateString('it-IT')}</div>
                    <div class="project-actions">
                        <button class="btn btn--primary btn--sm" onclick="editProject(${project.id})">Modifica</button>
                        <button class="btn btn--outline btn--sm" onclick="previewProject(${project.id})">Anteprima</button>
                        <button class="btn btn--outline btn--sm" onclick="deleteProject(${project.id})">Elimina</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function getProjectIcon(templateName) {
    const icons = {
        'Corporate Clean': '🏢',
        'Tech Startup': '🚀',
        'Fashion Store': '👗',
        'Photographer': '📸',
        'Design Studio': '🎨',
        'Travel Blog': '✈️',
        'Food Blog': '🍴',
        'Pizzeria': '🍕',
        'Fine Dining': '🍾',
        'Agency Landing': '💼',
        'App Download': '📱',
        'Legal Firm': '⚖️',
        'Medical Practice': '🏥',
        'Wedding Planner': '💒',
        'Fitness Gym': '💪'
    };
    return icons[templateName] || '📄';
}

// Template Functions
function renderTemplates() {
    const templatesGrid = document.getElementById('templates-grid');
    const userPlan = currentUser ? currentUser.plan : 'free';
    
    templatesGrid.innerHTML = templatesData.map(template => {
        const isLocked = template.plan === 'premium' && userPlan === 'free';
        
        return `
            <div class="template-card ${isLocked ? 'locked' : ''}" onclick="selectTemplate(${template.id})">
                <div class="template-preview">${getProjectIcon(template.name)}</div>
                <div class="template-badge ${template.plan}">${template.plan === 'premium' ? 'PREMIUM' : 'GRATUITO'}</div>
                <div class="template-info">
                    <div class="template-name">${template.name}</div>
                    <div class="template-category">${template.category}</div>
                    ${isLocked ? '<p class="locked-text">🔒 Richiede Piano Premium</p>' : ''}
                </div>
            </div>
        `;
    }).join('');
    
    setupTemplateFilters();
}

function setupTemplateFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            filterTemplates(category);
        });
    });
}

function filterTemplates(category) {
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
        const templateId = parseInt(card.onclick.toString().match(/\d+/)[0]);
        const template = templatesData.find(t => t.id === templateId);
        
        if (category === 'all' || template.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function selectTemplate(templateId) {
    const template = templatesData.find(t => t.id === templateId);
    const userPlan = currentUser ? currentUser.plan : 'free';
    
    if (template.plan === 'premium' && userPlan === 'free') {
        showUpgrade();
        return;
    }
    
    // Create new project
    const project = {
        id: Date.now(),
        name: template.name,
        template: template.name,
        templateId: templateId,
        elements: [],
        createdAt: new Date().toISOString(),
        published: false
    };
    
    if (!currentUser.projects) {
        currentUser.projects = [];
    }
    
    currentUser.projects.push(project);
    currentProject = project;
    
    saveUserData();
    showEditor();
}

// Editor Functions
function setupEditor() {
    renderComponents();
    setupCanvas();
    addWatermarkIfNeeded();
}

function renderComponents() {
    const componentsList = document.getElementById('components-list');
    const userPlan = currentUser ? currentUser.plan : 'free';
    
    componentsList.innerHTML = componentsData.map(component => {
        const isLocked = !component.free && userPlan === 'free';
        const hasReachedLimit = userPlan === 'free' && elementCounter >= 3;
        const isDisabled = isLocked || hasReachedLimit;
        
        return `
            <div class="component-item ${isDisabled ? 'disabled' : ''}" 
                 draggable="${!isDisabled}" 
                 data-type="${component.type}"
                 onclick="${!isDisabled ? `addElement('${component.type}')` : `showUpgrade()`}">
                <span class="component-icon">${component.icon}</span>
                <span class="component-name">${component.name}</span>
                ${isLocked ? '<span style="margin-left: auto;">🔒</span>' : ''}
            </div>
        `;
    }).join('');
}

function setupCanvas() {
    const canvas = document.getElementById('canvas');
    
    // Clear existing content
    canvas.innerHTML = '<div class="drop-zone"><p>Trascina i componenti qui per iniziare</p></div>';
    
    // Load existing elements if editing project
    if (currentProject && currentProject.elements) {
        elementCounter = currentProject.elements.length;
        currentProject.elements.forEach((element, index) => {
            addElementToCanvas(element, index);
        });
    }
    
    updateElementCounter();
}

function addElement(type) {
    const userPlan = currentUser ? currentUser.plan : 'free';
    
    // Check limits for free plan
    if (userPlan === 'free' && elementCounter >= 3) {
        showUpgrade();
        return;
    }
    
    const element = {
        id: Date.now(),
        type: type,
        content: getDefaultContent(type),
        style: getDefaultStyle(type)
    };
    
    // Add to project
    if (!currentProject.elements) {
        currentProject.elements = [];
    }
    
    currentProject.elements.push(element);
    elementCounter++;
    
    // Add to canvas
    addElementToCanvas(element, elementCounter - 1);
    updateElementCounter();
    saveProject();
}

function getDefaultContent(type) {
    const defaults = {
        'text': 'Clicca per modificare il testo',
        'image': 'https://via.placeholder.com/300x200?text=Immagine',
        'button': 'Clicca qui',
        'section': '<h2>Nuova Sezione</h2><p>Contenuto della sezione...</p>',
        'gallery': 'Galleria di immagini',
        'form': 'Modulo di contatto',
        'video': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'map': 'Mappa Google Maps',
        'social': 'Link Social Media',
        'testimonial': '"Ottimo servizio!" - Cliente Soddisfatto'
    };
    
    return defaults[type] || 'Nuovo elemento';
}

function getDefaultStyle(type) {
    return {
        fontSize: '16px',
        color: '#000000',
        backgroundColor: 'transparent',
        padding: '16px',
        margin: '8px',
        borderRadius: '8px'
    };
}

function addElementToCanvas(element, index) {
    const canvas = document.getElementById('canvas');
    const dropZone = canvas.querySelector('.drop-zone');
    
    if (dropZone && elementCounter === 1) {
        dropZone.remove();
    }
    
    const elementDiv = document.createElement('div');
    elementDiv.className = 'canvas-element';
    elementDiv.dataset.elementId = element.id;
    elementDiv.dataset.index = index;
    
    elementDiv.innerHTML = `
        <div class="element-controls">
            <button class="element-control" onclick="editElement(${element.id})">✏️</button>
            <button class="element-control" onclick="deleteElement(${element.id})">🗑️</button>
        </div>
        ${renderElement(element)}
    `;
    
    elementDiv.onclick = () => selectElement(element.id);
    
    canvas.appendChild(elementDiv);
}

function renderElement(element) {
    switch (element.type) {
        case 'text':
            return `<p contenteditable="true" onblur="updateElementContent(${element.id}, this.innerText)">${element.content}</p>`;
        case 'image':
            return `<img src="${element.content}" alt="Immagine" style="max-width: 100%; height: auto;">`;
        case 'button':
            return `<button class="btn btn--primary" onclick="alert('Bottone cliccato!')">${element.content}</button>`;
        case 'section':
            return `<div class="section">${element.content}</div>`;
        case 'gallery':
            return `<div class="gallery">🖼️ ${element.content}</div>`;
        case 'form':
            return `<form class="simple-form">
                <input type="text" placeholder="Nome" class="form-control" style="margin-bottom: 8px;">
                <input type="email" placeholder="Email" class="form-control" style="margin-bottom: 8px;">
                <textarea placeholder="Messaggio" class="form-control" style="margin-bottom: 8px;"></textarea>
                <button type="submit" class="btn btn--primary">Invia</button>
            </form>`;
        case 'video':
            return `<div class="video-container">🎬 Video Player</div>`;
        case 'map':
            return `<div class="map-placeholder">🗺️ ${element.content}</div>`;
        case 'social':
            return `<div class="social-links">📱 ${element.content}</div>`;
        case 'testimonial':
            return `<blockquote class="testimonial-quote">${element.content}</blockquote>`;
        default:
            return `<div>${element.content}</div>`;
    }
}

function selectElement(elementId) {
    // Remove previous selection
    document.querySelectorAll('.canvas-element').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to current element
    const elementDiv = document.querySelector(`[data-element-id="${elementId}"]`);
    if (elementDiv) {
        elementDiv.classList.add('selected');
        selectedElement = elementId;
        showElementProperties(elementId);
    }
}

function showElementProperties(elementId) {
    const element = currentProject.elements.find(e => e.id == elementId);
    if (!element) return;
    
    const propertiesContent = document.getElementById('properties-content');
    
    propertiesContent.innerHTML = `
        <h4>Proprietà ${element.type}</h4>
        <div class="form-group">
            <label class="form-label">Contenuto</label>
            ${element.type === 'image' ? 
                `<input type="url" class="form-control" value="${element.content}" onchange="updateElementProperty(${elementId}, 'content', this.value)">` :
                `<textarea class="form-control" onchange="updateElementProperty(${elementId}, 'content', this.value)">${element.content}</textarea>`
            }
        </div>
        <div class="form-group">
            <label class="form-label">Colore Testo</label>
            <input type="color" class="form-control" value="${element.style.color}" onchange="updateElementStyle(${elementId}, 'color', this.value)">
        </div>
        <div class="form-group">
            <label class="form-label">Sfondo</label>
            <input type="color" class="form-control" value="${element.style.backgroundColor}" onchange="updateElementStyle(${elementId}, 'backgroundColor', this.value)">
        </div>
        <div class="form-group">
            <label class="form-label">Dimensione Testo</label>
            <select class="form-control" onchange="updateElementStyle(${elementId}, 'fontSize', this.value)">
                <option value="12px" ${element.style.fontSize === '12px' ? 'selected' : ''}>Piccolo</option>
                <option value="16px" ${element.style.fontSize === '16px' ? 'selected' : ''}>Normale</option>
                <option value="20px" ${element.style.fontSize === '20px' ? 'selected' : ''}>Grande</option>
                <option value="24px" ${element.style.fontSize === '24px' ? 'selected' : ''}>Molto Grande</option>
            </select>
        </div>
    `;
}

function updateElementProperty(elementId, property, value) {
    const element = currentProject.elements.find(e => e.id == elementId);
    if (!element) return;
    
    element[property] = value;
    
    // Re-render element
    const elementDiv = document.querySelector(`[data-element-id="${elementId}"]`);
    if (elementDiv) {
        const controls = elementDiv.querySelector('.element-controls').outerHTML;
        elementDiv.innerHTML = controls + renderElement(element);
    }
    
    saveProject();
}

function updateElementStyle(elementId, property, value) {
    const element = currentProject.elements.find(e => e.id == elementId);
    if (!element) return;
    
    element.style[property] = value;
    
    // Apply style to element
    const elementDiv = document.querySelector(`[data-element-id="${elementId}"]`);
    if (elementDiv) {
        elementDiv.style[property] = value;
    }
    
    saveProject();
}

function updateElementContent(elementId, content) {
    updateElementProperty(elementId, 'content', content);
}

function deleteElement(elementId) {
    if (!confirm('Sei sicuro di voler eliminare questo elemento?')) return;
    
    // Remove from project
    currentProject.elements = currentProject.elements.filter(e => e.id != elementId);
    elementCounter--;
    
    // Remove from canvas
    const elementDiv = document.querySelector(`[data-element-id="${elementId}"]`);
    if (elementDiv) {
        elementDiv.remove();
    }
    
    // Clear properties panel
    document.getElementById('properties-content').innerHTML = '<p>Seleziona un elemento per modificarne le proprietà</p>';
    
    updateElementCounter();
    saveProject();
}

function updateElementCounter() {
    const counter = document.getElementById('elements-counter');
    const userPlan = currentUser ? currentUser.plan : 'free';
    
    if (userPlan === 'premium') {
        counter.textContent = `${elementCounter} elementi utilizzati`;
    } else {
        counter.textContent = `${elementCounter}/3 elementi utilizzati`;
        
        // Update component availability
        renderComponents();
    }
}

// Project Management
function saveProject() {
    if (!currentProject || !currentUser) return;
    
    // Update project in user's projects
    const projectIndex = currentUser.projects.findIndex(p => p.id === currentProject.id);
    if (projectIndex !== -1) {
        currentUser.projects[projectIndex] = currentProject;
    }
    
    saveUserData();
}

function editProject(projectId) {
    currentProject = currentUser.projects.find(p => p.id === projectId);
    if (currentProject) {
        document.getElementById('current-project-name').textContent = currentProject.name;
        showEditor();
    }
}

function deleteProject(projectId) {
    if (!confirm('Sei sicuro di voler eliminare questo progetto?')) return;
    
    currentUser.projects = currentUser.projects.filter(p => p.id !== projectId);
    saveUserData();
    updateDashboard();
}

function previewProject(projectId) {
    const project = currentUser.projects.find(p => p.id === projectId);
    if (!project) return;
    
    currentProject = project;
    previewSite();
}

// Preview and Publish Functions
function previewSite() {
    if (!currentProject) return;
    
    const previewFrame = document.getElementById('preview-frame');
    let previewHTML = `
        <html>
        <head>
            <title>${currentProject.name}</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; }
                .btn { padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; }
                .btn--primary { background: #1FB8CD; color: white; }
                .form-control { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
                .simple-form { max-width: 400px; }
                .section { margin: 20px 0; padding: 20px; background: #f9f9f9; border-radius: 8px; }
                .testimonial-quote { font-style: italic; border-left: 4px solid #1FB8CD; padding-left: 20px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <h1>${currentProject.name}</h1>
    `;
    
    if (currentProject.elements && currentProject.elements.length > 0) {
        currentProject.elements.forEach(element => {
            previewHTML += `<div style="margin: 20px 0;">${renderElement(element)}</div>`;
        });
    } else {
        previewHTML += '<p>Nessun elemento aggiunto ancora. Torna all\'editor per iniziare a creare!</p>';
    }
    
    // Add watermark for free plan
    if (currentUser && currentUser.plan === 'free') {
        previewHTML += '<div style="position: fixed; bottom: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 8px; border-radius: 4px; font-size: 12px;">Creato con SiteBuilder Pro</div>';
    }
    
    previewHTML += '</body></html>';
    
    previewFrame.innerHTML = previewHTML;
    document.getElementById('preview-modal').classList.remove('hidden');
}

function publishSite() {
    if (!currentProject) {
        alert('Nessun progetto da pubblicare!');
        return;
    }
    
    const userPlan = currentUser ? currentUser.plan : 'free';
    
    currentProject.published = true;
    currentProject.publishedAt = new Date().toISOString();
    
    if (userPlan === 'free') {
        currentProject.url = `${currentProject.name.toLowerCase().replace(/\s+/g, '-')}.sitebuilder.com`;
        alert(`Sito pubblicato con successo!\n\nURL: ${currentProject.url}\n\nNota: Con il piano premium puoi usare un dominio personalizzato.`);
    } else {
        const customDomain = prompt('Inserisci il tuo dominio personalizzato (es. miosito.com):');
        currentProject.url = customDomain || `${currentProject.name.toLowerCase().replace(/\s+/g, '-')}.com`;
        alert(`Sito pubblicato con successo!\n\nURL: ${currentProject.url}`);
    }
    
    saveProject();
}

// Plan Management
function showUpgrade() {
    closeAllModals();
    document.getElementById('upgrade-modal').classList.remove('hidden');
}

function upgradeToPremium() {
    // Simulate payment process
    if (confirm('Simulazione pagamento: Confermi l\'upgrade a Premium per 5€/mese?')) {
        currentUser.plan = 'premium';
        saveUserData();
        
        closeModal('upgrade-modal');
        alert('Congratulazioni! Il tuo account è stato aggiornato a Premium!');
        
        // Update UI
        if (document.getElementById('dashboard-page').classList.contains('active')) {
            updateDashboard();
        } else if (document.getElementById('editor-page').classList.contains('active')) {
            setupEditor();
        } else if (document.getElementById('templates-page').classList.contains('active')) {
            renderTemplates();
        }
    }
}

// Utility Functions
function addWatermarkIfNeeded() {
    const existingWatermark = document.querySelector('.watermark');
    if (existingWatermark) {
        existingWatermark.remove();
    }
    
    if (currentUser && currentUser.plan === 'free') {
        const watermark = document.createElement('div');
        watermark.className = 'watermark';
        watermark.textContent = 'Creato con SiteBuilder Pro';
        document.body.appendChild(watermark);
    }
}

function saveUserData() {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('userProjects', JSON.stringify(currentUser.projects || []));
    }
}

function loadUserData() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        
        // Load projects
        const projects = localStorage.getItem('userProjects');
        if (projects) {
            currentUser.projects = JSON.parse(projects);
        }
    }
}

// Modal Management
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

// Event Listeners
function setupEventListeners() {
    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Device switcher in editor
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('device-btn')) {
            document.querySelectorAll('.device-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            const device = event.target.dataset.device;
            const canvas = document.getElementById('canvas');
            
            // Apply responsive styles
            switch(device) {
                case 'tablet':
                    canvas.style.maxWidth = '768px';
                    break;
                case 'mobile':
                    canvas.style.maxWidth = '375px';
                    break;
                default:
                    canvas.style.maxWidth = '1200px';
            }
        }
    });
    
    // Auto-save in editor
    setInterval(() => {
        if (currentProject && document.getElementById('editor-page').classList.contains('active')) {
            saveProject();
        }
    }, 30000); // Auto-save every 30 seconds
}

// Initialize templates with default content for demo
function loadTemplate(templateId) {
    const template = templatesData.find(t => t.id === templateId);
    if (!template) return;
    
    // Add some default elements based on template
    const defaultElements = [
        {
            id: Date.now() + 1,
            type: 'text',
            content: `Benvenuto in ${template.name}`,
            style: { fontSize: '24px', color: template.colors[0], backgroundColor: 'transparent', padding: '16px', margin: '8px' }
        },
        {
            id: Date.now() + 2,
            type: 'text', 
            content: 'Modifica questo testo per personalizzare il tuo sito web.',
            style: { fontSize: '16px', color: template.colors[1] || '#000000', backgroundColor: 'transparent', padding: '16px', margin: '8px' }
        }
    ];
    
    currentProject.elements = defaultElements;
    elementCounter = defaultElements.length;
    
    document.getElementById('current-project-name').textContent = currentProject.name;
}

// Demo data seeding
function seedDemoData() {
    if (!currentUser) return;
    
    // Add a demo project if user has none
    if (!currentUser.projects || currentUser.projects.length === 0) {
        const demoProject = {
            id: Date.now(),
            name: 'Il Mio Primo Sito',
            template: 'Corporate Clean',
            templateId: 1,
            elements: [
                {
                    id: Date.now() + 1,
                    type: 'text',
                    content: 'Benvenuto nel mio sito web!',
                    style: { fontSize: '24px', color: '#1e40af', backgroundColor: 'transparent', padding: '16px', margin: '8px' }
                }
            ],
            createdAt: new Date().toISOString(),
            published: false
        };
        
        currentUser.projects = [demoProject];
        saveUserData();
    }
}