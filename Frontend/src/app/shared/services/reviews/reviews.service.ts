import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { apiEndpoints } from "../../../../api/api-endpoints";
import { Review } from "../../models/review.model";

@Injectable({
  providedIn: "root",
})
export class ReviewsService {
  constructor(private http: HttpClient) {}

  createReview(
    restaurantId: number,
    comment: string,
    rating: number,
  ): Observable<Review> {
    return this.http
      .post<Review>(apiEndpoints.createReview(restaurantId), {
        comment,
        rating,
      })
      .pipe(
        tap((review) => (review.creationDate = new Date(review.creationDate))),
      );
  }

  updateReview(
    restaurantId: number,
    reviewId: number,
    comment: string,
    rating: number,
  ): Observable<Review> {
    return this.http.patch<Review>(
      apiEndpoints.updateReview(restaurantId, reviewId),
      {
        comment,
        rating,
      },
    );
  }

  deleteReview(restaurantId: number, reviewId: number): Observable<null> {
    return this.http.delete<null>(
      apiEndpoints.deleteReview(restaurantId, reviewId),
    );
  }
}
