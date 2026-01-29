import mongoose from "mongoose";


const restaurantSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    }
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;