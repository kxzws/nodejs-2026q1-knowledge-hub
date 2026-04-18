import bcrypt from 'bcrypt';

const saltRounds = process.env.CRYPT_SALT;

export const getHash = async (value: string): Promise<string> => {
  return await bcrypt.hash(value, saltRounds);
};

export const compareHash = async (
  data: string,
  encryptedData: string,
): Promise<boolean> => {
  return await bcrypt.compare(data, encryptedData);
};
