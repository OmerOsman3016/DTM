/**
 * Sudan DTM Integrated Dashboard
 * Main JavaScript File
 */

// Global variables
let currentTab = 'overview';
let mapInstances = {};
let chartInstances = {};
let dataLoaded = false;

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Show loading spinner
    showLoadingSpinner();
    
    // Initialize navigation
    initNavigation();
    
    // Load data
    loadData()
        .then(() => {
            // Initialize all sections
            initOverview();
            initDisplacementMap();
            initReturneesMap();
            initDemographics();
            initTrends();
            initDataTables();
            
            // Hide loading spinner
            hideLoadingSpinner();
            
            // Show the active tab
            showTab(currentTab);
            
            // Mark data as loaded
            dataLoaded = true;
        })
        .catch(error => {
            console.error('Error initializing application:', error);
            hideLoadingSpinner();
            showErrorMessage('Failed to load data. Please try refreshing the page.');
        });
});

/**
 * Initialize navigation tabs
 */
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
        });
    });
    
    // Check for hash in URL
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (document.querySelector(`.nav-tab[data-tab="${hash}"]`)) {
            currentTab = hash;
        }
    }
}

/**
 * Show the selected tab and hide others
 */
function showTab(tabId) {
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Show selected content section
    document.querySelectorAll('.content-section').forEach(section => {
        if (section.id === `${tabId}-section`) {
            section.classList.add('active');
            section.style.display = 'block';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        } else {
            section.classList.remove('active');
            section.style.display = 'none';
        }
    });
    
    // Update URL hash
    window.location.hash = tabId;
    currentTab = tabId;
    
    // Resize any maps or charts in the active tab
    resizeVisualizations();
}

/**
 * Load all required data
 */
async function loadData() {
    updateLoadingProgress(10, 'Loading geographic data...');
    
    try {
        // Load Admin1 boundaries
        const admin1Response = await fetch('./data/Admin1.json');
        const admin1Data = await admin1Response.json();
        window.admin1Data = admin1Data;
        
        updateLoadingProgress(30, 'Loading displacement data...');
        
        // Load displacement data
        const displacementResponse = await fetch('./data/displacement.csv');
        const displacementText = await displacementResponse.text();
        window.displacementData = parseCSV(displacementText);
        
        updateLoadingProgress(50, 'Loading returnees data...');
        
        // Load returnees data
        const returneesResponse = await fetch('./data/returnees.csv');
        const returneesText = await returneesResponse.text();
        window.returneesData = parseCSV(returneesText);
        
        updateLoadingProgress(70, 'Loading demographic data...');
        
        // Load demographic data
        const demographicsResponse = await fetch('./data/demographics.csv');
        const demographicsText = await demographicsResponse.text();
        window.demographicsData = parseCSV(demographicsText);
        
        updateLoadingProgress(90, 'Preparing visualization...');
        
        // Process and prepare data for visualization
        prepareData();
        
        updateLoadingProgress(100, 'Ready!');
        
        return true;
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

/**
 * Parse CSV data into array of objects
 */
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(value => value.trim());
        const entry = {};
        
        headers.forEach((header, index) => {
            entry[header] = values[index];
        });
        
        result.push(entry);
    }
    
    return result;
}

/**
 * Prepare data for visualization
 */
function prepareData() {
    // This function would process the loaded data into formats needed for visualization
    // For now, we'll use placeholder data
    
    // Prepare summary statistics
    window.summaryStats = {
        totalIDPs: '11,301,340',
        idpChange: '-1.7%',
        returnees: '396,738',
        returneeChange: '0.0%',
        borderCrossings: '3,934,086',
        borderChange: '0.8%',
        migrantsAffected: '400,000',
        migrantsChange: '-2.1%',
        locationsCovered: '10,285',
        locationsChange: '1.2%'
    };
}

/**
 * Initialize the overview section
 */
function initOverview() {
    // Update summary statistics
    document.getElementById('idp-value').textContent = window.summaryStats.totalIDPs;
    document.getElementById('idp-change').textContent = window.summaryStats.idpChange;
    document.getElementById('returnee-value').textContent = window.summaryStats.returnees;
    document.getElementById('returnee-change').textContent = window.summaryStats.returneeChange;
    document.getElementById('border-value').textContent = window.summaryStats.borderCrossings;
    document.getElementById('border-change').textContent = window.summaryStats.borderChange;
    document.getElementById('migrants-value').textContent = window.summaryStats.migrantsAffected;
    document.getElementById('migrants-change').textContent = window.summaryStats.migrantsChange;
    document.getElementById('locations-value').textContent = window.summaryStats.locationsCovered;
    document.getElementById('locations-change').textContent = window.summaryStats.locationsChange;
    
    // Set appropriate classes for change indicators
    setChangeIndicatorClasses();
}

/**
 * Set appropriate classes for change indicators
 */
function setChangeIndicatorClasses() {
    const changeElements = document.querySelectorAll('.change');
    
    changeElements.forEach(element => {
        const changeText = element.textContent;
        element.classList.remove('positive', 'negative', 'neutral');
        
        if (changeText.includes('+') || changeText.includes('↑')) {
            element.classList.add('positive');
        } else if (changeText.includes('-') || changeText.includes('↓')) {
            element.classList.add('negative');
        } else {
            element.classList.add('neutral');
        }
    });
}

/**
 * Initialize the displacement map section
 */
function initDisplacementMap() {
    // This would initialize the Leaflet map for displacement
    // For now, we'll use a placeholder
    console.log('Displacement map initialized');
}

/**
 * Initialize the returnees map section
 */
function initReturneesMap() {
    // This would initialize the Leaflet map for returnees
    // For now, we'll use a placeholder
    console.log('Returnees map initialized');
}

/**
 * Initialize the demographics section
 */
function initDemographics() {
    // This would initialize the population pyramid chart
    // For now, we'll use a placeholder
    console.log('Demographics section initialized');
}

/**
 * Initialize the trends section
 */
function initTrends() {
    // This would initialize the trends charts
    // For now, we'll use a placeholder
    console.log('Trends section initialized');
}

/**
 * Initialize the data tables section
 */
function initDataTables() {
    // This would initialize the data tables
    // For now, we'll use a placeholder
    console.log('Data tables initialized');
}

/**
 * Resize maps and charts when tab changes or window resizes
 */
function resizeVisualizations() {
    // Resize any active maps or charts
    if (currentTab === 'displacement-map' && mapInstances.displacement) {
        mapInstances.displacement.invalidateSize();
    }
    
    if (currentTab === 'returnees-map' && mapInstances.returnees) {
        mapInstances.returnees.invalidateSize();
    }
    
    // Resize charts if needed
    Object.values(chartInstances).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            chart.resize();
        }
    });
}

/**
 * Show loading spinner
 */
function showLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

/**
 * Hide loading spinner
 */
function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.opacity = '0';
        setTimeout(() => {
            spinner.style.display = 'none';
        }, 500);
    }
}

/**
 * Update loading progress
 */
function updateLoadingProgress(percent, message) {
    const progressBar = document.querySelector('.loading-progress-bar');
    const loadingText = document.querySelector('.loading-text');
    
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
    }
    
    if (loadingText && message) {
        loadingText.textContent = message;
    }
}

/**
 * Show error message
 */
function showErrorMessage(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.textContent = message;
    
    document.body.appendChild(errorContainer);
    
    setTimeout(() => {
        errorContainer.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        errorContainer.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(errorContainer);
        }, 500);
    }, 5000);
}

// Handle window resize
window.addEventListener('resize', function() {
    if (dataLoaded) {
        resizeVisualizations();
    }
});
