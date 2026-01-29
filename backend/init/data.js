import mongoose from "mongoose";
import dotenv from "dotenv";

import Restaurant from "../models/restaurent.model.js";
import Order from "../models/order.model.js";
import restaurants from "./restaurants.js";
import orders from "./orders.js";

dotenv.config({ path: "../.env" });


const run = async () => {
    try {
        await mongoose.connect(process.env.MONGOURL);
        console.log("DB connected");

        await Restaurant.deleteMany({});
        await Order.deleteMany({});

        await Restaurant.insertMany(restaurants);

        await Order.insertMany(
        orders.map(o => ({
            ...o,
            order_time: new Date(o.order_time)
        }))
        );

        console.log("Data inserted successfully");
        process.exit(0);
    } catch (err) {
        console.error(err);
    }
};

run();
