const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../controllers/userController");

router.get("/",protect,getAllUsers);
router.post("/",registerUser);
router.post("/login",loginUser);

module.exports = router;
