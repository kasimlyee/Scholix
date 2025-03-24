import {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface AuthState {
  token: string | null;
  email: string | null;
  role: string | null;
}

interface AuthContextType {
  user: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthState>({
    token: localStorage.getItem("token"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Set axios default header on mount if token exists
    if (user.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user.token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        { email, password }
      );
      const { access_token, role } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);
      setUser({ token: access_token, email, role });
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      navigate("/dashboard");
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser({ token: null, email: null, role: null });
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


