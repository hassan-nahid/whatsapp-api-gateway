import { Request, Response, NextFunction } from 'express';
import { validateMessage } from '../middleware/validate';

const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockReq = (body: object) => ({ body } as Request);
const mockNext: NextFunction = jest.fn();

describe('validateMessage middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call next() when valid phone and message provided', () => {
        const req = mockReq({ phone: '8801711111111', message: 'Hello World' });
        const res = mockRes();

        validateMessage(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 when phone is missing', () => {
        const req = mockReq({ message: 'Hello' });
        const res = mockRes();

        validateMessage(req, res, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 when phone is too short (less than 10 digits)', () => {
        const req = mockReq({ phone: '12345', message: 'Hello' });
        const res = mockRes();

        validateMessage(req, res, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
        expect(jsonCall.data.phone).toContain('Phone number must be at least 10 digits');
    });

    it('should return 400 when phone is too long (more than 15 digits)', () => {
        const req = mockReq({ phone: '88017111111111111', message: 'Hello' });
        const res = mockRes();

        validateMessage(req, res, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
        expect(jsonCall.data.phone).toContain('Phone number must not exceed 15 digits');
    });

    it('should return 400 when message is empty', () => {
        const req = mockReq({ phone: '8801711111111', message: '' });
        const res = mockRes();

        validateMessage(req, res, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
        expect(jsonCall.data.message).toContain('Message cannot be empty');
    });

    it('should return 400 when message exceeds 1000 characters', () => {
        const req = mockReq({ phone: '8801711111111', message: 'a'.repeat(1001) });
        const res = mockRes();

        validateMessage(req, res, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
        expect(jsonCall.data.message).toContain('Message must not exceed 1000 characters');
    });

    it('should return 400 when both phone and message are missing', () => {
        const req = mockReq({});
        const res = mockRes();

        validateMessage(req, res, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        const jsonCall = (res.json as jest.Mock).mock.calls[0][0];
        expect(jsonCall.success).toBe(false);
        expect(jsonCall.message).toBe('Validation failed');
    });

    it('should accept phone with exactly 10 digits', () => {
        const req = mockReq({ phone: '1234567890', message: 'Hello' });
        const res = mockRes();

        validateMessage(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should accept message with exactly 1000 characters', () => {
        const req = mockReq({ phone: '8801711111111', message: 'a'.repeat(1000) });
        const res = mockRes();

        validateMessage(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
    });
});
