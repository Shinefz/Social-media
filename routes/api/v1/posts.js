const express=require('express');
const router=express.Router();
const passport=require('passport');

const postsApi=require("../../../controllers/api/v1/posts_api");

// Delete By using Apis
router.get('/',postsApi.index);
// router.delete('/:id',postsApi.destroy);
router.delete('/:id',passport.authenticate('jwt',{session: false}),postsApi.destroy);

module.exports=router;