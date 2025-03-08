import { getPaymentConfig } from "./paymentConfig";

export interface PaymentDetails {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  plan: string;
  amount: number;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
  gatewayResponse?: any;
}

// Process payment based on configured gateway
export async function processPayment(
  paymentDetails: PaymentDetails,
): Promise<PaymentResponse> {
  const config = getPaymentConfig();

  // Log payment attempt (would be server-side in production)
  console.log(
    `Processing payment with ${config.gatewayType} gateway in ${config.environment} mode`,
  );

  switch (config.gatewayType) {
    case "stripe":
      return processStripePayment(paymentDetails, config);
    case "paypal":
      return processPayPalPayment(paymentDetails, config);
    case "mock":
    default:
      return processMockPayment(paymentDetails, config);
  }
}

// Mock payment processor for testing
async function processMockPayment(
  paymentDetails: PaymentDetails,
  config: any,
): Promise<PaymentResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Success criteria based on configuration
  const successPattern = config.environment === "test" ? "4242" : "1111";

  if (paymentDetails.cardNumber.endsWith(successPattern)) {
    return {
      success: true,
      transactionId: `tx_${Math.random().toString(36).substring(2, 15)}`,
      gatewayResponse: {
        gateway: "mock",
        timestamp: new Date().toISOString(),
        environment: config.environment,
      },
    };
  } else {
    return {
      success: false,
      error: "Invalid card number or payment declined",
      gatewayResponse: {
        gateway: "mock",
        timestamp: new Date().toISOString(),
        environment: config.environment,
        declineCode: "card_declined",
      },
    };
  }
}

// Stripe payment processor (placeholder for real implementation)
async function processStripePayment(
  paymentDetails: PaymentDetails,
  config: any,
): Promise<PaymentResponse> {
  // In a real implementation, you would use the Stripe SDK here
  console.log("Would process with Stripe using API key:", config.apiKey);

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // For demo purposes, we'll simulate success in test mode with 4242
  if (
    config.environment === "test" &&
    paymentDetails.cardNumber.endsWith("4242")
  ) {
    return {
      success: true,
      transactionId: `stripe_${Date.now()}`,
      gatewayResponse: {
        gateway: "stripe",
        paymentIntentId: `pi_${Math.random().toString(36).substring(2, 10)}`,
        environment: config.environment,
      },
    };
  } else {
    return {
      success: false,
      error: "Payment failed. Please check your card details.",
      gatewayResponse: {
        gateway: "stripe",
        error: {
          type: "card_error",
          code: "card_declined",
        },
      },
    };
  }
}

// PayPal payment processor (placeholder for real implementation)
async function processPayPalPayment(
  paymentDetails: PaymentDetails,
  config: any,
): Promise<PaymentResponse> {
  // In a real implementation, you would use the PayPal SDK here
  console.log("Would process with PayPal using API key:", config.apiKey);

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // For demo purposes, we'll simulate success in test mode
  if (config.environment === "test") {
    return {
      success: true,
      transactionId: `paypal_${Date.now()}`,
      gatewayResponse: {
        gateway: "paypal",
        orderId: `order_${Math.random().toString(36).substring(2, 10)}`,
        environment: config.environment,
      },
    };
  } else {
    return {
      success: false,
      error: "PayPal payment failed. Please try again.",
      gatewayResponse: {
        gateway: "paypal",
        error: {
          name: "PAYMENT_ERROR",
          details: [{ issue: "INSTRUMENT_DECLINED" }],
        },
      },
    };
  }
}

export function getSubscriptionPrice(plan: string): number {
  switch (plan) {
    case "Basic":
      return 4.99;
    case "Family":
      return 9.99;
    case "Premium":
      return 14.99;
    default:
      return 0;
  }
}

// Validate card details based on gateway requirements
export function validateCardDetails(details: Partial<PaymentDetails>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  const config = getPaymentConfig();

  // Basic validation
  if (!details.cardName?.trim()) {
    errors.cardName = "Name is required";
  }

  if (!details.cardNumber?.trim()) {
    errors.cardNumber = "Card number is required";
  } else if (!/^\d{13,19}$/.test(details.cardNumber.replace(/\s/g, ""))) {
    errors.cardNumber = "Invalid card number format";
  }

  if (!details.expiryDate?.trim()) {
    errors.expiryDate = "Expiry date is required";
  } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(details.expiryDate)) {
    errors.expiryDate = "Invalid expiry date format (MM/YY)";
  }

  if (!details.cvc?.trim()) {
    errors.cvc = "CVC is required";
  } else if (!/^\d{3,4}$/.test(details.cvc)) {
    errors.cvc = "Invalid CVC format";
  }

  // Gateway-specific validation
  if (
    config.gatewayType === "stripe" &&
    details.cardNumber &&
    !details.cardNumber.match(/^(4|5|6)\d{15}$/)
  ) {
    errors.cardNumber = "This card type is not supported by Stripe";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
