import { Component } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { RoutePath } from "../../../app.routes";
import { SignUpButtonComponent } from "../../../features/auth/components/sign-up-button/sign-up-button.component";
import { LoginButtonComponent } from "../../../features/auth/components/login-button/login-button.component";
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  switchMap,
  take,
  timer,
  zip,
} from "rxjs";
import { AsyncPipe } from "@angular/common";
import { AppConfig } from "../../../../config/config-constants";
import { User } from "../../models/user.model";
import { UserService } from "../../services/user/user.service";

@Component({
  selector: "dhub-header",
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    SignUpButtonComponent,
    LoginButtonComponent,
    AsyncPipe,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  loggedInUser$: Observable<User | null | undefined>;

  private readonly isLoggingOutSubject$ = new BehaviorSubject(false);
  isLoggingOut$ = this.isLoggingOutSubject$.asObservable();

  readonly appRoutes = RoutePath;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
  ) {
    this.loggedInUser$ = userService.loggedInUser$.pipe(
      switchMap((loggedInUser) => {
        if (loggedInUser === undefined || this.isLoggingOutSubject$.value) {
          return of(loggedInUser);
        } else {
          return zip(
            of(loggedInUser),
            timer(AppConfig.MIN_LOADING_TIME_MS),
          ).pipe(map((loadingResult) => loadingResult[0]));
        }
      }),
    );
  }

  logoutUser() {
    this.isLoggingOutSubject$.next(true);

    this.userService
      .logout()
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate([RoutePath.Home]);
        this.isLoggingOutSubject$.next(false);
      });
  }
}
