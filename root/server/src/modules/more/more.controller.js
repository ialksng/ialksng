import mongoose from 'mongoose'; // Added to handle ObjectId casting
import { Game, Stream, Product, LifePost } from './more.model.js';
import User from '../auth/user.model.js';
import Notification from '../notifications/notification.model.js';

export const getGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.status(200).json(games);
  } catch (error) {
    console.error("GET GAMES ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createGame = async (req, res) => {
  try {
    const gameData = { ...req.body };
    if (req.file) {
      gameData.coverImage = req.file.path;
    }
    if (!gameData.name) {
      return res.status(400).json({ message: "Game name is required." });
    }
    const game = await Game.create(gameData);
    const users = await User.find({}, '_id');
    const notifications = users.map(user => ({
      user: user._id,
      title: '🎮 New Game Added',
      message: `I just added ${game.name} to the GameZone!`,
      link: '/more/gamezone',
      type: 'update'
    }));
    await Notification.insertMany(notifications);
    res.status(201).json(game);
  } catch (error) {
    console.error("CREATE GAME ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (req.file) {
      updateData.coverImage = req.file.path;
    }
    const updatedGame = await Game.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedGame) return res.status(404).json({ message: "Game not found" });
    res.status(200).json(updatedGame);
  } catch (error) {
    console.error("UPDATE GAME ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGame = await Game.findByIdAndDelete(id);
    if (!deletedGame) return res.status(404).json({ message: "Game not found" });
    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error("DELETE GAME ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.status(200).json(game);
  } catch (error) {
    console.error("GET GAME BY ID ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.file) productData.image = req.file.path;
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ADDED UPDATE PRODUCT FOR ADMIN GEAR
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (req.file) updateData.image = req.file.path;
    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getLifePosts = async (req, res) => {
  try {
    const posts = await LifePost.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("GET LIFE POSTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createLifePost = async (req, res) => {
  try {
    const postData = { ...req.body };
    if (req.file) {
      postData.mediaUrl = req.file.path;
      if (!postData.mediaType) postData.mediaType = 'image';
    }
    const post = await LifePost.create(postData);
    const users = await User.find({}, '_id');
    const notifications = users.map(user => ({
      user: user._id,
      title: '🌱 New Update',
      message: post.title,
      link: '/more/life',
      type: 'update'
    }));
    await Notification.insertMany(notifications);
    res.status(201).json(post);
  } catch (error) {
    console.error("CREATE LIFE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateLifePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (req.file) updateData.mediaUrl = req.file.path;
    const updatedPost = await LifePost.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPost) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("UPDATE LIFE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteLifePost = async (req, res) => {
  try {
    await LifePost.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    console.error("DELETE LIFE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getLiveStream = async (req, res) => {
  try {
    let stream = await Stream.findOne({ status: 'live' });
    if (!stream) {
      stream = await Stream.findOne({ status: 'archived' }).sort({ createdAt: -1 });
    }
    res.status(200).json(stream);
  } catch (error) {
    console.error("GET LIVE STREAM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATED: Robust Game Stream Retrieval
export const getGameStreams = async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // Explicitly cast gameId to ObjectId to prevent query mismatches
    const streams = await Stream.find({
      gameId: new mongoose.Types.ObjectId(gameId),
      status: 'archived'
    }).sort({ createdAt: -1 });

    res.status(200).json(streams);
  } catch (error) {
    console.error("GET GAME STREAMS ERROR:", error);
    res.status(500).json({ message: "Failed to load archives for this game." });
  }
};

export const getAllStreams = async (req, res) => {
  try {
    const streams = await Stream.find().sort({ createdAt: -1 });
    res.status(200).json(streams);
  } catch (error) {
    console.error("GET ALL STREAMS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createStream = async (req, res) => {
  try {
    const stream = await Stream.create(req.body);
    res.status(201).json(stream);
  } catch (error) {
    console.error("CREATE STREAM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateStream = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStream = await Stream.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedStream) return res.status(404).json({ message: "Stream not found" });
    res.status(200).json(updatedStream);
  } catch (error) {
    console.error("UPDATE STREAM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteStream = async (req, res) => {
  try {
    await Stream.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    console.error("DELETE STREAM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const toggleStreamStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status === 'live') {
      await Stream.updateMany({ status: 'live' }, { status: 'archived' });
    }

    const updatedStream = await Stream.findByIdAndUpdate(id, { status }, { new: true });

    if (status === 'live' && updatedStream) {
      const users = await User.find({}, '_id');
      const notifications = users.map(user => ({
        user: user._id,
        title: '🔴 LIVE NOW',
        message: `Alok is live: ${updatedStream.title}`,
        link: '/more/live',
        type: 'live'
      }));
      await Notification.insertMany(notifications);
    }

    res.status(200).json(updatedStream);
  } catch (error) {
    console.error("TOGGLE STREAM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const reactToLifePost = async (req, res) => {
  try {
    const { type } = req.body;
    const post = await LifePost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    const existingIndex = post.reactions.findIndex(r => r.userId.toString() === req.user._id.toString());
    if (existingIndex >= 0) {
      if (post.reactions[existingIndex].type === type) {
        post.reactions.splice(existingIndex, 1);
      } else {
        post.reactions[existingIndex].type = type;
      }
    } else {
      post.reactions.push({ userId: req.user._id, type });
    }
    await post.save();
    res.json(post.reactions);
  } catch (error) {
    console.error("REACT ERROR:", error);
    res.status(500).json({ message: "Server error applying reaction" });
  }
};

export const commentOnLifePost = async (req, res) => {
  try {
    const post = await LifePost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    const newComment = {
      userId: req.user._id,
      user: req.user.name,
      text: req.body.text
    };
    post.comments.push(newComment);
    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.error("COMMENT ERROR:", error);
    res.status(500).json({ message: "Server error posting comment" });
  }
};