// Direct Pabbly webhook test
const testPabblyWebhook = async () => {
  const testData = {
    name: 'Direct Test User',
    email: 'direct@test.com',
    phone: '+1234567890',
    age: '25',
    gender: 'male',
    registrationDate: new Date().toISOString(),
    source: 'Direct Pabbly Test',
    test: true
  };
  
  try {
    console.log('🧪 Testing Pabbly webhook directly...');
    console.log('📡 URL:', 'https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjcwNTZjMDYzNTA0MzM1MjZkNTUzNzUxMzci_pc');
    console.log('📤 Data:', testData);
    
    const response = await fetch('https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjcwNTZjMDYzNTA0MzM1MjZkNTUzNzUxMzci_pc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Direct-Test/1.0'
      },
      body: JSON.stringify(testData)
    });
    
    const responseData = await response.text();
    console.log('📥 Response status:', response.status);
    console.log('📥 Response data:', responseData);
    
    if (response.ok && responseData === 'success') {
      console.log('✅ Pabbly webhook is working - check your Pabbly dashboard!');
    } else {
      console.log('❌ Pabbly webhook issue detected');
    }
    
  } catch (error) {
    console.error('❌ Direct test failed:', error);
  }
};

// Run the test
testPabblyWebhook();
