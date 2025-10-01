import apiClient from "./axios-client";

const loginUser = (data: { username: string; password: string }) => {
  return apiClient.post("/api/auth/login", data);
};

const registerUser = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return apiClient.post("/api/auth/register", data);
};

export { loginUser, registerUser };
