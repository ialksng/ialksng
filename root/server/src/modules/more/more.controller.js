import { Game, Stream, Product, LifePost } from './more.model.js';

export const deleteGame = async (req, res) => {
  try {
    const deleted = await Game.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Game not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStream = async (req, res) => {
  try {
    const deleted = await Stream.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Stream not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLifePost = async (req, res) => {
  try {
    const deleted = await LifePost.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    res.status(200).json(stream || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGameStreams = async (req, res) => {
  try {
    const { gameId } = req.params;

    if (!gameId) {
      return res.status(400).json({ message: "Game ID is required" });
    }

    const streams = await Stream.find({
      gameId,
      status: 'archived'
    }).sort({ createdAt: -1 });

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

export const getAllStreams = async (req, res) => {
  try {
    const streams = await Stream.find().sort({ createdAt: -1 });
    res.status(200).json(streams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStream = async (req, res) => {
  try {
    const stream = await Stream.create(req.body);
    res.status(201).json(stream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleStreamStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: "Stream ID and status are required" });
    }

    if (status === 'live') {
      await Stream.updateMany({ status: 'live' }, { status: 'archived' });
    }

    const updatedStream = await Stream.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedStream) {
      return res.status(404).json({ message: "Stream not found" });
    }

    res.status(200).json(updatedStream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};