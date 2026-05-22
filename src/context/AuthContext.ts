import type { User } from "firebase/auth";
import { createContext } from "react";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
