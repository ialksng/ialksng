import User from "../models/User.js";
import Project from "../models/Project.js";
import Testimonial from "../models/Testimonial.js";

export const getPublicStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const projects = await Project.countDocuments();
    const clients = await Testimonial.countDocuments();

    res.json({
      users,
      projects,
      clients
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};