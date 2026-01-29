export const getEnv = (key: string, dafaultValue?: string) => {
  const value = process.env[key] ?? dafaultValue;

  if (!value) {
    throw new Error(`Missing env variable ${key}`);
  }
  return value;
};
