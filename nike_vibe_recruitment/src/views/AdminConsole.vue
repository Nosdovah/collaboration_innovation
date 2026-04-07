<script setup>
import { candidates, activeCandidate, selectCandidate, purgeCandidate } from '../store.js'

async function triggerLexGuard(candidateId) {
  if(!confirm(`[WARNING] INITIATE PHYSICAL PURGE FOR CANDIDATE ${candidateId}? (UU PDP MANDATE)`)) return;
  
  try {
    const res = await fetch(`http://localhost:3000/api/lexguard/${candidateId}`, { method: 'DELETE' });
    if(res.ok) {
        alert("LEXGUARD ENGAGED: Data Purged.");
        purgeCandidate(candidateId);
    } else {
        alert("LexGuard Execution FAILED.");
    }
  } catch(e) {
    console.error(e);
  }
}
</script>

<template>
  <div class="admin-panel">
    <div class="panel-header">
      <h2>TOP APPLICANTS</h2>
    </div>

    <div class="table-container">
      <table class="red-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Vibe Score</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, index) in candidates" :key="c.id" 
              @click="selectCandidate(c)"
              :class="{'purged': c.vibe_score === 0, 'active-row': activeCandidate && activeCandidate.id === c.id}">
            <td class="rank">{{ index + 1 }}</td>
            <td>
              <div class="candidate-info">
                 <svg class="avatar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                 <span>{{ c.name }}</span>
                 <span class="id-tag">ID:{{ c.id }}</span>
              </div>
            </td>
            <td class="score" :class="{'score-bad': c.vibe_score === 0}">
               {{ c.vibe_score === 0 ? 'ELIMINATED' : c.vibe_score }}
            </td>
            <td>
              <button 
                class="lexguard-btn" 
                @click.stop="triggerLexGuard(c.id)"
                :disabled="c.vibe_score === 0">
                PURGE
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="panel-header mt-4">
      <h2>SKILL METRICS <span v-if="activeCandidate">({{ activeCandidate.name }})</span></h2>
    </div>
    
    <div class="metrics-card" v-if="activeCandidate">
       <div class="metric-row">
         <div class="m-label">Speed</div>
         <div class="m-bar-bg"><div class="m-bar-fill" :style="{width: activeCandidate.skill_metrics.speed + '%'}"></div></div>
         <div class="m-val">{{ activeCandidate.skill_metrics.speed }}</div>
       </div>
       <div class="metric-row">
         <div class="m-label">Agility</div>
         <div class="m-bar-bg"><div class="m-bar-fill" :style="{width: activeCandidate.skill_metrics.agility + '%'}"></div></div>
         <div class="m-val">{{ activeCandidate.skill_metrics.agility }}</div>
       </div>
       <div class="metric-row">
         <div class="m-label">Endurance</div>
         <div class="m-bar-bg"><div class="m-bar-fill" :style="{width: activeCandidate.skill_metrics.endurance + '%'}"></div></div>
         <div class="m-val">{{ activeCandidate.skill_metrics.endurance }}</div>
       </div>
       <div class="metric-row">
         <div class="m-label">Focus</div>
         <div class="m-bar-bg"><div class="m-bar-fill pulse-bar" :style="{width: activeCandidate.skill_metrics.focus_5g + '%'}"></div></div>
         <div class="m-val">{{ activeCandidate.skill_metrics.focus_5g }}</div>
       </div>
       <div class="metric-row">
         <div class="m-label">Teamwork</div>
         <div class="m-bar-bg"><div class="m-bar-fill" :style="{width: activeCandidate.skill_metrics.teamwork + '%'}"></div></div>
         <div class="m-val">{{ activeCandidate.skill_metrics.teamwork }}</div>
       </div>
    </div>
  </div>
</template>

<style scoped>
.admin-panel {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  border-bottom: 1px solid rgba(255, 10, 51, 0.4);
  margin-bottom: 15px;
  padding-bottom: 5px;
}

.panel-header h2 {
  font-family: 'Teko', sans-serif;
  font-size: 1.8rem;
  margin: 0;
  color: #fff;
  letter-spacing: 1px;
}

.mt-4 { margin-top: 25px; }

.table-container {
  flex: 1;
  overflow-y: auto;
}

.red-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 5px;
}

.red-table th {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  text-align: left;
  padding: 5px 10px;
  border-bottom: 1px solid rgba(255, 10, 51, 0.3);
}

.red-table tr {
  background: rgba(255, 10, 51, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.red-table tr:hover {
  background: rgba(255, 10, 51, 0.15);
  box-shadow: 0 0 10px rgba(255, 10, 51, 0.2);
}

.red-table tr.active-row {
  background: rgba(255, 10, 51, 0.25);
  border: 1px solid #ff0a33;
}

.red-table tr.purged {
  opacity: 0.4;
  filter: grayscale(100%);
  pointer-events: none;
}

.red-table td {
  padding: 10px;
  border-top: 1px solid rgba(255, 10, 51, 0.1);
  border-bottom: 1px solid rgba(255, 10, 51, 0.1);
}

.red-table tr td:first-child { border-left: 1px solid rgba(255, 10, 51, 0.1); border-radius: 4px 0 0 4px; }
.red-table tr td:last-child { border-right: 1px solid rgba(255, 10, 51, 0.1); border-radius: 0 4px 4px 0; }

.rank {
  color: #ff0a33;
  font-weight: bold;
  font-size: 1.2rem;
}

.candidate-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 20px;
  height: 20px;
  color: #ff0a33;
}

.id-tag {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
}

.score {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 5px #ff0a33;
}
.score-bad {
  color: #ff0a33;
  font-size: 0.9rem;
  text-shadow: none;
}

.lexguard-btn {
  background: transparent;
  color: #ff0a33;
  border: 1px solid #ff0a33;
  padding: 4px 10px;
  border-radius: 4px;
  font-family: 'Share Tech Mono', monospace;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.lexguard-btn:hover:not(:disabled) {
  background: #ff0a33;
  color: #000;
  box-shadow: 0 0 10px #ff0a33;
}

.lexguard-btn:disabled {
  border-color: #555;
  color: #555;
  cursor: not-allowed;
}

/* Metrics Section */

.metrics-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.m-label {
  width: 80px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.m-bar-bg {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.m-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #ff0a33;
  box-shadow: 0 0 10px #ff0a33;
}

.pulse-bar {
  animation: barPulse 1.5s infinite;
}

@keyframes barPulse {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}

.m-val {
  width: 30px;
  text-align: right;
  font-weight: bold;
  color: #fff;
}
</style>
