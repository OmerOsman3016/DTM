/**
 * Sudan DTM Integrated Dashboard
 * Maps Visualization JavaScript
 */

// Global map variables
let displacementMap;
let returneesMap;
let stateGeoJSON;
let displacementData;
let returneeData;

/**
 * Initialize maps when data is loaded
 */
function initMaps(admin1Data, displacementStats, returneeStats) {
    stateGeoJSON = admin1Data;
    displacementData = displacementStats;
    returneeData = returneeStats;
    
    // Initialize displacement map
    initDisplacementMap();
    
    // Initialize returnees map
    initReturneesMap();
    
    // Initialize displacement proportion map
    initDisplacementProportionMap();
}

/**
 * Initialize the IDP distribution map
 */
function initDisplacementMap() {
    // Create map if container exists
    const mapContainer = document.getElementById('displacement-map');
    if (!mapContainer) return;
    
    // Initialize Leaflet map
    displacementMap = L.map('displacement-map', {
        center: [15.5, 30.5], // Sudan center coordinates
        zoom: 6,
        minZoom: 5,
        maxZoom: 10,
        zoomControl: true
    });
    
    // Add base map layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(displacementMap);
    
    // Add state boundaries with IDP data
    addStateLayerWithData(displacementMap, stateGeoJSON, displacementData, 'idps');
    
    // Add search control
    addSearchControl(displacementMap);
    
    // Add legend
    addDisplacementLegend(displacementMap);
    
    // Store map instance
    mapInstances.displacement = displacementMap;
}

/**
 * Initialize the returnees map
 */
function initReturneesMap() {
    // Create map if container exists
    const mapContainer = document.getElementById('returnees-map');
    if (!mapContainer) return;
    
    // Initialize Leaflet map
    returneesMap = L.map('returnees-map', {
        center: [15.5, 30.5], // Sudan center coordinates
        zoom: 6,
        minZoom: 5,
        maxZoom: 10,
        zoomControl: true
    });
    
    // Add base map layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(returneesMap);
    
    // Add state boundaries with returnee data
    addStateLayerWithData(returneesMap, stateGeoJSON, returneeData, 'returnees');
    
    // Add search control
    addSearchControl(returneesMap);
    
    // Add legend
    addReturneeMapLegend(returneesMap);
    
    // Store map instance
    mapInstances.returnees = returneesMap;
}

/**
 * Initialize the displacement proportion map
 */
function initDisplacementProportionMap() {
    // Create map if container exists
    const mapContainer = document.getElementById('proportion-map');
    if (!mapContainer) return;
    
    // Initialize Leaflet map
    proportionMap = L.map('proportion-map', {
        center: [15.5, 30.5], // Sudan center coordinates
        zoom: 6,
        minZoom: 5,
        maxZoom: 10,
        zoomControl: true
    });
    
    // Add base map layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(proportionMap);
    
    // Add state boundaries with proportion data
    addProportionLayer(proportionMap, stateGeoJSON, displacementData);
    
    // Add search control
    addSearchControl(proportionMap);
    
    // Add legend
    addProportionLegend(proportionMap);
    
    // Store map instance
    mapInstances.proportion = proportionMap;
}

/**
 * Add state layer with data visualization
 */
function addStateLayerWithData(map, geoJSON, data, dataType) {
    // Create a GeoJSON layer with custom styling based on data
    const stateLayer = L.geoJSON(geoJSON, {
        style: function(feature) {
            const stateName = feature.properties.name;
            const stateData = data.find(d => d.state === stateName);
            const value = stateData ? parseInt(stateData.value.replace(/,/g, '')) : 0;
            
            return {
                fillColor: getColorByValue(value, dataType),
                weight: 1,
                opacity: 1,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            };
        },
        onEachFeature: function(feature, layer) {
            const stateName = feature.properties.name;
            const stateData = data.find(d => d.state === stateName);
            const value = stateData ? stateData.value : 'No data';
            const percentage = stateData ? stateData.percentage : 'N/A';
            
            // Add popup
            layer.bindPopup(`
                <div class="map-popup">
                    <h3>${stateName}</h3>
                    <p><strong>${dataType === 'idps' ? 'IDPs' : 'Returnees'}:</strong> ${value}</p>
                    <p><strong>Percentage of Population:</strong> ${percentage}</p>
                </div>
            `);
            
            // Add hover effect
            layer.on({
                mouseover: function(e) {
                    const layer = e.target;
                    layer.setStyle({
                        weight: 3,
                        color: '#666',
                        dashArray: '',
                        fillOpacity: 0.9
                    });
                    layer.bringToFront();
                },
                mouseout: function(e) {
                    stateLayer.resetStyle(e.target);
                },
                click: function(e) {
                    map.fitBounds(e.target.getBounds());
                }
            });
        }
    }).addTo(map);
    
    return stateLayer;
}

/**
 * Add proportion layer with pie charts
 */
