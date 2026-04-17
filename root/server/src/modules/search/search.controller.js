import Blog from '../blog/blog.model.js';
import Product from '../products/product.model.js';
import Project from '../projects/project.model.js';

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') return res.json({ blogs: [], products: [], projects: [] });

    const searchRegex = new RegExp(q, 'i');

    const [blogs, products, projects] = await Promise.all([
      Blog.find({ title: searchRegex }).select('title _id').limit(10),
      Product.find({ title: searchRegex }).select('title _id').limit(10),
      Project.find({ title: searchRegex }).select('title _id').limit(10),
    ]);

    res.json({ blogs, products, projects });
  } catch (error) {
    res.status(500).json({ msg: "Server error during search" });
  }
};

export const getSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') return res.json([]);

    const searchRegex = new RegExp(q, 'i');

    const [blogs, products, projects] = await Promise.all([
      Blog.find({ title: searchRegex }).select('title _id').limit(3),
      Product.find({ title: searchRegex }).select('title _id').limit(3),
      Project.find({ title: searchRegex }).select('title _id').limit(3),
    ]);

    let suggestions = [
      ...blogs.map(b => ({ _id: b._id, title: b.title, type: 'blog', url: `/blog/${b._id}` })),
      ...products.map(p => ({ _id: p._id, title: p.title, type: 'store', url: `/access/${p._id}` })),
      ...projects.map(p => ({ _id: p._id, title: p.title, type: 'project', url: `/work` }))
    ];

    suggestions = suggestions.slice(0, 6);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ msg: "Server error fetching suggestions" });
  }
};