const midtransClient = require('midtrans-client');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
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
        finish: process.env.GOOGLE_DRIVE_REDIRECT_URL
      }
    };

    // Create transaction token
    const transaction = await snap.createTransaction(parameter);
    
    res.status(200).json({ token: transaction.token });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
} 