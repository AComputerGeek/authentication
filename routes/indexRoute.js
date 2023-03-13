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
// URL: "localhost:8000/dashboard"
// The only person can see this page (dashboard page) is the person who is logged in.
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

// Admin Panel
router.get("/admin", isAdmin, (req, res) => {

  // Session Store:
  const activeSessionIds  = Object.keys(req.sessionStore.sessions);
  const allActiveSessions = Object.values(req.sessionStore.sessions);


  const iDs = [];

  for (let i = 0; i < Object.values(req.sessionStore.sessions).length; i++) 
  {
    for (let j = 0; j < activeSessionIds.length; j++) 
    {
      if(i == j)
      {
        let userId    = JSON.parse(Object.values(req.sessionStore.sessions)[i]).passport.user;
        let sessionId = activeSessionIds[i];
        iDs.push({ "userId": userId, "sessionId": sessionId }); 
      }
    }
  }

  console.log("iDs:", iDs);



 


  console.log(`${os.EOL}===>>> \"req.sessionStore.sessions\" - The Session Store (All Active Sessions):`, req.sessionStore.sessions); // Session Store (All Active Sessions)
  console.log(`===>>> \"Object.keys(req.sessionStore.sessions)\" - All Keys in the Session Store (All Active Session IDs) as an array:`, Object.keys(req.sessionStore.sessions)); // All Active Session IDs as an array
  console.log(`===>>> \"Object.values(req.sessionStore.sessions)\" - All Values related to Active Session IDs as an array:`, Object.values(req.sessionStore.sessions)); // All Values related to Active Session IDs as an array
  
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++");
  console.log(`===>>> \"JSON.parse(Object.values(req.sessionStore.sessions)[0])\" - :`, JSON.parse(Object.values(req.sessionStore.sessions)[0]).passport);
  console.log(`===>>> \"JSON.parse(Object.values(req.sessionStore.sessions)[0]).passport\" - :`, JSON.parse(Object.values(req.sessionStore.sessions)[0]).passport);
  console.log(`===>>> \"JSON.parse(Object.values(req.sessionStore.sessions)[0]).passport.user\" - :`, JSON.parse(Object.values(req.sessionStore.sessions)[0]).passport.user);
  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++");


  // Admin:
  const adminFirstName = req.user.name.split(" ")[0];

  console.log(`${os.EOL}===>>> \"req.user\" - All information about Admin in the database:`, req.user); // All info about Admin in the database
  console.log(`===>>> \"req.session\" - All information about Admin's session:`, req.session); // All information about Admin's session
  console.log(`===>>> \"Object.keys(req.session)\" - [ cookie, passport ]'s Admin:`, Object.keys(req.session)); // [ cookie, passport ]'s' Admin
  console.log(`===>>> \"Object.values(req.session)\" - All Values related to [ cookie, passport ]'s Admin:`, Object.values(req.session)); // All Values related to [ cookie, passport ]'s Admin
  console.log(`===>>> \"req.session.id\" - Admin's Session ID:`, req.session.id); // Admin's Session ID 


  res.render("admin", { adminData: req.user, adminFirstName: adminFirstName, adminSessionId: req.session.id, activeSessionIds, iDs });
});

// Revoke a session
router.get("/revoke", isAdmin, (req, res) => {
  
  const thisSId = req.query.sid;

  console.log("This sid is deleted: ", thisSId);

  req.sessionStore.destroy(thisSId, (err) => {

    // callback function. If an error occurs, it will be accessible here.
    if(err)
    {
      return console.error(err)
    }
    
    res.redirect("admin");
  })
});

module.exports = router;
