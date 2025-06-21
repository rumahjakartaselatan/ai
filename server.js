const express = require('express');
const midtransClient = require('midtrans-client');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize Midtrans Snap client
const snap = new midtransClient.Snap({
    isProduction: true, // Set to true for production
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

app.post('/create-transaction', async (req, res) => {
    try {
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
        console.error('Error creating transaction:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log('Pastikan Anda sudah membuat file .env dengan API Key Midtrans.');
}); 