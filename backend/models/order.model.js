import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    restaurant_id: {
        type: Number,
        required: true
    },
    order_amount: {
        type: Number,
        required: true
    },
    order_time: {
        type: Date,
    }
});


const Order = mongoose.model("Order", orderSchema);

export default Order;