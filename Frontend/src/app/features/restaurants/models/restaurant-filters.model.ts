export interface RestaurantFilters {
  name: string | null;
  location: string | null;
  score: ScoreOption;
}

export interface ScoreOption {
  value: number | null;
}
