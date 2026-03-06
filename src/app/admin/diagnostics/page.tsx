"use client";

import { useState } from "react";

export default function DiagnosticsPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    setResults(null);

    try {
      // Test checkout configuration
      const checkoutResponse = await fetch("/api/debug/test-checkout");
      const checkoutData = await checkoutResponse.json();

      // Check webhook logs and orders
      const webhookResponse = await fetch("/api/debug/webhook-logs");
      const webhookData = await webhookResponse.json();

      setResults({
        checkout: checkoutData,
        webhooks: webhookData,
      });
    } catch (error: any) {
      setResults({
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/debug/create-test-order", { method: "POST" });
      const data = await response.json();
      
      if (data.success) {
        alert("✅ Test order created! Check /admin/orders");
        // Refresh diagnostics
        runDiagnostics();
      } else {
        alert("❌ Failed: " + data.error);
      }
    } catch (error: any) {
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-primary mb-6">System Diagnostics</h1>
      <p className="text-text-secondary mb-8">
        Test checkout configuration and troubleshoot issues.
      </p>

      <div className="flex gap-4 mb-8">
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Running Tests..." : "Run Diagnostics"}
        </button>
        <button
          onClick={createTestOrder}
          disabled={loading}
          className="bg-surface border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-surface-hover transition disabled:opacity-50"
        >
          Create Test Order
        </button>
      </div>

      {results && (
        <div className="space-y-6">
          {/* Checkout Test Results */}
          {results.checkout && (
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text-primary">Checkout Configuration</h2>
                {results.checkout.success ? (
                  <span className="text-success text-2xl">✅</span>
                ) : (
                  <span className="text-danger text-2xl">❌</span>
                )}
              </div>

              {/* Environment Variables */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-text-secondary mb-2">Environment Variables</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={results.checkout.results?.environment?.hasPublicKey ? "text-success" : "text-danger"}>
                      {results.checkout.results?.environment?.hasPublicKey ? "✓" : "✗"}
                    </span>
                    <span>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={results.checkout.results?.environment?.hasSecretKey ? "text-success" : "text-danger"}>
                      {results.checkout.results?.environment?.hasSecretKey ? "✓" : "✗"}
                    </span>
                    <span>STRIPE_SECRET_KEY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={results.checkout.results?.environment?.hasWebhookSecret ? "text-success" : "text-danger"}>
                      {results.checkout.results?.environment?.hasWebhookSecret ? "✓" : "✗"}
                    </span>
                    <span>STRIPE_WEBHOOK_SECRET</span>
                  </div>
                  <div className="text-text-muted mt-2">
                    Site URL: {results.checkout.results?.environment?.siteUrl || "Not set"}
                  </div>
                </div>
              </div>

              {/* Stripe Configuration */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-text-secondary mb-2">Stripe Status</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={results.checkout.results?.stripe?.configured ? "text-success" : "text-danger"}>
                      {results.checkout.results?.stripe?.configured ? "✓" : "✗"}
                    </span>
                    <span>Stripe Configured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={results.checkout.results?.stripe?.canCreateSession ? "text-success" : "text-danger"}>
                      {results.checkout.results?.stripe?.canCreateSession ? "✓" : "✗"}
                    </span>
                    <span>Can Create Checkout Sessions</span>
                  </div>
                  {results.checkout.results?.stripe?.testMode !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className={results.checkout.results?.stripe?.testMode ? "text-warning" : "text-success"}>
                        {results.checkout.results?.stripe?.testMode ? "⚠️" : "✓"}
                      </span>
                      <span>Mode: {results.checkout.results?.stripe?.testMode ? "Test" : "Live"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Errors */}
              {results.checkout.results?.stripe?.error && (
                <div className="bg-danger/20 border border-danger text-danger px-4 py-3 rounded-lg">
                  <strong className="block mb-1">Error:</strong>
                  <code className="text-sm">{results.checkout.results.stripe.error}</code>
                  {results.checkout.results.stripe.errorType && (
                    <div className="text-xs mt-1">Type: {results.checkout.results.stripe.errorType}</div>
                  )}
                </div>
              )}

              {results.checkout.error && (
                <div className="bg-danger/20 border border-danger text-danger px-4 py-3 rounded-lg">
                  <strong className="block mb-1">Error:</strong>
                  <code className="text-sm">{results.checkout.error}</code>
                </div>
              )}

              {/* Success Details */}
              {results.checkout.success && results.checkout.results?.stripe?.testSessionId && (
                <div className="bg-success/20 border border-success text-success px-4 py-3 rounded-lg mt-4">
                  <strong className="block mb-1">✅ Stripe is working!</strong>
                  <div className="text-sm">
                    Test session created: <code>{results.checkout.results.stripe.testSessionId}</code>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Webhook Status */}
          {results.webhooks && (
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text-primary">Webhook & Orders</h2>
                {results.webhooks.success ? (
                  <span className="text-success text-2xl">✅</span>
                ) : (
                  <span className="text-danger text-2xl">❌</span>
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-text-secondary mb-2">Orders in Database</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={results.webhooks.ordersCount > 0 ? "text-success" : "text-warning"}>
                      {results.webhooks.ordersCount > 0 ? "✓" : "⚠️"}
                    </span>
                    <span>{results.webhooks.ordersCount} order(s) found</span>
                  </div>
                  {results.webhooks.ordersCount === 0 && (
                    <p className="text-text-muted text-xs mt-2">
                      No orders yet. Either no purchases have been made, or the webhook isn't creating orders.
                    </p>
                  )}
                </div>
              </div>

              {results.webhooks.orders && results.webhooks.orders.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text-secondary mb-2">Recent Orders</h3>
                  <div className="space-y-2">
                    {results.webhooks.orders.slice(0, 3).map((order: any) => (
                      <div key={order.id} className="bg-background border border-border rounded p-2 text-xs">
                        <div className="font-semibold text-primary">{order.id}</div>
                        <div className="text-text-secondary">
                          {order.customerEmail || "No email"} • ${order.amount || "0.00"}
                        </div>
                        <div className="text-text-muted">
                          {order.createdAt || "No timestamp"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.webhooks.error && (
                <div className="bg-danger/20 border border-danger text-danger px-4 py-3 rounded-lg">
                  <strong className="block mb-1">Error checking webhooks:</strong>
                  <code className="text-sm">{results.webhooks.error}</code>
                </div>
              )}
            </div>
          )}

          {/* Raw JSON (for debugging) */}
          <details className="bg-background border border-border rounded-lg p-4">
            <summary className="cursor-pointer font-semibold text-text-primary">
              Raw Results (for developers)
            </summary>
            <pre className="mt-4 text-xs text-text-secondary overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
