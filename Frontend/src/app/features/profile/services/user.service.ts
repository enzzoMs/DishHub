import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { Restaurant } from "../../../shared/models/restaurant.model";
import { apiEndpoints } from "../../../../api/api-endpoints";
import { Review } from "../../../shared/models/review.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  getUserRestaurants(includeMenu?: boolean): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(apiEndpoints.getUserRestaurants(), {
      params: includeMenu
        ? new HttpParams().append("includeMenu", includeMenu)
        : undefined,
    });
  }

  getUserReviews(): Observable<Review[]> {
    return this.http
      .get<Review[]>(apiEndpoints.getUserReviews())
      .pipe(
        tap((review) =>
          review.forEach(
            (review) => (review.creationDate = new Date(review.creationDate)),
          ),
        ),
      );
  }
}
