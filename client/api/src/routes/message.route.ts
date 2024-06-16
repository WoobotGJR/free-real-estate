import express from 'express';
import { addMessage } from '../controllers/message.controller';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router.post('/:chatId', verifyToken, addMessage);

export default router;
