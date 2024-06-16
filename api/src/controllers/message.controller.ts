import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const addMessage = async (req: Request, res: Response) => {
  const { userId, text } = req.body;
  const { chatId } = req.params;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [userId],
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const newMessage = await prisma.message.create({
      data: {
        userId,
        text,
        chatId,
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [userId],
        lastMessage: text,
      },
    });

    res.status(200).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export { addMessage };
