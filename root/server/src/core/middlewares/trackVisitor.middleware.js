import Visitor from "../../modules/stats/visitor.model.js";

export const trackVisitor = (req, res, next) => {
  next();
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    
    Visitor.create({
      ip,
      userAgent: req.headers["user-agent"]
    }).catch(err => {
      console.log("Visitor tracking error:", err.message);
    });

  } catch (err) {
    console.log("Visitor tracking sync error:", err.message);
  }
};