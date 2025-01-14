import { TestBed } from "@angular/core/testing";
import { CanActivateFn, Router } from "@angular/router";

import { authGuard } from "./auth.guard";
import { RoutePath } from "../../app.routes";
import { ErrorCode } from "../../features/error/models/error-codes.model";
import { UserService } from "../services/user/user.service";

describe("authGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let authServiceMock: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj<UserService>("UserService", [
      "getCurrentLoggedInUser",
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: UserService, useValue: authServiceMock }],
    });
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });

  it("should allow navigation if user is authenticated", () => {
    authServiceMock.getCurrentLoggedInUser.and.returnValue({ userName: "" });

    expect(executeGuard(null!, null!)).toBeTrue();
  });

  it("should redirect to error page if user is not authenticated", () => {
    authServiceMock.getCurrentLoggedInUser.and.returnValue(null);

    const router = TestBed.inject(Router);
    const errorUrlTree = router.createUrlTree([
      RoutePath.Error,
      ErrorCode.Unauthorized,
    ]);

    expect(executeGuard(null!, null!)).toEqual(errorUrlTree);
  });
});
