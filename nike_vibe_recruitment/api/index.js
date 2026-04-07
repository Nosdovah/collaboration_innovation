// api/index.js
import express from 'express';
import cors from 'cors';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import { decryptPayload } from './lib/lexguard_crypto.js';

dotenv.config({ path: '../.env' }); 

const app = express();
// Mengizinkan Vite Frontend (localhost:5173) mengakses API
app.use(cors({ origin: '*' })); 
app.use(express.json());

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://dummy-url',
  authToken: process.env.TURSO_AUTH_TOKEN || 'dummy',
});

// Mock Initial Default Data (jika Turso kosong / setup lokal tanpa DB aktif)
let mockVibeScore = 84; 

// GET: Vibe Score Data for Dashboard Polling (Tugas 1)
app.get('/api/vibe-score/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Simulasi respons dinamis jika Turso belum dialamatkan dengan data asli
    if (!process.env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN === 'your-turso-auth-token') {
        mockVibeScore = Math.max(0, Math.min(100, mockVibeScore + Math.floor(Math.random() * 5) - 2));
        return res.json({
            kandidat_id: id,
            vibe_score: mockVibeScore,
            discipline_index: 85,
            biometrics: { focus_latency_ms: 12 },
            timestamp: new Date().toISOString()
        });
    }

    const result = await turso.execute({
      sql: `SELECT c.vibe_score, c.discipline_index, b.iv, b.encrypted_biometric_payload
            FROM candidates c
            LEFT JOIN biometric_data b ON c.kandidat_id = b.kandidat_id
            WHERE c.kandidat_id = ?
            ORDER BY b.deletion_timestamp DESC LIMIT 1`,
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const row = result.rows[0];
    let decryptedBiometrics = null;

    if (row.encrypted_biometric_payload && row.iv) {
      decryptedBiometrics = decryptPayload(row.iv, row.encrypted_biometric_payload);
    }

    res.json({
      kandidat_id: id,
      vibe_score: row.vibe_score,
      discipline_index: row.discipline_index,
      biometrics: decryptedBiometrics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[API] Vibe Score Fetch Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET: Admin Console Candidate List (Tugas 2)
app.get('/api/candidates', async (req, res) => {
  try {
    if (!process.env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN === 'your-turso-auth-token') {
        // Fallback Simulasi
        return res.json([
            { id: '1', name: 'Raihan Akbar', vibeScore: mockVibeScore, complianceStatus: 'CLEARED' },
            { id: '2', name: 'Jane Doe', vibeScore: 65, complianceStatus: 'POSSIBLE_SPOOF' }
        ]);
    }

    const result = await turso.execute(`
      SELECT 
        c.kandidat_id, 
        c.name, 
        c.vibe_score,
        c.discipline_index,
        (SELECT status FROM compliance_log cl WHERE cl.kandidat_id = c.kandidat_id ORDER BY timestamp DESC LIMIT 1) as latest_compliance
      FROM candidates c
    `);
    
    const candidates = result.rows.map(r => ({
      id: r.kandidat_id,
      name: r.name,
      vibeScore: r.vibe_score,
      complianceStatus: r.latest_compliance || 'CLEARED'
    }));

    res.json(candidates);
  } catch (error) {
    console.error('[API] Candidates Fetch Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE: Trigger LexGuard (Tugas 2)
app.delete('/api/lexguard/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!process.env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN === 'your-turso-auth-token') {
        mockVibeScore = 0; // Simulasi data terhapus
        return res.json({ message: 'LexGuard executed on Mock System' });
    }

    // 1. Physically delete biometric data (Hard Delete)
    const delResult = await turso.execute({
      sql: "DELETE FROM biometric_data WHERE kandidat_id = ?",
      args: [id]
    });

    // 2. Nullify vibe_score to signify PDP execution
    await turso.execute({
      sql: "UPDATE candidates SET vibe_score = 0, discipline_index = 0 WHERE kandidat_id = ?",
      args: [id]
    });

    // 3. Log compliance action
    await turso.execute({
      sql: "INSERT INTO compliance_log (kandidat_id, action_type, status) VALUES (?, 'PDP_MANUAL_DELETE', 'SUCCESS')",
      args: [id]
    });

    res.json({ message: 'LexGuard executed. Biometric data securely wiped.', affectedRows: delResult.rowsAffected });
  } catch (error) {
    console.error('[API] LexGuard Delete Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[Data Bridge] Express API runs on http://localhost:${PORT}`));

export default app;
