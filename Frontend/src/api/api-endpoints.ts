import { AppConfig } from "../config/config-constants";

export const apiEndpoints = {
  getRestaurants: () => `${AppConfig.API_BASE_PATH}/restaurants`,
  getRestaurantById: (id: number) =>
    `${AppConfig.API_BASE_PATH}/restaurants/${id}`,
  getRestaurantReviews: (id: number) =>
    `${AppConfig.API_BASE_PATH}/restaurants/${id}/reviews`,
  createRestaurant: () => `${AppConfig.API_BASE_PATH}/restaurants`,
  updateRestaurant: (id: number) => `${AppConfig.API_BASE_PATH}/restaurants/${id}`,
  deleteRestaurant: (id: number) => `${AppConfig.API_BASE_PATH}/restaurants/${id}`,

  getRestaurantMenu: (restaurantId: number) =>
    `${AppConfig.API_BASE_PATH}/restaurants/${restaurantId}/menu`,
  createMenuItem: (restaurantId: number) =>
    `${AppConfig.API_BASE_PATH}/restaurants/${restaurantId}/menu`,
  updateMenuItem: (restaurantId: number, menuItemId: number) =>
    `${AppConfig.API_BASE_PATH}/restaurants/${restaurantId}/menu/${menuItemId}`,
  deleteMenuItem: (restaurantId: number, menuItemId: number) =>
    `${AppConfig.API_BASE_PATH}/restaurants/${restaurantId}/menu/${menuItemId}`,

  getAppStatistics: () => `${AppConfig.API_BASE_PATH}/statistics`,

  signUpUser: () => `${AppConfig.API_BASE_PATH}/auth/signup`,
  loginUser: () => `${AppConfig.API_BASE_PATH}/auth/login`,
  logout: () => `${AppConfig.API_BASE_PATH}/auth/logout`,
  userInformation: () => `${AppConfig.API_BASE_PATH}/user`,
  getUserRestaurants: () => `${AppConfig.API_BASE_PATH}/user/restaurants`,
  getUserReviews: () => `${AppConfig.API_BASE_PATH}/user/reviews`,
};
