const express=require('express');
const router=express.Router();
const passport=require('passport');
const usersController=require('../controllers/users_controller');
// router.get('/profile', usersController.profile);
router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.get('/sign-up',usersController.signUp);
router.get('/sign-in',usersController.signIn);          // sign-in in if account is present
router.post('/create',usersController.create);          // create now account 
router.post('/update/:id',passport.checkAuthentication,usersController.update);  // update profile

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
    ),usersController.createSession);

router.get('/sign-out',usersController.destroySession);

//router for google oauth
router.get('/auth/google',passport.authenticate('google',{scope: ['profile', 'email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect: '/users/sign-in'}), usersController.createSession);

module.exports=router; 

