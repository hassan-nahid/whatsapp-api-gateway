import { Server } from 'socket.io'

import logger from '../config/logger'

export const initializeSocket = (io: Server): void => {
    io.on('connection', (socket) => {
        logger.info("Socket client connected", { id: socket.id });

        socket.on('disconnect', () => {
            logger.info('Socket client disconnected', { id: socket.id });
        });
    });
}