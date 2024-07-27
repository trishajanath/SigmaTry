import React, { createContext, useContext, useState } from "react";

// Define the type for the context value
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const updateUser = (updatedUser) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
  };

  return (
    <UserContext.Provider value={{ ...user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser };
