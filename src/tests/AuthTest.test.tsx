import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

/**
 * This component is used to test the authentication functionality.
 * It provides a simple interface to test login, registration, and profile updates.
 */
export default function AuthTest() {
  const { user, login, register, logout, updateUserProfile, isLoading, error } =
    useAuth();

  const [testEmail, setTestEmail] = useState("demo@example.com");
  const [testPassword, setTestPassword] = useState("password");
  const [testName, setTestName] = useState("Test User");
  const [testIsParent, setTestIsParent] = useState(false);

  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Test login
  const testLogin = async () => {
    setTestResult(null);
    try {
      const success = await login(testEmail, testPassword);
      setTestResult({
        success,
        message: success
          ? `Successfully logged in as ${testEmail}`
          : `Failed to log in: ${error || "Unknown error"}`,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Error during login: ${err.message}`,
      });
    }
  };

  // Test registration
  const testRegister = async () => {
    setTestResult(null);
    try {
      const success = await register({
        name: testName,
        email: testEmail,
        password: testPassword,
        isParent: testIsParent,
      });

      setTestResult({
        success,
        message: success
          ? `Successfully registered account for ${testEmail}`
          : `Failed to register: ${error || "Unknown error"}`,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Error during registration: ${err.message}`,
      });
    }
  };

  // Test logout
  const testLogout = async () => {
    setTestResult(null);
    try {
      await logout();
      setTestResult({
        success: true,
        message: "Successfully logged out",
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Error during logout: ${err.message}`,
      });
    }
  };

  // Test profile update
  const testUpdateProfile = async () => {
    setTestResult(null);
    if (!user) {
      setTestResult({
        success: false,
        message: "No user logged in",
      });
      return;
    }

    try {
      const success = await updateUserProfile({
        name: testName,
      });

      setTestResult({
        success,
        message: success
          ? `Successfully updated profile name to ${testName}`
          : `Failed to update profile: ${error || "Unknown error"}`,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Error during profile update: ${err.message}`,
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Authentication Test Suite</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Auth State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">User:</h3>
                {user ? (
                  <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                ) : (
                  <p className="text-muted-foreground">Not logged in</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold">Loading State:</h3>
                <p>{isLoading ? "Loading..." : "Idle"}</p>
              </div>

              <div>
                <h3 className="font-semibold">Error:</h3>
                {error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <p className="text-muted-foreground">No errors</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {testResult ? (
              <div
                className={`p-4 rounded ${testResult.success ? "bg-green-100" : "bg-red-100"}`}
              >
                <h3 className="font-semibold mb-2">
                  {testResult.success ? "Success" : "Failure"}
                </h3>
                <p>{testResult.message}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Run a test to see results</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test: Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-email">Email</Label>
                <Input
                  id="test-email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-password">Password</Label>
                <Input
                  id="test-password"
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="password"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-name">Name</Label>
                <Input
                  id="test-name"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Test User"
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="test-is-parent"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={testIsParent}
                  onChange={(e) => setTestIsParent(e.target.checked)}
                  title="Check if this is a parent account"  // Add this title
                />
                <Label htmlFor="test-is-parent">Is Parent Account</Label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button
                onClick={testLogin}
                disabled={isLoading}
                className="w-full"
              >
                Test Login
              </Button>

              <Button
                onClick={testRegister}
                disabled={isLoading}
                className="w-full"
              >
                Test Register
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={testUpdateProfile}
                disabled={isLoading || !user}
                className="w-full"
              >
                Test Update Profile
              </Button>

              <Button
                onClick={testLogout}
                disabled={isLoading || !user}
                className="w-full"
                variant="outline"
              >
                Test Logout
              </Button>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">Testing Instructions:</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  • For demo login: use <strong>demo@example.com</strong> /{" "}
                  <strong>password</strong>
                </li>
                <li>
                  • For demo parent login: use{" "}
                  <strong>parent@example.com</strong> /{" "}
                  <strong>password</strong>
                </li>
                <li>• For registration: use any email that looks valid</li>
                <li>
                  • When Supabase is connected, real authentication will be used
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
