const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Load User Model
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // See if the user exists
            User.findOne({ email: email }, (err, user) => {
                if (err) {
                    return done(err);
                } else {
                    if (!user) {
                        return done(null, false, { message: 'Email Not Registered' });
                    }

                    // User exists, match password
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if (result) {
                                return done(null, user);
                            } else {
                                return done(null, false, { message: 'Invalid Password' });
                            }
                        }
                    });
                }
            });
        })
    );

    // Serialise and Deserialise User
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}