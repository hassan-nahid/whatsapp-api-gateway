import { Request, Response, NextFunction } from 'express';
import { sendMessageController } from '../controllers/message.controller';

jest.mock('../services/queue.service', () => ({
    addToQueue: jest.fn(),
}));

jest.mock('../services/whatsapp.service', () => ({
    sendMessage: jest.fn(),
}));

import { addToQueue } from '../services/queue.service';

const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext: NextFunction = jest.fn();

describe('sendMessageController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should queue the message and return 200', async () => {
        const req = { body: { phone: '8801711111111', message: 'Hello' } } as Request;
        const res = mockRes();

        await sendMessageController(req, res, mockNext);

        expect(addToQueue).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: 'Message queued successfully',
            })
        );
    });

    it('should call next(error) when addToQueue throws', async () => {
        const error = new Error('Queue error');
        (addToQueue as jest.Mock).mockImplementationOnce(() => {
            throw error;
        });

        const req = { body: { phone: '8801711111111', message: 'Hello' } } as Request;
        const res = mockRes();

        await sendMessageController(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should pass the correct phone and message to addToQueue', async () => {
        const req = { body: { phone: '8801999999999', message: 'Test message' } } as Request;
        const res = mockRes();

        await sendMessageController(req, res, mockNext);

        expect(addToQueue).toHaveBeenCalledWith(expect.any(Function));
    });
});
