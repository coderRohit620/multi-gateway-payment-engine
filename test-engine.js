const PORT = process.env.PORT || 8000;
const BASE_URL = `http://localhost:${PORT}/api/v1/payments`;

async function makeRequest(body, headers = {}) {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(body)
        });
        const status = response.status;
        const data = await response.json().catch(() => ({}));
        return { status, data };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

async function runTests() {
    console.log("🚀 Starting Multi-Gateway Payment Engine Integration Tests...\n");

    const idempotencyKey = `test-key-${Date.now()}`;
    const payload = {
        amount: 3000,
        currency: "INR",
        userId: "user_test_99",
        paymentMethod: "UPI"
    };

    // Test 1: First payment attempt
    console.log(`[Test 1] Executing first payment request with key: ${idempotencyKey}`);
    const res1 = await makeRequest(payload, { 'x-idempotency-key': idempotencyKey });
    console.log(`Response Status: ${res1.status}`);
    console.log("Response Body:", JSON.stringify(res1.data, null, 2));
    console.log("-----------------------------------------------------------------\n");

    // Test 2: Double Spend / Idempotent duplicate check
    console.log(`[Test 2] Attempting duplicate payment with same key: ${idempotencyKey}`);
    const res2 = await makeRequest(payload, { 'x-idempotency-key': idempotencyKey });
    console.log(`Response Status: ${res2.status}`);
    console.log("Response Body (should return cached response):", JSON.stringify(res2.data, null, 2));
    console.log("-----------------------------------------------------------------\n");

    // Test 3: High amount routing (should route to STRIPE -> RAZORPAY)
    const highAmountKey = `test-key-high-${Date.now()}`;
    const highAmountPayload = {
        amount: 8000,
        currency: "INR",
        userId: "user_test_99",
        paymentMethod: "CARD"
    };
    console.log(`[Test 3] Requesting high amount (8000) for CARD. Should route to STRIPE -> RAZORPAY.`);
    const res3 = await makeRequest(highAmountPayload, { 'x-idempotency-key': highAmountKey });
    console.log(`Response Status: ${res3.status}`);
    console.log("Response Body:", JSON.stringify(res3.data, null, 2));
    console.log("-----------------------------------------------------------------\n");

    // Test 4: Missing field validation test
    const invalidPayload = {
        currency: "INR",
        userId: "user_test_99"
    };
    console.log("[Test 4] Request with missing fields (should trigger error handler middleware)");
    const res4 = await makeRequest(invalidPayload, { 'x-idempotency-key': `test-invalid-${Date.now()}` });
    console.log(`Response Status: ${res4.status}`);
    console.log("Response Body:", JSON.stringify(res4.data, null, 2));
    console.log("-----------------------------------------------------------------\n");

    console.log("🏁 All tests completed.");
}

runTests();
