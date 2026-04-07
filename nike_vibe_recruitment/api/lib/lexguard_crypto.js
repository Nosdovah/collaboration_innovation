/**
 * LexGuard: Data-at-Rest Encryption Module
 * Menggunakan standar AES-256-CBC untuk mengenkripsi kolom data biometrik
 * sebelum di-insert ke dalam database Turso untuk melindungi privasi.
 */
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const algorithm = 'aes-256-cbc';
// Kunci rahasia 256-bit (32 bytes) dari environment variables, contoh pada .env
const secretKey = process.env.LEXGUARD_SECRET_KEY 
  ? Buffer.from(process.env.LEXGUARD_SECRET_KEY, 'utf-8')
  : crypto.randomBytes(32); 

/**
 * Mengenkripsi data (contoh: object biometrik) ke format heksadesimal.
 * @param {Object|String} data Payload data mentah
 * @returns {Object} { iv: hex, encryptedData: hex }
 */
export function encryptPayload(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    
    const stringifiedData = typeof data === 'object' ? JSON.stringify(data) : data.toString();
    
    let encrypted = cipher.update(stringifiedData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted
    };
}

/**
 * Mendekripsi payload hex kembali ke object/string aslinya.
 * @param {String} iv Initialization vector dari database.
 * @param {String} encryptedData Payload terenkripsi hex.
 * @returns {Object|String} Decrypted data
 */
export function decryptPayload(ivHex, encryptedDataHex) {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encryptedDataHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    try {
        return JSON.parse(decrypted);
    } catch (e) {
        return decrypted;
    }
}

// Simulasi penggunaan
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log("== LexGuard Encryption Test ==");
    const testData = { heart_rate_avg: 72, focus_latency_ms: 12 };
    
    const encrypted = encryptPayload(testData);
    console.log("Encrypted Data (To Turso DB):", encrypted);
    
    const decrypted = decryptPayload(encrypted.iv, encrypted.encryptedData);
    console.log("Decrypted Data (Memory Only):", decrypted);
}
