const express = require("express");
const multer = require("multer");
const authentication = require("../../middlewares/authenticationUser");
const AuthController = require("./auth.controller");

const router = express.Router();

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/images/profiles/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.put("/update/:id", authentication, AuthController.update);
router.get("/", authentication, AuthController.getCurrentUser);
router.delete("/delete/:id", authentication, AuthController.deleteUser);

module.exports = router;
