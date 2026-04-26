import Notification from './notification.model.js';

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id }, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicNotifications = async (req, res) => {
  try {
    // Aggregation pipeline to group by title and filter out duplicates
    const notifications = await Notification.aggregate([
      { $sort: { createdAt: -1 } }, 
      {
        $group: {
          _id: "$title", 
          doc: { $first: "$$ROOT" } 
        }
      },
      { $replaceRoot: { newRoot: "$doc" } }, 
      { $sort: { createdAt: -1 } }, 
      { $limit: 5 } 
    ]);
    
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};