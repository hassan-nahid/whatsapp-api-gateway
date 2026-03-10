import rateLimit from "express-rate-limit";

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10);
const max = parseInt(process.env.RATE_LIMIT_MAX || "100", 10);

export const rateLimiter = rateLimit({
    windowMs,
    max,
    message: {
        success: false,
        message: 'Too many requests, please try again after 15 minutes',
    },
});