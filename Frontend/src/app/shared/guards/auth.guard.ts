import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { RoutePath } from "../../app.routes";
import { ErrorCode } from "../../features/error/models/error-codes.model";
import { UserService } from "../services/user/user.service";

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);

  const loggedInUser = userService.getCurrentLoggedInUser();

  if (loggedInUser) {
    return true;
  }

  const router = inject(Router);

  return router.createUrlTree([RoutePath.Error, ErrorCode.Unauthorized]);
};
