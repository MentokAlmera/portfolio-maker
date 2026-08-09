import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// ==========================================
// SIGNUP
// ==========================================

export const signup = async (userData) => {
  const response = await axios.post(
    `${API_URL}/signup`,
    userData
  );

  return response.data;
};

// ==========================================
// VERIFY EMAIL
// ==========================================

export const verifyEmail = async (email, code) => {
  const response = await axios.post(
    `${API_URL}/verify-email`,
    {
      email,
      code,
    }
  );

  return response.data;
};

// ==========================================
// LOGIN
// ==========================================

export const login = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/login`,
    {
      email,
      password,
    }
  );

  // Save JWT
  localStorage.setItem(
    "token",
    response.data.token
  );

  // Save logged-in user
  localStorage.setItem(
    "user",
    JSON.stringify(response.data.user)
  );

  return response.data;
};

// ==========================================
// LOGOUT
// ==========================================

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ==========================================
// GET CURRENT USER
// ==========================================

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Unable to read user:", error);

    return null;
  }
};

// ==========================================
// GET TOKEN
// ==========================================

export const getToken = () => {
  return localStorage.getItem("token");
};