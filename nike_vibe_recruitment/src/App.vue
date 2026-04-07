<script setup>
import Dashboard from './views/Dashboard.vue'
import AdminConsole from './views/AdminConsole.vue'
</script>

<template>
  <div class="hud-master">
    <!-- Header -->
    <header class="hud-header">
      <div class="header-content">
        <div class="title-section">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0a33" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pulse-icon"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
           <h1>NIKE-VIBE RECRUITMENT DASHBOARD</h1>
        </div>
        <div class="sponsor">
           <a href="../index.html" class="back-btn">BACK TO CONCEPT</a>
           <span class="five-g">5G</span>
           <span class="by">BY</span>
           <span class="telkomsel">TELKOMSEL</span>
        </div>
      </div>
    </header>
    
    <div class="hud-grid">
       <div class="hud-panel left-panel">
         <AdminConsole />
       </div>
       <div class="hud-panel right-panel">
         <Dashboard />
       </div>
    </div>
    
    <footer class="hud-footer">
      <div class="brand">
         <svg width="40" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M24 8.7c-2.4 1.2-5 1.7-7.6 1.5C9.6 10 4 6.7 1.2 2.3c-.5-.8-.7-1.5-.5-1.9.4-.5 1.3-.3 2.5.3 4.8 2.4 10.5 3.6 16.2 3.4 1.6-.1 3.2-.2 4.6-.4z"/></svg> 
         <span>NIKE-VIBE</span>
      </div>
      <div>POWERED BY <strong>TELKOMSEL 5G</strong></div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Teko:wght@500;700&display=swap');

.hud-master {
  min-height: 100vh;
  background: radial-gradient(circle at center, #110000 0%, #030000 100%);
  display: flex;
  flex-direction: column;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  padding: 1rem;
  box-sizing: border-box;
}

.hud-header {
  border-bottom: 2px solid #ff0a33;
  padding-bottom: 10px;
  margin-bottom: 15px;
  box-shadow: 0 5px 15px rgba(255, 10, 51, 0.15);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.pulse-icon {
  animation: radarPulse 2s infinite;
}

@keyframes radarPulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

h1 {
  font-family: 'Teko', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
  background: linear-gradient(to right, #fff, #ffbcc0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(255, 10, 51, 0.4);
}

.sponsor {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
}

.five-g { color: #ff0a33; font-size: 1.5rem; text-shadow: 0 0 8px #ff0a33; }
.by { color: #888; font-size: 0.9rem; }
.telkomsel { font-size: 1.5rem; letter-spacing: 1px; }

.back-btn {
  text-decoration: none;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px 15px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: 'Share Tech Mono', monospace;
  transition: all 0.3s ease;
  margin-right: 15px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #fff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.hud-grid {
  display: flex;
  flex: 1;
  gap: 20px;
  overflow: hidden;
}

.hud-panel {
  border: 1px solid rgba(255, 10, 51, 0.3);
  background: rgba(20, 0, 0, 0.6);
  box-shadow: 0 0 15px rgba(255, 10, 51, 0.1), inset 0 0 20px rgba(255, 10, 51, 0.05);
  border-radius: 8px;
  backdrop-filter: blur(5px);
}

.left-panel { flex: 0.35; display: flex; flex-direction: column; overflow: hidden; }
.right-panel { flex: 0.65; display: flex; flex-direction: column; overflow: hidden; }

.hud-footer {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 10, 51, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #a3a3a3;
  font-size: 0.9rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-family: 'Teko', sans-serif;
  color: #fff;
}
</style>
