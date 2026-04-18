import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  username: { type: String },
  joinLink: { type: String },
  coverImage: { type: String },
}, { timestamps: true });

const streamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String, enum: ['YouTube', 'Twitch'], required: true },
  videoUrl: { type: String, required: true },
  embedUrl: { type: String, required: true },
  thumbnail: { type: String },
  status: { type: String, enum: ['live', 'archived'], default: 'archived' },
  category: { type: String, enum: ['gaming', 'general'], default: 'gaming' },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: false },
}, { timestamps: true });

const recommendationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  externalLink: { type: String, required: true },
  image: { type: String },
}, { timestamps: true });

const lifePostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['Fitness', 'Life updates', 'Tips'], required: true },
  image: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export const Game = mongoose.model('Game', gameSchema);
export const Stream = mongoose.model('Stream', streamSchema);
export const Product = mongoose.model('Recommendation', recommendationSchema);
export const LifePost = mongoose.model('LifePost', lifePostSchema);