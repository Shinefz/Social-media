const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');

// Tell passport to use a new strategy for google login
passport.use(new googleStrategy({
      
        clientID: "603577633171-sjkbp9kk0lla469i8lp73vmom48hd5er.apps.googleusercontent.com",
        clientSecret: "5UQXQf9eNmUCw9NOeHlLdoOv-",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done){
        // Find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log('Error in google strategy-passport', err);
                return;
            }
            if(user){
                // if user found, set this user as req.user
                return done(null, user);
            }else{
                // If user not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){
                        console.log('Error in creating user google strategy-passport', err);
                        return;
                    }
                    return done(null, user);
                });
            }
        });
    }
));

module.exports=passport;