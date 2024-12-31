import { Component } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { RoutePath } from "../../../app.routes";
import { SignUpButtonComponent } from "../../../features/auth/components/sign-up-button/sign-up-button.component";
import { LoginButtonComponent } from "../../../features/auth/components/login-button/login-button.component";
import { AuthService } from "../../../features/auth/services/auth.service";
import { User } from "../../../features/auth/models/user.model";
import {
  BehaviorSubject,
  firstValueFrom,
  map,
  Observable,
  of,
  switchMap,
  timer,
  zip,
} from "rxjs";
import { AsyncPipe } from "@angular/common";
import { AppConfig } from "../../../../config/config-constants";

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
  readonly appRoutes = RoutePath;

  loggedInUser$: Observable<User | null | undefined>;

  private readonly isLoggingOutSubject$ = new BehaviorSubject(false);
  isLoggingOut$ = this.isLoggingOutSubject$.asObservable();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.loggedInUser$ = authService.loggedInUser$.pipe(
      switchMap((loggedInUser) => {
        if (loggedInUser === undefined) {
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

  async logoutUser() {
    this.isLoggingOutSubject$.next(true);

    await firstValueFrom(this.authService.logout());

    this.router.navigate([RoutePath.Home]);
    this.isLoggingOutSubject$.next(false);
  }
}
