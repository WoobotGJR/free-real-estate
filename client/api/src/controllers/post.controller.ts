import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';

const getPosts = async (req: Request, res: Response) => {
  const query: any = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: query.price || undefined,
        latitude: query.latitude || undefined,
        longitude: query.longitude || undefined,
      },
    });
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getPost = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        PostDetails: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string,
        async (err: any, payload: any) => {
          if (!err) {
            const saved = await prisma.savedPost.findUnique({
              where: {
                userId_postId: {
                  postId: id,
                  userId: payload?.id,
                },
              },
            });
            res.status(200).json({ ...post, isSaved: saved ? true : false });
          }
        }
      );
    }
    res.status(200).json({ ...post, isSaved: false });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to get post' });
  }
};

const createPost = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: body.userId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const postData = req.body;
    const { id } = req.params;
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...postData,
      },
    });
    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const deletedPost = await prisma.post.findUnique({
      where: { id },
    });

    if (deletedPost?.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.json(deletedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export { getPosts, getPost, createPost, updatePost, deletePost };
