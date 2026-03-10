import { Request, Response } from "express";
import { isClientReady } from "../services/whatsapp.service";
import { sendResponse } from "../utils/response";

export const getStatusController = (req: Request, res: Response): void => {
    const ready = isClientReady();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: ready ? "WhatsApp client is ready" : "WhatsApp client is initializing",
        data: {
            status: ready ? "ready" : "initializing",
        },
    });
};
