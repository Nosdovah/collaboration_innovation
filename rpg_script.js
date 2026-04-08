// rpg_script.js

let chartInstance = null;
let candidatesData = [];

document.addEventListener('DOMContentLoaded', () => {
    // Attempt to fetch from JSON
    fetch('nike_vibe_recruitment/src/assets/metadata.json')
        .then(response => {
            if (!response.ok) {
                // Fallback, in case it was built and copied to root
                return fetch('metadata.json');
            }
            return response;
        })
        .then(response => response.json())
        .then(data => {
            candidatesData = data;
            populateDropdown(data);
            if (data.length > 0) {
                renderCandidate(data[0]); // Render first candidate by default
            }
        })
        .catch(err => {
            console.error("Failed to load candidate metadata:", err);
            document.getElementById('c-assessment').textContent = "ERROR: Failed to establish telemetry link to biometric database.";
        });

    document.getElementById('userDropdown').addEventListener('change', (e) => {
        const selectedId = e.target.value;
        const candidate = candidatesData.find(c => c.kandidat_id === selectedId);
        if (candidate) {
            renderCandidate(candidate);
        }
    });
});

function populateDropdown(data) {
    const dropdown = document.getElementById('userDropdown');
    dropdown.innerHTML = '';
    data.forEach(c => {
        const option = document.createElement('option');
        option.value = c.kandidat_id;
        option.textContent = `${c.kandidat_id} : ${c.profil_dasar.nama_kandidat}`;
        dropdown.appendChild(option);
    });
}

function renderCandidate(cData) {
    const pInfo = cData.profil_dasar;
    const ipk = cData.indeks_performa_kandidat;
    const ai = cData.biometrik_perilaku_ai;

    document.getElementById('c-name').textContent = pInfo.nama_kandidat;
    document.getElementById('c-class').textContent = pInfo.recruitment_status.replace('_', ' ');
    document.getElementById('c-id').textContent = cData.kandidat_id;
    
    // Overall score to rank logic
    let rank = "C";
    if (ipk.skor_keseluruhan >= 90) rank = "S";
    else if (ipk.skor_keseluruhan >= 80) rank = "A";
    else if (ipk.skor_keseluruhan >= 70) rank = "B";
    document.getElementById('c-rank').textContent = rank;
    
    document.querySelector('.level-badge').textContent = `LVL ${ipk.skor_keseluruhan}`;
    
    const assessmentParts = [];
    assessmentParts.push(`Status Verifikasi: ${pInfo.status_verifikasi}.`);
    assessmentParts.push(`Analisis ${ai.interval_analisis}: Ritme ${ai.ritme_olahraga}.`);
    assessmentParts.push(`Pemulihan HR: ${ai.fluktuasi_pemulihan_detak_jantung}.`);
    document.getElementById('c-assessment').textContent = assessmentParts.join(" ");

    const badge = document.getElementById('hud-badge');
    badge.textContent = pInfo.status_verifikasi;
    if (pInfo.status_verifikasi === 'REJECTED' || pInfo.status_verifikasi === 'FLAGGED') {
        badge.style.borderColor = 'red';
        badge.style.color = 'red';
    } else if (pInfo.status_verifikasi === 'VERIFIED_PRO') {
        badge.style.borderColor = '#00ff00';
        badge.style.color = '#00ff00';
    } else {
        badge.style.borderColor = '#00A9E0';
        badge.style.color = '#00A9E0';
    }

    const attributes = [
        { name: "Speed", value: ipk.speed, color: "#EE1424", icon: "⚡" },
        { name: "Agility", value: ipk.agility, color: "#00A9E0", icon: "🌪️" },
        { name: "Endurance", value: ipk.endurance, color: "#FFD700", icon: "🛡️" },
        { name: "Focus 5G", value: ipk.focus_5g, color: "#9D00FF", icon: "👁️" },
        { name: "Teamwork", value: ipk.teamwork, color: "#00FF00", icon: "🤝" },
        { name: "Discipline", value: ai.skor_disiplin, color: "#FF4500", icon: "⚖️" },
        { name: "Resilience", value: ai.skor_resiliensi_mental_juara, color: "#00FFFF", icon: "❤️‍🔥" }
    ];

    const barsContainer = document.getElementById('stat-bars-container');
    barsContainer.innerHTML = ''; // clear previous bars

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
    }, 50);

    renderRadarChart(attributes);
}

function renderRadarChart(attrs) {
    const ctx = document.getElementById('rpgRadarChart').getContext('2d');
    
    const labels = attrs.map(a => a.name);
    const data = attrs.map(a => a.value);

    Chart.defaults.color = "rgba(255, 255, 255, 0.7)";
    Chart.defaults.font.family = "'Outfit', sans-serif";

    if (chartInstance) {
        chartInstance.destroy(); // Destroy previous chart to avoid overlay/memory leaks
    }

    chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Biometric Metadata',
                data: data,
                backgroundColor: 'rgba(238, 20, 36, 0.2)', 
                borderColor: '#EE1424', 
                pointBackgroundColor: '#00A9E0', 
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
