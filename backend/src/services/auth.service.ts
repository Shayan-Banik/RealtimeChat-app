import UserModel from "../models/user.models";
import { NotFoundException, UnauthorizedException } from "../utils/app-error";
import {
  LoginSchemaType,
  RegisterSchemaType,
} from "../validators/authValidator";

export const registerService = async (body: RegisterSchemaType) => {
  const { email } = body;

  const userExists = await UserModel.findOne({ email });

  if (userExists) {
    throw new UnauthorizedException("Email already exists");
  }

  const newUser = new UserModel({ ...body });

  await newUser.save();
  return newUser;
};

export const loginService = async (body: LoginSchemaType)=> {
  const { email, password } = body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFoundException("Invalid credentials");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new UnauthorizedException("Invalid credentials");
  }
  return user;
};
