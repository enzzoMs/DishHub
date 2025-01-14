import { Component, effect, input, output, viewChild } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import {
  BehaviorSubject,
  combineLatestWith,
  map,
  Observable,
  Subject,
  switchMap,
  take,
  tap,
  timer,
} from "rxjs";
import { ReviewItemComponent } from "../review-item/review-item.component";
import { EnumeratePipe } from "../../../../shared/pipes/enumerate/enumerate.pipe";
import { Review } from "../../../../shared/models/review.model";
import { RestaurantsService } from "../../../../shared/services/restaurants/restaurants.service";
import { AppConfig } from "../../../../../config/config-constants";
import { User } from "../../../../shared/models/user.model";
import { FormDialogComponent } from "../../../../shared/components/form-dialog/form-dialog.component";
import { MessageDialogComponent } from "../../../../shared/components/message-dialog/message-dialog.component";
import { ReviewForm, ReviewFormConfig } from "./review-form-config";
import { ReviewsService } from "../../../../shared/services/reviews/reviews.service";
import { UserService } from "../../../../shared/services/user/user.service";

@Component({
  selector: "dhub-restaurant-reviews",
  standalone: true,
  imports: [
    AsyncPipe,
    ReviewItemComponent,
    EnumeratePipe,
    FormDialogComponent,
    MessageDialogComponent,
  ],
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

  loggedInUser$: Observable<User | null | undefined>;

  createReviewDialog = viewChild.required(FormDialogComponent);
  creationSuccessDialog = viewChild.required(MessageDialogComponent);

  private loadingCreationSubject$ = new BehaviorSubject(false);
  loadingCreation$ = this.loadingCreationSubject$.asObservable();

  reviewCreated = output<Review>();

  readonly ReviewFormConfig = ReviewFormConfig;

  constructor(
    restaurantsService: RestaurantsService,
    userService: UserService,
    private readonly reviewsService: ReviewsService,
  ) {
    this.reviews$ = this.reviewsUpdater$.asObservable().pipe(
      switchMap(() =>
        restaurantsService
          .getRestaurantReviews(
            this.restaurantId()!,
            this.currentReviewsPage,
            this.pageSize,
          )
          .pipe(
            combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
            map((loadingResult) => loadingResult[0]),
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

    this.loggedInUser$ = userService.loggedInUser$;
  }

  showCreateReviewDialog() {
    this.createReviewDialog().showModal();
  }

  createReview(reviewForm: ReviewForm) {
    const { comment, rating } = reviewForm;

    this.loadingCreationSubject$.next(true);

    this.reviewsService
      .createReview(this.restaurantId()!, comment, rating)
      .pipe(
        take(1),
        combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
        map((loadingResult) => loadingResult[0]),
      )
      .subscribe((review) => {
        this.loadedReviews.splice(0, 0, review);

        this.createReviewDialog().closeDialog();
        this.loadingCreationSubject$.next(false);
        this.creationSuccessDialog().showModal();

        if (this.totalReviews !== undefined) {
          this.totalReviews++;
          this.reviewCountChanged.emit(this.totalReviews);
        }

        this.reviewCreated.emit(review);
      });
  }

  seeMoreReviews() {
    this.currentReviewsPage++;

    this.loadingSubject$.next(true);
    this.reviewsUpdater$.next();
  }
}
