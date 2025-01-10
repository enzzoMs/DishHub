import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Restaurant } from "../../../shared/models/restaurant.model";
import { apiEndpoints } from "../../../../api/api-endpoints";
import { Review } from "../../../shared/models/review.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  getUserRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(apiEndpoints.getUserRestaurants());
  }

  getUserReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(apiEndpoints.getUserReviews());
  }
}
