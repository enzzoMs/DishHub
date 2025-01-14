import { TestBed } from "@angular/core/testing";

import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { HttpErrorResponse, provideHttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { apiEndpoints } from "../../../../api/api-endpoints";
import { User } from "../../models/user.model";
import { Restaurant } from "../../models/restaurant.model";
import { Review } from "../../models/review.model";
import { UserService } from "./user.service";

describe("UserService", () => {
  let service: UserService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpTesting = TestBed.inject(HttpTestingController);

    const userRequest = httpTesting.expectOne(apiEndpoints.userInformation());
    userRequest.flush(null);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should sign up user", async () => {
    const testUser: User = { userName: "Jane" };

    const userName = "Jane";
    const password = "123456";
    const userPromise = firstValueFrom(service.signUpUser(userName, password));

    const testRequest = httpTesting.expectOne({
      method: "POST",
      url: apiEndpoints.signUpUser(),
    });

    expect(testRequest.request.body).toEqual({ userName, password });

    testRequest.flush(testUser);

    expect(await userPromise).toEqual(testUser);
  });

  it("should throw 409 if the user already exists", () => {
    const conflictErrorCode = 409;

    let errorResponse: HttpErrorResponse | undefined;
    service.signUpUser("", "").subscribe({
      error: (error: HttpErrorResponse) => {
        errorResponse = error;
      },
    });

    const testRequest = httpTesting.expectOne(apiEndpoints.signUpUser());
    testRequest.flush("", {
      status: conflictErrorCode,
      statusText: "Conflict",
    });

    expect(errorResponse?.status).toEqual(conflictErrorCode);
  });

  it("should login user", async () => {
    const testUser: User = { userName: "Jane" };

    const userName = "Jane";
    const password = "123456";
    const userPromise = firstValueFrom(service.loginUser(userName, password));

    const testRequest = httpTesting.expectOne({
      method: "POST",
      url: apiEndpoints.loginUser(),
    });

    expect(testRequest.request.body).toEqual({ userName, password });

    testRequest.flush(testUser);

    expect(await userPromise).toEqual(testUser);
  });

  it("should update 'loggedInUser' on user login", async () => {
    let loggedInUser: User | null | undefined;
    service.loggedInUser$.subscribe((user) => (loggedInUser = user));

    const testUser: User = { userName: "Jane" };

    const userPromise = firstValueFrom(service.loginUser("", ""));

    const testRequest = httpTesting.expectOne({
      method: "POST",
      url: apiEndpoints.loginUser(),
    });

    testRequest.flush(testUser);

    await userPromise;

    expect(loggedInUser).toEqual(testUser);
  });

  it("should throw 401 on login if user name or password is wrong", () => {
    const unauthorizedErrorCode = 401;

    let errorResponse: HttpErrorResponse | undefined;
    service.loginUser("", "").subscribe({
      error: (error: HttpErrorResponse) => {
        errorResponse = error;
      },
    });

    const testRequest = httpTesting.expectOne(apiEndpoints.loginUser());
    testRequest.flush("", {
      status: unauthorizedErrorCode,
      statusText: "Unauthorized",
    });

    expect(errorResponse?.status).toEqual(unauthorizedErrorCode);
  });

  it("should logout user", async () => {
    let loggedInUser: User | null | undefined;
    service.loggedInUser$.subscribe((user) => (loggedInUser = user));

    // Login
    const testUser: User = { userName: "Jane" };
    const userPromise = firstValueFrom(service.loginUser("", ""));

    const testRequest = httpTesting.expectOne({
      method: "POST",
      url: apiEndpoints.loginUser(),
    });
    testRequest.flush(testUser);

    await userPromise;

    // Logout
    const logoutPromise = firstValueFrom(service.logout());

    const logoutRequest = httpTesting.expectOne({
      method: "POST",
      url: apiEndpoints.logout(),
    });

    logoutRequest.flush(null);

    await logoutPromise;

    expect(loggedInUser).toBeNull();
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
      {
        id: 0,
        restaurantId: 0,
        restaurantName: "",
        userName: "",
        comment: "",
        rating: 1,
        creationDate: new Date(),
      },
      {
        id: 0,
        restaurantId: 0,
        restaurantName: "",
        userName: "",
        comment: "",
        rating: 2,
        creationDate: new Date(),
      },
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
