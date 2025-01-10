import { Component, effect, input, output } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import {BehaviorSubject, combineLatestWith, map, Observable, Subject, switchMap, tap, timer} from "rxjs";
import { ReviewItemComponent } from "../review-item/review-item.component";
import { EnumeratePipe } from "../../../../shared/pipes/enumerate/enumerate.pipe";
import { Review } from "../../../../shared/models/review.model";
import { RestaurantsService } from "../../../../shared/services/restaurants/restaurants.service";
import {AppConfig} from "../../../../../config/config-constants";

@Component({
  selector: "dhub-restaurant-reviews",
  standalone: true,
  imports: [AsyncPipe, ReviewItemComponent, EnumeratePipe],
  templateUrl: "./restaurant-reviews.component.html",
  styleUrl: "./restaurant-reviews.component.css",
})
export class RestaurantReviewsComponent {
  restaurantId = input<number>();
  reviewCountChanged = output<number>();

  reviews$: Observable<Review[]>;
  private readonly reviewsUpdater$ = new Subject<void>();

  totalReviews: number | undefined;
  private loadedReviews: Review[] = [];
  allReviewsLoaded = false;

  private currentReviewsPage = 1;
  static readonly pageSize = 3;
  pageSize = RestaurantReviewsComponent.pageSize;

  private loadingSubject$ = new BehaviorSubject(true);
  loading$ = this.loadingSubject$.asObservable();

  constructor(restaurantsService: RestaurantsService) {
    this.reviews$ = this.reviewsUpdater$.asObservable().pipe(
      switchMap(() =>
        restaurantsService.getRestaurantReviews(
          this.restaurantId()!,
          this.currentReviewsPage,
          this.pageSize,
        ).pipe(
          combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
          map(loadingResult => loadingResult[0])
        ),
      ),
      tap((paginatedReviews) => {
        if (this.totalReviews === undefined) {
          this.reviewCountChanged.emit(paginatedReviews.totalItems);
        }

        this.totalReviews = paginatedReviews.totalItems;
        this.loadedReviews = this.loadedReviews.concat(
          ...paginatedReviews.data,
        );

        this.allReviewsLoaded = this.loadedReviews.length >= this.totalReviews;

        this.loadingSubject$.next(false);
      }),
      map(() => this.loadedReviews),
    );

    effect(() => {
      if (this.restaurantId()) {
        this.currentReviewsPage = 1;
        this.loadedReviews = [];

        this.loadingSubject$.next(true);
        this.reviewsUpdater$.next();
      }
    });
  }

  seeMoreReviews() {
    this.currentReviewsPage++;

    this.loadingSubject$.next(true);
    this.reviewsUpdater$.next();
  }
}
