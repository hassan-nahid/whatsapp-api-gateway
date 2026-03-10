import { Request, Response, NextFunction } from "express";
import { addToQueue } from "../services/queue.service";
import { sendMessage, isClientReady } from "../services/whatsapp.service";
import { sendResponse } from "../utils/response";

export const sendMessageController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { phone, message } = req.body;

        if (!isClientReady()) {
            throw new Error('WhatsApp client is not ready');
        }

        await addToQueue(() => sendMessage(phone, message));

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