// @author: Amir Armion
// @version: V.01

module.exports = {
  ensureAuthenticated: (req, res, next) => {

    if(req.isAuthenticated()) 
    {
      return next();
    }

    res.redirect("/auth/login");
  },
  forwardAuthenticated: (req, res, next) => {

    if(!req.isAuthenticated()) 
    {
      return next();
    }

    res.redirect("/dashboard");
  },
  isAdmin: (req, res, next) => {

    if(req.isAuthenticated())
    {
      if(req.user.role == "admin")
      {
        return next();
      }
      else
      {
        res.redirect("/dashboard");
      }
    }
    else
    {
      res.redirect("/auth/login");
    }
  }
};
