import { Server } from 'socket.io'

import logger from '../config/logger'

export const emitQR = (io: Server, qrData: string): void => {
    io.emit('qr', qrData);
    logger.info('QR code emitted to clients');
}

export const initializeSocket = (io: Server): void => {
    io.on('connection', (socket) => {
        logger.info("Socket client connected", { id: socket.id });

        socket.on('disconnect', () => {
            logger.info('Socket client disconnected', { id: socket.id });
        });
    });
}