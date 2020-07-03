const Post=require('../models/post');
const User=require('../models/user');

// Convert code into async await
module.exports.home= async function(req,res){
    try {
         // Populate the user of each post
        let posts=await Post.find({})
        .sort('-createdAt')   // sort the post according to time of post
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            //  populate the likes of each post and comment
            populate: {
                path: 'likes'
            }
        }).populate('likes');

        // for show user on home page
        let users=await User.find({});
        return res.render('home',{
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });

    } catch (err) {
        console.log('Error', err);
        return;
        
    }
}


