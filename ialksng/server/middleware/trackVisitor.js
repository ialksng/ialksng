import Visitor from "../models/Visitor.js";

export const trackVisitor = async (req, res, next) => {
  try {
    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

    await Visitor.create({
      ip,
      userAgent: req.headers["user-agent"]
    });

  } catch (err) {
    console.log("Visitor tracking error");
  }

  next();
};