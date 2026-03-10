import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from "./app";
import { initializeWhatsApp, destroyClient } from './services/whatsapp.service';
import { initializeSocket } from './sockets/qr.socket';
import logger from './config/logger';

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

initializeSocket(io);
initializeWhatsApp(io);

httpServer.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received. Shutting down gracefully...`);

    await destroyClient();

    io.close(() => {
        logger.info('Socket.IO closed');
    });

    httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });

    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));