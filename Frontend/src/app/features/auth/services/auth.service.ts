import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from "@angular/common/http";
import { User } from "../models/user.model";
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  tap,
  throwError,
} from "rxjs";
import { apiEndpoints } from "../../../../api/api-endpoints";
import { IGNORE_ERROR_STATUS_TOKEN } from "../../../shared/interceptors/error-interceptor";
import { ErrorCode } from "../../error/models/error-codes.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly loggedInUserSubject$ = new BehaviorSubject<
    User | null | undefined
  >(undefined);
  readonly loggedInUser$ = this.loggedInUserSubject$.asObservable();

  constructor(private readonly http: HttpClient) {
    const currentUserRequest = this.http
      .get<User>(apiEndpoints.userInformation(), {
        context: new HttpContext().set(IGNORE_ERROR_STATUS_TOKEN, [
          ErrorCode.Unauthorized,
        ]),
      })
      .pipe(
        catchError((error) => {
          if (
            error instanceof HttpErrorResponse &&
            error.status === ErrorCode.Unauthorized
          ) {
            return of(null);
          }
          return throwError(() => error);
        }),
      );

    currentUserRequest.subscribe((currentUser) =>
      this.loggedInUserSubject$.next(currentUser),
    );
  }

  /**
   * Signs up a user with the provided username and password.
   *
   * Can throw a "409 Conflict" error if the username already exists.
   */
  signUpUser(userName: string, password: string): Observable<User> {
    return this.http.post<User>(
      apiEndpoints.signUpUser(),
      {
        userName,
        password,
      },
      {
        context: new HttpContext().set(IGNORE_ERROR_STATUS_TOKEN, [
          ErrorCode.Conflict,
        ]),
      },
    );
  }

  /**
   * Logs in a user with the provided username and password.
   *
   * Can throw a "401 Unauthorized" error if the username or password is invalid.
   */
  loginUser(userName: string, password: string): Observable<User> {
    return this.http
      .post<User>(
        apiEndpoints.loginUser(),
        {
          userName,
          password,
        },
        {
          context: new HttpContext().set(IGNORE_ERROR_STATUS_TOKEN, [
            ErrorCode.Unauthorized,
          ]),
        },
      )
      .pipe(tap((user: User) => this.loggedInUserSubject$.next(user)));
  }

  /**
   * Logs out the current user.
   */
  logout(): Observable<void> {
    return this.http
      .post<void>(apiEndpoints.logout(), {})
      .pipe(tap(() => this.loggedInUserSubject$.next(null)));
  }
}
