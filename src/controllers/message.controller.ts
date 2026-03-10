import { Request, Response, NextFunction } from "express";
import { addToQueue } from "../services/queue.service";
import { sendMessage } from "../services/whatsapp.service";
import { sendResponse } from "../utils/response";

export const sendMessageController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { phone, message } = req.body;

        addToQueue(() => sendMessage(phone, message));

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Message queued successfully',
            data: null,
        });
    } catch (error) {
        next(error);
    }
}