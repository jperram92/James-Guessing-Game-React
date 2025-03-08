const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

// Verify webhook signature
function verifyWebhook(req, res, next) {
    const transmissionId = req.headers['paypal-transmission-id'];
    const timestamp = req.headers['paypal-transmission-time'];
    const webhookId = PAYPAL_WEBHOOK_ID;
    const transmissionSig = req.headers['paypal-transmission-sig'];
    const certUrl = req.headers['paypal-cert-url'];
    const authAlgo = req.headers['paypal-auth-algo'];
    const webhookEventBody = JSON.stringify(req.body);

    const expectedSignature = crypto.createHmac('sha256', PAYPAL_SECRET)
        .update(transmissionId + "|" + timestamp + "|" + webhookId + "|" + webhookEventBody)
        .digest('base64');

    if (expectedSignature === transmissionSig) {
        next();
    } else {
        res.status(400).send('Invalid signature');
    }
}

app.post('/api/paypal-webhook', verifyWebhook, (req, res) => {
    const event = req.body;

    // Handle the event
    switch (event.event_type) {
        case 'PAYMENT.SALE.COMPLETED':
            // Handle payment sale completed
            break;
        // Add more cases as needed
        default:
            console.log(`Unhandled event type ${event.event_type}`);
    }

    res.status(200).send('Event received');
});

const startServer = (port) => {
    const server = app.listen(port)
        .on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.log(`Port ${port} is busy, trying ${port + 1}`);
                startServer(port + 1);
            } else {
                console.error('Server error:', error);
            }
        })
        .on('listening', () => {
            console.log(`Server running on port ${port}`);
        });
};

// Start server on port 3000, will increment if busy
startServer(3000);
