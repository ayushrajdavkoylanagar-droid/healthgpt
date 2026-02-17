// Test webhook functionality for Vercel deployment
const testWebhook = async () => {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    age: '25',
    gender: 'male',
    registrationDate: new Date().toISOString(),
    source: 'HealthGPT Website Test'
  };

  try {
    const response = await fetch('https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjcwNTZjMDYzNTA0MzM1MjZkNTUzNzUxMzci_pc', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://healthgpt-rho.vercel.app',
        'User-Agent': 'HealthGPT-Website/1.0'
      },
      body: JSON.stringify(testData)
    });

    console.log('Test webhook response:', response.status);
    console.log('Test webhook response:', await response.json());
  } catch (error) {
    console.error('Test webhook error:', error);
  }
};

// Run test
testWebhook();
