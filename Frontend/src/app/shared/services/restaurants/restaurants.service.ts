import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { PaginatedItems } from "../../models/paginated-items";
import { HttpClient, HttpParams } from "@angular/common/http";
import { apiEndpoints } from "../../../../api/api-endpoints";
import {
  API_PAGINATION_HEADER,
  PaginationMetadata,
} from "../../../../api/pagination-metadata.model";
import { Restaurant } from "../../models/restaurant.model";
import { Review } from "../../models/review.model";
import { RestaurantFilters } from "../../../features/restaurants/models/restaurant-filters.model";

@Injectable({
  providedIn: "root",
})
export class RestaurantsService {
  constructor(private http: HttpClient) {}

  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(apiEndpoints.getRestaurantById(id));
  }

  getRestaurantsForPage(
    page: number,
    pageSize: number,
    filters: RestaurantFilters,
  ): Observable<PaginatedItems<Restaurant>> {
    const filtersParamMap: Record<string, string> = {};

    if (filters.name) {
      filtersParamMap["name"] = filters.name;
    }
    if (filters.location) {
      filtersParamMap["location"] = filters.location;
    }
    if (filters.score.value !== null) {
      filtersParamMap["score"] = filters.score.value.toString();
    }

    return this.getPaginatedItems<Restaurant>(
      apiEndpoints.getRestaurants(),
      page,
      pageSize,
      filtersParamMap,
    );
  }

  getRestaurantReviews(
    id: number,
    page: number,
    pageSize: number,
  ): Observable<PaginatedItems<Review>> {
    return this.getPaginatedItems<Review>(
      apiEndpoints.getRestaurantReviews(id),
      page,
      pageSize,
    ).pipe(
      map((paginatedReviews) => {
        paginatedReviews.data.forEach(
          (review) => (review.creationDate = new Date(review.creationDate)),
        );
        return paginatedReviews;
      }),
    );
  }

  createRestaurant(
    name: string,
    description: string,
    location: string,
  ): Observable<Restaurant> {
    return this.http.post<Restaurant>(apiEndpoints.createRestaurant(), {
      name,
      description,
      location,
    });
  }

  updateRestaurant(
    id: number,
    name: string,
    description: string,
    location: string,
  ): Observable<Restaurant> {
    return this.http.patch<Restaurant>(apiEndpoints.updateRestaurant(id), {
      name,
      description,
      location,
    });
  }

  deleteRestaurant(id: number): Observable<null> {
    return this.http.delete<null>(apiEndpoints.deleteRestaurant(id));
  }

  private getPaginatedItems<T>(
    apiEndpoint: string,
    page: number,
    pageSize: number,
    extraParams?: Record<string, string>,
  ): Observable<PaginatedItems<T>> {
    let httpParams = new HttpParams()
      .append("page", page)
      .append("pageSize", pageSize);

    if (extraParams) {
      for (const param in extraParams) {
        httpParams = httpParams.append(param, extraParams[param]);
      }
    }
    return this.http
      .get<T[]>(apiEndpoint, { params: httpParams, observe: "response" })
      .pipe(
        map((res) => {
          const paginationHeader = res.headers.get(API_PAGINATION_HEADER)!;

          const paginationMetadata = JSON.parse(
            paginationHeader,
          ) as PaginationMetadata;

          const paginatedItems: PaginatedItems<T> = {
            data: res.body!,
            pageNumber: paginationMetadata.pageIndex,
            totalItems: paginationMetadata.totalItems,
          };

          return paginatedItems;
        }),
      );
  }
}
