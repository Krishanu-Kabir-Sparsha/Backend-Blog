const express = require('express');
const dotenv = require('dotenv');
const cors = require ('cors');
const { connect } = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./auth/authRoutes');
const postRoutes = require('./Post/postRoutes');

dotenv.config();

//Express Initialization
const app = express();

app.use(cors());

//Connect to MongoDB
connectDB();

//Middleware
app.use(express.json());

app.get("/", (req,res)=> {
    res.send("Welcome to the server");
})

// Auth Routes
app.use("/auth", authRoutes);

// Post routes
app.use("/posts", postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})