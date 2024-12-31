import { Component, ElementRef, OnDestroy, viewChild } from "@angular/core";
import { AppConfig } from "../../../../../config/config-constants";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { AuthForm, AuthFormComponent } from "../auth-form/auth-form.component";
import {
  BehaviorSubject,
  catchError,
  combineLatestWith,
  EMPTY,
  finalize,
  Subscription,
  throwError,
  timer,
} from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorCode } from "../../../error/models/error-codes.model";
import { AsyncPipe } from "@angular/common";
import { Router } from "@angular/router";
import { RoutePath } from "../../../../app.routes";

@Component({
  selector: "dhub-login-button",
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AuthFormComponent, AsyncPipe],
  templateUrl: "./login-button.component.html",
  styleUrl: "./login-button.component.css",
})
export class LoginButtonComponent implements OnDestroy {
  loginDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>("loginDialog");

  loginErrorDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>("loginErrorDialog");

  authForm = viewChild.required(AuthFormComponent);

  private loginRequestSubscription: Subscription | undefined;

  private readonly loadingUserSubject$ = new BehaviorSubject(false);
  readonly loadingUser$ = this.loadingUserSubject$.asObservable();

  readonly AppConfig = AppConfig;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  ngOnDestroy() {
    this.loginRequestSubscription?.unsubscribe();
  }

  openLoginDialog() {
    if (!this.loadingUserSubject$.value) {
      this.authForm().resetForm();
    }
    this.loginDialog().nativeElement.showModal();
  }

  closeLoginDialog() {
    this.loginDialog().nativeElement.close();

    if (!this.loadingUserSubject$.value) {
      this.authForm().resetForm();
    }
  }

  closeLoginErrorDialog() {
    this.loginErrorDialog().nativeElement.close();
  }

  loginUser(authForm: AuthForm) {
    this.loginRequestSubscription?.unsubscribe();

    const loginRequest$ = this.authService
      .loginUser(authForm.name, authForm.password)
      .pipe(
        combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
        catchError((error) => {
          if (
            error instanceof HttpErrorResponse &&
            error.status === ErrorCode.Unauthorized
          ) {
            this.loginErrorDialog().nativeElement.showModal();
            return EMPTY;
          }
          return throwError(() => error);
        }),
        finalize(() => {
          this.loadingUserSubject$.next(false);
          this.loginDialog().nativeElement.close();
        }),
      );

    this.loadingUserSubject$.next(true);

    const router = this.router;
    this.loginRequestSubscription = loginRequest$.subscribe(() => {
      router.navigate([RoutePath.Home]);
    });
  }
}
