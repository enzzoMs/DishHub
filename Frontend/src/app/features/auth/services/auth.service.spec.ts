import { TestBed } from "@angular/core/testing";

import { AuthService } from "./auth.service";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { HttpErrorResponse, provideHttpClient } from "@angular/common/http";
import { User } from "../models/user.model";
import { firstValueFrom } from "rxjs";
import { apiEndpoints } from "../../../../api/api-endpoints";

describe("AuthService", () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
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
});
