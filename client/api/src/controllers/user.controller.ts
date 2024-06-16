import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, avatar, password, userId } = req.body;

    if (id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    let updatedPassword = null;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedPassword = hashedPassword;
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        username,
        email,
        ...(avatar && { avatar }),
        ...(updatedPassword && { password: updatedPassword }),
      },
    });
    const { password: userPassword, ...otherUserInfo } = user;
    res.json(otherUserInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (id !== userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const { id } = req.params;
    const user = await prisma.user.delete({
      where: {
        id,
      },
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const savePost = async (req: Request, res: Response) => {
  const { postId, userId } = req.body;
  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        id: userId,
        postId: postId,
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: 'Post deleted' });
    } else {
      await prisma.savedPost.create({
        // @ts-ignore
        id: userId,
        postId: postId,
      });
      res.status(200).json({ message: 'Post saved' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const profilePosts = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: userId,
      },
    });
    const saved = await prisma.savedPost.findMany({
      where: {
        id: userId,
      },
      include: {
        post: true,
      },
    });
    const savedPosts = saved.map((post) => post.post);
    res.json({ posts, savedPosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export { getUsers, getUser, updateUser, deleteUser, savePost, profilePosts };
