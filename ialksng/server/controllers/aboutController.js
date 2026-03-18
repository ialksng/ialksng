import About from "../models/About.js";

// @route   GET /api/about
// @access  Public
export const getAboutData = async (req, res) => {
  try {
    let aboutData = await About.findOne();
    // If no document exists yet, return an empty template
    if (!aboutData) {
      aboutData = await About.create({});
    }
    res.status(200).json(aboutData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @route   PUT /api/admin/about
// @access  Private/Admin
export const updateAboutData = async (req, res) => {
  try {
    const updatedData = await About.findOneAndUpdate(
      {}, // Matches the first document it finds
      req.body,
      { new: true, upsert: true } // Create if it doesn't exist
    );
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ message: "Failed to update about data", error });
  }
};