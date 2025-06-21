const midtransClient = require('midtrans-client');

module.exports = async (req, res) => {
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
    // Initialize Midtrans Snap client
    const snap = new midtransClient.Snap({
      isProduction: false, // Set to false for sandbox testing
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    const orderId = 'EBOOK-VEO3-' + Date.now() + Math.floor(Math.random() * 1000);
    
    const parameter = {
      "transaction_details": {
        "order_id": orderId,
        "gross_amount": 99000
      },
      "item_details": [{
        "id": "EBOOK_VEO3_01",
        "price": 99000,
        "quantity": 1,
        "name": "Ebook VEO3 Unlimited + Tools",
        "brand": "VEO3 Master",
        "category": "Ebook",
        "merchant_name": "VEO3 Master"
      }],
      "customer_details": {
        "first_name": "Pembeli",
        "last_name": "Ebook",
        "email": "customer@example.com",
        "phone": "08123456789"
      }
    };

    const token = await snap.createTransactionToken(parameter);
    res.json({ token });

  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ 
      error: 'Payment system error',
      message: error.message,
      details: 'Please try again or use manual payment option'
    });
  }
}; 