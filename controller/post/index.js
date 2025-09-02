const express = require("express");
const router = express.Router();
const PostController = require("./post.controller");
const authentication = require("../../middlewares/authenticationUser");

router.get("/search-suggestions", PostController.getSearchSuggestions);
router.get("/all", PostController.getAllPosts);
router.get("/postBy/:id", authentication, PostController.getPostById);
router.get("/post/:identifier", PostController.getPostByIdentifier);
router.post("/create", authentication, PostController.createPost);
router.put("/update/:id", authentication, PostController.updatePost);
router.delete("/delete/:id", authentication, PostController.deletePost);
router.put("/:id/react", PostController.reactToPost);
router.post("/:id/comment", PostController.addComment);
router.put("/:id/view", PostController.incrementViews);
router.get("/:id", authentication, PostController.getSinglePopulatedPost);
router.get("/mypost/posts", authentication, PostController.getMyPosts);
module.exports = router;
