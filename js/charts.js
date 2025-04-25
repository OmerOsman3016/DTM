/**
 * Sudan DTM Integrated Dashboard
 * Charts Visualization JavaScript
 */

// Global chart variables
let demographicsChart;
let trendsChart;

/**
 * Initialize charts when data is loaded
 */
function initCharts(demographicsData, trendsData) {
    // Initialize demographics chart (population pyramid)
    initDemographicsChart(demographicsData);
    
    // Initialize trends chart
    initTrendsChart(trendsData);
}

/**
 * Initialize the demographics chart (population pyramid)
 */
function initDemographicsChart(data) {
    const chartContainer = document.getElementById('demographics-chart');
    if (!chartContainer) return;
    
    // Sample data structure for population pyramid
    const ageGroups = ['0-1 Year', '01-05 Years', '06-17 Years', '18-59 Years', '60+ Years'];
    const maleValues = [8.2, 12.5, 20.3, 23.8, 3.6]; // Percentages
    const femaleValues = [8.7, 13.1, 21.5, 25.9, 4.0]; // Percentages
    
    // Create the chart using Plotly
    const trace1 = {
        x: maleValues.map(v => -v), // Negative values for males (left side)
        y: ageGroups,
        name: 'Male',
        orientation: 'h',
        type: 'bar',
        marker: {
            color: 'rgba(65, 143, 222, 0.8)'
        }
    };
    
    const trace2 = {
        x: femaleValues,
        y: ageGroups,
        name: 'Female',
        orientation: 'h',
        type: 'bar',
        marker: {
            color: 'rgba(240, 173, 78, 0.8)'
        }
    };
    
    const layout = {
        title: 'IDP Population by Age and Gender',
        titlefont: {
            family: 'Segoe UI, sans-serif',
            size: 18,
            color: '#2A6FBB'
        },
        barmode: 'relative',
        bargap: 0.1,
        autosize: true,
        margin: {
            l: 100,
            r: 40,
            b: 60,
            t: 80,
            pad: 10
        },
        xaxis: {
            title: 'Percentage of Total Population',
            titlefont: {
                family: 'Segoe UI, sans-serif',
                size: 14,
                color: '#555'
            },
            tickfont: {
                family: 'Segoe UI, sans-serif',
                size: 12,
                color: '#555'
            },
            tickvals: [-25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25],
            ticktext: ['25%', '20%', '15%', '10%', '5%', '0%', '5%', '10%', '15%', '20%', '25%'],
            zeroline: true,
            zerolinecolor: '#666',
            zerolinewidth: 1,
            showgrid: true,
            gridcolor: '#eee',
            gridwidth: 1
        },
        yaxis: {
            title: 'Age Group',
            titlefont: {
                family: 'Segoe UI, sans-serif',
                size: 14,
                color: '#555'
            },
            tickfont: {
                family: 'Segoe UI, sans-serif',
                size: 12,
                color: '#555'
            },
            automargin: true
        },
        legend: {
            x: 0.5,
            y: 1.1,
            orientation: 'h',
            xanchor: 'center',
            font: {
                family: 'Segoe UI, sans-serif',
                size: 12,
                color: '#555'
            }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        hovermode: 'closest'
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'toggleSpikelines']
    };
    
    Plotly.newPlot('demographics-chart', [trace1, trace2], layout, config);
    
    // Store chart instance
    chartInstances.demographics = {
        resize: function() {
            Plotly.relayout('demographics-chart', {
                'width': chartContainer.offsetWidth,
                'height': chartContainer.offsetHeight
            });
        }
    };
}

/**
 * Initialize the trends chart
 */
