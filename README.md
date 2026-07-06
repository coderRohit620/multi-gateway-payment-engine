# Multi-Gateway Payment Orchestration Engine

A robust, scalable backend system built on Node.js, Express, and Mongoose that orchestrates payment processing across multiple payment gateways (Stripe, Razorpay, and simulated UPI) with intelligent routing, automatic gateway failovers/retries, data telemetry, and API idempotency lock management.

---

## 🏗️ Architecture & Folder Structure

The project follows clean-architecture principles, isolating database storage, presentation (routes/controllers/middlewares), business rules (routing/orchestration), and adapter patterns (gateways) into distinct modules:

```
src/
├── server.js                        # App entry point, DB loader, HTTP listener
├── app.js                           # Express middleware and routing configuration
├── api/
│   ├── controllers/
│   │   └── payment.controller.js    # Standardized handlers processing client input
│   ├── middlewares/
│   │   ├── error.middleware.js      # Global JSON structured API error handler
│   │   └── idempotency.middleware.js# Key validator parsing X-Idempotency-Key
│   └── routes/
│       └── payment.routes.js        # Mounts routes and maps middlewares
├── config/
│   ├── db.js                        # MongoDB Mongoose connection client
│   └── redis.js                     # Cache client placeholder
├── db/
│   ├── models/
│   │   ├── idempotency.model.js     # Cache tracking schema with 24h auto-expiry TTL
│   │   ├── metrics.model.js         # Telemetry schemas capturing response times
│   │   └── payment.model.js         # Schema log defining status & gateway attempts array
│   └── repositories/
│       ├── idempotency.repository.js# Key status database query access methods
│       └── payment.repository.js    # Payment records query operations
├── gateways/
│   ├── gateway.factory.js           # Decouples handler resolution from business flows
│   ├── razorpay.gateway.js          # Mock gateway with ~12% failure & delay delay
│   ├── stripe.gateway.js            # Mock gateway with ~18% failure & delay delay
│   └── upiMock.gateway.js           # Mock gateway with ~30% failure & delay delay
├── idempotency/
│   └── idempotency.service.js       # Business services verifying idempotency cache
├── metrics/
│   └── metrics.service.js           # Service recording gateway performance database records
├── orchestration/
│   ├── orchestrator.js              # Orchestrator flow mapping payment state transitions
│   ├── retryEngine.js               # Retry loop attempting gateways sequentially
│   └── stateMachine.js              # Transitions payments between status enums
├── routing/
│   ├── routingEngine.js             # Selects gateways lists based on amount thresholds
│   └── rules.routing.js             # Configuration rules defining gateway lists
└── utils/
    ├── apiError.js                  # Standardized Class structure representing failures
    ├── apiResponse.js               # Consistent payload envelope returning JSON
    ├── asyncHandler.js              # Express controller runtime wrapper
    ├── constants.js                 # Global constants (DB names, etc)
    └── logger.js                    # Console logging helper
```

---

## ⚙️ Setup & Configuration

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (running locally or a cloud instance URI)

### Installation
1. Install node dependencies:
   ```bash
   npm install
   ```

2. Create an `.env` file in the root directory (defaults are provided inside `.env` already):
   ```ini
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/payment-orchestration
   CORS_ORIGIN=*
   ```

3. Start the application in development mode:
   ```bash
   npm run dev
   ```

---

## 📡 API Reference

### 1. Process Payment
*   **URL**: `/api/v1/payments`
*   **Method**: `POST`
*   **Headers**:
    *   `Content-Type: application/json`
    *   `X-Idempotency-Key: <unique-string>` (Required. Prevents duplicate payments)
*   **Request Body**:
    ```json
    {
      "amount": 3000,
      "currency": "INR",
      "userId": "user_123",
      "paymentMethod": "UPI"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "statusCode": 200,
      "data": {
        "_id": "64a4b8df...",
        "amount": 3000,
        "currency": "INR",
        "userId": "user_123",
        "paymentMethod": "UPI",
        "status": "SUCCESS",
        "gatewayUsed": "UPI_MOCK",
        "attempts": [
          {
            "gateway": "UPI_MOCK",
            "status": "SUCCESS",
            "_id": "64a4b8e0..."
          }
        ],
        "createdAt": "2026-07-06...",
        "updatedAt": "2026-07-06..."
      },
      "message": "Payment processed successfully",
      "success": true
    }
    ```

### 2. Service Health
*   **URL**: `/api/v1/payments/health`
*   **Method**: `GET`
*   **Success Response (200 OK)**:
    ```json
    {
      "Message": "payment API working"
    }
    ```

---

## ⚙️ How it Works

1.  **Idempotency Protection**: When a POST request arrives, the `idempotencyMiddleware` checks for `X-Idempotency-Key`. 
    *   If the key exists with `PROCESSING`, it returns a `409` conflict error (preventing double spend).
    *   If it exists with `COMPLETED`, it immediately serves the cached JSON response.
    *   If it doesn't exist, it logs it as `PROCESSING` and moves forward.
2.  **Routing Selection**: The routing engine (`routingEngine.js`) inspects the request context:
    *   If `paymentMethod` is `UPI`, it routes to `["UPI_MOCK", "RAZORPAY"]`.
    *   If `amount > 5000`, it routes to `["STRIPE", "RAZORPAY"]`.
    *   Otherwise, it routes to `["RAZORPAY", "STRIPE"]`.
3.  **Automatic Failover & Retry**: The retry engine loops through the selected list. For each gateway, it tries up to 2 times. If one fails, it tries the next gateway.
4.  **Telemetry & Metrics**: Every gateway execution (both success and failure) tracks latency (ms) and is saved as a log record in the `metrics` collection.
5.  **Completion & Cleanup**: The transaction status changes to `SUCCESS` or `FAILED`, the record is saved, and the idempotency cache is saved as `COMPLETED`.

---

## 🧪 Running Local Verification tests

We've provided a test client to execute transaction flows and verify engine robustness.

1. Ensure the server is running (`npm run dev`).
2. Run the test script in a separate terminal:
   ```bash
   node test-engine.js
   ```
This will automatically execute API tests validating single success charges, idempotent request caching, gateway failover routing rules, and validation exceptions.
