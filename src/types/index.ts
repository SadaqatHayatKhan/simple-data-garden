
export interface User {
  id: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  is_complete: boolean;
  created_at: string;
  user_id: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
