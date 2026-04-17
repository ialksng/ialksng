import Visitor from "../../../models/Visitor.js";

export const trackVisitor = (req, res, next) => {
  // 1. Call next() immediately so the user's request continues without delay
  next();

  // 2. Perform the database write in the background (Notice there is no 'await')
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    
    Visitor.create({
      ip,
      userAgent: req.headers["user-agent"]
    }).catch(err => {
      // Catch any background database errors so they don't crash the server
      console.log("Visitor tracking error:", err.message);
    });

  } catch (err) {
    console.log("Visitor tracking sync error:", err.message);
  }
};