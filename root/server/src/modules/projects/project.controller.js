import Project from "./project.model.js";
import User from "../auth/user.model.js";
import Notification from "../notifications/notification.model.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }); 
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    // NOTIFICATION LOGIC: Create notifications for all users
    const users = await User.find({}, "_id");
    const notifications = users.map((user) => ({
      user: user._id,
      title: "🚀 New Project Added",
      message: `A new project "${project.title}" has been added!`,
      link: `/work`, // Link to where projects are displayed
      type: "update",
      referenceId: project._id 
    }));

    if (notifications.length) await Notification.insertMany(notifications);

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to create project", error });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // NOTIFICATION LOGIC: Sync the notification message if the project title changes
    await Notification.updateMany(
      { referenceId: project._id },
      { 
        $set: { 
          message: `A new project "${project.title}" has been added!` 
        } 
      }
    );

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to update project", error });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // NOTIFICATION LOGIC: Remove notifications if the project is deleted
    await Notification.deleteMany({ referenceId: req.params.id });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project", error });
  }
};