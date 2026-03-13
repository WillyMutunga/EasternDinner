const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function runTests() {
    const baseUrl = 'http://localhost:5000/api';
    
    console.log('--- Testing Admin Login ---');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful, token received.');

    console.log('\n--- Testing Protected Dashboard (Super Admin Only) ---');
    const dashRes = await fetch(`${baseUrl}/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const dashData = await dashRes.json();
    console.log('Dashboard response:', dashData);

    console.log('\n--- Testing Editor Login ---');
    const editorLoginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'editor', password: 'password123' })
    });
    const editorLoginData = await editorLoginRes.json();
    const editorToken = editorLoginData.token;
    console.log('Editor login successful.');

    console.log('\n--- Testing Editor access to Super Admin Dashboard (Should fail) ---');
    const failRes = await fetch(`${baseUrl}/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${editorToken}` }
    });
    const failData = await failRes.json();
    console.log('Access result (Expected denial):', failData);

    console.log('\n--- Testing Editor access to Content Management (Should pass) ---');
    const contentRes = await fetch(`${baseUrl}/admin/content`, {
        headers: { 'Authorization': `Bearer ${editorToken}` }
    });
    const contentData = await contentRes.json();
    console.log('Content result:', contentData);
}

runTests().catch(err => console.error('Verification failed:', err));
