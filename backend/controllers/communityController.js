// controllers/communityController.js
const Post = require('../models/Post');

// @GET /api/community/posts
exports.getPosts = async (req, res) => {
  try {
    const { room, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (room) filter.room = room;

    const posts = await Post.find(filter)
      .populate('user', 'name avatar settings')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Mask anonymous users
    const sanitized = posts.map(p => {
      const post = p.toObject();
      if (post.anonymous) {
        post.user = { name: 'Anonymous User', avatar: null };
      }
      return post;
    });

    res.json({ success: true, posts: sanitized });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/community/posts
exports.createPost = async (req, res) => {
  try {
    const { room, title, content, tags, anonymous } = req.body;
    const post = await Post.create({
      user: req.user._id,
      room, title, content, tags,
      anonymous: anonymous || req.user.settings?.anonymousMode || false,
    });
    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/community/posts/:id/comment
exports.addComment = async (req, res) => {
  try {
    const { content, anonymous } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: { user: req.user._id, content, anonymous: anonymous || false } },
        $inc: { commentCount: 1 },
      },
      { new: true }
    );
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/community/posts/:id/react
exports.reactToPost = async (req, res) => {
  try {
    const { reaction } = req.body; // 'heart', 'support', 'thumbsUp'
    const inc = {};
    inc[`reactions.${reaction}`] = 1;

    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: inc }, { new: true });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
