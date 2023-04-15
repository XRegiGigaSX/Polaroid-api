import express from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost, commentPost, likePost, getPostsBySearch } from '../controllers/posts.js'
import authMid from '../middleware/auth.js'

const router = express.Router();

router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost)
router.post('/', authMid, createPost)
router.patch('/:id', authMid, updatePost)
router.delete('/:id', authMid, deletePost)
router.patch('/:id/likePost', authMid, likePost)
router.post('/:id/commentPost', authMid, commentPost)


export default router;