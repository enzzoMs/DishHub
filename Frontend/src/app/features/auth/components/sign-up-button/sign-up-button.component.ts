import { Component, ElementRef, viewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppConfig } from "../../../../../config/config-constants";
import { AuthService } from "../../services/auth.service";
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
  throwError,
  timer,
} from "rxjs";
import { User } from "../../models/user.model";
import { AsyncPipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorCode } from "../../../error/models/error-codes.model";
import { AuthForm, AuthFormComponent } from "../auth-form/auth-form.component";

@Component({
  selector: "dhub-sign-up-button",
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AsyncPipe, AuthFormComponent],
  templateUrl: "./sign-up-button.component.html",
  styleUrl: "./sign-up-button.component.css",
})
export class SignUpButtonComponent {
  signUpDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>("signUpDialog");

  signUpResultDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>("signUpResultDialog");

  authForm = viewChild.required(AuthFormComponent);

  private readonly registeredUserUpdater$ = new Subject<AuthForm>();
  readonly registeredUser$: Observable<User>;

  private readonly loadingUserSubject$ = new BehaviorSubject(false);
  readonly loadingUser$ = this.loadingUserSubject$.asObservable();

  signUpResult: "userAlreadyExists" | "success" | undefined;

  constructor(authService: AuthService) {
    this.registeredUser$ = this.registeredUserUpdater$.asObservable().pipe(
      switchMap((authForm: AuthForm) => {
        this.loadingUserSubject$.next(true);

        const { name, password } = authForm;

        return authService.signUpUser(name, password).pipe(
          catchError((error) => {
            if (
              error instanceof HttpErrorResponse &&
              error.status === ErrorCode.Conflict
            ) {
              this.signUpResult = "userAlreadyExists";
              this.signUpResultDialog().nativeElement.showModal();
              return EMPTY;
            }
            return throwError(() => error);
          }),
          finalize(() => {
            this.loadingUserSubject$.next(false);
            this.signUpDialog().nativeElement.close();
          }),
        );
      }),
      combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
      map((loadingResult) => {
        const user = loadingResult[0];

        this.signUpResultDialog().nativeElement.showModal();

        this.signUpResult = "success";

        return user;
      }),
    );
  }

  openSignUpDialog() {
    if (!this.loadingUserSubject$.value) {
      this.authForm().resetForm();
    }
    this.signUpDialog().nativeElement.showModal();
  }

  closeSignUpDialog() {
    this.signUpDialog().nativeElement.close();

    if (!this.loadingUserSubject$.value) {
      this.authForm().resetForm();
    }
  }

  closeSignUpResultDialog() {
    this.signUpResultDialog().nativeElement.close();
  }

  signUpUser(authForm: AuthForm) {
    this.registeredUserUpdater$.next(authForm);
  }
}