function addProportionLayer(map, geoJSON, data) {
    // Create a GeoJSON layer for state boundaries
    const stateLayer = L.geoJSON(geoJSON, {
        style: function(feature) {
            return {
                fillColor: 'transparent',
                weight: 1,
                opacity: 1,
                color: '#666',
                dashArray: '',
                fillOpacity: 0
            };
        }
    }).addTo(map);
    
    // Add pie charts for each state
    geoJSON.features.forEach(feature => {
        const stateName = feature.properties.name;
        const stateData = data.find(d => d.state === stateName);
        
        if (stateData) {
            const center = getCenterOfPolygon(feature.geometry);
            const displaced = parseInt(stateData.value.replace(/,/g, ''));
            const total = parseInt(stateData.total_population.replace(/,/g, ''));
            const remaining = total - displaced;
            
            // Create pie chart marker
            const pieChartMarker = L.pieChartMarker(
                [center[1], center[0]],
                {
                    data: [
                        {
                            name: 'Displaced',
                            value: displaced,
                            style: {
                                fillColor: '#FF6B6B',
                                fillOpacity: 0.8,
                                stroke: true,
                                color: '#fff',
                                weight: 1
                            }
                        },
                        {
                            name: 'Remaining',
                            value: remaining,
                            style: {
                                fillColor: '#4ECDC4',
                                fillOpacity: 0.8,
                                stroke: true,
                                color: '#fff',
                                weight: 1
                            }
                        }
                    ],
                    radius: getRadiusByPopulation(total),
                    attribution: stateName
                }
            ).addTo(map);
            
            // Add popup
            pieChartMarker.bindPopup(`
                <div class="map-popup">
                    <h3>${stateName}</h3>
                    <p><strong>Displaced Population:</strong> ${stateData.value} (${stateData.percentage})</p>
                    <p><strong>Remaining Population:</strong> ${remaining.toLocaleString()}</p>
                    <p><strong>Total Population:</strong> ${stateData.total_population}</p>
                </div>
            `);
        }
    });
}

/**
 * Get center coordinates of a polygon
 */
function getCenterOfPolygon(geometry) {
    if (geometry.type === 'Polygon') {
        const coordinates = geometry.coordinates[0];
        let x = 0;
        let y = 0;
        
        for (let i = 0; i < coordinates.length; i++) {
            x += coordinates[i][0];
            y += coordinates[i][1];
        }
        
        return [x / coordinates.length, y / coordinates.length];
    } else if (geometry.type === 'MultiPolygon') {
        // Use the first polygon for simplicity
        return getCenterOfPolygon({type: 'Polygon', coordinates: geometry.coordinates[0]});
    }
    
    return [0, 0];
}

/**
 * Get radius size based on population
 */
function getRadiusByPopulation(population) {
    // Scale radius based on population
    const minRadius = 20;
    const maxRadius = 60;
    const minPop = 100000;
    const maxPop = 5000000;
    
    if (population <= minPop) return minRadius;
    if (population >= maxPop) return maxRadius;
    
    const scale = (population - minPop) / (maxPop - minPop);
    return minRadius + scale * (maxRadius - minRadius);
}

/**
 * Get color based on value and data type
 */
function getColorByValue(value, dataType) {
    // Different color scales for different data types
    if (dataType === 'idps') {
        if (value > 1000000) return '#2A81CB';
        if (value > 500000) return '#5DA2D5';
        if (value > 100000) return '#90C3DF';
        if (value > 50000) return '#C5E4EA';
        return '#EFF9FB';
    } else if (dataType === 'returnees') {
        if (value > 300000) return '#5CB85C';
        if (value > 100000) return '#7EC97E';
        if (value > 50000) return '#A1DAA1';
        if (value > 10000) return '#C4EBC4';
        return '#E7F7E7';
    }
    
    return '#CCCCCC';
}

/**
 * Add search control to map
 */
function addSearchControl(map) {
    // Create search control
    const searchControl = L.control.search({
        position: 'topright',
        layer: L.layerGroup(),
        initial: false,
        zoom: 7,
        marker: false
    });
    
    // Add search control to map
    map.addControl(searchControl);
}

/**
 * Add displacement legend to map
 */
function addDisplacementLegend(map) {
    const legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 50000, 100000, 500000, 1000000];
        const labels = [];
        
        div.innerHTML = '<h4>IDPs by State</h4>';
        
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColorByValue(grades[i], 'idps') + '"></i> ' +
                (grades[i] ? formatNumber(grades[i]) : '0') +
                (grades[i + 1] ? '&ndash;' + formatNumber(grades[i + 1]) + '<br>' : '+');
        }
        
        return div;
    };
    
    legend.addTo(map);
}

/**
 * Add returnee map legend
 */
function addReturneeMapLegend(map) {
    const legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 10000, 50000, 100000, 300000];
        const labels = [];
        
        div.innerHTML = '<h4>Returnees by State</h4>';
        
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColorByValue(grades[i], 'returnees') + '"></i> ' +
                (grades[i] ? formatNumber(grades[i]) : '0') +
                (grades[i + 1] ? '&ndash;' + formatNumber(grades[i + 1]) + '<br>' : '+');
        }
        
        return div;
    };
    
    legend.addTo(map);
}

/**
 * Add proportion legend
 */
function addProportionLegend(map) {
    const legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'info legend');
        
        div.innerHTML = `
            <h4>Displacement Proportion</h4>
            <div class="legend-item">
                <i style="background:#FF6B6B"></i> Displaced Population
            </div>
            <div class="legend-item">
                <i style="background:#4ECDC4"></i> Remaining Population
            </div>
            <div class="legend-item">
                <div class="circle-size small"></div> < 500,000 people
            </div>
            <div class="legend-item">
                <div class="circle-size medium"></div> 500,000 - 2,000,000 people
            </div>
            <div class="legend-item">
                <div class="circle-size large"></div> > 2,000,000 people
            </div>
        `;
        
        return div;
    };
    
    legend.addTo(map);
}

/**
 * Format number with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
