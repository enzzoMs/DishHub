import { AppConfig } from "../config/config-constants";

export const apiEndpoints = {
  getRestaurants: () => `${AppConfig.API_BASE_PATH}/restaurants`,
  getRestaurantById: (id: number) =>
    `${AppConfig.API_BASE_PATH}/restaurants/${id}`,
  getRestaurantReviews: (id: number) =>
    `${AppConfig.API_BASE_PATH}/restaurants/${id}/reviews`,
  getRestaurantMenu: (id: number) =>
    `${AppConfig.API_BASE_PATH}/restaurants/${id}/menu`,
  signUpUser: () => `${AppConfig.API_BASE_PATH}/auth/signup`,
};
