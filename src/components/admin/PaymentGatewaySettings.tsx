import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Check, CreditCard, RefreshCw } from "lucide-react";
import {
  getPaymentConfig,
  updatePaymentConfig,
  resetPaymentConfig,
  PaymentGatewayConfig,
} from "@/lib/paymentConfig";
import { validateCardDetails } from "@/lib/payment";

export default function PaymentGatewaySettings() {
  const [config, setConfig] =
    useState<PaymentGatewayConfig>(getPaymentConfig());
  const [activeTab, setActiveTab] = useState("general");
  const [testCardNumber, setTestCardNumber] = useState("4242 4242 4242 4242");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState("");

  // Update local state when config changes
  const handleConfigChange = (key: keyof PaymentGatewayConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save configuration changes
  const handleSaveConfig = () => {
    updatePaymentConfig(config);
    setShowSuccessMessage("Payment gateway configuration saved successfully!");
    setTimeout(() => setShowSuccessMessage(""), 3000);
  };

  // Reset to default configuration
  const handleResetConfig = () => {
    const defaultConfig = resetPaymentConfig();
    setConfig(defaultConfig);
    setShowSuccessMessage("Payment gateway configuration reset to defaults");
    setTimeout(() => setShowSuccessMessage(""), 3000);
  };

  // Test the payment gateway
  const handleTestGateway = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Import payment processor
      const { processPayment } = await import("@/lib/payment");

      // Process a test payment
      const result = await processPayment({
        cardName: "Test User",
        cardNumber: testCardNumber.replace(/\s/g, ""),
        expiryDate: "12/25",
        cvc: "123",
        plan: "Test Plan",
        amount: 1.0,
      });

      if (result.success) {
        setTestResult({
          success: true,
          message: `Test payment successful! Transaction ID: ${result.transactionId}`,
        });
      } else {
        setTestResult({
          success: false,
          message: result.error || "Test payment failed",
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "An unexpected error occurred during the test",
      });
      console.error("Payment test error:", error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center shadow-md">
          <Check className="h-5 w-5 mr-2" />
          {showSuccessMessage}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment Gateway Configuration</h1>
        <Button variant="outline" onClick={handleResetConfig}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="gateway">Gateway Configuration</TabsTrigger>
          <TabsTrigger value="test">Test Gateway</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Payment Settings</CardTitle>
              <CardDescription>
                Configure basic payment settings for your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={config.currency}
                  onValueChange={(value) =>
                    handleConfigChange("currency", value)
                  }
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Environment</Label>
                <RadioGroup
                  value={config.environment}
                  onValueChange={(value) =>
                    handleConfigChange(
                      "environment",
                      value as "test" | "production",
                    )
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="test" id="env-test" />
                    <Label htmlFor="env-test">Test Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="production" id="env-prod" />
                    <Label htmlFor="env-prod">Production Mode</Label>
                  </div>
                </RadioGroup>
                {config.environment === "test" && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Test mode is active. No real payments will be processed.
                  </p>
                )}
                {config.environment === "production" && (
                  <p className="text-sm text-yellow-600 mt-2">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Warning: Production mode will process real payments!
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Supported Card Types</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["visa", "mastercard", "amex", "discover"].map((card) => (
                    <div key={card} className="flex items-center space-x-2">
                      <Switch
                        id={`card-${card}`}
                        checked={config.supportedCards.includes(card)}
                        onCheckedChange={(checked) => {
                          const newCards = checked
                            ? [...config.supportedCards, card]
                            : config.supportedCards.filter((c) => c !== card);
                          handleConfigChange("supportedCards", newCards);
                        }}
                      />
                      <Label htmlFor={`card-${card}`} className="capitalize">
                        {card}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gateway" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Selection</CardTitle>
              <CardDescription>
                Choose and configure your payment gateway
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Gateway Provider</Label>
                <RadioGroup
                  value={config.gatewayType}
                  onValueChange={(value) =>
                    handleConfigChange(
                      "gatewayType",
                      value as "stripe" | "paypal" | "mock",
                    )
                  }
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 p-2 border rounded-md">
                    <RadioGroupItem value="stripe" id="gateway-stripe" />
                    <Label htmlFor="gateway-stripe" className="flex-1">
                      Stripe
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      Credit/Debit Cards, Apple Pay, Google Pay
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded-md">
                    <RadioGroupItem value="paypal" id="gateway-paypal" />
                    <Label htmlFor="gateway-paypal" className="flex-1">
                      PayPal
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      PayPal, Credit/Debit Cards
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded-md">
                    <RadioGroupItem value="mock" id="gateway-mock" />
                    <Label htmlFor="gateway-mock" className="flex-1">
                      Mock Gateway (Testing)
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      For development and testing only
                    </span>
                  </div>
                </RadioGroup>
              </div>

              {config.gatewayType === "stripe" && (
                <div className="space-y-4 p-4 border rounded-md">
                  <h3 className="font-medium">Stripe Configuration</h3>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-api-key">API Key</Label>
                    <Input
                      id="stripe-api-key"
                      value={config.apiKey}
                      onChange={(e) =>
                        handleConfigChange("apiKey", e.target.value)
                      }
                      placeholder="pk_test_..."
                    />
                    <p className="text-xs text-muted-foreground">
                      {config.environment === "test"
                        ? "Use your Stripe test API key"
                        : "Use your Stripe live API key"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret-key">Secret Key</Label>
                    <Input
                      id="stripe-secret-key"
                      type="password"
                      value={config.secretKey || ""}
                      onChange={(e) =>
                        handleConfigChange("secretKey", e.target.value)
                      }
                      placeholder="sk_test_..."
                    />
                    <p className="text-xs text-muted-foreground">
                      This would typically be stored securely on your server
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-webhook">Webhook URL</Label>
                    <Input
                      id="stripe-webhook"
                      value={config.webhookUrl || ""}
                      onChange={(e) =>
                        handleConfigChange("webhookUrl", e.target.value)
                      }
                      placeholder="https://your-domain.com/api/stripe-webhook"
                    />
                  </div>
                </div>
              )}

              {config.gatewayType === "paypal" && (
                <div className="space-y-4 p-4 border rounded-md">
                  <h3 className="font-medium">PayPal Configuration</h3>
                  <div className="space-y-2">
                    <Label htmlFor="paypal-client-id">Client ID</Label>
                    <Input
                      id="paypal-client-id"
                      value={config.apiKey}
                      onChange={(e) =>
                        handleConfigChange("apiKey", e.target.value)
                      }
                      placeholder="AeJIH..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paypal-secret">Secret</Label>
                    <Input
                      id="paypal-secret"
                      type="password"
                      value={config.secretKey || ""}
                      onChange={(e) =>
                        handleConfigChange("secretKey", e.target.value)
                      }
                      placeholder="EGNh..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paypal-webhook">Webhook URL</Label>
                    <Input
                      id="paypal-webhook"
                      value={config.webhookUrl || ""}
                      onChange={(e) =>
                        handleConfigChange("webhookUrl", e.target.value)
                      }
                      placeholder="https://your-domain.com/api/paypal-webhook"
                    />
                  </div>
                </div>
              )}

              {config.gatewayType === "mock" && (
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm">
                    The mock gateway is for testing only. In test mode, card
                    numbers ending with "4242" will result in successful
                    payments.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Payment Gateway</CardTitle>
              <CardDescription>
                Verify your payment gateway configuration with a test
                transaction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-medium flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Current Configuration
                </h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <strong>Gateway:</strong> {config.gatewayType}
                  </p>
                  <p>
                    <strong>Environment:</strong> {config.environment}
                  </p>
                  <p>
                    <strong>Currency:</strong> {config.currency}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-card-number">Test Card Number</Label>
                <Input
                  id="test-card-number"
                  value={testCardNumber}
                  onChange={(e) => setTestCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                />
                <p className="text-xs text-muted-foreground">
                  For successful test payments, use a card number ending with
                  "4242"
                </p>
              </div>

              <Button
                onClick={handleTestGateway}
                disabled={isTesting}
                className="w-full"
              >
                {isTesting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Test Payment...
                  </>
                ) : (
                  "Run Test Transaction"
                )}
              </Button>

              {testResult && (
                <div
                  className={`p-4 rounded mt-4 ${testResult.success ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}
                >
                  {testResult.success ? (
                    <Check className="h-5 w-5 inline mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 inline mr-2" />
                  )}
                  {testResult.message}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveConfig}>Save Configuration</Button>
      </div>
    </div>
  );
}
