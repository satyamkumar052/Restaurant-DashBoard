import express from 'express';
const app = express();


import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import RestaurentRouter from "./routes/restaurant.routes.js";
dotenv.config();


// middleware
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));



app.use("/api", RestaurentRouter);

app.get("/", (req,res) => {
    res.send("Request Received");
})

const start = () => {
    mongoose.connect(process.env.MONGOURL)
    .then(() => console.log('Connected!'));
};

app.listen(8080, () => {
    console.log("Server running on 8080");
    start();
});

