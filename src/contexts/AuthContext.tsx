import React, { useState, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  registeredAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  register: (userData: Omit<User, 'id' | 'registeredAt'>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for existing user
    const savedUser = localStorage.getItem('registeredUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      return {
        ...parsedUser,
        registeredAt: new Date(parsedUser.registeredAt)
      };
    }
    return null;
  });

  const register = (userData: Omit<User, 'id' | 'registeredAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      registeredAt: new Date()
    };
    
    setUser(newUser);
    localStorage.setItem('registeredUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('registeredUser');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
