import { TestBed } from "@angular/core/testing";

import { ReviewItemComponent } from "./review-item.component";
import { Review } from "../../../../shared/models/review.model";

describe("ReviewItemComponent", () => {
  it("should be created", async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewItemComponent],
    }).compileComponents();

    const testReview: Review = {
      userName: "",
      comment: "",
      rating: 0,
      creationDate: new Date(),
    };

    const fixture = TestBed.createComponent(ReviewItemComponent);
    fixture.componentRef.setInput("reviewModel", testReview);

    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
