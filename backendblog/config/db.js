const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connection Successful".bgCyan);
    } catch(error){
        console.error(`Error: ${error.message}`);
    }
}

module.exports = connectDB;