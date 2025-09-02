const User = require("../../models/user.model");
const catchAsync = require("../../utils/catch");

class UserController {

    static followUser = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const targetUserId = req.params.id;

    if (userId === targetUserId) return res.status(400).json({ message: "You can't follow yourself" });

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    if (user.following.includes(targetUserId)) return res.status(400).json({ message: "Already following" });

    user.following.push(targetUserId);
    targetUser.followers.push(userId);

    await user.save();
    await targetUser.save();

    res.status(200).json({ message: "Followed successfully" });
  });

  static unfollowUser = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const targetUserId = req.params.id;

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    user.following.pull(targetUserId);
    targetUser.followers.pull(userId);

    await user.save();
    await targetUser.save();

    res.status(200).json({ message: "Unfollowed successfully" });
  });

  static getFollowersCount = catchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      followersCount: user.followers.length,
      followingCount: user.following.length,
    });
  });

  static getUserProfile = catchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  });

  static getFollowers = catchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username }).populate("followers", "username email");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.followers);
  });

  static getFollowing = catchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username }).populate("following", "username email");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.following);
  });
}
module.exports = UserController;