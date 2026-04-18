import { Game, Stream, Product, LifePost } from './more.model.js';
import User from '../auth/user.model.js';
import Notification from '../notifications/notification.model.js';

export const getGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.status(200).json(games);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createGame = async (req, res) => {
  try {
    const gameData = { ...req.body };
    if (req.file) gameData.coverImage = req.file.path;
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
    
    if (!updatedGame) {
      return res.status(404).json({ message: "Game not found" });
    }
    
    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGame = await Game.findByIdAndDelete(id);
    
    if (!deletedGame) {
      return res.status(404).json({ message: "Game not found" });
    }
    
    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.file) productData.image = req.file.path;
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteProduct = async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); res.status(200).json({ message: 'Deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

export const getLifePosts = async (req, res) => {
  try {
    const posts = await LifePost.find().sort({ date: -1 });
    res.status(200).json(posts);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createLifePost = async (req, res) => {
  try {
    const postData = { ...req.body };
    if (req.file) postData.image = req.file.path;
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
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteLifePost = async (req, res) => {
  try { await LifePost.findByIdAndDelete(req.params.id); res.status(200).json({ message: 'Deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

export const getLiveStream = async (req, res) => {
  try {
    let stream = await Stream.findOne({ status: 'live' });
    if (!stream) {
      stream = await Stream.findOne({ status: 'archived' }).sort({ createdAt: -1 });
    }
    res.status(200).json(stream);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getGameStreams = async (req, res) => {
  try {
    const streams = await Stream.find({ gameId: req.params.gameId, status: 'archived' }).sort({ createdAt: -1 });
    res.status(200).json(streams);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getAllStreams = async (req, res) => {
  try {
    const streams = await Stream.find().sort({ createdAt: -1 });
    res.status(200).json(streams);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createStream = async (req, res) => {
  try {
    const stream = await Stream.create(req.body);
    res.status(201).json(stream);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteStream = async (req, res) => {
  try { await Stream.findByIdAndDelete(req.params.id); res.status(200).json({ message: 'Deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
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
  } catch (error) { res.status(500).json({ message: error.message }); }
};