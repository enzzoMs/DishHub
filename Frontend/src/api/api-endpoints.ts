const API_BASE_PATH = "api";

export const apiEndpoints = {
  getRestaurants: () => `${API_BASE_PATH}/restaurants`,
  getRestaurantById: (id: number) => `${API_BASE_PATH}/restaurants/${id}`,
  getRestaurantReviews: (id: number) => `${API_BASE_PATH}/restaurants/${id}/reviews`,
  getRestaurantMenu: (id: number) => `${API_BASE_PATH}/restaurants/${id}/menu`,
};
