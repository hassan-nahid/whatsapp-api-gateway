import {Router} from 'express';
import { rateLimiter } from '../middleware/rateLimiter';
import { validateMessage } from '../middleware/validate';
import { sendMessageController } from '../controllers/message.controller';

const router = Router();

router.post('/messages', rateLimiter, validateMessage, sendMessageController);

export default router;