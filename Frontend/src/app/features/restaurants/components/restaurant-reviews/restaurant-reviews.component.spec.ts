import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";

import { RestaurantReviewsComponent } from "./restaurant-reviews.component";
import { of } from "rxjs";
import { PaginatedItems } from "../../../../shared/models/paginated-items";
import { RestaurantsService } from "../../../../shared/services/restaurants/restaurants.service";
import { Review } from "../../../../shared/models/review.model";
import { AppConfig } from "../../../../../config/config-constants";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("RestaurantReviewsComponent", () => {
  let component: RestaurantReviewsComponent;
  let fixture: ComponentFixture<RestaurantReviewsComponent>;

  let restaurantServiceMock: jasmine.SpyObj<RestaurantsService>;

  const testReviewsFirstPage: Review[] = [];
  for (let i = 0; i < RestaurantReviewsComponent.pageSize; i++) {
    testReviewsFirstPage.push({
      id: 0,
      restaurantName: "",
      restaurantId: 0,
      userName: "",
      comment: "",
      rating: i,
      creationDate: new Date(),
    });
  }
  const testReviewsTotalItems = RestaurantReviewsComponent.pageSize * 5;

  beforeEach(async () => {
    const testReviewsItems: PaginatedItems<Review> = {
      data: testReviewsFirstPage,
      totalItems: testReviewsTotalItems,
      pageNumber: 1,
    };

    restaurantServiceMock = jasmine.createSpyObj("RestaurantService", [
      "getRestaurantReviews",
    ]);
    restaurantServiceMock.getRestaurantReviews.and.returnValue(
      of(testReviewsItems),
    );

    await TestBed.configureTestingModule({
      imports: [RestaurantReviewsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RestaurantsService, useValue: restaurantServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantReviewsComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch reviews for the first page when restaurant id changes", fakeAsync(() => {
    let retrievedReviews: Review[] | undefined;
    component.reviews$?.subscribe((reviews: Review[]) => {
      retrievedReviews = reviews;
    });

    const newRestaurantId = 10;

    fixture.componentRef.setInput("restaurantId", newRestaurantId);
    fixture.detectChanges();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(retrievedReviews).toEqual(testReviewsFirstPage);
  }));

  it("should load the next batch of reviews when 'seeMoreReviews' is called", fakeAsync(() => {
    let retrievedReviews: Review[] | undefined;
    component.reviews$.subscribe((reviews: Review[]) => {
      retrievedReviews = reviews;
    });

    component.seeMoreReviews();
    tick(AppConfig.MIN_LOADING_TIME_MS);

    component.seeMoreReviews();
    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(retrievedReviews).toEqual([
      ...testReviewsFirstPage,
      ...testReviewsFirstPage,
    ]);
  }));

  it("should update the loading status while reviews are loading", fakeAsync(() => {
    const loadingStatus: boolean[] = [];
    component.loading$.subscribe((loading) => {
      loadingStatus.push(loading);
    });

    component.reviews$?.subscribe(() => {
      return;
    });

    const newRestaurantId = 10;

    fixture.componentRef.setInput("restaurantId", newRestaurantId);
    fixture.detectChanges();

    expect(loadingStatus.at(-1)).toBeTrue();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(loadingStatus.at(-1)).toBeFalse();
  }));

  it("should update 'allReviewsAreLoaded' correctly", fakeAsync(() => {
    component.reviews$?.subscribe(() => {
      return;
    });
    const totalPages = Math.ceil(
      testReviewsTotalItems / RestaurantReviewsComponent.pageSize,
    );

    const newRestaurantId = 10;

    fixture.componentRef.setInput("restaurantId", newRestaurantId);
    fixture.detectChanges();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(component.allReviewsLoaded).toBeFalse();

    for (let i = 1; i < totalPages; i++) {
      component.seeMoreReviews();
      tick(AppConfig.MIN_LOADING_TIME_MS);
    }

    expect(component.allReviewsLoaded).toBeTrue();
  }));

  it("should emit 'reviewCountChanged' when fetching data for the first time", fakeAsync(() => {
    let reviewCount: number | undefined;
    component.reviewCountChanged?.subscribe((currentReviewCount) => {
      reviewCount = currentReviewCount;
    });

    const newRestaurantId = 10;

    fixture.componentRef.setInput("restaurantId", newRestaurantId);
    fixture.detectChanges();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(reviewCount).toBe(testReviewsTotalItems);
  }));
});
