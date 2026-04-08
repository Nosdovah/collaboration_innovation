// rpg_script.js

const metadata = {
    candidate: {
        id: "T-NK-2026-9041",
        name: "Raihan H. Firdaus",
        classType: "Vanguard Specialist",
        level: 84,
        rank: "S",
        aiAssessment: "The candidate shows exceptional mental resilience and consistent discipline patterns. Heart Rate Recovery points to elite level stress management. Highly recommended for high-pressure tech operations.",
        attributes: [
            { name: "Speed", value: 85, color: "#EE1424", icon: "⚡" },
            { name: "Agility", value: 92, color: "#00A9E0", icon: "🌪️" },
            { name: "Endurance", value: 78, color: "#FFD700", icon: "🛡️" },
            { name: "Focus", value: 88, color: "#9D00FF", icon: "👁️" },
            { name: "Teamwork", value: 75, color: "#00FF00", icon: "🤝" },
            { name: "Discipline", value: 95, color: "#FF4500", icon: "⚖️" },
            { name: "Resilience", value: 80, color: "#00FFFF", icon: "❤️‍🔥" }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Populate Profile
    document.getElementById('c-name').textContent = metadata.candidate.name;
    document.getElementById('c-class').textContent = metadata.candidate.classType;
    document.getElementById('c-id').textContent = metadata.candidate.id;
    document.getElementById('c-rank').textContent = metadata.candidate.rank;
    document.querySelector('.level-badge').textContent = `LVL ${metadata.candidate.level}`;
    document.getElementById('c-assessment').textContent = metadata.candidate.aiAssessment;

    // Populate Stat Bars
    const barsContainer = document.getElementById('stat-bars-container');
    const attributes = metadata.candidate.attributes;

    attributes.forEach((attr) => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        statItem.innerHTML = `
            <div class="stat-label-container">
                <span class="stat-name">${attr.icon} ${attr.name}</span>
                <span class="stat-value">${attr.value}</span>
            </div>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill" style="width: 0%;" data-target="${attr.value}"></div>
            </div>
        `;
        barsContainer.appendChild(statItem);
    });

    // Animate Bars
    setTimeout(() => {
        const fills = document.querySelectorAll('.stat-bar-fill');
        fills.forEach(fill => {
            const target = fill.getAttribute('data-target');
            fill.style.width = target + '%';
        });
    }, 300);

    // Render Radar Chart
    renderRadarChart(attributes);
});

function renderRadarChart(attrs) {
    const ctx = document.getElementById('rpgRadarChart').getContext('2d');
    
    // Prepare Data
    const labels = attrs.map(a => a.name);
    const data = attrs.map(a => a.value);

    Chart.defaults.color = "rgba(255, 255, 255, 0.7)";
    Chart.defaults.font.family = "'Outfit', sans-serif";

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Biometric Metadata',
                data: data,
                backgroundColor: 'rgba(238, 20, 36, 0.2)', // Telkomsel Red with opacity
                borderColor: '#EE1424', // Telkomsel Red
                pointBackgroundColor: '#00A9E0', // Telkomsel Blue
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#00A9E0',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        circular: true
                    },
                    pointLabels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    },
                    ticks: {
                        display: false,
                        min: 0,
                        max: 100,
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#EE1424',
                    bodyColor: '#fff',
                    padding: 10,
                    borderColor: 'rgba(238, 20, 36, 0.5)',
                    borderWidth: 1,
                    displayColors: false
                }
            }
        }
    });
}
