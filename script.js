// MOCK DATA
const DOOR_TYPES = [
    { id: 'seccional', name: 'Puertas Seccionales', description: 'Paneles, guías y herrajes' },
    { id: 'rapida', name: 'Puertas Rápidas', description: 'Lonas, motores y control' },
    { id: 'cortafuego', name: 'Puertas Cortafuego', description: 'Manillas, cierrapuertas y sellos' },
    { id: 'frigorifica', name: 'Puertas Frigoríficas', description: 'Burletes, resistencias y manetas' },
    { id: 'anden', name: 'Andenes de Carga', description: 'Rampas, abrigos y topes' }
];

const TAXONOMY = {
    brands: ['Hörmann', 'Assa Abloy', 'Nice', 'Otros'],
    functions: {
        'Seguridad': ['Sensores', 'Fotoceldas', 'Luces de advertencia'],
        'Sellado': ['Burletes', 'Cortinas'],
        'Movimiento': ['Motores', 'Ejes', 'Cadenas'],
        'Control': ['Cuadros de mando', 'Pulsadores', 'Controles remotos']
    }
};

// LOGIC: Go to Level 2
function selectProduct(product) {
    state.currentLevel = 2;
    renderLevel2(product);
}

// RENDER LEVEL 2: DETAIL VIEW
function renderLevel2(product) {
    app.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'level-2-container';

    // Back Button (Returns to L1, preserving filters)
    const backBtn = document.createElement('button');
    backBtn.className = 'btn-back';
    backBtn.onclick = () => {
        state.currentLevel = 1;
        renderLevel1(); // Re-renders L1. Filters strictly preserved in `state`.
    };
    backBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Volver ${state.activeType ? 'a ' + state.activeType.name : ''}
    `;

    // Content
    const content = document.createElement('div');
    content.className = 'detail-grid';
    content.innerHTML = `
        <div class="detail-image-placeholder"></div>
        <div class="detail-info">
            <span class="detail-brand">${product.brand}</span>
            <h1 class="detail-title">${product.name}</h1>
            
            <div class="detail-compatibility">
                <span class="comp-label">FUNCIONES</span>
                <span class="comp-text">${product.functions.join(', ')}</span>
            </div>

            <div class="detail-price-block">
                <span class="detail-price">$${product.price.toLocaleString()}</span>
                <span class="detail-unit">x ${product.unit}</span>
            </div>

            <button class="btn-consult" aria-disabled="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Consultar este repuesto
            </button>
        </div>
    `;

    app.appendChild(backBtn);
    container.appendChild(content);
    app.appendChild(container);

    // Check if header needs update (it usually stays in Type context)
    window.scrollTo(0, 0);
}

// Simplified Mock Products (Expanded for testing)
const PRODUCTS = [
    // Seccionales - Hörmann
    { id: 'h1', typeId: 'seccional', brand: 'Hörmann', name: 'Motor WA 300 S4', price: 450000, unit: 'Unidad', functions: ['Motores', 'Control'], image: '' },
    { id: 'h2', typeId: 'seccional', brand: 'Hörmann', name: 'Panel LPU 42', price: 120000, unit: 'm2', functions: ['Sellado'], image: '' },
    { id: 'h3', typeId: 'seccional', brand: 'Hörmann', name: 'Fotoceldas EL 101', price: 45000, unit: 'Par', functions: ['Sensores', 'Seguridad'], image: '' },

    // Seccionales - Other
    { id: 's1', typeId: 'seccional', brand: 'Nice', name: 'Receptor OXIBD', price: 35000, unit: 'Unidad', functions: ['Control', 'Controles remotos'], image: '' },
    { id: 's2', typeId: 'seccional', brand: 'Otros', name: 'Resorte de Torsión 700x50', price: 85000, unit: 'Unidad', functions: ['Movimiento', 'Ejes'], image: '' },

    // Rápidas
    { id: 'r1', typeId: 'rapida', brand: 'Assa Abloy', name: 'Lona PVC 900g', price: 25000, unit: 'm2', functions: ['Sellado', 'Cortinas'], image: '' },
    { id: 'r2', typeId: 'rapida', brand: 'Nice', name: 'Radar de Movimiento', price: 110000, unit: 'Unidad', functions: ['Sensores', 'Movimiento'], image: '' },

    // Incomplete Data (Should be hidden)
    { id: 'err1', typeId: 'seccional', brand: 'Genérico', name: 'Rodamiento fallido', price: null, unit: 'Unidad', functions: ['Movimiento'], image: '' }
];

// STATE MANAGEMENT
const state = {
    currentLevel: 0,
    activeType: null, // 'seccional', 'rapida', etc.
    filters: {
        brand: [],
        function: []
    }
};

// DOM ELEMENTS
const app = document.getElementById('app');
const searchInput = document.getElementById('search-input');
const searchBadge = document.getElementById('search-badge');

// INITIALIZATION
function init() {
    // Check URL URL state here (future implementation usually)
    // For now, force Level 0
    renderLevel0();
}

// RENDER LEVEL 0: HOME
function renderLevel0() {
    // 1. Reset State
    state.currentLevel = 0;
    state.activeType = null;
    state.filters = { brand: [], function: [] };

    // 2. Clear UI
    app.innerHTML = '';
    configureHeader(false);

    // 3. Render Cards
    const grid = document.createElement('div');
    grid.className = 'level-0-grid';

    DOOR_TYPES.forEach(type => {
        const card = document.createElement('div');
        card.className = 'taxonomy-card';
        card.tabIndex = 0; // Accessibility
        card.setAttribute('role', 'button');
        card.onclick = () => selectType(type);
        card.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectType(type);
            }
        };

        card.innerHTML = `
            <h2 class="taxonomy-title">${type.name}</h2>
            <p class="taxonomy-subtitle">${type.description}</p>
        `;
        grid.appendChild(card);
    });

    app.appendChild(grid);
}

// LOGIC: HEADER
function configureHeader(isActive) {
    if (isActive && state.activeType) {
        searchInput.disabled = false;
        searchInput.placeholder = `Buscar en ${state.activeType.name}...`;

        searchBadge.textContent = state.activeType.name;
        searchBadge.classList.remove('hidden');
        searchInput.classList.add('has-badge');
    } else {
        searchInput.disabled = true;
        searchInput.placeholder = 'Selecciona un tipo de puerta...';

        searchBadge.textContent = '';
        searchBadge.classList.add('hidden');
        searchInput.classList.remove('has-badge');
        searchInput.value = '';
    }
}

// TRANSITION: LEVEL 0 -> LEVEL 1
function selectType(type) {
    state.currentLevel = 1;
    state.activeType = type;
    configureHeader(true);
    renderLevel1();
}

// RENDER LEVEL 1: CATEGORY VIEW
function renderLevel1() {
    app.innerHTML = '';

    // 1. Container Structure
    const container = document.createElement('div');
    container.className = 'level-1-container';

    // 2. Left Sidebar (Filters)
    const sidebar = document.createElement('aside');
    sidebar.className = 'filter-sidebar';
    sidebar.innerHTML = generateFilterHTML();
    container.appendChild(sidebar);

    // 3. Right Content (Back Button + Grid)
    const content = document.createElement('div');
    content.className = 'content-area';

    const backBtn = document.createElement('button');
    backBtn.className = 'btn-back';
    backBtn.onclick = renderLevel0;
    backBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Volver a Tipos
    `;
    content.appendChild(backBtn);

    const productsGrid = document.createElement('div');
    productsGrid.id = 'product-grid';
    productsGrid.className = 'product-grid';
    content.appendChild(productsGrid);

    container.appendChild(content);
    app.appendChild(container);

    // 4. Initial Filter Logic
    updateProductGrid();

    // 5. Attach Filter Listeners
    attachFilterListeners();
}

