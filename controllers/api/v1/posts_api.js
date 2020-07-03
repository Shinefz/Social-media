const Post=require('../../../models/post');
const Comment=require('../../../models/comment');

module.exports.index= async function(req, res){

    // Create a post
    let posts=await Post.find({})
        .sort('-createdAt')   // sort the post according to time of post
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

    return res.json(200, {
        message: "List of posts",
        posts: posts
    });
}

// To Delete a post
module.exports.destroy= async function(req, res){
    try {
        let post=await Post.findById(req.params.id);
            // .id means converting objet id into String
            if(post.user==req.user.id){
                post.remove();
                await Comment.deleteMany({post: req.params.id});

                // Delete a post by ajax
                // if(req.xhr){
                //     return res.status(200).json({
                //         data: {
                //             post_id: req.params.id
                //         },
                //         message: "Post Deleted"
                //     });
                // }

                // req.flash('success','Post and associated comments deleted!');
                return res.json(200,{
                    message: "Post and associated comments deleted successfully!"
                });

            }else{
                return res.json(401, {
                    message: "You cannot delete this post"
                });
            }
    } catch (err) {
        // console.log('Error',err);
            // return;
        // req.flash('error',err);
        console.log('******',err);
        
        return res.json(500,{
            message: "Internal Server Error"
        });
    }
}
