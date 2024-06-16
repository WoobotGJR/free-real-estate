import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  savePost,
  updateUser,
  profilePosts,
} from '../controllers/user.controller';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router.get('/', getUsers);
router.get('/profilePosts', verifyToken, profilePosts);
router.get('/:id', verifyToken, getUser);

router.post('/:id', verifyToken, updateUser);

router.delete('/:id', verifyToken, deleteUser);

router.post('/save', verifyToken, savePost);

export default router;
