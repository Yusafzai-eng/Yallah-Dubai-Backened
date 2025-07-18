const express = require("express");
const app = express();
const router = express.Router();

// controllers
const { getlogin, getsignup, postauth, postsignup, postget, verifyToken } = require("../controllers/users");
const { postpersonal, getpersonal } = require("../controllers/personal");

// middlewares
const { authJWTandRole, emailValidator, authenticateJWT, loginLimiter } = require("../middlewares/middlewares");

// routes
router.get("/signup", getsignup);
router.get("/login", getlogin);

// ✅ VERIFY TOKEN ROUTE ADDED HERE
    //    new addded code
router.get("/api/verify-token", verifyToken); // 👈 This is the main fix

router.get('/api/booknow', authJWTandRole("user"), getpersonal);
router.post("/auth", authenticateJWT, postauth);
router.post("/signup", emailValidator, postsignup);
router.post("/login", loginLimiter, postget);
router.post('/api/cart', authJWTandRole("user"), postpersonal);

module.exports = router;
