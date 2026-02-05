import fs from 'fs';
const baseUrl = 'https://skillora-hxcjbsbzd6e4h9c6.canadacentral-01.azurewebsites.net';
const logFile = 'verification_results.log';

function log(message) {
    console.log(message);
    fs.appendFileSync(logFile, message + '\n');
}

async function testEndpoint(name, url, options = {}) {
    log(`\nTesting ${name} (${url})...`);
    try {
        const start = Date.now();
        const response = await fetch(url, options);
        const duration = Date.now() - start;
        log(`Status: ${response.status} ${response.statusText}`);
        log(`Duration: ${duration}ms`);
        
        const contentType = response.headers.get('content-type');
        log(`Content-Type: ${contentType}`);

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            log(`Response JSON: ${JSON.stringify(data, null, 2)}`);
        } else {
            const text = await response.text();
            log(`Response Text (first 500 chars): ${text.substring(0, 500)}`);
        }
        
    } catch (error) {
        log(`Error testing ${name}: ${error.message}`);
        if(error.cause) log(`Cause: ${error.cause}`);
    }
}

async function main() {
    fs.writeFileSync(logFile, `Verification Report - ${new Date().toISOString()}\n`);
    log('Starting backend verification...');
    
    // 1. Health Check (Categories)
    await testEndpoint('Categories', `${baseUrl}/categories`);

    // 2. Auth Check (Login with dummy data)
    await testEndpoint('Auth Login (Expected Failure)', `${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'wrongpassword' })
    });

    // 3. Swagger Docs
    await testEndpoint('Swagger Docs', `${baseUrl}/api-docs`);
    
    log('\nVerification complete.');
}

main();
