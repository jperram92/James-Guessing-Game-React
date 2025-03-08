import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types/game";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  isParent: boolean;
  avatarUrl?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  isParent: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<AuthUser>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from local storage or session
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        // Check if we have a session
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData?.session) {
          // Get user profile data
          const { data: userData, error: userError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", sessionData.session.user.id)
            .single();

          if (userError) throw userError;

          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              isParent: userData.is_parent,
              avatarUrl: userData.avatar_url,
            });
          }
        } else {
          // For demo purposes, check if we have a user in localStorage
          const storedUser = localStorage.getItem("wordWizardUser");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Get user profile after sign in
          const { data: userData, error: userError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!userError && userData) {
            const authUser = {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              isParent: userData.is_parent,
              avatarUrl: userData.avatar_url,
            };
            setUser(authUser);
            localStorage.setItem("wordWizardUser", JSON.stringify(authUser));
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem("wordWizardUser");
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      try {
        // Mock implementation for demo
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

        // Demo login - in a real app, this would be handled by Supabase
        if (email === "demo@example.com" && password === "password") {
          const mockUser = {
            id: "demo-user-id",
            email: "demo@example.com",
            name: "Demo User",
            isParent: false,
            avatarUrl:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=demo-user",
          };
          setUser(mockUser);
          localStorage.setItem("wordWizardUser", JSON.stringify(mockUser));
          return true;
        } else if (email === "parent@example.com" && password === "password") {
          const mockParent = {
            id: "demo-parent-id",
            email: "parent@example.com",
            name: "Demo Parent",
            isParent: true,
            avatarUrl:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=demo-parent",
          };
          setUser(mockParent);
          localStorage.setItem("wordWizardUser", JSON.stringify(mockParent));
          return true;
        } else {
          // Check if this user has registered before
          const registeredUsers = localStorage.getItem(
            "wordWizardRegisteredUsers",
          );
          const users = registeredUsers ? JSON.parse(registeredUsers) : [];

          const foundUser = users.find(
            (user) => user.email === email && user.password === password,
          );

          if (foundUser) {
            // User found, log them in
            const userToLogin = {
              id: foundUser.id,
              email: foundUser.email,
              name: foundUser.name,
              isParent: foundUser.isParent,
              avatarUrl: foundUser.avatarUrl,
            };
            setUser(userToLogin);
            localStorage.setItem("wordWizardUser", JSON.stringify(userToLogin));
            return true;
          }

          throw new Error("Invalid email or password");
        }
      } catch (error) {
        throw error;
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
      return false;
    } finally {
      setIsLoading(false);
    }

    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      try {
        // Mock implementation for demo
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

        // Demo registration - in a real app, this would be handled by Supabase
        const mockUserId = `user-${Date.now()}`;
        const newUser = {
          id: mockUserId,
          email: data.email,
          name: data.name,
          isParent: data.isParent,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockUserId}`,
          password: data.password, // Store password for mock auth
        };

        // Save to registered users list
        const registeredUsers = localStorage.getItem(
          "wordWizardRegisteredUsers",
        );
        const users = registeredUsers ? JSON.parse(registeredUsers) : [];
        users.push(newUser);
        localStorage.setItem(
          "wordWizardRegisteredUsers",
          JSON.stringify(users),
        );

        // Set current user (without password in the current user object)
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        setUser(userWithoutPassword);
        localStorage.setItem(
          "wordWizardUser",
          JSON.stringify(userWithoutPassword),
        );
        return true;
      } catch (error) {
        throw error;
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      return false;
    } finally {
      setIsLoading(false);
    }

    return false;
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      if (supabase.auth) {
        await supabase.auth.signOut();
      }

      // Clear local state regardless of whether we're using Supabase
      setUser(null);
      localStorage.removeItem("wordWizardUser");
    } catch (err: any) {
      console.error("Error signing out:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (
    data: Partial<AuthUser>,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!user) throw new Error("No user logged in");

      if (supabase.auth) {
        // Update the user profile in the database
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({
            name: data.name,
            avatar_url: data.avatarUrl,
            // Only update is_parent if it's explicitly provided
            ...(data.isParent !== undefined
              ? { is_parent: data.isParent }
              : {}),
          })
          .eq("id", user.id);

        if (updateError) throw updateError;
      }

      // Update local state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("wordWizardUser", JSON.stringify(updatedUser));

      return true;
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
