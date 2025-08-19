/**
 * Sudan DTM Integrated Dashboard
 * Maps Visualization JavaScript
 */

// Global map variables
let displacementMap;
let returneesMap;
let proportionMap;
let borderPointsMap;

let stateGeoJSON;
let displacementData;
let returneeData;
let borderPointsData;

// Store all map instances for reference
const mapInstances = {};

/**
 * Initialize all maps when data is loaded
 */
function initMaps(admin1Data, displacementStats, returneeStats, borderPoints) {
    stateGeoJSON = admin1Data;
    displacementData = displacementStats;
    returneeData = returneeStats;
    borderPointsData = borderPoints;

    // Initialize maps
    initDisplacementMap();
    initReturneesMap();
    initDisplacementProportionMap();
    initBorderPointsMap();
}

/* ------------------------------------------------------------------
   BORDER POINTS MAP
-------------------------------------------------------------------*/
function initBorderPointsMap() {
    const mapContainer = document.getElementById('border-points-map');
    if (!mapContainer) return;

    borderPointsMap = L.map('border-points-map', {
        center: [15.5, 30.5], // Sudan center
        zoom: 6,
        minZoom: 5,
        maxZoom: 10,
        zoomControl: true
    });

    // Basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> | © <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(borderPointsMap);

    // Layers + UI
    addBorderPointsLayer(borderPointsMap);
    addSearchControl(borderPointsMap);
    addBorderPointsLegend(borderPointsMap);

    mapInstances.borderPoints = borderPointsMap;
}

