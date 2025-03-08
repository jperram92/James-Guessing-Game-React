import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";

const PayPalButton = () => {
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log("PayPal Client ID:", import.meta.env.VITE_PAYPAL_CLIENT_ID);
    setLoaded(true);
  }, []);

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      {!loaded && <div>Loading PayPal integration...</div>}
      {error && <div style={{color: 'red'}}>{error}</div>}
      
      <PayPalScriptProvider 
        options={{
          "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
          "currency": "USD",
          "debug": true // Enable PayPal debug mode
        }}
      >
        <div style={{ maxWidth: "500px", minHeight: "200px" }}>
          <div style={{marginBottom: '10px', backgroundColor: '#f5f5f5', padding: '10px'}}>
            PayPal Payment Section - Amount: $10.00
          </div>
          
          <PayPalButtons
            forceReRender={[loaded]} // Force re-render when loaded
            style={{
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "paypal"
            }}
            createOrder={(data, actions) => {
              console.log("Creating PayPal order...");
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: "10.00"
                  }
                }]
              });
            }}
            onApprove={async (data, actions) => {
              console.log("Payment approved, capturing...");
              const details = await actions.order.capture();
              console.log("Payment completed!", details);
              
              // Store transaction details
              const transactionData = {
                transactionId: details.id,
                status: details.status,
                amount: details.purchase_units[0].amount.value,
                timestamp: new Date().toISOString()
              };

              // Update user subscription status
              // Add your subscription activation logic here
              
              alert("Payment successful! Your subscription is now active.");
            }}
            onError={(err) => {
              setError('PayPal failed to load: ' + err.message);
              console.error('PayPal Error:', err);
            }}
          />
        </div>
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalButton;