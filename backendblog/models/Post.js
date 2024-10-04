const mongoose = require ('mongoose');

const PostSchema = new mongoose.Schema({
    content:{
        type:String,
        required: true
    },

    userId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required:true
    },

    imageUrl: {
        type: String
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports=mongoose.model('Post', PostSchema);