function addBorderPointsLayer(map) {
    if (!borderPointsData || borderPointsData.length === 0) return;

    const countryColors = {
        'Chad': '#e74c3c',
        'Ethiopia': '#3498db',
        'Eritrea': '#2ecc71',
        'Egypt': '#f39c12'
    };

    const borderPointsLayer = L.featureGroup().addTo(map);

    borderPointsData.forEach(point => {
        const color = countryColors[point['Neighbouring Country']] || '#999';

        const borderIcon = L.divIcon({
            className: 'border-point-icon',
            html: `<div style="width:12px;height:12px;border-radius:50%;background-color:${color};"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });

        const marker = L.marker([point.Y, point.X], {
            icon: borderIcon,
            title: point['Cross border location']
        }).addTo(borderPointsLayer);

        marker.bindPopup(`
            <div class="border-point-popup">
                <h4>${point['Cross border location']}</h4>
                <div class="popup-grid">
                    <div><b>State:</b> ${point.State} (${point['State Code']})</div>
                    <div><b>Locality:</b> ${point.Locality} (${point['Locality Code']})</div>
                    <div><b>Neighboring Country:</b> ${point['Neighbouring Country']}</div>
                    <div><b>Coordinates:</b> ${point.Y.toFixed(4)}, ${point.X.toFixed(4)}</div>
                </div>
            </div>
        `);

        marker.on('mouseover', function () { this.openPopup(); });
    });

    map.fitBounds(borderPointsLayer.getBounds());
    return borderPointsLayer;
}

function addBorderPointsLegend(map) {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        const countryColors = {
            'Chad': '#e74c3c',
            'Ethiopia': '#3498db',
            'Eritrea': '#2ecc71',
            'Egypt': '#f39c12'
        };

        div.innerHTML = '<h4>Border Countries</h4>';
        Object.entries(countryColors).forEach(([country, color]) => {
            div.innerHTML += `
                <div class="legend-item">
                    <i style="background:${color}"></i> ${country}
                </div>
            `;
        });

        return div;
    };

    legend.addTo(map);
}

/* ------------------------------------------------------------------
   DISPLACEMENT MAP (IDPs)
-------------------------------------------------------------------*/
function initDisplacementMap() {
    const mapContainer = document.getElementById('displacement-map');
    if (!mapContainer) return;

    displacementMap = L.map('displacement-map', {
        center: [15.5, 30.5],
        zoom: 6,
        minZoom: 5,
        maxZoom: 10,
        zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OSM | © CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(displacementMap);

    addStateLayerWithData(displacementMap, stateGeoJSON, displacementData, 'idps');
    addSearchControl(displacementMap);
    addDisplacementLegend(displacementMap);

    mapInstances.displacement = displacementMap;
}

/* ------------------------------------------------------------------
   RETURNEES MAP
-------------------------------------------------------------------*/
function initReturneesMap() {
    const mapContainer = document.getElementById('returnees-map');
    if (!mapContainer) return;

    returneesMap = L.map('returnees-map', {
        center: [15.5, 30.5],
        zoom: 6,
        minZoom: 5,
        maxZoom: 10,
        zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OSM | © CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(returneesMap);

    addStateLayerWithData(returneesMap, stateGeoJSON, returneeData, 'returnees');
    addSearchControl(returneesMap);
    addReturneeMapLegend(returneesMap);

    mapInstances.returnees = returneesMap;
}

/* ------------------------------------------------------------------
   PROPORTION MAP
-------------------------------------------------------------------*/
function initDisplacementProportionMap() {
    const mapContainer = document.getElementById('proportion-map');
    if (!mapContainer) return;

    proportionMap = L.map('proportion-map', {
        center: [15.5, 30.5],
        zoom: 6,
        minZoom: 5,
        maxZoom: 10,
        zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OSM | © CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(proportionMap);

    addProportionLayer(proportionMap, stateGeoJSON, displacementData);
    addSearchControl(proportionMap);
    addProportionLegend(proportionMap);

    mapInstances.proportion = proportionMap;
}

/* ------------------------------------------------------------------
   GENERIC HELPERS
-------------------------------------------------------------------*/
function addStateLayerWithData(map, geoJSON, data, dataType) {
    return L.geoJSON(geoJSON, {
        style: feature => {
            const stateData = data.find(d => d.state === feature.properties.name);
            const value = stateData ? parseInt(stateData.value.replace(/,/g, '')) : 0;
            return {
                fillColor: getColorByValue(value, dataType),
                weight: 1,
                opacity: 1,
                color: '#666',
                fillOpacity: 0.7
            };
        },
        onEachFeature: (feature, layer) => {
            const stateData = data.find(d => d.state === feature.properties.name);
            const value = stateData ? stateData.value : 'No data';
            const percentage = stateData ? stateData.percentage : 'N/A';

            layer.bindPopup(`
                <div class="map-popup">
                    <h3>${feature.properties.name}</h3>
                    <p><b>${dataType === 'idps' ? 'IDPs' : 'Returnees'}:</b> ${value}</p>
                    <p><b>Percentage of Population:</b> ${percentage}</p>
                </div>
            `);

            layer.on({
                mouseover: e => {
                    e.target.setStyle({ weight: 3, fillOpacity: 0.9 });
                    e.target.bringToFront();
                },
                mouseout: e => e.target.setStyle({ weight: 1, fillOpacity: 0.7 }),
                click: e => map.fitBounds(e.target.getBounds())
            });
        }
    }).addTo(map);
}

/* --- Color Scaling --- */
function getColorByValue(value, type) {
    if (type === 'idps') {
        if (value > 1_000_000) return '#2A81CB';
        if (value > 500_000) return '#5DA2D5';
        if (value > 100_000) return '#90C3DF';
        if (value > 50_000) return '#C5E4EA';
        return '#EFF9FB';
    }
    if (type === 'returnees') {
        if (value > 300_000) return '#5CB85C';
        if (value > 100_000) return '#7EC97E';
        if (value > 50_000) return '#A1DAA1';
        if (value > 10_000) return '#C4EBC4';
        return '#E7F7E7';
    }
    return '#CCC';
}

/* --- Legends & Controls --- */
function addSearchControl(map) {
    const searchControl = L.control.search({
        position: 'topright',
        layer: L.layerGroup(),
        initial: false,
        zoom: 7,
        marker: false
    });
    map.addControl(searchControl);
}

function addDisplacementLegend(map) {
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 50_000, 100_000, 500_000, 1_000_000];
        div.innerHTML = '<h4>IDPs by State</h4>';
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                `<i style="background:${getColorByValue(grades[i], 'idps')}"></i> ${formatNumber(grades[i])}` +
                (grades[i + 1] ? `–${formatNumber(grades[i + 1])}<br>` : '+');
        }
        return div;
    };
    legend.addTo(map);
}

function addReturneeMapLegend(map) {
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 10_000, 50_000, 100_000, 300_000];
        div.innerHTML = '<h4>Returnees by State</h4>';
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                `<i style="background:${getColorByValue(grades[i], 'returnees')}"></i> ${formatNumber(grades[i])}` +
                (grades[i + 1] ? `–${formatNumber(grades[i + 1])}<br>` : '+');
        }
        return div;
    };
    legend.addTo(map);
}

function addProportionLegend(map) {
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => `
        <div class="info legend">
            <h4>Displacement Proportion</h4>
            <div><i style="background:#FF6B6B"></i> Displaced</div>
            <div><i style="background:#4ECDC4"></i> Remaining</div>
        </div>`;
    legend.addTo(map);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
