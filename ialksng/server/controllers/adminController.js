import User from "../models/User.js";
import Order from "../models/Order.js";
import Visitor from "../models/Visitor.js";
import Product from "../models/Product.js";

export const getStats = async (req, res) => {
  try {
    // 📅 today start
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🚀 run all queries in parallel (FAST)
    const [
      users,
      orders,
      uniqueIPs,
      todayUniqueIPs,
      revenueData,
      topProductsRaw
    ] = await Promise.all([

      User.countDocuments(),

      Order.countDocuments(),

      Visitor.distinct("ip"), // total unique visitors

      Visitor.distinct("ip", {
        visitedAt: { $gte: today }
      }), // today's unique visitors

      // 💰 revenue aggregation (FAST)
      Order.aggregate([
        { $match: { isPaid: true } },
        {
          $group: {
            _id: null,
            total: { $sum: "$price" }
          }
        }
      ]),

      // 🏆 top products
      Order.aggregate([
        { $match: { isPaid: true } },
        {
          $group: {
            _id: "$product",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    // ✅ extract values
    const visitors = uniqueIPs.length;
    const todayVisitors = todayUniqueIPs.length;
    const revenue = revenueData[0]?.total || 0;

    // 🔗 populate product titles
    const topProducts = await Product.populate(topProductsRaw, {
      path: "_id",
      select: "title"
    });

    // 🎯 response
    res.json({
      users,
      orders,
      visitors,
      todayVisitors,
      revenue,
      topProducts
    });

  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ error: err.message });
  }
};