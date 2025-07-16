// ============ Builtin imports Start ================


const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const session = require("express-session");


// ============ Builtin imports end ================

// ============ User define imports Start ================

const  collection  = require("../models/users");


// ============ User define imports end  ================


// ============ Using a predefined secret key for JWT token =============

const secretKey = process.env.TOKEN_SECRET_KEY; // This should be stored in a secure environment


// ============= auth user post function ================

function postauth(req, res) {
  const user = req.user;
  res.status(200).json({ user });
}


// =============== login get function Start ================

function getlogin(req, res) {
  res.render("login");
}

// =============== login get function end ================

// ============== signup get function Start ================

function getsignup(req, res) {
  res.render("signup");
}

// ============== signup get function end ================




// ============= post signup function Start ================

async function postsignup(req, res) {
  try {
    // Create user data from request body
    const data = {
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: "user",
    };

    //  exist user 
    const existuser = await collection.findOne({ email: data.email });

    if (existuser != null) {
      return res.status(409) // 409 means conflict
    } else {
      // hash the password
      const hashpasword = await bcrypt.hash(data.password, 10);
      data.password = hashpasword;
      await collection.insertMany(data);
      res.status(200);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while signing up the user",
      error: error.message,
    });
  }
}

// ============== post signup function end ================


// ============== post login function Start ================


// is ka


// Login handler
async function postget(req, res) {
  try {
    const user = await collection.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: "Wrong password" });

    // Create JWT token
    const token = jwt.sign(
      { email: user.email, role: user.role },
      secretKey,
      { expiresIn: "1h" }
    );

//     // Optional: Store session data
req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.userEmail = user.email;
    req.session.cart = [];


  //  console.log(req.session.userId);
  //  console.log(user.id);
   

//  if (user && bcrypt.compareSync(req.body.password, user.password)) {
//     req.session.userId = user._id.toString();  // store as string
//     req.session.userName = user.name;
//     req.session.userEmail = user.email;
//     req.session.cart = [];
//     console.log("Session set:", req.session);
//     return res.status(200).json({ message: 'Login successful' });
//   }



    // Optional: Store session data
    // req.session.userId = user.id;
    // req.session.userName = user.name;
    // req.session.userEmail = user.email;
    // req.session.cart = [];
   
  
    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,          // Use HTTPS in production
      sameSite: "Strict",    // CSRF protection
      maxAge: 3600000        // 1 hour
    });

    // ✅ Send role in response
    return res.status(200).json({
      message: "Login successful",
      role: user.role,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "An error occurred during login" });
  }
}
    //  new add add code
function verifyToken(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    return res.status(200).json({ message: "Token valid", user: decoded });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}




// async function postget(req, res) {
//   try {
//     // Find user by email
//     const user = await collection.findOne({ email: req.body.email });

//     // Check if user exists
//     if (!user) {
//       return res.status(404).send("User not found"); // User not found
//     }

//     // Check if the password matches
//     const passwordMatch = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );

//     if (passwordMatch) {
//       // Check the user's role
//       const role = user.role; // Assuming `role` is stored in the user's document in MongoDB

//       // If password matched, generate JWT token and send that token to user otherwise a suitable response
//       const token = jwt.sign({ email: user.email, role: user.role }, secretKey);

//       / Return token in the cookie with security
//       // res.cookie("token", token, {
//       //   httpOnly: true,
//       //   secure: true,
//       //   sameSite: "Strict",
//       // });/
//       res.status(200).json({
//       message: "Login successful",
//       token, // yahan token direct bhej rahe ho
//       user: { email: user.email, role: user.role }
//     });
//       // sameSite: 'Strict' can be used too

//       req.session.userId = user.id; // Store user ID in session for cart management
//       req.session.userName = user.name; // Store user name in session for cart management
//       req.session.userEmail = user.email; // Store user email in
//       req.session.cart = []; // Initialize cart in the session

//       // Redirect to page according to role

//       if (role === "user") {
//         return res.redirect("/api/home"); // Render home page for normal users
//       } else if (role === "admin") {
//         return res.redirect("/api/admin"); // Render admin page for admin users
//       } else {
//         return res.render("login").status(403).send("Unauthorized access"); // If role is something unexpected
//       }
//     } else {
//       return res.render("login").status(401).send("Wrong password"); // Wrong password
//     }
//   } catch (error) {
//     console.error("Error during login:", error); // Log the error for debugging
//     return res.status(500).send("An error occurred while logging in"); // General error message
//   }
// }

// ============== post login function end ================

// ============== Module Exports ================
module.exports = {
  postauth,
  getlogin,
  getsignup,
  postsignup,
  postget,
  verifyToken, // ✅ Add this line
};






