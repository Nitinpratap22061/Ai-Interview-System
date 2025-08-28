const { UserModel } = require("../model/user");

const UserInterviewData = async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await UserModel.findById(userId).populate("userPastInterview");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const interviews = user.userPastInterview || [];
    res.status(200).json({
      message: "User interviews fetched successfully",
      interviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Couldn't fetch user interviews",
      error: error.message,
    });
  }
};

module.exports = {
  UserInterviewData,
};
