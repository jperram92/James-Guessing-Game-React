import PayPalButton from './components/PayPalButton';

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Payment Dashboard</h1>
      <div style={{ 
        maxWidth: "600px", 
        margin: "20px auto",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h2>Complete Your Payment</h2>
        <p>Amount: $10.00</p>
        <PayPalButton />
      </div>
    </div>
  );
}

export default App;
