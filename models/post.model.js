const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  photo: { type: String },
});

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    tags: { type: [String], required: true, unique: true },
    desc: { type: String, required: true },
    photo: { type: String },
    username: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
views: { type: Number, default: 0 },
    //  These replace `reactions`
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
 slug: { type: String, unique: true },
    comments: [commentSchema],

    categories: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
