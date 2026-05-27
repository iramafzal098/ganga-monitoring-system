// Initialize Lucide icons
lucide.createIcons();

// Global variables
let currentUser = null;
let currentCity = 'Varanasi';
let map = null;
let chart = null;

// Screen management
function showScreen(screenId) {

    // FIRST hide everything
    document.getElementById('roleSelection')
        .style.display = 'none';

    document.getElementById('registrationForm')
        .style.display = 'none';

    document.getElementById('dashboard')
        .style.display = 'none';

    document.getElementById('analytics')
        .style.display = 'none';

    document.getElementById('account')
        .style.display = 'none';

    // LOGIN FLOW
    if (screenId === 'roleSelection') {

        document.getElementById('roleSelection')
            .style.display = 'block';

        document.getElementById('bottomNav')
            .classList.add('hidden');

        return;
    }

    if (screenId === 'registrationForm') {

        document.getElementById('registrationForm')
            .style.display = 'block';

        document.getElementById('bottomNav')
            .classList.add('hidden');

        return;
    }

    // MAIN APP
    document.getElementById('dashboard')
        .style.display = 'block';

    document.getElementById('analytics')
        .style.display = 'block';

    document.getElementById('account')
        .style.display = 'block';

    // Bottom nav visible
    document.getElementById('bottomNav')
        .classList.remove('hidden');

    // Initialize map properly
    setTimeout(() => {

        if (!map) {
            initializeIndiaMap();
        } else {
            map.invalidateSize();
        }

    }, 200);

    // Initialize chart
    initializeChart();
}


function showRoleSelection() {
    showScreen('roleSelection');
}

function showRegistration() {
    showScreen('registrationForm');
}

// Registration
function handleRegistration(event) {

    event.preventDefault();

    const name =
        document.getElementById('userName').value;

    const city =
        document.getElementById('userCity').value;

    const email =
        document.getElementById('userEmail').value;

    currentUser = {
        name,
        city,
        email
    };

    currentCity = city;

    // Update UI
    document.getElementById('userNameDisplay')
        .textContent = name;

    document.getElementById('userCityDisplay')
        .textContent = city;

    document.getElementById('profileName')
        .value = name;

    document.getElementById('profileEmail')
        .value = email;

    document.getElementById('profileCity')
        .value = city;

    showScreen('dashboard');
}

// =======================
// MAP
// =======================

function initializeIndiaMap() {

    if (map) {
        map.remove();
    }

    map = L.map('map', {

    zoomControl: true,

    scrollWheelZoom: true,

    dragging: true

}).setView([25.6, 83.0], 7);

    // OpenStreetMap Tiles
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }
    ).addTo(map);

    // Ganga River Path
    const gangaPath = [
        [29.9457, 78.1642],
        [26.4499, 80.3319],
        [25.4358, 81.8463],
        [25.3176, 82.9739],
        [25.5941, 85.1376],
        [22.5726, 88.3639]
    ];

    L.polyline(gangaPath, {

        color: '#3b82f6',

        weight: 3,

        opacity: 0.8

    }).addTo(map);

    // Monitoring points
    const monitoringPoints = [

        {
            lat: 29.9457,
            lng: 78.1642,
            name: 'Haridwar',
            status: 'normal'
        },

        {
            lat: 26.4499,
            lng: 80.3319,
            name: 'Kanpur',
            status: 'warning'
        },

        {
            lat: 25.3176,
            lng: 82.9739,
            name: 'Varanasi',
            status: 'danger'
        },

        {
            lat: 25.5941,
            lng: 85.1376,
            name: 'Patna',
            status: 'warning'
        }
    ];

    monitoringPoints.forEach(point => {

        let color = '#10b981';

        if (point.status === 'warning') {
            color = '#f59e0b';
        }

        if (point.status === 'danger') {
            color = '#ef4444';
        }

        L.circleMarker([point.lat, point.lng], {

            radius:
                point.status === 'danger'
                ? 10
                : 8,

            fillColor: color,

            color: color,

            weight: 3,

            opacity: 1,

            fillOpacity: 0.8

        })

        .addTo(map)

        .bindPopup(`

            <div style="
                min-width:160px;
                font-family:sans-serif;
            ">

                <h3 style="
                    margin-bottom:8px;
                    color:${color};
                ">
                    ${point.name}
                </h3>

                <p>
                    <strong>Status:</strong>
                    ${point.status}
                </p>

                <p>
                    <strong>Water Quality:</strong>

                    ${
                        point.status === 'danger'
                        ? 'Poor'

                        : point.status === 'warning'
                        ? 'Moderate'

                        : 'Safe'
                    }
                </p>

                <p>
                    <strong>AI Insight:</strong>

                    ${
                        point.status === 'danger'
                        ? 'Industrial contamination detected'

                        : 'Stable river conditions'
                    }
                </p>

            </div>

        `);
    });
}

