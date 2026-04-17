import Blog from '../models/Blog.js';
import Product from '../models/Product.js';
import Project from '../models/Project.js';

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.json({ blogs: [], products: [], projects: [] });
    }

    const searchRegex = new RegExp(q, 'i');

    const [blogs, products, projects] = await Promise.all([
      Blog.find({ title: searchRegex }).select('title _id').limit(10),
      Product.find({ title: searchRegex }).select('title _id').limit(10),
      Project.find({ title: searchRegex }).select('title _id').limit(10),
    ]);

    res.json({ blogs, products, projects });

  } catch (error) {
    console.error("Global Search Error:", error);
    res.status(500).json({ msg: "Server error during search" });
  }
};