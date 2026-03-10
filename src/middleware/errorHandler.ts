import { Request, Response, NextFunction } from "express";

import logger from "../config/logger";
import { sendResponse } from "../utils/response";

const ERROR_STATUS_MAP: Record<string, number> = {
    'WhatsApp client is not ready': 503,
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = ERROR_STATUS_MAP[err.message] ?? 500;

    logger.error(err.message, {
        stack: err.stack,
        method: req.method,
        url: req.url,
        statusCode,
    });

    const message = statusCode === 503
        ? 'WhatsApp client is not ready. Please scan the QR code first.'
        : 'An unexpected error occurred. Please try again later.';

    sendResponse(res, {
        statusCode,
        success: false,
        message,
        data: null,
    });
}