// =======================
// CHART
// =======================

function initializeChart() {

   if (chart) {
    chart.destroy();
}

    const ctx =
        document.getElementById('analyticsChart')
        .getContext('2d');

    chart = new Chart(ctx, {

        type: 'line',

        data: {

            labels: [
                'Jan 1',
                'Jan 7',
                'Jan 14',
                'Jan 21',
                'Jan 28'
            ],

            datasets: [

                {
                    label: 'pH Level',

                    data: [
                        7.2,
                        7.1,
                        7.3,
                        7.0,
                        7.2
                    ],

                    borderColor: '#2563eb',

                    backgroundColor:
                        'rgba(37,99,235,0.1)',

                    tension: 0.3,

                    fill: true
                }
            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }
            }
        }
    });
}

// Generate mock analytics data
function generateMockData(parameter, period) {

    const data = [];

    let baseValue = 7;
    let variation = 1;

    switch(parameter) {

        case 'ph':
            baseValue = 7.5;
            variation = 0.5;
            break;

        case 'do':
            baseValue = 6;
            variation = 1;
            break;

        case 'bod':
            baseValue = 3;
            variation = 1.5;
            break;

        case 'nitrate':
            baseValue = 5;
            variation = 2;
            break;

        case 'fecal-coliform':
            baseValue = 400;
            variation = 200;
            break;
    }

    for(let i = 0; i < period; i++) {

        const value =
            baseValue +
            (Math.random() - 0.5) * variation;

        data.push(
            parseFloat(value.toFixed(2))
        );
    }

    return data;
}

// Update chart dynamically
function updateChart() {

    const parameter =
        document.getElementById('analyticsParameter')
        .value;

    const period =
        parseInt(
            document.getElementById('analyticsPeriod')
            .value
        );

    const paramLabel =
        document.getElementById('analyticsParameter')
        .selectedOptions[0].text;

    const newData =
        generateMockData(parameter, period);

    const labels =
        Array.from(
            { length: period },
            (_, i) => `Day ${i + 1}`
        );

    chart.data.labels = labels;

    chart.data.datasets[0].data = newData;

    chart.data.datasets[0].label = paramLabel;

    chart.update();

    // Summary cards
    const currentValue =
        newData[newData.length - 1];

    const averageValue =
        newData.reduce((a, b) => a + b, 0)
        / newData.length;

    document.getElementById('currentValue')
        .textContent =
        currentValue.toFixed(2);

    document.getElementById('averageValue')
        .textContent =
        averageValue.toFixed(2);
}

// Reset profile
function resetProfile() {

    if(currentUser) {

        document.getElementById('profileName')
            .value = currentUser.name;

        document.getElementById('profileEmail')
            .value = currentUser.email;

        document.getElementById('profileCity')
            .value = currentUser.city;
    }
}

// Sign out
function signOut() {

    const confirmLogout =
        confirm(
            'Are you sure you want to sign out?'
        );

    if(confirmLogout) {

        currentUser = null;

        showScreen('roleSelection');
    }
}

// Start app
showScreen('roleSelection');