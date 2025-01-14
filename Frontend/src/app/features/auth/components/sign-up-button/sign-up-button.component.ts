import { Component, viewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppConfig } from "../../../../../config/config-constants";
import {
  BehaviorSubject,
  catchError,
  combineLatestWith,
  EMPTY,
  finalize,
  map,
  Observable,
  Subject,
  switchMap,
  tap,
  throwError,
  timer,
} from "rxjs";
import { AsyncPipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorCode } from "../../../error/models/error-codes.model";
import { User } from "../../../../shared/models/user.model";
import { FormDialogComponent } from "../../../../shared/components/form-dialog/form-dialog.component";
import { AuthForm, AuthFormConfig } from "../auth-form-config";
import { MessageDialogComponent } from "../../../../shared/components/message-dialog/message-dialog.component";
import { UserService } from "../../../../shared/services/user/user.service";

@Component({
  selector: "dhub-sign-up-button",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    FormDialogComponent,
    MessageDialogComponent,
  ],
  templateUrl: "./sign-up-button.component.html",
})
export class SignUpButtonComponent {
  signUpDialog = viewChild.required(FormDialogComponent);

  signUpResultDialog = viewChild.required(MessageDialogComponent);

  private readonly registeredUserUpdater$ = new Subject<AuthForm>();
  readonly registeredUser$: Observable<User>;

  private readonly loadingUserSubject$ = new BehaviorSubject(false);
  readonly loadingUser$ = this.loadingUserSubject$.asObservable();

  signUpResult: "userAlreadyExists" | "success" | undefined;

  readonly AuthFormConfig = AuthFormConfig;

  constructor(userService: UserService) {
    this.registeredUser$ = this.registeredUserUpdater$.asObservable().pipe(
      switchMap((authForm: AuthForm) => {
        this.loadingUserSubject$.next(true);

        const { name, password } = authForm;

        return userService.signUpUser(name, password).pipe(
          combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
          map((loadingResult) => loadingResult[0]),
          catchError((error) => {
            if (
              error instanceof HttpErrorResponse &&
              error.status === ErrorCode.Conflict
            ) {
              this.signUpResult = "userAlreadyExists";
              this.signUpResultDialog().showModal();
              return EMPTY;
            }
            return throwError(() => error);
          }),
          finalize(() => {
            this.loadingUserSubject$.next(false);
            this.signUpDialog().closeDialog();
          }),
        );
      }),
      tap(() => {
        this.signUpResultDialog().showModal();

        this.signUpResult = "success";
      }),
    );
  }

  openSignUpDialog() {
    this.signUpDialog().showModal();
  }

  signUpUser(authForm: AuthForm) {
    this.registeredUserUpdater$.next(authForm);
  }
}
