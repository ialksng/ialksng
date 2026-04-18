import { Game, Stream, Product, LifePost } from './more.model.js';

export const getGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
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
    res.status(500).json({ message: error.message });
  }
};

export const getGameStreams = async (req, res) => {
  try {
    const streams = await Stream.find({ gameId: req.params.gameId, status: 'archived' }).sort({ createdAt: -1 });
    res.status(200).json(streams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLifePosts = async (req, res) => {
  try {
    const posts = await LifePost.find().sort({ date: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};