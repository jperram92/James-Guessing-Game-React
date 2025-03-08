// Payment Gateway Configuration

export interface PaymentGatewayConfig {
  gatewayType: "stripe" | "paypal" | "mock";
  apiKey: string;
  secretKey?: string;
  environment: "test" | "production";
  webhookUrl?: string;
  currency: string;
  supportedCards: string[];
}

// Default configuration (mock gateway for development)
let paymentConfig: PaymentGatewayConfig = {
  gatewayType: "mock",
  apiKey: "mock_api_key",
  environment: "test",
  currency: "USD",
  supportedCards: ["visa", "mastercard", "amex"],
};

// Initialize with stored configuration if available
try {
  const storedConfig = localStorage.getItem("paymentGatewayConfig");
  if (storedConfig) {
    paymentConfig = JSON.parse(storedConfig);
  }
} catch (error) {
  console.error("Failed to load payment gateway configuration", error);
}

// Get current configuration
export function getPaymentConfig(): PaymentGatewayConfig {
  return { ...paymentConfig };
}

// Update configuration
export function updatePaymentConfig(
  newConfig: Partial<PaymentGatewayConfig>,
): PaymentGatewayConfig {
  paymentConfig = {
    ...paymentConfig,
    ...newConfig,
  };

  // Save to localStorage
  try {
    localStorage.setItem("paymentGatewayConfig", JSON.stringify(paymentConfig));
  } catch (error) {
    console.error("Failed to save payment gateway configuration", error);
  }

  return { ...paymentConfig };
}

// Reset to default configuration
export function resetPaymentConfig(): PaymentGatewayConfig {
  const defaultConfig: PaymentGatewayConfig = {
    gatewayType: "mock",
    apiKey: "mock_api_key",
    environment: "test",
    currency: "USD",
    supportedCards: ["visa", "mastercard", "amex"],
  };

  paymentConfig = defaultConfig;
  localStorage.removeItem("paymentGatewayConfig");

  return { ...paymentConfig };
}
