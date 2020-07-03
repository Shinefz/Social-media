const Post=require('../models/post');
const Comment=require('../models/comment');
const Like = require('../models/like');

// Create a post
// module.exports.create=function(req, res){
//     Post.create({
//         content: req.body.content,
//         user: req.user._id
//     }, function(err, post){
//         if(err){
//             console.log('Error in creating a post');
//             return;
//         }
//         return res.redirect('back');
//     });
// }

// Create a post by Async Await
module.exports.create= async function(req, res){
    try {
        // await Post.create({
        let post=await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        // if the data in ajax
        if(req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post Created"
            });
        }

        req.flash('success','Post Published!');
        return res.redirect('back');

    } catch (err) {
        req.flash('error',err);
        return res.redirect('back');
    }
}

// To delete a post by Async await
module.exports.destroy= async function(req, res){
    try {
        let post=await Post.findById(req.params.id);
            // .id means converting objet id into String
            if(post.user==req.user.id){

                // delete the associated likes for the post and all its comments' likes too
                await Like.deleteMany({likeable: post, onModel: 'Post'});
                await Like.deleteMany({_id: {$in: post.comments}});

                post.remove();
                await Comment.deleteMany({post: req.params.id});

                // Delete a post by ajax
                if(req.xhr){
                    return res.status(200).json({
                        data: {
                            post_id: req.params.id
                        },
                        message: "Post Deleted"
                    });
                }

                req.flash('success','Post and associated comments deleted!');
                return res.redirect('back');

            }else{
                req.flash('error','You cannot delete this post!');
                return res.redirect('back');
            }
    } catch (err) {
        req.flash('error',err);
        return res.redirect('back');
    }
}

