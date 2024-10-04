const Post = require('../models/Post');
const {cloudinary}= require('../config/cloudinaryConfig');
const Comment = require('../models/Comment');




// *************** Create Post ***************

const createPost = async(req,res)=>{
    try {

        const {content} = req.body;

        if(!content && !req.file) {
            return res.send({
                message: "Content or image is required"
            });
        }

        let imageUrl = "";

        if(req.file){
            const uploadImage = await cloudinary.uploader.upload(req.file.path,{
                folder: "user_images"
            });
            imageUrl = uploadImage.secure_url;
        }

        const newPost = new Post({
            content,
            userId: req.user.id,
            imageUrl: imageUrl
        })

        await newPost.save();

        res.send({
            message: "Post created Successfully", newPost
        });

    }
    catch(error){
        res.send({ message: error.message });
    }
}


// ********** Get All Post By an USER***********

const getUserPosts = async (req,res) => {
    try {

        const userId = req.params.userId;
        const userPosts = await Post.find({userId}).populate("userId", "firstName lastName profileImage");
        // Populate accepts two parameters.

        if(Post.length === 0){
            return res.send({message: "No Posts Found"});
        }

        return res.send({userPosts});

    }   catch (error) {
        res.send({
            message: error.message
        })
    } 
}

// ********** Get Single Post By an User***********
const getSinglePost = async (req,res) => {
    try {
        const {userId, postId} = req.params;

        const post = await Post.findOne({_id: postId, userId}).populate("userId", "firstName lastName profileImage").populate("likes", "firstName lastName");

        if(!post){
            return res.send({message: "Post not found for this user"})
        }

        //send the found post
        return res.send({post});

    } catch (error) {
        res.send({
            message: error.message
        })
    }
}

// ********** Post Update***********
const updatePost = async (req,res) => {
    try {
        const {postId} = req.params;
        const {content} = req.body;

        //Find the post by ID and ensure it belongs to the authenticated user
        const post = await Post.findOne({_id: postId, userId:req.user.id});

        if(!post){
            return res.send({message: "Post not found or you are not authorized to update"})
        }

        //Update post
        if(content){
            post.content = content;
        }

        //Image upload update? 
        if (req.file) {
            // Upload new image to Cloudinary
            const uploadImage = await cloudinary.uploader.upload(req.file.path, {
                folder: "user_images"
            });
            post.imageUrl = uploadImage.secure_url;
        }

        await post.save();

        res.send({
            message: "Post Updated Successfully",
            post
        });

    } catch (error) {
        res.send({
            message: error.message
        })
    }
}

// ********** Post Delete***********
const deletePost = async (req,res) =>{
    try {
        const {postId} = req.params;

        //Find the post by ID and ensure it belongs to the authenticated user
        const post = await Post.findOne({_id: postId, userId: req.user.id});

        if(!post){
            return res.send({message: "Post not found or you are not authorized to delete"})
        }


        //Delete comments associated with the post
        await Comment.deleteMany({postId: postId});

        //Delete or Remove post
        await Post.deleteOne({_id: postId});
       

        //Delete image if exists
        if (post.imageUrl) {
            const imagePublicId = post.imageUrl.split('/').pop().split('.')[0]; // Get the public ID of the image
            await cloudinary.uploader.destroy(`user_images/${imagePublicId}`);
        }

        res.send({message: "Post Deleted Successfully"});

    } catch (error) {
        res.send({
            message: error.message
        })
    }
}


//**** Like Post ****

const likePost = async(req,res)=>{
    try{
        const postId= req.params.postId;
        const post = await Post.findById(postId);

        if(!post){
            return res.send({
                message: "Post not found"
            })
        }

        if(post.likes.includes(req.user.id)){ // includes method is used to find from array.
            return res.send({
                message: "Post already liked"
            })
        }

        post.likes.push(req.user.id);
        await post.save();
        res.send({
            message: "Post liked successfully."
        })
    }

    catch (error) {
        res.send({
            message: error.message
        })
    }
}


// **** Unlike Post*****

const unLikePost = async(req,res)=>{
    try{
        const postId= req.params.postId;
        const post = await Post.findById(postId);

        if(!post){
            return res.send({
                message: "Post not found"
            })
        }

        if(!post.likes.includes(req.user.id)){ // includes method is used to find from array.
            return res.send({
                message: "Post not liked"
            })
        }


        post.likes= post.likes.filter((userId) => userId.toString() !== req.user.id);

        await post.save();


        
        res.send({
            message: "Post unlike success."
        })
    }
    
    catch (error) {
        res.send({
            message: error.message
        })
    }
}

module.exports = {createPost, getUserPosts, likePost, unLikePost, getSinglePost, updatePost, deletePost};

