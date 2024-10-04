const Post = require("../models/Post");
const Comment = require("../models/Comment");

//add a comment
const addComment = async(req,res)=>{

    try {
        
        const {content} = req.body;
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if(!post) {
            return res.send({ message: "Post not found"})
        }

        if(!content) {
            return res.send({ message: "Content is  required"})
        }

        const newComment = new Comment({
            content,
            postId,
            userId: req.user.id
        })

        await newComment.save();

        res.send({message: "Comment added successfully"})


    } catch (error) {
        res.send({
            message: error.message
        })
    }
}


//delete a comment
const deleteComment = async(req,res) =>{

    try {       

        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);

        if(!comment){
            return res.send({message: "Comment not found"})
        }

        if(comment.userId.toString() !== req.user.id){
            return res.send({message: "You are not authorized to delete this comment"})
        }

        await comment.deleteOne();
        
        res.send({message: "Comment Delete Successful"})


    } catch (error) {
        res.send({
            message: error.message
        })
    }
}

module.exports = {addComment, deleteComment};