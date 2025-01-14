import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  tap,
  throwError,
} from "rxjs";
import { apiEndpoints } from "../../../../api/api-endpoints";
import { IGNORE_ERROR_STATUS_TOKEN } from "../../interceptors/error-interceptor";
import { ErrorCode } from "../../../features/error/models/error-codes.model";
import { User } from "../../models/user.model";
import { Restaurant } from "../../models/restaurant.model";
import { Review } from "../../models/review.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
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

  getCurrentLoggedInUser(): User | null | undefined {
    return this.loggedInUserSubject$.getValue();
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

  getUserRestaurants(includeMenu?: boolean): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(apiEndpoints.getUserRestaurants(), {
      params: includeMenu
        ? new HttpParams().append("includeMenu", includeMenu)
        : undefined,
    });
  }

  getUserReviews(): Observable<Review[]> {
    return this.http
      .get<Review[]>(apiEndpoints.getUserReviews())
      .pipe(
        tap((review) =>
          review.forEach(
            (review) => (review.creationDate = new Date(review.creationDate)),
          ),
        ),
      );
  }

  updateUser(userName: string, password: string): Observable<User> {
    return this.http
      .patch<User>(apiEndpoints.updateUser(), { userName, password })
      .pipe(tap((user) => this.loggedInUserSubject$.next(user)));
  }

  deleteUser(): Observable<null> {
    return this.http
      .delete<null>(apiEndpoints.deleteUser())
      .pipe(tap(() => this.loggedInUserSubject$.next(null)));
  }
}
