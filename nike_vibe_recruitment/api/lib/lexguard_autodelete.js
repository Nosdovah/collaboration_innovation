/**
 * LexGuard: Auto-Deletion Background Worker
 * Skrip worker fisik untuk memastikan mandat UU PDP Indonesia dipenuhi.
 * Menghapus baris/data biometrik sensitif di mana waktu saat ini lebih besar dari deletion_timestamp.
 */
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // Arahkan ke env project root

export async function runAutoDeletionJob() {
    console.log("[LexGuard Worker] Booting up TTL auto-deletion chronjob...");
    
    const tursoClient = createClient({
        url: process.env.TURSO_DATABASE_URL || 'libsql://dummy-db-url',
        authToken: process.env.TURSO_AUTH_TOKEN || 'dummy-token',
    });

    try {
        // Mendapatkan timestamp ISO aktual
        const currentTime = new Date().toISOString();
        console.log(`[LexGuard Worker] Scan time threshold: < ${currentTime}`);
        
        // 1. Eksekusi Kueri DELETE FISIK
        const result = await tursoClient.execute({
            sql: "DELETE FROM biometric_data WHERE deletion_timestamp < ?",
            args: [currentTime]
        });

        // 2. Logging Kepatuhan / Audit Trail
        const deletedRows = result.rowsAffected;
        
        if (deletedRows > 0) {
            console.log(`[LexGuard] SUCCESS: Removed ${deletedRows} expired biometric rows mapping to UU PDP compliance.`);
            
            // Catat aktivitas ke compliance log tanpa mengekspos identifier spesifik (untuk keamanan)
            await tursoClient.execute({
                sql: "INSERT INTO compliance_log (action_type, status) VALUES ('AUTO_DELETION', 'SUCCESS')",
                args: []
            });
        } else {
            console.log("[LexGuard] System fully compliant. No expired data blocks found.");
        }

    } catch (error) {
        console.error("[LexGuard] FATAL ERROR during physical data deletion execution:");
        console.error(error);
        
        // Catat kegagalan
        try {
            await tursoClient.execute({
                sql: "INSERT INTO compliance_log (action_type, status) VALUES ('AUTO_DELETION', 'FAILED')",
                args: []
            });
        } catch (e) {}

    } finally {
        tursoClient.close();
    }
}

// Skrip ini bisa dijalankan via cron, webhook di Vercel cron, atau setInterval di node server
if (import.meta.url === `file://${process.argv[1]}`) {
    runAutoDeletionJob();
}
