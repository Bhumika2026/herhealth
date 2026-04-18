// routes/communityRoutes.js
const express = require('express');
const router = express.Router();
const { getPosts, createPost, addComment, reactToPost } = require('../controllers/communityController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/posts', getPosts);
router.post('/posts', createPost);
router.post('/posts/:id/comment', addComment);
router.post('/posts/:id/react', reactToPost);

module.exports = router;
