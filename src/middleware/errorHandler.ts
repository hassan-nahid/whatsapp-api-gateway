import { Request, Response, NextFunction } from "express";

import logger from "../config/logger";
import { sendResponse } from "../utils/response";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error(err.message, {
        stack: err.stack,
        method: req.method,
        url: req.url,
    });

    sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
        data: null,
    });
}