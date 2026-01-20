import UserModel from "../models/user.models";

export const findByIdUserService = async (userId: string) => {
    return await UserModel.findById(userId);
}