import User from "../auth/user.model.js";
import Order from "../orders/order.model.js";
import Visitor from "../stats/visitor.model.js";
import Product from "../products/product.model.js";

export const getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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

      Visitor.distinct("ip"), 

      Visitor.distinct("ip", {
        visitedAt: { $gte: today }
      }), 

      Order.aggregate([
        { $match: { isPaid: true } },
        {
          $group: {
            _id: null,
            total: { $sum: "$price" }
          }
        }
      ]),

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

    const visitors = uniqueIPs.length;
    const todayVisitors = todayUniqueIPs.length;
    const revenue = revenueData[0]?.total || 0;
    const topProducts = await Product.populate(topProductsRaw, {
      path: "_id",
      select: "title"
    });

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