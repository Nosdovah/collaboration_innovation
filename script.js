document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch both data sources
        const [scamperRes, campaignRes] = await Promise.all([
            fetch('draft.json'),
            fetch('campaign_draft.json')
        ]);

        const scamperData = await scamperRes.json();
        const campaignData = await campaignRes.json();

        const concept = scamperData.innovation_concept;

        // Populate Header/Hero
        document.getElementById('main-title').textContent = concept.title;
        document.getElementById('product-name').textContent = concept.output_product.name;
        document.getElementById('product-description').textContent = concept.output_product.description;

        // Inject Hero Image
        const productVisual = document.getElementById('product-visual');
        productVisual.innerHTML = `<img src="hero.png" alt="Nike-Vibe Vision" style="width: 100%; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">`;

        // SCAMPER Grid
        const scamperGrid = document.getElementById('scamper-grid');
        concept.scamper_analysis.forEach((item, index) => {
            const card = createCard('card', index);
            card.innerHTML = `
                <div class="category-tag">${item.category}</div>
                <h4 class="action-title">${item.action}</h4>
                <p class="result-text">${item.result}</p>
            `;
            scamperGrid.appendChild(card);
        });

        // Campaign Grid (Updated keys: ide_kampanye, judul, deskripsi)
        const campaignGrid = document.getElementById('campaign-grid');
        campaignData.ide_kampanye.forEach((item, index) => {
            const card = createCard('campaign-card', index + 7);
            card.innerHTML = `
                <h4>${item.judul}</h4>
                <p class="result-text">${item.deskripsi}</p>
            `;
            campaignGrid.appendChild(card);
        });

        // Marketing Strategy Phases (Updated keys: strategi_pemasaran, fase_1_kesadaran, fase_2_pertimbangan, fase_3_konversi)
        const mStrat = campaignData.strategi_pemasaran;
        populateList('awareness-list', mStrat.fase_1_kesadaran);
        populateList('consideration-list', mStrat.fase_2_pertimbangan);
        populateList('conversion-list', mStrat.fase_3_konversi);

        // Channel Distribution (Updated keys: distribusi_saluran, saluran, taktik)
        const channelGrid = document.getElementById('channel-grid');
        mStrat.distribusi_saluran.forEach((item, index) => {
            const card = createCard('channel-card', index + 15);
            card.innerHTML = `
                <div class="channel-name">${item.saluran}</div>
                <div class="channel-tactic">${item.taktik}</div>
            `;
            channelGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading data:', error);
    }
});

function createCard(className, delayIndex) {
    const card = document.createElement('div');
    card.className = className;
    card.style.animation = `fadeInUp 0.6s ease forwards ${delayIndex * 0.1}s`;
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    return card;
}

function populateList(id, items) {
    const list = document.getElementById(id);
    if (!list) return;
    items.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        list.appendChild(li);
    });
}

// Add animation keyframe to document
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
