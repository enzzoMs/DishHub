import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserReviewItemComponent } from "./user-review-item.component";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideRouter } from "@angular/router";
import { appRoutes } from "../../../../app.routes";
import { Review } from "../../../../shared/models/review.model";

describe("UserReviewItemComponent", () => {
  let component: UserReviewItemComponent;
  let fixture: ComponentFixture<UserReviewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserReviewItemComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(appRoutes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserReviewItemComponent);
    component = fixture.componentInstance;

    const testReview: Review = {
      id: 0,
      restaurantId: 0,
      restaurantName: "",
      userName: "",
      comment: "",
      rating: 5,
      creationDate: new Date()
    };
    fixture.componentRef.setInput("reviewModel", testReview);

    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
