import jwt from 'jsonwebtoken';

const HARDCODED_ADMIN = {
  username: 'admin',
  password: 'Admin@123'
};

export const loginAdmin = async (username: string, password: string): Promise<{ token: string; admin: { username: string } } | null> => {
  if (username !== HARDCODED_ADMIN.username) {
    return null;
  }

  const isValid = password === HARDCODED_ADMIN.password;
  if (!isValid) {
    return null;
  }

  const token = jwt.sign(
    { username: HARDCODED_ADMIN.username },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );

  return {
    token,
    admin: { username: HARDCODED_ADMIN.username }
  };
};