function initTrendsChart(data) {
    const chartContainer = document.getElementById('trends-chart');
    if (!chartContainer) return;
    
    // Sample data for trends
    const months = ['Apr 2023', 'May 2023', 'Jun 2023', 'Jul 2023', 'Aug 2023', 'Sep 2023', 
                   'Oct 2023', 'Nov 2023', 'Dec 2023', 'Jan 2024', 'Feb 2024', 'Mar 2024',
                   'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024',
                   'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025'];
    
    const idpValues = [
        3800000, 4200000, 4800000, 5300000, 5900000, 6400000,
        6900000, 7300000, 7800000, 8200000, 8600000, 9000000,
        9300000, 9600000, 9900000, 10200000, 10500000, 10800000,
        11000000, 11200000, 11300000, 11400000, 11500000, 11300000
    ];
    
    const returneeValues = [
        0, 20000, 45000, 70000, 95000, 120000,
        150000, 180000, 210000, 240000, 270000, 300000,
        320000, 335000, 350000, 360000, 370000, 380000,
        385000, 390000, 395000, 397000, 396000, 396738
    ];
    
    // Create the chart using Plotly
    const trace1 = {
        x: months,
        y: idpValues,
        name: 'IDPs',
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            color: '#2A81CB',
            width: 3
        },
        marker: {
            color: '#2A81CB',
            size: 8
        }
    };
    
    const trace2 = {
        x: months,
        y: returneeValues,
        name: 'Returnees',
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            color: '#5CB85C',
            width: 3
        },
        marker: {
            color: '#5CB85C',
            size: 8
        }
    };
    
    const layout = {
        title: 'Displacement and Returns Trends (Apr 2023 - Mar 2025)',
        titlefont: {
            family: 'Segoe UI, sans-serif',
            size: 18,
            color: '#2A6FBB'
        },
        autosize: true,
        margin: {
            l: 60,
            r: 40,
            b: 80,
            t: 80,
            pad: 10
        },
        xaxis: {
            title: 'Month',
            titlefont: {
                family: 'Segoe UI, sans-serif',
                size: 14,
                color: '#555'
            },
            tickfont: {
                family: 'Segoe UI, sans-serif',
                size: 12,
                color: '#555'
            },
            tickangle: -45,
            showgrid: true,
            gridcolor: '#eee',
            gridwidth: 1
        },
        yaxis: {
            title: 'Number of People',
            titlefont: {
                family: 'Segoe UI, sans-serif',
                size: 14,
                color: '#555'
            },
            tickfont: {
                family: 'Segoe UI, sans-serif',
                size: 12,
                color: '#555'
            },
            showgrid: true,
            gridcolor: '#eee',
            gridwidth: 1,
            tickformat: ',d'
        },
        legend: {
            x: 0.5,
            y: 1.1,
            orientation: 'h',
            xanchor: 'center',
            font: {
                family: 'Segoe UI, sans-serif',
                size: 12,
                color: '#555'
            }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        hovermode: 'closest'
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'toggleSpikelines']
    };
    
    Plotly.newPlot('trends-chart', [trace1, trace2], layout, config);
    
    // Store chart instance
    chartInstances.trends = {
        resize: function() {
            Plotly.relayout('trends-chart', {
                'width': chartContainer.offsetWidth,
                'height': chartContainer.offsetHeight
            });
        }
    };
}

/**
 * Change chart type (bar, line, area)
 */
function changeChartType(chartId, type) {
    const chartContainer = document.getElementById(chartId);
    if (!chartContainer) return;
    
    if (chartId === 'trends-chart') {
        const update = {};
        
        if (type === 'bar') {
            update.type = 'bar';
            update.mode = undefined;
        } else if (type === 'line') {
            update.type = 'scatter';
            update.mode = 'lines+markers';
        } else if (type === 'area') {
            update.type = 'scatter';
            update.mode = 'lines';
            update.fill = 'tozeroy';
        }
        
        Plotly.restyle(chartId, update, [0, 1]);
    }
}

/**
 * Update chart data range
 */
function updateChartDateRange(chartId, startDate, endDate) {
    const chartContainer = document.getElementById(chartId);
    if (!chartContainer) return;
    
    // This would filter the data based on date range
    // For now, we'll just log the action
    console.log(`Updating chart ${chartId} date range: ${startDate} to ${endDate}`);
}

/**
 * Export chart as image
 */
function exportChartAsImage(chartId) {
    const chartContainer = document.getElementById(chartId);
    if (!chartContainer) return;
    
    Plotly.downloadImage(chartId, {
        format: 'png',
        width: 1200,
        height: 800,
        filename: `sudan-dtm-${chartId}`
    });
}

/**
 * Format number with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
