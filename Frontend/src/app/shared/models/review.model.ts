export interface Review {
  id: number;
  userName: string;
  comment: string;
  rating: number;
  creationDate: Date;
  restaurantId: number;
  restaurantName: string;
}
