// Vercel Serverless Function for Webhook Proxy
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'POST') {
    try {
      const webhookData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        gender: req.body.gender,
        registrationDate: new Date().toISOString(),
        source: 'HealthGPT Website - Vercel Production'
      };
      
      // Send to Pabbly
      const response = await fetch('https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjcwNTZjMDYzNTA0MzM1MjZkNTUzNzUxMzci_pc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'HealthGPT-Vercel/1.0'
        },
        body: JSON.stringify(webhookData)
      });
      
      const responseData = await response.json();
      
      res.status(200).json({
        success: true,
        message: 'Webhook sent successfully',
        pabblyResponse: responseData
      });
      
    } catch (error) {
      console.error('Webhook proxy error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
