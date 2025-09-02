const express = require("express");
const authentication = require("../../middlewares/authenticationUser");
const UserController = require("./user.controller");
const router = express.Router();



router.post("/:id/follow", authentication, UserController.followUser);
router.post("/:id/unfollow", authentication, UserController.unfollowUser);
router.get("/:username/followers-count", UserController.getFollowersCount);
router.get("/profile/:username", UserController.getUserProfile);
router.get("/:username/followers", UserController.getFollowers);
router.get("/:username/following", UserController.getFollowing);
module.exports = router;
