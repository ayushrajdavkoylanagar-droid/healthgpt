// Alternative webhook services for backup
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'POST') {
    try {
      const webhookData = {
        name: req.body.name || 'Test User',
        email: req.body.email || 'test@example.com',
        phone: req.body.phone || '+1234567890',
        age: req.body.age || '25',
        gender: req.body.gender || 'male',
        registrationDate: new Date().toISOString(),
        source: 'HealthGPT Website - Vercel Production',
        vercelTimestamp: new Date().toISOString()
      };
      
      console.log('📤 Sending webhook data:', webhookData);
      
      // Try multiple webhook services
      const webhookUrls = [
        'https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjcwNTZjMDYzNTA0MzM1MjZkNTUzNzUxMzci_pc', // Original Pabbly
        'https://webhook.site/your-unique-id', // Webhook.site (for testing)
        'https://requestbin.io/your-unique-id' // RequestBin (for testing)
      ];
      
      const results = [];
      
      for (const url of webhookUrls) {
        try {
          console.log(`🚀 Trying webhook: ${url}`);
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'HealthGPT-Vercel/1.0'
            },
            body: JSON.stringify(webhookData)
          });
          
          const responseData = await response.text();
          results.push({
            url: url,
            status: response.status,
            response: responseData,
            success: response.ok
          });
          
          console.log(`📥 Response from ${url}:`, response.status, responseData);
          
        } catch (error) {
          console.error(`❌ Error with ${url}:`, error);
          results.push({
            url: url,
            error: error.message,
            success: false
          });
        }
      }
      
      res.status(200).json({
        success: true,
        message: 'Webhook sent to multiple services',
        results: results,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Webhook proxy error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  } else if (req.method === 'GET') {
    res.status(200).json({
      message: 'Multi-webhook endpoint is working',
      method: req.method,
      timestamp: new Date().toISOString(),
      url: 'https://healthgpt-rho.vercel.app/api/webhook'
    });
  } else {
    res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['GET', 'POST', 'OPTIONS']
    });
  }
}
