const midtransClient = require('midtrans-client');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if environment variables are set
    if (!process.env.MIDTRANS_SERVER_KEY || !process.env.MIDTRANS_CLIENT_KEY) {
      console.error('Missing environment variables');
      return res.status(500).json({ 
        message: 'Server configuration error',
        error: 'Missing Midtrans API keys'
      });
    }

    // Create Snap API instance
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    // Create transaction details
    let parameter = {
      transaction_details: {
        order_id: "VEO3-EBOOK-" + Date.now(),
        gross_amount: 99000
      },
      item_details: [{
        id: "VEO3-EBOOK-001",
        price: 99000,
        quantity: 1,
        name: "Ebook VEO3 Unlimited + Tools Content Creator"
      }],
      customer_details: {
        first_name: "Customer",
        email: "customer@example.com",
        phone: "08123456789"
      },
      callbacks: {
        finish: process.env.GOOGLE_DRIVE_REDIRECT_URL || 'https://premiumaiseo.vercel.app/'
      }
    };

    // Create transaction token
    const transaction = await snap.createTransaction(parameter);
    
    console.log('Transaction created successfully:', transaction.token);
    res.status(200).json({ token: transaction.token });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ 
      message: 'Failed to create transaction',
      error: error.message 
    });
  }
} 