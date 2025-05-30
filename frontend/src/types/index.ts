
export type User = {
  id: string;
  name: string;
  email: string;
  username?: string;
  settings?: {
    theme?: string;
    notifications?: boolean;
  };
  createdAt?: string;
};

export type Board = {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  settings?: {
    visibility?: "public" | "private";
    color?: string;
  };
  createdAt?: string;
};

export type Column = {
  id: string;
  title: string;
  boardId: string;
  order: number;
  cards?: Card[];
  createdAt?: string;
};

export type Card = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  order: number;
  dueDate?: string;
  assignedUserId?: string;
  createdAt?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  username: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  id: string;
};

export type ApiError = {
  error: string;
};
