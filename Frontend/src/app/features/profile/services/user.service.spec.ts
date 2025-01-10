import { TestBed } from "@angular/core/testing";

import { UserService } from "./user.service";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { Restaurant } from "../../../shared/models/restaurant.model";
import { firstValueFrom } from "rxjs";
import { apiEndpoints } from "../../../../api/api-endpoints";
import { Review } from "../../../shared/models/review.model";

describe("UserService", () => {
  let service: UserService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch user restaurants", async () => {
    const testRestaurants: Restaurant[] = [
      { id: 0, name: "", description: "", location: "", score: 0 },
      { id: 1, name: "", description: "", location: "", score: 0 },
    ];

    const restaurantsPromise = firstValueFrom(service.getUserRestaurants());

    const request = httpTesting.expectOne({
      method: "GET",
      url: apiEndpoints.getUserRestaurants(),
    });

    request.flush(testRestaurants);

    expect(await restaurantsPromise).toEqual(testRestaurants);
  });

  it("should fetch user reviews", async () => {
    const testReviews: Review[] = [
      { userName: "", comment: "", rating: 1, creationDate: new Date() },
      { userName: "", comment: "", rating: 2, creationDate: new Date() },
    ];

    const reviewsPromise = firstValueFrom(service.getUserReviews());

    const request = httpTesting.expectOne({
      method: "GET",
      url: apiEndpoints.getUserReviews(),
    });

    request.flush(testReviews);

    expect(await reviewsPromise).toEqual(testReviews);
  });
});
