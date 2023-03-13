// @author: Amir Armion
// @version: V.01

const express  = require("express");
const passport = require("../middleware/passport");
const router   = express.Router();

const { forwardAuthenticated } = require("../middleware/checkAuth");

// URL: "localhost:8000/auth/login"
//
// NOTE: If a user logged in successfully, when that user wants to go back to the login page, 
// forwardAuthenticated prevents this action from that user (a valid and logged in user can not see the login page, unless user logged out).
router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

// Step 2:
// URL: "localhost:8000/auth/login"
// When we click the "Login" button in the login page, 
// and username and password were valid, then we are going to go step 3 and 4.
//
// NOTE: "passport.authenticate" sends email(username) and password to the Strategy (passport.js file)
router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    if(req.user.role === "admin")
    {
      res.redirect("/admin");
    }
    else
    {
    res.redirect("/dashboard");
    }
  }
);

// GitHub:
// When we clicked the "Login with GitHub" button, this code is going to be executed
router.get("/github",
  // Means use github strategy
  passport.authenticate("github")
);

// When GitHub sends the result of user's attempt for login, this code is going to be executed
router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    if(req.user.role === "admin")
    {
      res.redirect("/admin");
    }
    else
    {
    res.redirect("/dashboard");
    }
  }
);


// URL: "localhost:8000/auth/logout"
// When "Logout" link clicked in the dashboard page, this code will execute.
router.get("/logout", (req, res) => {
  
  // Destroying the session, so user no longer be authorized
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

module.exports = router;
