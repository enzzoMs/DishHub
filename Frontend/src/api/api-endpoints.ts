import { AppConfig } from "../config/config-constants";

export const apiEndpoints = {
  getRestaurants: () => `${AppConfig.API_BASE_PATH}/restaurants`,
  getRestaurantById: (id: number) =>
    `${AppConfig.API_BASE_PATH}/restaurants/${id}`,
  getRestaurantReviews: (id: number) =>
    `${AppConfig.API_BASE_PATH}/restaurants/${id}/reviews`,
  getRestaurantMenu: (id: number) =>
    `${AppConfig.API_BASE_PATH}/restaurants/${id}/menu`,
  getAppStatistics: () => `${AppConfig.API_BASE_PATH}/statistics`,
  signUpUser: () => `${AppConfig.API_BASE_PATH}/auth/signup`,
  loginUser: () => `${AppConfig.API_BASE_PATH}/auth/login`,
  logout: () => `${AppConfig.API_BASE_PATH}/auth/logout`,
  userInformation: () => `${AppConfig.API_BASE_PATH}/user`,
};
