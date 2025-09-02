const Post = require("../../models/post.model");
const catchAsync = require("../../utils/catch");

class PostController {
  getSearchSuggestions = catchAsync(async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { desc: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
        { "comments.text": { $regex: query, $options: "i" } },
      ],
    }).select("_id title");

    res.json(posts);
  });

  getAllPosts = catchAsync(async (req, res) => {
    const { user: username, cat: catName } = req.query;
    let posts;

    if (username) posts = await Post.find({ username });
    else if (catName) posts = await Post.find({ categories: { $in: [catName] } });
    else posts = await Post.find();

    res.status(200).json(posts);
  });

  getPostById = catchAsync(async (req, res) => {
    const post = await Post.find({ _id: req.params.id });
    res.send({ success: true, msg: post });
  });

  getPostByIdentifier = catchAsync(async (req, res) => {
    const { identifier } = req.params;
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

    const post = isValidObjectId
      ? await Post.findById(identifier)
      : await Post.findOne({ slug: identifier });

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  });

  createPost = catchAsync(async (req, res) => {
    const { title, tags, desc, username, photo, ...rest } = req.body;
    if (!title || !desc || !username || !tags) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    let imagePath = photo?.startsWith("http") ? photo : `/images/blog/${photo}`;

    const newPost = new Post({
      title,
      desc,
      tags,
      username: req.user?.username,
      userId: req.userId,
      photo: imagePath,
      ...rest,
    });

    const savedPost = await newPost.save();
    res.status(200).json({ success: true, message: "Post created successfully", data: savedPost });
  });

  updatePost = catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    post.title = req.body.title;
    post.desc = req.body.desc;
    const updatedPost = await post.save();
    res.send({ success: true, msg: "Updated Successfully", data: updatedPost });
  });

  deletePost = catchAsync(async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.send({ success: true, msg: "Deleted Successfully" });
  });

  reactToPost = catchAsync(async (req, res) => {
    const { userId, action } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    post.likes = post.likes.filter(id => id.toString() !== userId);
    post.dislikes = post.dislikes.filter(id => id.toString() !== userId);

    if (action === "like") post.likes.push(userId);
    if (action === "dislike") post.dislikes.push(userId);

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  });

  addComment = catchAsync(async (req, res) => {
    const { userId, username, text } = req.body;
    const post = await Post.findById(req.params.id);
    post.comments.push({ userId, username, text });
    await post.save();
    res.status(200).json({ message: "Comment added successfully" });
  });

  incrementViews = catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.views = (post.views || 0) + 1;
    await post.save();
    res.status(200).json({ message: "View count updated", views: post.views });
  });

  getSinglePopulatedPost = catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id)
      .populate("likes", "username profilePic")
      .populate("dislikes", "username profilePic")
      .populate("comments.userId", "username profilePic");

    if (!post) return res.status(404).json({ success: false, msg: "Post not found" });

    res.send({ success: true, msg: post });
  });

  getMyPosts = catchAsync(async (req, res) => {
    const posts = await Post.find({ userId: req.userId });
    res.send({ success: true, msg: posts });
  });
}

module.exports = new PostController();
