# WhatsApp API Gateway

A production-ready Node.js backend that exposes a RESTful API to send WhatsApp messages via WhatsApp Web. Authentication is handled through QR code scanning, transmitted in real-time using Socket.IO. Session persistence ensures re-authentication is not required after server restart.

---

## Features

- QR code authentication via WhatsApp Web
- Real-time QR delivery to clients using Socket.IO
- Session persistence using `LocalAuth` (no re-scan after restart)
- Automatic reconnection on disconnection
- REST API to send WhatsApp messages
- Request validation (Zod)
- Concurrent request queuing (p-queue)
- Centralized error handling
- Structured logging (Winston)
- Rate limiting (express-rate-limit)
- Security hardening (Helmet, CORS)
- Graceful shutdown handling

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **WhatsApp:** whatsapp-web.js
- **Realtime:** Socket.IO
- **Validation:** Zod
- **Queue:** p-queue
- **Logging:** Winston
- **Testing:** Jest + Supertest

---

## Prerequisites

- Node.js v18+
- Google Chrome or Chromium installed (required by whatsapp-web.js/Puppeteer)
- A WhatsApp account on your mobile phone

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/hassan-nahid/whatsapp-api-gateway.git

cd whatsapp-api-gateway
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` as needed (see [Environment Variables](#environment-variables) below).

### 4. Run in development mode

```bash
npm run dev
```

### 5. Build and run in production

```bash
npm run build
npm start
```

---

## Environment Variables

Copy `.env.example` to `.env` and adjust values:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | HTTP server port |
| `NODE_ENV` | `development` | Environment (`development` / `production`) |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window in milliseconds (15 minutes) |
| `RATE_LIMIT_MAX` | `100` | Maximum requests per window per IP |
| `QUEUE_CONCURRENCY` | `5` | Number of concurrent WhatsApp message tasks |

---

## QR Code Authentication

1. Start the server (`npm run dev`)
2. Open the browser and connect to the Socket.IO server on `http://localhost:5000`
3. Listen for the `qr` event — the raw QR string will be emitted
4. Alternatively, the QR code is printed directly in the server terminal (small ASCII art)
5. Scan the QR code with your WhatsApp mobile app
6. Once authenticated, the server logs `WhatsApp client is ready`

Session data is stored in `.wwebjs_auth/` directory. On subsequent server restarts, authentication is restored automatically without re-scanning.

---

## API Reference

### Check WhatsApp Status

```
GET /api/status
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "WhatsApp client is ready",
  "data": {
    "status": "ready"
  }
}
```

| `status` value | Meaning |
|---|---|
| `ready` | Client authenticated and connected |
| `initializing` | Client still starting up or authenticating |

---

### Send a WhatsApp Message

```
POST /api/messages
```

**Request Body (JSON):**

| Field | Type | Required | Description |
|---|---|---|---|
| `phone` | string | ✅ | Target phone number (10–15 digits, with or without `+` prefix) |
| `message` | string | ✅ | Message text (1–1000 characters) |

**Example Request:**
```json
{
  "phone": "8801711111111",
  "message": "Hello from WhatsApp API Gateway!"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Message queued successfully",
  "data": null
}
```

**Validation Error Response (400):**
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation failed",
  "data": {
    "phone": ["Phone number must be at least 10 digits"]
  }
}
```

**Service Unavailable Response (503):**
```json
{
  "statusCode": 503,
  "success": false,
  "message": "WhatsApp client is not ready. Please scan the QR code first.",
  "data": null
}
```

**Rate Limited Response (429):**
```json
{
  "success": false,
  "message": "Too many requests, please try again after 15 minutes"
}
```

---

## Socket.IO Events

Connect to the server using any Socket.IO client:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('qr', (qrString) => {
  // render QR code from qrString using a QR library
  console.log('Scan this QR:', qrString);
});
```

| Event | Direction | Description |
|---|---|---|
| `qr` | Server → Client | Emitted when a new QR code is generated |

---

## Project Structure

```
src/
├── app.ts                  # Express app setup (middleware, routes)
├── server.ts               # HTTP server, Socket.IO, startup & shutdown
├── config/
│   └── logger.ts           # Winston logger configuration
├── controllers/
│   ├── message.controller.ts
│   └── status.controller.ts
├── middleware/
│   ├── errorHandler.ts     # Centralized error handler
│   ├── rateLimiter.ts      # Rate limiting middleware
│   └── validate.ts         # Zod request validation
├── routes/
│   ├── message.routes.ts
│   └── status.routes.ts
├── services/
│   ├── queue.service.ts    # p-queue concurrency management
│   └── whatsapp.service.ts # whatsapp-web.js client management
├── sockets/
│   └── qr.socket.ts        # Socket.IO connection handling
└── utils/
    └── response.ts         # Standardized JSON response helper
```

---

## Running Tests

```bash
npm test
```

Tests cover:
- Message controller (unit)
- Message routes (integration via Supertest)
- Queue service (unit)
- Validate middleware (unit)
- Response utility (unit)

---

## Postman Collection

A Postman collection is included in the repository root:

```
WhatsApp_Api_Gateway.postman_collection.json
```

Import it into Postman to test all endpoints immediately.

---

## Logs

Log files are written to the `logs/` directory:

| File | Content |
|---|---|
| `logs/combined.log` | All log levels |
| `logs/error.log` | Error-level logs only |

---

## Security Notes

- `helmet` sets secure HTTP headers
- `cors` is enabled (configure `origin` in production)
- Rate limiting prevents abuse (100 req / 15 min per IP by default)
- `.env` and `.wwebjs_auth/` are excluded from Git via `.gitignore`
