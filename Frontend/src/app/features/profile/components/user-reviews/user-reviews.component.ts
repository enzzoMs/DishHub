import { Component, OnInit } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { UserReviewItemComponent } from "../user-review-item/user-review-item.component";
import { EnumeratePipe } from "../../../../shared/pipes/enumerate/enumerate.pipe";
import { BehaviorSubject, combineLatestWith, map, take, timer } from "rxjs";
import { UserService } from "../../services/user.service";
import { AppConfig } from "../../../../../config/config-constants";
import { Review } from "../../../../shared/models/review.model";

@Component({
  selector: "dhub-user-reviews",
  standalone: true,
  imports: [AsyncPipe, UserReviewItemComponent, EnumeratePipe],
  templateUrl: "./user-reviews.component.html",
  styleUrl: "./user-reviews.component.css",
})
export class UserReviewsComponent implements OnInit {
  private readonly userReviewsSubject$ = new BehaviorSubject<
    Review[] | undefined
  >(undefined);
  readonly userReviews$ = this.userReviewsSubject$.asObservable();

  readonly numOfLoadingSkeletons = 4;

  constructor(private readonly userService: UserService) {}

  ngOnInit() {
    this.userService
      .getUserReviews()
      .pipe(
        combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
        map((loadingResult) => loadingResult[0]),
        take(1),
      )
      .subscribe((reviews) => {
        this.userReviewsSubject$.next(reviews);
      });
  }

  reviewUpdated(updatedReview: Review) {
    const existingReview = this.userReviewsSubject$.value?.find(
      (review) => review.id === updatedReview.id,
    );

    if (!existingReview) {
      return;
    }

    existingReview.comment = updatedReview.comment;
    existingReview.rating = updatedReview.rating;
  }

  reviewDeleted(deletedReview: Review) {
    const deletedReviewIndex = this.userReviewsSubject$.value?.findIndex(
      (review) => review.id === deletedReview.id,
    );

    if (deletedReviewIndex !== undefined && deletedReviewIndex >= 0) {
      this.userReviewsSubject$.value?.splice(deletedReviewIndex, 1);
    }
  }
}
