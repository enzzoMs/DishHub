import { fakeAsync, TestBed, tick } from "@angular/core/testing";

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
});
