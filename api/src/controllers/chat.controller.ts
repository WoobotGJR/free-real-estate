import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const getChats = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: { hasSome: [userId] },
      },
    });

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== userId);

      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { username: true, avatar: true, id: true },
      });

      chat.receiver = receiver;
    }

    res.status(200).json(chats);
  } catch (error) {}
};

const getChat = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id,
        userIDs: { hasSome: [userId] },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id,
      },
      data: {
        seenBy: {
          push: [userId],
        },
      },
    });

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const createChat = async (req: Request, res: Response) => {
  const { userId, receiverId } = req.body;
  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [userId, receiverId],
      },
    });
    res.status(200).json(newChat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const readChat = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const chat = await prisma.chat.update({
      where: {
        id,
        userIDs: { hasSome: [userId] },
      },
      data: {
        seenBy: {
          push: [userId],
        },
      },
    });

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export { getChats, getChat, createChat, readChat };
