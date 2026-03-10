import request from 'supertest';
import app from '../app';

jest.mock('../services/queue.service', () => ({
    addToQueue: jest.fn(),
}));

jest.mock('../services/whatsapp.service', () => ({
    sendMessage: jest.fn(),
    initializeWhatsApp: jest.fn(),
}));

describe('POST /api/messages', () => {
    it('should return 200 with valid payload', async () => {
        const res = await request(app)
            .post('/api/messages')
            .send({ phone: '8801711111111', message: 'Hello Integration Test' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Message queued successfully');
    });

    it('should return 400 when phone is missing', async () => {
        const res = await request(app)
            .post('/api/messages')
            .send({ message: 'Hello' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Validation failed');
    });

    it('should return 400 when message is missing', async () => {
        const res = await request(app)
            .post('/api/messages')
            .send({ phone: '8801711111111' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should return 400 when phone is too short', async () => {
        const res = await request(app)
            .post('/api/messages')
            .send({ phone: '12345', message: 'Hello' });

        expect(res.status).toBe(400);
        expect(res.body.data.phone).toContain('Phone number must be at least 10 digits');
    });

    it('should return 400 when message is empty', async () => {
        const res = await request(app)
            .post('/api/messages')
            .send({ phone: '8801711111111', message: '' });

        expect(res.status).toBe(400);
        expect(res.body.data.message).toContain('Message cannot be empty');
    });

    it('should return 400 when message exceeds 1000 characters', async () => {
        const res = await request(app)
            .post('/api/messages')
            .send({ phone: '8801711111111', message: 'a'.repeat(1001) });

        expect(res.status).toBe(400);
        expect(res.body.data.message).toContain('Message must not exceed 1000 characters');
    });

    it('should return 400 when request body is empty', async () => {
        const res = await request(app)
            .post('/api/messages')
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should accept phone with + prefix', async () => {
        const res = await request(app)
            .post('/api/messages')
            .send({ phone: '+8801711111111', message: 'Hello' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
