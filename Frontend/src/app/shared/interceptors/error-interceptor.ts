import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from "@angular/common/http";
import { catchError, EMPTY, Observable, throwError } from "rxjs";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { RoutePath } from "../../app.routes";

export const IGNORE_ERROR_STATUS_TOKEN = new HttpContextToken<number[]>(
  (): number[] => [],
);

export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);

  const ignoreErrorStatus = req.context.get(IGNORE_ERROR_STATUS_TOKEN);

  return next(req).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        !ignoreErrorStatus.includes(error.status)
      ) {
        router.navigate([RoutePath.Error, error.status]);
        return EMPTY;
      }
      return throwError(() => error);
    }),
  );
}
