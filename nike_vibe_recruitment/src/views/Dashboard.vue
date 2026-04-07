<script setup>
import { ref, computed, watchEffect } from 'vue'
import { activeCandidate } from '../store.js'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS, Title, Tooltip, Legend, ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const isDataRemoved = computed(() => !activeCandidate.value || activeCandidate.value.vibe_score === 0)
const vibeScore = computed(() => activeCandidate.value ? activeCandidate.value.vibe_score : 0)

const gaugeData = ref({
  labels: ['Score', 'Remaining'],
  datasets: [{
    data: [0, 100],
    backgroundColor: ['#ff0a33', 'rgba(255, 10, 51, 0.1)'], 
    borderWidth: 0,
    circumference: 180,
    rotation: 270,
  }]
})

const gaugeOptions = {
  responsive: true, maintainAspectRatio: false, cutout: '85%',
  plugins: { legend: { display: false }, tooltip: { enabled: false } }
};

watchEffect(() => {
  if (isDataRemoved.value) {
    gaugeData.value = { 
      ...gaugeData.value, 
      datasets: [{ ...gaugeData.value.datasets[0], data: [0, 100], backgroundColor: ['#333', 'rgba(255, 255, 255, 0.1)'] }] 
    };
  } else {
    gaugeData.value = {
      ...gaugeData.value,
      datasets: [{ ...gaugeData.value.datasets[0], data: [vibeScore.value, 100 - vibeScore.value], backgroundColor: ['#ff0a33', 'rgba(255, 10, 51, 0.1)'] }]
    };
  }
})
</script>

<template>
  <div class="dash-panel" v-if="activeCandidate">
    <!-- Active Candidate Header -->
    <div class="candidate-header">
       <div class="c-title">CANDIDATE: {{ activeCandidate.name.toUpperCase() }}</div>
       <div class="c-subtitle">LIVE BIOMECHANICAL DATA <span v-if="!isDataRemoved" class="ar-badge">AR Overlay Active</span> <span v-else class="ar-badge-off">DATA PURGED</span></div>
    </div>

    <div class="main-metrics">
       <!-- Biometrics Side -->
       <div class="bio-stats">
          <h3>BIOMETRICS</h3>
          <div class="stat-box">
             <div class="s-label">Heart Rate</div>
             <div class="s-val">{{ activeCandidate.biometrics.heart_rate }} {{ activeCandidate.biometrics.heart_rate_unit || 'bpm' }}</div>
          </div>
          <div class="stat-box">
             <div class="s-label">VO2 Max</div>
             <div class="s-val">{{ activeCandidate.biometrics.vo2_max }}</div>
          </div>
          <div class="stat-box">
             <div class="s-label">Muscle Activation</div>
             <div class="s-val">{{ activeCandidate.biometrics.muscle_activation_pct }}%</div>
          </div>
          <div class="stat-box">
             <div class="s-label">Velocity</div>
             <div class="s-val">{{ activeCandidate.biometrics.velocity_kmh }} km/h</div>
          </div>
       </div>
       
       <!-- Silhouette Center -->
       <div class="figure-container">
          <!-- Placeholder for human shape -->
          <div class="silhouette-placeholder" :class="{'wiped': isDataRemoved}">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 4v.01M16 4v.01M10.5 8.5l-2.5-3M13.5 8.5l2.5-3M12 15l-3 5M12 15l3 5M12 8v7M9.5 12h5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div v-if="isDataRemoved" class="purge-text">LEXGUARD EXECUTED</div>
       </div>

       <!-- 5G Status -->
       <div class="connection-stats">
          <div class="box-panel glow-panel">
             <h3>5G CONNECTIVITY STATUS</h3>
             <div class="signal">
                <div class="bar bar-1"></div>
                <div class="bar bar-2"></div>
                <div class="bar bar-3"></div>
                <div class="bar bar-4 pulse-bar"></div>
             </div>
             <div class="latency">Latency: <span class="ms">4ms</span></div>
          </div>
          
          <div class="box-panel gauge-panel">
             <h3>GLOBAL VIBE SCORE</h3>
             <div class="gauge-wrap">
               <Doughnut :data="gaugeData" :options="gaugeOptions" />
               <div class="gauge-text" :class="{'wiped-text': isDataRemoved}">
                 <span>{{ isDataRemoved ? 'NULL' : vibeScore }}</span>
               </div>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<style scoped>
