import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  username: { type: String },
  joinLink: { type: String },
  coverImage: { type: String },
  category: { type: String, default: 'Game' },
}, { timestamps: true });

const streamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: {
    type: String,
    enum: ['youtube', 'twitch', 'facebook', 'other'],
    required: true
  },
  url: { type: String, required: true },
  embedUrl: { type: String, required: true },
  thumbnail: { type: String },
  status: {
    type: String,
    enum: ['planned', 'live', 'archived'],
    default: 'archived'
  },
  category: { type: String, enum: ['gaming', 'general'], default: 'gaming' },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' }
}, { timestamps: true });

const recommendationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  externalLink: { type: String, required: true },
  image: { type: String }
}, { timestamps: true });

const lifePostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['Fitness', 'Life updates', 'Tips', 'Dev Log'],
    default: 'Life updates'
  },
  mediaType: { type: String, enum: ['none', 'image', 'video', 'audio'], default: 'none' },
  mediaUrl: { type: String },
  reactions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['like', 'love', 'laugh', 'shock', 'sad'] }
  }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    user: { type: String },
    text: { type: String },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Game = mongoose.model('Game', gameSchema);
export const Stream = mongoose.model('Stream', streamSchema);
export const Product = mongoose.model('Recommendation', recommendationSchema);
export const LifePost = mongoose.model('LifePost', lifePostSchema);