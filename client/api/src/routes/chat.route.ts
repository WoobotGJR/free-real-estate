import express from 'express';
import {
  createChat,
  getChat,
  getChats,
  readChat,
} from '../controllers/chat.controller';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router.get('/', verifyToken, getChats);
router.get('/:id', verifyToken, getChat);

router.post('/', verifyToken, createChat);
router.post('/read/:id', verifyToken, readChat);

export default router;
