import { createContext, useState, useEffect, useContext } from "react";
import { 
    registerUser,
    loginUser,
    getUser,
    updateUser,
    logoutUser,
    refreshAccessToken,
    getToken,
} from "@/api/authHandler";


export type User = {
    id: string,
    email: string,
    firstName?: string,
    lastName?: string,
    setupComplete: boolean,
    city?: string,
    state?: string,
    dateOfBirth?: Date,
    preferences?: {
        interests: string[],
        subscription: boolean,
        notifications: boolean,
        theme: { 
            type: String, 
            enum: ['light', 'dark'], 
            default: 'light' 
            }
    }
}

type AuthContextType = {
    user: User | null,
    accessToken: string | null,
    loading: boolean,
    login: (email: string, password:string) => Promise<void>,
    register: (email: string, password:string) => Promise<void>,
    getUser: () => Promise<void>,
    logout: () => Promise<void>,
    update: (updates: Record<string, any>) => Promise<void>,
    refresh: () => Promise<void>
}


export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = await getToken("access_token");
                if (token) {
                    setAccessToken(token);
                    await loadUser();
                }
            } catch (error) {
                console.warn("Error restoring session:", error);
                setLoading(false);
            } finally {
              setLoading(false);
            }
        };
        initializeAuth();
    }, []);

  const loadUser = async () => {
    try {
      const fetchedUser = await getUser();
      setUser(fetchedUser);
    } catch (error: any) {
      console.warn("Error fetching user:", error.message);
      // if token expired, try to refresh it
      if (error.response?.status === 401) {
        await refresh();
      }
    }
  };

const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { accessToken } = await loginUser(email, password);
      setAccessToken(accessToken);
      await loadUser();
    } catch (error) {
      console.warn("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { accessToken } = await registerUser(email, password);
      setAccessToken(accessToken);
      await loadUser();
    } catch (error) {
      console.warn("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    try {
      const newToken = await refreshAccessToken();
      setAccessToken(newToken);
      await loadUser();
    } catch (error) {
      console.warn("Refresh token failed:", error);
      await logout();
    }
  };

  const update = async (updates: Record<string, any>) => {
    try {
      const updatedUser = await updateUser(updates);
      setUser(updatedUser);
    } catch (error) {
      console.warn("User update failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

      return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        getUser: loadUser,
        update,
        refresh,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};


