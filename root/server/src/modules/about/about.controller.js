import About from "./about.model.js";

export const getAboutData = async (req, res) => {
  try {
    let aboutData = await About.findOne();
    if (!aboutData) {
      aboutData = await About.create({});
    }
    res.status(200).json(aboutData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const updateAboutData = async (req, res) => {
  try {
    const updatedData = await About.findOneAndUpdate(
      {}, 
      req.body,
      { new: true, upsert: true } 
    );
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ message: "Failed to update about data", error });
  }
};