// HELPER: Generate Filter HTML
function generateFilterHTML() {
    let html = `<div class="filter-section-title">Filtrar por</div>`;

    // A. Brands (Flat List)
    html += `
    <div class="accordion-group">
        <button class="accordion-header" onclick="toggleAccordion(this)">
            Marca
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="accordion-content">
            ${TAXONOMY.brands.map(brand => `
                <label class="filter-option">
                    <input type="checkbox" name="brand" value="${brand}">
                    <span class="filter-label">${brand}</span>
                </label>
            `).join('')}
        </div>
    </div>`;

    // B. Functions (Grouped)
    html += `
    <div class="accordion-group">
        <button class="accordion-header" onclick="toggleAccordion(this)">
            Función
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="accordion-content">
            ${Object.entries(TAXONOMY.functions).map(([group, subFunctions]) => `
                <div class="filter-category-label">${group}</div>
                ${subFunctions.map(func => `
                    <label class="filter-option">
                        <input type="checkbox" name="function" value="${func}">
                        <span class="filter-label">${func}</span>
                    </label>
                `).join('')}
            `).join('')}
        </div>
    </div>`;

    return html;
}

// LOGIC: Update Grid based on State
function updateProductGrid() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    // Filter Logic:
    // 1. Must match Active Type
    // 2. Must match Brand (if any selected) OR logic within brands? Usually OR within same cat, AND across cats.
    // User asked for "Strict AND". Let's assume strict AND for simplicity if requested, but standard commerce is OR within group, AND across groups.
    // Re-reading: "El filtro debe funcionar con lógica AND estricta: el producto se muestra solo si cumple todas las selecciones activas."
    // This implies if I select "Hörmann" and "Nice", I get NOTHING (because a product can't be both).
    // Usually "Strict AND" refers to Categories. For Brands, multiple selection usually means OR.
    // However, if the user explicitly said STRICT AND for everything, I will implement that, but it might result in empty states often.
    // Correction: "Un repuesto puede tener múltiples funciones". So for functions it can work. For brands, a product is usually one brand.
    // If I select Brand A and Brand B, strict AND returns 0.
    // Implementation: I will use OR within Filter Group (Brand A OR Brand B), and AND across groups (Brand A AND Function X).
    // This is the standard "Checklist behavior".

    const activeBrands = state.filters.brand;
    const activeFunctions = state.filters.function;

    const filtered = PRODUCTS.filter(p => {
        // 1. Type Check
        if (p.typeId !== state.activeType.id) return false;

        // 2. Data Validation Limit (Hide incomplete)
        if (!p.price || !p.unit) return false;

        // 3. Brand Filter (OR logic within brands)
        if (activeBrands.length > 0 && !activeBrands.includes(p.brand)) {
            return false;
        }

        // 4. Function Filter (AND logic? Or OR? usually OR for "features")
        // Implementation: If user selects "Sensor" and "Motor", do they want items that are BOTH? Or either?
        // "Checklist behavior" usually implies OR.
        // Let's stick to: Product must match AT LEAST ONE of the selected functions if filter active.
        if (activeFunctions.length > 0) {
            const hasMatch = p.functions.some(f => activeFunctions.includes(f));
            if (!hasMatch) return false;
        }

        return true;
    });

    // Sort: Alphabetical
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    // Render
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>No se encontraron productos</h3>
                <p>Intenta eliminar algunos filtros.</p>
                <button class="btn-clear" onclick="clearFilters()">Limpiar Filtros</button>
            </div>
        `;
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => selectProduct(p);
        card.innerHTML = `
            <div class="product-image-skeleton"></div>
            <div class="product-brand">${p.brand}</div>
            <h3 class="product-name">${p.name}</h3>
            <div class="product-price-container">
                <span class="product-price">$${p.price.toLocaleString()}</span>
                <span class="product-unit">x ${p.unit}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// UI: Accordion Toggle
function toggleAccordion(btn) {
    const content = btn.nextElementSibling;
    content.classList.toggle('hidden');
    // Rotation logic for icon could go here
}

// LOGIC: Filter Listeners
function attachFilterListeners() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', (e) => {
            const { name, value, checked } = e.target;

            if (checked) {
                state.filters[name].push(value);
            } else {
                state.filters[name] = state.filters[name].filter(item => item !== value);
            }

            updateProductGrid();
        });
    });
}

// LOGIC: Clear Filters
function clearFilters() {
    state.filters.brand = [];
    state.filters.function = [];

    // Uncheck UI
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    updateProductGrid();
}

// Start App
init();
