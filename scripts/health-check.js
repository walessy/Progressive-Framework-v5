#!/usr/bin/env node

const http = require('http');
const https = require('https');

async function healthCheck() {
    const port = process.env.PORT || 3000;
    const protocol = process.env.NODE_ENV === 'production' ? https : http;
    
    try {
        // Check main health endpoint
        const healthResponse = await makeRequest(protocol, 'localhost', port, '/api/emergency/health');
        
        if (healthResponse.health && healthResponse.health.overall === 'healthy') {
            console.log('✅ Health check passed');
            process.exit(0);
        } else {
            console.error('❌ Health check failed:', healthResponse.health?.overall || 'unknown');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        process.exit(1);
    }
}

function makeRequest(protocol, hostname, port, path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname,
            port,
            path,
            method: 'GET',
            timeout: 5000
        };
        
        const req = protocol.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (res.statusCode === 200) {
                        resolve(parsed);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                    }
                } catch (parseError) {
                    reject(new Error(`Parse error: ${parseError.message}`));
                }
            });
        });
        
        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.end();
    });
}

if (require.main === module) {
    healthCheck();
}

module.exports = { healthCheck };