import Blog from "./blog.model.js";

export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    const userId = req.user._id ? req.user._id.toString() : req.user.id.toString();

    let likes = Array.isArray(blog.likes) ? [...blog.likes] : [];

    if (likes.includes(userId)) {
      likes = likes.filter(id => id !== userId);
    } else {
      likes.push(userId); 
    }

    blog.likes = likes;
    blog.markModified('likes');

    await blog.save();
    res.json(blog.likes);
  } catch (err) {
    console.error("Like Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const commentBlog = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ msg: "Comment text is required" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    const userId = req.user._id ? req.user._id.toString() : req.user.id.toString();
    const userName = req.user.name || req.user.username || "User";

    const newComment = {
      user: userName,
      userId: userId,
      text: text.trim(),
      date: new Date()
    };

    const comments = Array.isArray(blog.comments) ? [...blog.comments] : [];
    comments.push(newComment);

    blog.comments = comments;
    blog.markModified('comments');
    
    await blog.save();
    res.json(blog.comments);
  } catch (err) {
    console.error("Comment Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteBlogComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    const userId = req.user._id ? req.user._id.toString() : req.user.id.toString();
    
    let comments = Array.isArray(blog.comments) ? [...blog.comments] : [];

    const index = comments.findIndex(c => c._id.toString() === req.params.commentId);

    if (index === -1) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (comments[index].userId !== userId) {
      return res.status(401).json({ msg: "Not authorized to delete this comment" });
    }

    comments.splice(index, 1);

    blog.comments = comments;
    blog.markModified('comments');

    await blog.save();
    res.json(blog.comments);
  } catch (err) {
    console.error("Delete Comment Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const editBlogComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Text required" });

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    const userId = req.user._id ? req.user._id.toString() : req.user.id.toString();
    
    let comments = Array.isArray(blog.comments) ? [...blog.comments] : [];
    const index = comments.findIndex(c => c._id.toString() === req.params.commentId);

    if (index === -1) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (comments[index].userId !== userId) {
      return res.status(401).json({ msg: "Not authorized to edit this comment" });
    }
    comments[index].text = text.trim();

    blog.comments = comments;
    blog.markModified('comments');

    await blog.save();
    res.json(blog.comments);
  } catch (err) {
    console.error("Edit Comment Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, category, image, excerpt } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }

    const blog = new Blog({
      title,
      content,
      category,
      image,
      excerpt
    });

    const saved = await blog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const totalBlogs = await Blog.countDocuments();

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};