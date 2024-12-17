const API_BASE_URL = "http://localhost:5012";

export const apiEndpoints = {
  getRestaurants: () => `${API_BASE_URL}/restaurants`,
  getRestaurantById: (id: number) => `${API_BASE_URL}/restaurants/${id}`,
  getRestaurantReviews: (id: number) => `${API_BASE_URL}/restaurants/${id}/reviews`,
  getRestaurantMenu: (id: number) => `${API_BASE_URL}/restaurants/${id}/menu`,
};
