import {Client, LocalAuth} from 'whatsapp-web.js';
import {Server} from 'socket.io';
import logger from "../config/logger";
import qrcode from 'qrcode-terminal';

let client: Client;
let isReady = false;
let isReconnecting = false;

const PUPPETEER_ARGS = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu',
];

const createClient = (): Client => new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: PUPPETEER_ARGS,
    },
});

const attachEvents = (io: Server): void => {
    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
        io.emit('qr', qr);
        logger.info('QR code generated');
    });

    client.on('ready', () => {
        isReady = true;
        isReconnecting = false;
        logger.info('WhatsApp client is ready');
    });

    client.on('authenticated', () => {
        logger.info('WhatsApp client authenticated');
    });

    client.on('disconnected', async (reason) => {
        if (isReconnecting) return;
        isReady = false;
        isReconnecting = true;
        logger.warn('WhatsApp client disconnected', { reason });

        try {
            await client.destroy();
        } catch {
            // ignore destroy errors during reconnect
        }

        setTimeout(() => {
            client = createClient();
            attachEvents(io);
            client.initialize().catch((error) => {
                isReconnecting = false;
                logger.error('Failed to reinitialize WhatsApp client', { error });
            });
        }, 5000);
    });
};

export const initializeWhatsApp = (io: Server): void => {
    client = createClient();
    attachEvents(io);
    client.initialize().catch((error) => {
        logger.error('WhatsApp client initialization failed', { error });
    });
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