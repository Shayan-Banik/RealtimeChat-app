import mongoose, { Schema, Document } from "mongoose";
import { comparevalue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);


userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
   this.password = await hashValue(this.password, 10);
  }
});


userSchema.methods.comparePassword = async function (password: string) {
  return await comparevalue(password, this.password);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
