// @author: Amir Armion
// @version: V.01

const express        = require("express");
const expressLayouts = require("express-ejs-layouts");
const session        = require("express-session");
const os             = require("os");
const path           = require("path");
const port           = process.env.port || 8000;
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Configuring our session for passport
//
// NOTE: Before doing any passport stuffs, MUST be configure express session.
// NOTE: Passport, internally is creating session for us (by using "express-session" library)
app.use(
  session({
    secret: "secret", // For cookies with secret keys
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

const passport   = require("./middleware/passport");
const authRoute  = require("./routes/authRoute");
const indexRoute = require("./routes/indexRoute");

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize()); // Starting the passport
app.use(passport.session());    // Allowing to the passport to hook into the express-session

// Print out the session info:
app.use((req, res, next) => {
  
  console.log(`${os.EOL}========>> Start - Session Info <<========`);
  console.log(`${os.EOL}>> User details are:`, req.user);
  console.log(`${os.EOL}>> Entire session object:${os.EOL}`, req.session);
  console.log(`${os.EOL}>> Session details are:`, req.session.passport);
  console.log(`${os.EOL}================>> End <<================${os.EOL}`);
  
  next();
});

// Step 1:
app.use("/", indexRoute);
app.use("/auth", authRoute);

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});
