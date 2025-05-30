
import { AuthResponse, ApiError, User, Board, Column, Card, LoginCredentials, RegisterCredentials } from "@/types";

const API_URL = "https://sogeor.com/api";

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.error || `Error: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

// Create request headers with authentication token if available
const createHeaders = (): HeadersInit => {
  return  {
      "Content-Type": "application/json",
  };
};

// Authentication
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/account/login`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(credentials),
    });
    return handleResponse<AuthResponse>(response);
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/account/create`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(credentials),
    });
    return handleResponse<AuthResponse>(response);
  },

  getUserInfo: async (userId: string = 'me'): Promise<User> => {
    const response = await fetch(`${API_URL}/account/${userId}/about`, {
      headers: createHeaders(),
    });
    const data = await handleResponse<User & { _id: string }>(response);
    return {
      id: data._id,
      name: data.username,
      email: data.email,
      username: data.username,
      settings: data.settings,
      createdAt: data.createdAt,
    };
  },

  updateUserSettings: async (userId: string = 'me', settings: { theme?: string; notifications?: boolean }): Promise<User["settings"]> => {
    const response = await fetch(`${API_URL}/account/${userId}/settings`, {
      method: "PUT",
      headers: createHeaders(),
      body: JSON.stringify(settings),
    });
    return handleResponse<User["settings"]>(response);
  },

  deleteAccount: async (userId: string = 'me'): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/account/${userId}`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },
};

// Board management
export const boardsAPI = {
  getUserBoards: async (userId: string = 'me'): Promise<Board[]> => {
    const response = await fetch(`${API_URL}/account/${userId}/boards`, {
      headers: createHeaders(),
    });
    const data = await handleResponse<(Board & { owner: string, _id: string })[]>(response);
    // Transform the response to match our Board type
    return data.map(board => ({
      id: board._id,
      title: board.title,
      description: "",
      ownerId: board.owner,
      settings: board.settings,
      createdAt: board.createdAt
    }));
  },

  createBoard: async (boardData: { title: string; settings?: { visibility?: "public" | "private"; color?: string } }): Promise<Board> => {
    const response = await fetch(`${API_URL}/board`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(boardData),
    });
    const data = await handleResponse<Board & { _id: string, owner: string }>(response);
    // Transform the response to match our Board type
    return {
      id: data._id,
      title: data.title,
      description: "", // API doesn't provide description
      ownerId: data.owner,
      settings: data.settings,
      createdAt: data.createdAt
    };
  },

  updateBoardSettings: async (boardId: string, settings: { visibility?: "public" | "private"; color?: string }): Promise<{ visibility?: string; color?: string }> => {
    const response = await fetch(`${API_URL}/board/${boardId}/settings`, {
      method: "PUT",
      headers: createHeaders(),
      body: JSON.stringify(settings),
    });
    return handleResponse<{ visibility?: string; color?: string }>(response);
  },

  deleteBoard: async (boardId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/board/${boardId}`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },
};

// Workflow (columns and cards) management
export const workflowAPI = {
  getBoardWorkflow: async (boardId: string): Promise<Column[]> => {
    const response = await fetch(`${API_URL}/board/${boardId}/workflow`, {
      headers: createHeaders(),
    });
    const data = await handleResponse<any[]>(response);
    // Transform the response to match our Column type
    return data.map((column, index) => ({
      id: column._id,
      title: column.title,
      boardId: column.board,
      order: index, // We'll use the array index as the order since API doesn't provide it
      cards: column.cards?.map((card: any, cardIndex: number) => ({
        id: card._id,
        title: card.title,
        description: card.description || "",
        columnId: column._id,
        order: cardIndex, // Similarly, use array index for card order
        createdAt: card.createdAt
      })),
      createdAt: column.createdAt
    }));
  },

  createColumn: async (boardId: string, title: string): Promise<Column> => {
    const response = await fetch(`${API_URL}/board/${boardId}/workflow`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({ title }),
    });
    const data = await handleResponse<any>(response);
    // Transform the response to match our Column type
    return {
      id: data._id,
      title: data.title,
      boardId: data.board,
      order: 0, // Default order
      cards: [],
      createdAt: data.createdAt
    };
  },

  deleteColumn: async (boardId: string, columnId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/board/${boardId}/workflow/${columnId}`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },

  createCard: async (boardId: string, columnId: string, cardData: { title: string; description?: string }): Promise<Card> => {
    const response = await fetch(`${API_URL}/board/${boardId}/workflow/${columnId}/card`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(cardData),
    });
    const data = await handleResponse<any>(response);
    // Transform the response to match our Card type
    return {
      id: data._id,
      title: data.title,
      description: data.description || "",
      columnId: columnId,
      order: 0, // Default order
      createdAt: data.createdAt
    };
  },

  deleteCard: async (boardId: string, columnId: string, cardId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/board/${boardId}/workflow/${columnId}/card/${cardId}`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },
};
