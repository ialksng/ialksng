import Blog from '../blog/blog.model.js';
import Product from '../products/product.model.js';
import Project from '../projects/project.model.js';
import { Game, Stream, Product as Recommendation, LifePost } from '../more/more.model.js';

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json({ 
        blogs: [], products: [], projects: [], 
        games: [], streams: [], recommendations: [], lifePosts: [] 
      });
    }

    const searchRegex = new RegExp(q, 'i');

    const [blogs, products, projects, games, streams, recommendations, lifePosts] = await Promise.all([
      Blog.find({ title: searchRegex }).select('title _id').limit(10),
      Product.find({ title: searchRegex }).select('title _id').limit(10),
      Project.find({ title: searchRegex }).select('title _id').limit(10),
      Game.find({ name: searchRegex }).select('name _id').limit(10),
      Stream.find({ title: searchRegex }).select('title _id').limit(10),
      Recommendation.find({ name: searchRegex }).select('name _id').limit(10),
      LifePost.find({ title: searchRegex }).select('title _id').limit(10),
    ]);

    res.json({ blogs, products, projects, games, streams, recommendations, lifePosts });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ msg: "Server error during search" });
  }
};

export const getSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') return res.json([]);

    const searchRegex = new RegExp(q, 'i');

    const [blogs, products, projects, games, streams, recommendations, lifePosts] = await Promise.all([
      Blog.find({ title: searchRegex }).select('title _id').limit(3),
      Product.find({ title: searchRegex }).select('title _id').limit(3),
      Project.find({ title: searchRegex }).select('title _id').limit(3),
      Game.find({ name: searchRegex }).select('name _id').limit(3),
      Stream.find({ title: searchRegex }).select('title _id').limit(3),
      Recommendation.find({ name: searchRegex }).select('name _id').limit(3),
      LifePost.find({ title: searchRegex }).select('title _id').limit(3),
    ]);

    let suggestions = [
      ...blogs.map(b => ({ _id: b._id, title: b.title, type: 'blog', url: `/blog/${b._id}` })),
      ...products.map(p => ({ _id: p._id, title: p.title, type: 'store', url: `/access/${p._id}` })),
      ...projects.map(p => ({ _id: p._id, title: p.title, type: 'project', url: `/work` })),
      ...games.map(g => ({ _id: g._id, title: g.name, type: 'game', url: `/more/gamezone/${g._id}` })),
      ...streams.map(s => ({ _id: s._id, title: s.title, type: 'stream', url: `/more/live` })),
      ...recommendations.map(r => ({ _id: r._id, title: r.name, type: 'gear', url: `/more/products` })),
      ...lifePosts.map(l => ({ _id: l._id, title: l.title, type: 'life', url: `/more/life` }))
    ];

    suggestions = suggestions.slice(0, 6);

    res.json(suggestions);
  } catch (error) {
    console.error("Suggestions Error:", error);
    res.status(500).json({ msg: "Server error fetching suggestions" });
  }
};