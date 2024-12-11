import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RestaurantReviewsComponent } from "./restaurant-reviews.component";
import { RestaurantsService } from "../../services/restaurants.service";
import { of } from "rxjs";
import { PaginatedItems } from "../../../../shared/models/PaginatedItems";
import { Review } from "../../models/review.model";

describe("RestaurantReviewsComponent", () => {
  let component: RestaurantReviewsComponent;
  let fixture: ComponentFixture<RestaurantReviewsComponent>;

  let restaurantServiceMock: jasmine.SpyObj<RestaurantsService>;

  const testReviewsFirstPage: Review[] = [];
  for (let i = 0; i < RestaurantReviewsComponent.pageSize; i++) {
    testReviewsFirstPage.push({
      userName: "",
      comment: "",
      rating: i,
      date: new Date(),
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
        { provide: RestaurantsService, useValue: restaurantServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantReviewsComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch reviews for the first page when restaurant id changes", () => {
    let retrievedReviews: Review[] | undefined;
    component.reviews$?.subscribe((reviews: Review[]) => {
      retrievedReviews = reviews;
    });

    const newRestaurantId = 10;

    fixture.componentRef.setInput("restaurantId", newRestaurantId);
    fixture.detectChanges();

    expect(retrievedReviews).toEqual(testReviewsFirstPage);
  });

  it("should load the next batch of reviews when 'seeMoreReviews' is called", () => {
    let retrievedReviews: Review[] | undefined;
    component.reviews$?.subscribe((reviews: Review[]) => {
      retrievedReviews = reviews;
    });

    const newRestaurantId = 10;

    fixture.componentRef.setInput("restaurantId", newRestaurantId);

    component.seeMoreReviews();
    component.seeMoreReviews();

    expect(retrievedReviews).toEqual([
      ...testReviewsFirstPage,
      ...testReviewsFirstPage,
      ...testReviewsFirstPage,
    ]);
  });

  it("should update the loading status while reviews are loading", () => {
    const loadingStatus: boolean[] = [];
    component.loading$.subscribe((loading) => {
      loadingStatus.push(loading);
    });

    component.reviews$?.subscribe(() => {
      return;
    });

    const newRestaurantId = 10;

    fixture.componentRef.setInput("restaurantId", newRestaurantId);

    expect(loadingStatus[0]).toBe(true);
    expect(loadingStatus[1]).toBe(false);
  });

  it("should update 'allReviewsAreLoaded' correctly", () => {
    component.reviews$?.subscribe(() => {
      return;
    });
    const totalPages = Math.ceil(
      testReviewsTotalItems / RestaurantReviewsComponent.pageSize,
    );

    const newRestaurantId = 10;

    fixture.componentRef.setInput("restaurantId", newRestaurantId);

    expect(component.allReviewsLoaded).toBe(false);

    for (let i = 1; i < totalPages; i++) {
      component.seeMoreReviews();
    }

    expect(component.allReviewsLoaded).toBe(true);
  });

  it("should emmit 'reviewCountChanged' when fetching data for the first time", () => {
    let reviewCount: number | undefined;
    component.reviewCountChanged?.subscribe((currentReviewCount) => {
      reviewCount = currentReviewCount;
    });

    const newRestaurantId = 10;

    fixture.componentRef.setInput("restaurantId", newRestaurantId);
    fixture.detectChanges();

    expect(reviewCount).toBe(testReviewsTotalItems);
  });
});
