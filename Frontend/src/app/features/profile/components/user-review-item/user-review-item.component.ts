import { Component, input, output, viewChild } from "@angular/core";
import { Review } from "../../../../shared/models/review.model";
import { RoutePath } from "../../../../app.routes";
import { AsyncPipe } from "@angular/common";
import { EnumeratePipe } from "../../../../shared/pipes/enumerate/enumerate.pipe";
import { RouterLink } from "@angular/router";
import { FormDialogComponent } from "../../../../shared/components/form-dialog/form-dialog.component";
import { MessageDialogComponent } from "../../../../shared/components/message-dialog/message-dialog.component";
import { BehaviorSubject, combineLatestWith, map, take, timer } from "rxjs";
import { AppConfig } from "../../../../../config/config-constants";
import {
  ReviewForm,
  ReviewFormConfig,
} from "../../../restaurants/components/restaurant-reviews/review-form-config";
import { ReviewsService } from "../../../../shared/services/reviews/reviews.service";

@Component({
  selector: "dhub-user-review-item",
  standalone: true,
  imports: [
    EnumeratePipe,
    RouterLink,
    AsyncPipe,
    FormDialogComponent,
    MessageDialogComponent,
  ],
  templateUrl: "./user-review-item.component.html",
  styleUrl: "./user-review-item.component.css",
})
export class UserReviewItemComponent {
  reviewModel = input.required<Review>();

  updateReviewDialog = viewChild.required(FormDialogComponent);
  updateSuccessDialog = viewChild.required<MessageDialogComponent>(
    "updateSuccessDialog",
  );

  reviewUpdated = output<Review>();

  private readonly loadingUpdateSubject$ = new BehaviorSubject(false);
  readonly loadingUpdate$ = this.loadingUpdateSubject$.asObservable();

  deleteReviewDialog =
    viewChild.required<MessageDialogComponent>("deleteReviewDialog");
  deleteSuccessDialog = viewChild.required<MessageDialogComponent>(
    "deleteSuccessDialog",
  );

  reviewDeleted = output<Review>();

  private readonly loadingDeleteSubject$ = new BehaviorSubject(false);
  readonly loadingDelete$ = this.loadingDeleteSubject$.asObservable();

  readonly ReviewFormConfig = ReviewFormConfig;
  protected readonly RoutePaths = RoutePath;

  constructor(private readonly reviewService: ReviewsService) {}

  showUpdateReviewDialog() {
    const initialValue: ReviewForm = {
      comment: this.reviewModel().comment,
      rating: this.reviewModel().rating,
    };

    this.updateReviewDialog().showModal(initialValue);
  }

  showDeleteReviewDialog() {
    this.deleteReviewDialog().showModal();
  }

  updateReview(reviewForm: ReviewForm) {
    const { comment, rating } = reviewForm;

    this.loadingUpdateSubject$.next(true);

    this.reviewService
      .updateReview(this.reviewModel().restaurantId, this.reviewModel().id, comment, rating)
      .pipe(
        take(1),
        combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
        map((loadingResult) => loadingResult[0]),
      )
      .subscribe((review) => {
        this.reviewUpdated.emit(review);

        this.updateReviewDialog().closeDialog();
        this.loadingUpdateSubject$.next(false);
        this.updateSuccessDialog().showModal();
      });
  }

  deleteReview() {
    this.loadingDeleteSubject$.next(true);

    this.reviewService
      .deleteReview(this.reviewModel().restaurantId, this.reviewModel().id)
      .pipe(
        take(1),
        combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
        map((loadingResult) => loadingResult[0]),
      )
      .subscribe(() => {
        this.reviewDeleted.emit(this.reviewModel());

        this.deleteReviewDialog().closeDialog();
        this.loadingDeleteSubject$.next(false);
        this.deleteSuccessDialog().showModal();
      });
  }
}
