import { Response } from 'express';
import { sendResponse } from '../utils/response';

const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('sendResponse utility', () => {
    it('should respond with correct statusCode and success true', () => {
        const res = mockRes();

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Message queued successfully',
            data: null,
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 200,
                success: true,
                message: 'Message queued successfully',
                data: null,
            })
        );
    });

    it('should respond with 400 and success false for error', () => {
        const res = mockRes();

        sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Validation failed',
            data: { phone: ['Phone number must be at least 10 digits'] },
        });

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 400,
                success: false,
                message: 'Validation failed',
            })
        );
    });

    it('should include meta when provided', () => {
        const res = mockRes();
        const meta = { page: 1, limit: 10, totalPage: 5, total: 50 };

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'List fetched',
            data: [],
            meta,
        });

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ meta })
        );
    });

    it('should set meta as undefined when not provided', () => {
        const res = mockRes();

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'OK',
            data: null,
        });

        const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
        expect(jsonCall.meta).toBeUndefined();
    });

    it('should respond with 500 for server error', () => {
        const res = mockRes();

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
            data: null,
        });

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ success: false, statusCode: 500 })
        );
    });
});
