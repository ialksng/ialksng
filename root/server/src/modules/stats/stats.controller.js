import User from "../auth/user.model.js";
import Project from "../projects/project.model.js";
import Testimonial from "../testimonials/testimonial.model.js";

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