// Debug webhook functionality
const debugWebhook = async () => {
  console.log('🔍 Starting webhook debug...');
  
  // Test 1: Check if webhook endpoint exists
  try {
    const testResponse = await fetch('https://healthgpt-rho.vercel.app/api/webhook', {
      method: 'GET'
    });
    
    console.log('✅ Webhook endpoint test:', await testResponse.json());
  } catch (error) {
    console.error('❌ Webhook endpoint error:', error);
  }
  
  // Test 2: Test actual webhook call
  try {
    const testData = {
      name: 'Debug Test User',
      email: 'debug@test.com',
      phone: '+1234567890',
      age: '25',
      gender: 'male',
      registrationDate: new Date().toISOString(),
      source: 'HealthGPT Debug Test'
    };
    
    const response = await fetch('https://healthgpt-rho.vercel.app/api/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://healthgpt-rho.vercel.app'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log('✅ Webhook call result:', result);
    
  } catch (error) {
    console.error('❌ Webhook call error:', error);
  }
};

// Run debug
debugWebhook();
