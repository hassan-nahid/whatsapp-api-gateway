import {Client, LocalAuth} from 'whatsapp-web.js';
import {Server} from 'socket.io';
import logger from "../config/logger";
import qrcode from 'qrcode-terminal';

let client: Client;
let isReady = false;

export const initializeWhatsApp = (io: Server): void => {
    client = new Client({
        authStrategy: new LocalAuth(),
    });

    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true }); 
        io.emit('qr', qr);
        logger.info('QR code generated');
    });

    client.on('ready', () => {
        isReady = true;
        logger.info('WhatsApp client is ready');
    });
    client.on('authenticated', () => {
        logger.info('WhatsApp client authenticated')
    })
    client.on('disconnected', async (reason) => {
        isReady = false;
        logger.warn('WhatsApp client disconnected', {reason});
        try{
            await client.initialize();
        } catch (error) {
            logger.error('Failed to reinitialize WhatsApp client', { error });
        }
    });
    client.initialize();
}

export const isClientReady = (): boolean => isReady;

export const destroyClient = async (): Promise<void> => {
    if (client) {
        await client.destroy();
        logger.info('WhatsApp client destroyed');
    }
};

export const sendMessage = async (number: string, message: string): Promise<void> => {
    if (!isReady) {
        throw new Error('WhatsApp client is not ready');
    }
    const sanitized = number.replace(/^\+/, '');
    const chatId = `${sanitized}@c.us`;
    await client.sendMessage(chatId, message);
}