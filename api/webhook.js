// Enhanced Vercel Serverless Function with better error handling
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Log incoming requests
  console.log('Webhook request received:', {
    method: req.method,
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString()
  });
  
  if (req.method === 'POST') {
    try {
      // Only accept the 6 fields requested by user
      const webhookData = {
        name: req.body.name || 'Unknown User',
        email: req.body.email || 'unknown@example.com',
        phone: req.body.phone || '+0000000000',
        heartRate: req.body.heartRate || 'Unknown',
        stressScore: req.body.stressScore || 'Unknown',
        sleepScore: req.body.sleepScore || 'Unknown',
        emotionScore: req.body.emotionScore || 'Unknown',
        hydrationScore: req.body.hydrationScore || 'Unknown'
      };
      
      console.log('📤 Sending EXACT user data to Pabbly:', webhookData);
      
      // Send to Pabbly - UPDATED WITH CORRECT WEBHOOK URL
      const pabblyWebhookUrl = 'https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjcwNTZjMDYzNTA0MzM1MjZjNTUzMzUxMzYi_pc'; // ✅ CORRECT URL
      
      console.log('🚀 About to call Pabbly webhook...');
      console.log('📡 Pabbly URL:', pabblyWebhookUrl);
      console.log('📤 Data to send:', webhookData);
      
      const response = await fetch(pabblyWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'HealthGPT-Vercel/1.0'
        },
        body: JSON.stringify(webhookData)
      });
      
      console.log(' Pabbly response status:', response.status);
      console.log(' Pabbly response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseData = await response.text();
      console.log(' Pabbly response data:', responseData);
      console.log(' Pabbly response type:', typeof responseData);
      
      res.status(200).json({
        success: true,
        message: 'Webhook sent successfully',
        pabblyStatus: response.status,
        pabblyResponse: responseData,
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
    // Test endpoint
    res.status(200).json({
      message: 'Webhook endpoint is working',
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
