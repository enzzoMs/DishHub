import { TestBed } from "@angular/core/testing";

import { ReviewsService } from "./reviews.service";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("ReviewsService", () => {
  let service: ReviewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ReviewsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
