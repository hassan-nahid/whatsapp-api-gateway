import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { sendResponse } from "../utils/response";

const messageSchema = z.object({
    phone: z.string()
        .regex(/^\+?\d{10,15}$/, { message: 'Phone number must be 10–15 digits and may start with +' }),
    message: z.string()
        .min(1, { message: 'Message cannot be empty' })
        .max(1000, { message: 'Message must not exceed 1000 characters' }),
});

export const validateMessage = (req: Request, res: Response, next: NextFunction): void => {

    const result = messageSchema.safeParse(req.body);
    if (!result.success) {
        sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Validation failed',
            data: result.error.flatten().fieldErrors,
        });
        return;
    }

    next();
}