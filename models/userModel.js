// @author: Amir Armion
// @version: V.01

// Database:
const database = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    role: "user"
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    role: "user"
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    role: "user"
  },
  {
    id: 4,
    name: "Amir Armion",
    email: "AArmion@SAP.com",
    password: "a123",
    role: "admin"
  }
];

const userModel = {
  
  findOne: (email) => {

    const user = database.find((user) => user.email === email);

    // NOTE: If we had a real database, here we commented out the above line, 
    // and then use SQL code here to catch the user from the real database.
    // Example:
    // const user = `SELECT email, password FROM users WHERE...`;

    if(user) 
    {
      return user;
    }

    throw new Error(`Couldn't find user with email: ${email}`);
  },
  findById: (id) => {

    const user = database.find((user) => user.id === id);

    if(user) 
    {
      return user;
    }

    throw new Error(`Couldn't find user with id: ${id}`);
  },
  findOrCreate: (githubId, name) => {

    let user = null;
    user     = database.find((user) => user.id === githubId);

    if(!user)
    {
      database.push({ id: githubId, name: name, role: "user" });
      const newUser = database.find((user) => user.id == githubId);
      
      return newUser;
    }

    return user;
  }
};

module.exports = { database, userModel };
