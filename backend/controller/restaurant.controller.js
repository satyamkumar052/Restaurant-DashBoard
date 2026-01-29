import Restaurant from "../models/restaurent.model.js";
import Order from "../models/order.model.js";


export const getRestaurent = async (req, res) => {

    try {
        const { search = "", cuisine, location, sortBy = "name", order = "asc", page = 1, limit = 10 } = req.query;

        const query = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (cuisine) query.cuisine = cuisine;
        if (location) query.location = location;

        const skip = (page - 1) * limit;

        const restaurants = await Restaurant.find(query)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Restaurant.countDocuments(query);

        res.json({
            data: restaurants,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


export const getRestaurantTrends = async (req, res) => {

    try {
        const { id } = req.params;
        const { start_date, end_date } = req.query;

        const restaurantId = Number(id);

        // 1. Build Date Filter
        const dateFilter = {};
        if (start_date || end_date) {
            dateFilter.order_time = {};
            if (start_date) dateFilter.order_time.$gte = new Date(start_date);
            if (end_date) dateFilter.order_time.$lte = new Date(end_date);
        }

        // 2. Daily Stats Aggregation
        const dailyStats = await Order.aggregate([
            { $match: { restaurant_id: restaurantId, ...dateFilter } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$order_time" } },
                    total_orders: { $sum: 1 },
                    total_revenue: { $sum: "$order_amount" },
                    avg_order_value: { $avg: "$order_amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 3. Peak Hour Aggregation
        const peakHours = await Order.aggregate([
            { $match: { restaurant_id: restaurantId, ...dateFilter } },
            {
                $project: {
                    day: { $dateToString: { format: "%Y-%m-%d", date: "$order_time" } },
                    hour: { $hour: "$order_time" }
                }
            },
            {
                $group: {
                    _id: { day: "$day", hour: "$hour" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.day": 1, count: -1 } },
            {
                $group: {
                    _id: "$_id.day",
                    peak_hour: { $first: "$_id.hour" }
                }
            }
        ]);

        // 4. Merge Results
        const peakHourMap = {};
        peakHours.forEach(p => peakHourMap[p._id] = p.peak_hour);

        const result = dailyStats.map(stat => ({
            date: stat._id,
            orders: stat.total_orders,
            revenue: stat.total_revenue,
            avg_order_value: Math.round(stat.avg_order_value),
            peak_hour: peakHourMap[stat._id] || null
        }));

        res.json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


export const getTopRestaurents = async (req, res) => {

    try {

        const { start_date, end_date } = req.query;

        const dateFilter = {};

        if(start_date || end_date) {
            dateFilter.order_time = {};

            if(start_date) dateFilter.order_time.$gte = new Date(start_date);
            
            if(end_date) dateFilter.order_time.$lte = new Date(end_date);
        }

        const topRestaurent = await Order.aggregate([

            { $match: dateFilter },

            {
                $group: {
                    _id: "$restaurant_id",
                    total_revenue: { $sum: "$order_amount" }
                }
            },

            { $sort: {total_revenue : -1}},

            { $limit: 3},

            {
                $lookup: {
                    from: "restaurants",
                    localField: "_id",
                    foreignField: "_id",
                    as: "details"
                }
            },

            {$unwind: "$details"},

            {
                $project: {
                    _id: 0,
                    restaurant_id: "$_id",
                    name: "$details.name",
                    revenue: "$total_revenue"
                }
            },

        ]);


        res.json(topRestaurent);
        
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