.dash-panel {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.candidate-header {
  border: 1px solid rgba(255, 10, 51, 0.4);
  background: rgba(255, 10, 51, 0.05);
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.c-title {
  font-family: 'Teko', sans-serif;
  font-size: 2rem;
  color: #fff;
  text-shadow: 0 0 8px #ff0a33;
  margin-bottom: 5px;
}

.c-subtitle {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: space-between;
}

.ar-badge {
  border: 1px solid #ff0a33;
  color: #ff0a33;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  box-shadow: 0 0 5px #ff0a33;
}

.ar-badge-off {
  border: 1px solid #555;
  color: #555;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
}

.main-metrics {
  display: flex;
  flex: 1;
  gap: 20px;
}

.bio-stats {
  flex: 0.25;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bio-stats h3 {
  font-family: 'Teko', sans-serif;
  font-size: 1.4rem;
  color: #fff;
  margin: 0;
  border-bottom: 1px solid rgba(255, 10, 51, 0.4);
  padding-bottom: 5px;
}

.stat-box { display: flex; flex-direction: column; }
.s-label { color: rgba(255, 255, 255, 0.6); font-size: 0.8rem; }
.s-val { color: #fff; font-size: 1.5rem; font-weight: bold; text-shadow: 0 0 5px #ff0a33; }

.figure-container {
  flex: 0.45;
  border: 1px solid rgba(255, 10, 51, 0.2);
  border-radius: 8px;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,10,51,0.05) 3px, rgba(255,10,51,0.05) 3px);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.silhouette-placeholder svg {
  width: 150px;
  height: 250px;
  color: #ff0a33;
  filter: drop-shadow(0 0 10px #ff0a33);
}

.silhouette-placeholder.wiped svg {
  color: #333;
  filter: none;
}

.purge-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ff0a33;
  color: #000;
  padding: 10px 20px;
  font-weight: bold;
  font-family: 'Teko', sans-serif;
  font-size: 2rem;
  border-radius: 4px;
}

.connection-stats {
  flex: 0.3;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.box-panel {
  border: 1px solid rgba(255, 10, 51, 0.3);
  padding: 15px;
  border-radius: 6px;
  background: rgba(10, 0, 0, 0.8);
}

.glow-panel { box-shadow: 0 0 10px rgba(255, 10, 51, 0.1); }

.box-panel h3 {
  font-family: 'Teko', sans-serif;
  font-size: 1.2rem;
  margin: 0 0 10px 0;
  border-bottom: 1px solid rgba(255, 10, 51, 0.3);
  padding-bottom: 5px;
}

.signal {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 40px;
  margin-bottom: 10px;
}

.bar { width: 12px; background: #ff0a33; border-radius: 2px 2px 0 0; box-shadow: 0 0 5px #ff0a33; }
.bar-1 { height: 10px; }
.bar-2 { height: 20px; }
.bar-3 { height: 30px; }
.bar-4 { height: 40px; }

.pulse-bar { animation: barOpacity 1.5s infinite; }

@keyframes barOpacity {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

.latency { color: rgba(255, 255, 255, 0.7); font-size: 0.9rem; }
.ms { color: #fff; font-weight: bold; font-size: 1.2rem; }

.gauge-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.gauge-wrap {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.gauge-text {
  position: absolute;
  top: 60%;
  transform: translateY(-50%);
  font-size: 3rem;
  font-weight: bold;
  font-family: 'Teko', sans-serif;
  color: #ff0a33;
  text-shadow: 0 0 10px #ff0a33;
}

.wiped-text { color: #555; text-shadow: none; font-size: 2rem;}
</style>
