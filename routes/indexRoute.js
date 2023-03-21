// @author: Amir Armion
// @version: V.01

const express = require("express");
const router  = express.Router();
const os      = require("os");

const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

// Welcome Rout:
// URL: "localhost:8000/"
// This page doesn't need to be protected, so we didn't use ensureAuthenticated function here.
// So, everyone can go to this page. No authorization needed!
router.get("/", (req, res) => {
  res.send("Hello, and Welcome! This is main page.");
});

// Dashboard Rout:
// 
// User Dashboard:
// URL: "localhost:8000/dashboard"
// The only person can see this page (dashboard page) is the person who is logged in (this person is not admin!).
// 
// NOTE: For protecting a page from an invalid user, 
// we should use ensureAuthenticated function to check user's authorization.
// NOTE: Anytime if we want to protect a page, we have to use ensureAuthenticated function.
router.get("/dashboard", ensureAuthenticated, (req, res) => {

  if(req.user.role !== "admin")
  {
    res.render("dashboard", { dataUser: req.user });
  }
  else
  {
    res.redirect("admin")
  }
});

// Admin Dashboard:
router.get("/admin", isAdmin, (req, res) => {

  // Session Store:
  const activeSessionIds  = Object.keys(req.sessionStore.sessions); // All Keys in the Session Store (All Active Session IDs) as an array
  const allActiveSessions = Object.values(req.sessionStore.sessions); // All Values related to Active Session IDs as an array

  // Making match between User ID and Session ID, and push each match as an object to an array
  const iDs = [];

  for(let i = 0; i < allActiveSessions.length; i++) 
  {
    for(let j = 0; j < activeSessionIds.length; j++) 
    {
      if(i == j)
      {
        let userId    = JSON.parse(allActiveSessions[i]).passport.user; // First, convert string to an object by JSON.parse(" "); and then extract user's id from that object
        let sessionId = activeSessionIds[i];

        iDs.push({ "userId": userId, "sessionId": sessionId }); 
      }
    }
  }

  console.log(`${os.EOL}===>>> iDs:`, iDs); // [ { userId: X1, sessionId: Y1 }, { userId: X2, sessionId: Y2 }, ... ]

  // Info about Session Store:
  console.log(`${os.EOL}===>>> \"req.sessionStore.sessions\" - All Active Sessions in the Session Store:`, req.sessionStore.sessions); // All Active Sessions in the Session Store
  console.log(`===>>> \"Object.keys(req.sessionStore.sessions)\" - All Keys (All Active Session IDs) in the Session Store as an array:`, Object.keys(req.sessionStore.sessions)); // All Active Session IDs as an array
  console.log(`===>>> \"Object.values(req.sessionStore.sessions)\" - All Values related to Active Session IDs as an array:`, Object.values(req.sessionStore.sessions)); // All Values related to Active Session IDs as an array
  
  // Example: Information about first session in the Session Store: Object.values(req.sessionStore.sessions)[0]
  console.log(`${os.EOL}===>>> \"JSON.parse(Object.values(req.sessionStore.sessions)[0])\":`, JSON.parse(Object.values(req.sessionStore.sessions)[0]));
  console.log(`===>>> \"JSON.parse(Object.values(req.sessionStore.sessions)[0]).passport\":`, JSON.parse(Object.values(req.sessionStore.sessions)[0]).passport);
  console.log(`===>>> \"JSON.parse(Object.values(req.sessionStore.sessions)[0]).passport.user\":`, JSON.parse(Object.values(req.sessionStore.sessions)[0]).passport.user);

  // Extract Admin's first name from Admin's full name
  const adminFirstName = req.user.name.split(" ")[0];

  // Information about Admin
  console.log(`${os.EOL}===>>> \"req.user\" - All information about Admin in the database:`, req.user); // All information about Admin in the database
  console.log(`===>>> \"req.session\" - All information about Admin's session:`, req.session); // All information about Admin's session
  console.log(`===>>> \"Object.keys(req.session)\" - [ cookie, passport ]'s Admin:`, Object.keys(req.session)); // [ cookie, passport ]'s' Admin
  console.log(`===>>> \"Object.values(req.session)\" - All Values related to [ cookie, passport ]'s Admin:`, Object.values(req.session)); // All Values related to [ cookie, passport ]'s Admin
  console.log(`===>>> \"req.session.id\" - Admin's Session ID:`, req.session.id); // Admin's Session ID 

  res.render("admin", { adminData: req.user, adminFirstName, adminSessionId: req.session.id, activeSessionIds, iDs });
});

// Revoke a session
router.get("/revoke", isAdmin, (req, res) => {
  
  const thisSId = req.query.sid;

  console.log(`${os.EOL}===>>> This sid is deleted:`, thisSId);

  req.sessionStore.destroy(thisSId, (err) => {

    // callback function. If an error occurs, it will be accessible here.
    if(err)
    {
      return console.error(err);
    }
    
    res.redirect("admin");
  })
});

module.exports = router;
