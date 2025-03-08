// This is a mock payment processor for demonstration purposes
// In a production app, you would integrate with a real payment processor like Stripe

export interface PaymentDetails {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  plan: string;
  amount: number;
}

export async function processPayment(paymentDetails: PaymentDetails): Promise<{
  success: boolean;
  transactionId?: string;
  error?: string;
}> {
  // In a real app, this would call your payment processor's API
  // For demo purposes, we'll simulate a successful payment if the card number ends with "4242"
  // and a failed payment otherwise

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (paymentDetails.cardNumber.endsWith("4242")) {
    return {
      success: true,
      transactionId: `tx_${Math.random().toString(36).substring(2, 15)}`,
    };
  } else {
    return {
      success: false,
      error: "Invalid card number or payment declined",
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
