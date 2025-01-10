import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { RoutePath } from "../../app.routes";
import { ErrorCode } from "../../features/error/models/error-codes.model";
import { AuthService } from "../services/auth/auth.service";

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  const loggedInUser = authService.getCurrentLoggedInUser();

  if (loggedInUser) {
    return true;
  }

  const router = inject(Router);

  return router.createUrlTree([RoutePath.Error, ErrorCode.Unauthorized]);
};
