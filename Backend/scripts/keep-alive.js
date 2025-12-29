#!/usr/bin/env node

/**
 * Script para mantener el backend despierto
 * Útil para servicios gratuitos que "duermen" después de inactividad
 * 
 * Ejecutar con: node scripts/keep-alive.js
 * O configurar en UptimeRobot para ping cada 10 minutos
 */

const https = require('https');
const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'https://tu-backend.onrender.com';
const HEALTH_ENDPOINT = '/health';
const INTERVAL_MS = 10 * 60 * 1000; // 10 minutos

function pingBackend() {
  const url = new URL(BACKEND_URL + HEALTH_ENDPOINT);
  const client = url.protocol === 'https:' ? https : http;
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname,
    method: 'GET',
    timeout: 30000, // 30 segundos
  };

  const req = client.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const timestamp = new Date().toISOString();
      if (res.statusCode === 200) {
        console.log(`✅ [${timestamp}] Backend respondió correctamente`);
      } else {
        console.warn(`⚠️  [${timestamp}] Backend respondió con código ${res.statusCode}`);
      }
    });
  });

  req.on('error', (error) => {
    const timestamp = new Date().toISOString();
    console.error(`❌ [${timestamp}] Error al hacer ping:`, error.message);
  });

  req.on('timeout', () => {
    req.destroy();
    const timestamp = new Date().toISOString();
    console.error(`⏱️  [${timestamp}] Timeout al hacer ping`);
  });

  req.end();
}

// Ping inicial
console.log(`🔄 Iniciando keep-alive para: ${BACKEND_URL}`);
console.log(`⏰ Ping cada ${INTERVAL_MS / 1000 / 60} minutos\n`);
pingBackend();

// Ping periódico
setInterval(pingBackend, INTERVAL_MS);

// Manejar cierre graceful
process.on('SIGINT', () => {
  console.log('\n👋 Deteniendo keep-alive...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Deteniendo keep-alive...');
  process.exit(0);
});

