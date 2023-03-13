// @author: Amir Armion
// @version: V.01

const userModel = require("../models/userModel").userModel;

// This function check database
const getUserByEmailIdAndPassword = (email, password) => {

  // If we have this email in database, then it's going to return the user as an object (with this email);
  // otherwise, it's going to throw an error with a message!
  let user = userModel.findOne(email);

  // If we found the user
  if(user)
  {
    // If we have this user with this password in database (checking user's password), 
    // then it's going to return this user as an object
    if(isUserValid(user, password)) 
    {      
      return user;
    }
  }

  // If we didn't find the user (with this email and password), then it returns "null"
  return null;
};

const getUserById = (id) => {

  let user = userModel.findById(id);

  if(user) 
  {
    return user;
  }

  return null;
};

const getUserByGithubId = (githubId, name) => {

  let user = userModel.findOrCreate(githubId, name);

  if(user) 
  {
    return user;
  }

  return null;
}

function isUserValid(user, password) 
{
  return user.password === password;
}

module.exports = {
  getUserByEmailIdAndPassword,
  getUserById,
  getUserByGithubId
};
