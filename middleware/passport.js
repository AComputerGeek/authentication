// @author: Amir Armion
// @version: V.01

const passport       = require("passport"); // Importing passport library
const LocalStrategy  = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const userController = require("../controllers/userController");
const { userModel }  = require("../models/userModel");

// Step 3:
// Local Login:
const localLogin = new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  },
  (email, password, done) => {

    // Checking email and password in database
    // If we have this email and password in database, 
    // then it's going to return the user as an object (with this email and password); 
    // otherwise, it's going to be "null"
    const user = userController.getUserByEmailIdAndPassword(email, password);

    return user ? done(null, user) : done(null, false, {
      message: "Your login details are not valid! Please try again..."
    });
  }
);

// Step 3:
// GitHub Login:
const githubLogin = new GitHubStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL
  },
  (accessToken, refreshToken, profile, done) => {
    let githubId = Number(profile.id);
    let name     = profile.displayName;

    console.log(profile);

    const user = userController.getUserByGithubId(githubId, name);
    
    return user ? done(null, user) : done(null, false, {
      message: "Your login details are not valid! Please try again..."
    });
  }
);

// Step 4:
// Create a session for valid user, and then send session id (sid) of that user to the Browser; 
// and also, attach the user as an object to the "req.user"; 
// so, "req.user" has all information about that user.
passport.serializeUser((user, done) => {
  // Save something unique from the user into the session (like user's id)
  // In the Terminal you can see something like this: 
  //   Session { cookie: { ... }, passport: {user: 4}} // here, 4 is user's id
  done(null, user.id);
});

// Step 5:
// Whenever we are refreshing the page or moving to another page, 
// this will get user latest info from the database, and reattach it to the "req.user"
//
// NOTE: 
// We deserialize the user, based on what we serialized that user (What we saved from the user into the session).
// here, we saved user's id in serializeUser() function; 
// so, id is going to be the first parameter in deserializeUser() function
passport.deserializeUser((id, done) => {

  // If we have this id in database, then it's going to return the user as an object (with this id); 
  // otherwise, it's going to be "null"
  let user = userController.getUserById(id);

  if(user) 
  {
    // User object attached to the request as "req.user"
    done(null, user);
  } 
  else 
  {
    done({ message: "User not found!" }, null);
  }
});

module.exports = passport.use(localLogin).use(githubLogin);
