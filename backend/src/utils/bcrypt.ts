import bcrypt from "bcryptjs";

export const hashValue = async (val: string, salt: number = 10) => {
  return await bcrypt.hash(val, salt);
};

export const comparevalue = async (val: string, hashVal: string) => {
  return await bcrypt.compare(val, hashVal);
};


