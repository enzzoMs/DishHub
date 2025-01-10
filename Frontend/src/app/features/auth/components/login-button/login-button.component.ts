import { Component, OnDestroy, viewChild } from "@angular/core";
import { AppConfig } from "../../../../../config/config-constants";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { AuthService } from "../../../../shared/services/auth/auth.service";
import { FormDialogComponent } from "../../../../shared/components/form-dialog/form-dialog.component";
import { AuthForm, AuthFormConfig } from "../auth-form-config";
import { MessageDialogComponent } from "../../../../shared/components/message-dialog/message-dialog.component";

@Component({
  selector: "dhub-login-button",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    FormDialogComponent,
    MessageDialogComponent,
  ],
  templateUrl: "./login-button.component.html",
})
export class LoginButtonComponent implements OnDestroy {
  loginDialog = viewChild.required(FormDialogComponent);

  loginErrorDialog = viewChild.required(MessageDialogComponent);

  private loginRequestSubscription: Subscription | undefined;

  private readonly loadingUserSubject$ = new BehaviorSubject(false);
  readonly loadingUser$ = this.loadingUserSubject$.asObservable();

  readonly AppConfig = AppConfig;
  readonly AuthFormConfig = AuthFormConfig;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  ngOnDestroy() {
    this.loginRequestSubscription?.unsubscribe();
  }

  openLoginDialog() {
    this.loginDialog().showModal();
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
            this.loginErrorDialog().showModal();
            return EMPTY;
          }
          return throwError(() => error);
        }),
        finalize(() => {
          this.loadingUserSubject$.next(false);
          this.loginDialog().closeDialog();
        }),
      );

    this.loadingUserSubject$.next(true);

    const router = this.router;
    this.loginRequestSubscription = loginRequest$.subscribe(() => {
      router.navigate([RoutePath.Home]);
    });
  }
}
