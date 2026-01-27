import UserModel from "../models/user.models";

export const findByIdUserService = async (userId: string) => {
  return await UserModel.findById(userId);
};

export const getUserService = async (userId: string) => {
  const users = await UserModel.find({ _id: { $ne: userId } }).select(
    "-password",
  );
  return users;
};
