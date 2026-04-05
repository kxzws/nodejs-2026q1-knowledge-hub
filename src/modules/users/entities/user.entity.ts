export enum Role {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  role: Role;
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}
