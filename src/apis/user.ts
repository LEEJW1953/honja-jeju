import axios from 'axios';
import { LoginFormData, RegisterFormData } from '../types/UserTypes';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const registerUser = async (formData: RegisterFormData) => {
  const response = await axios.post(`${baseUrl}/auth/signup`, formData);
  return response;
};

export const loginUser = async (formData: LoginFormData) => {
  const response = await axios.post(`${baseUrl}/auth/signin`, formData);
  return response;
};

export const refreshUserTokens = async (refreshToken: string) => {
  const response = await axios.post(`${baseUrl}/auth/refresh`, refreshToken);
  return response;
};
