import { User } from 'src/modules/users/entities/user.entity';

export const getUserWoPassword = ({
  id,
  login,
  role,
  createdAt,
  updatedAt,
}: User): Omit<User, 'password'> => ({ id, login, role, createdAt, updatedAt });
