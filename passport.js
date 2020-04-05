var localStrategy = require("passport-local").Strategy;
var User = require("./model/User")
const GoogleStrategy = require('passport-google-oauth20').Strategy
var config = require("./config/config")

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user);
    })
    passport.deserializeUser(function (user, done) {
        done(null, user);
    })

    passport.use(new localStrategy(function (username, password, done) {
        console.log(username);
        console.log(password);
        User.findOne({ username: username }, (error, doc) => {
            if (error) {
                done(error)
            }
            else {
                if (doc) {
                    var valid = doc.comparePassword(password, doc.password)
                    if (valid) {
                        done(null, {
                            username: doc.username,
                            password: doc.password
                        })
                    } else {
                        done(null, false)
                    }
                }
                else {
                    done(null, false)
                }
            }
        })
    }))

    passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    },
        (token, tokenSecret, profile, done) => {
            // do we already have a User document in MongoDB for this Google profile?
            User.findOne({ _id: profile.id }, (err, user) => {
                if (err) {
                    console.log(err) // error, so stop and debug
                }
                if (!err && user != null) {
                    // Google already exists in our MongoDB so just return the user object
                    done(null, user)
                }
                else {
                    // Google user is new, register them in MongoDB users collection
                    user = new User({
                        _id: profile.id,
                        fullname: profile.displayName,
                        username: "",
                        password: ""
                    })

                    user.save((err) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            done(null, user)
                        }
                    })
                }
            })
        }
    ))
}