import { Component, ElementRef, viewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
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
  tap,
  throwError,
  timer,
} from "rxjs";
import { User } from "../../models/user.model";
import { AsyncPipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorCode } from "../../../error/models/error-codes.model";

@Component({
  selector: "dhub-sign-up-button",
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: "./sign-up-button.component.html",
  styleUrl: "./sign-up-button.component.css",
})
export class SignUpButtonComponent {
  signUpDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>("signUpDialog");

  signUpResultDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>("signUpResultDialog");

  private readonly registeredUserUpdater$ = new Subject<void>();
  readonly registeredUser$: Observable<User>;

  private readonly loadingUserSubject$ = new BehaviorSubject(false);
  readonly loadingUser$: Observable<boolean>;

  readonly AppConfig = AppConfig;

  readonly signUpForm: FormGroup<{
    name: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  signUpResult: "userAlreadyExists" | "success" | undefined;

  constructor(
    private readonly authService: AuthService,
    formBuilder: FormBuilder,
  ) {
    this.loadingUser$ = this.loadingUserSubject$.asObservable().pipe(
      tap((loading) => {
        if (loading) {
          this.signUpForm.disable();
        } else {
          this.signUpForm.enable();
        }
      }),
    );

    this.registeredUser$ = this.registeredUserUpdater$.asObservable().pipe(
      switchMap(() => {
        this.loadingUserSubject$.next(true);

        const { name, password } = this.signUpForm.value;

        return this.authService.signUpUser(name!, password!).pipe(
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

        if (this.loadingUserSubject$.value) {
          this.loadingUserSubject$.next(false);
        }
        this.signUpDialog().nativeElement.close();
        this.signUpResultDialog().nativeElement.showModal();

        this.signUpResult = "success";

        return user;
      }),
    );

    this.signUpForm = formBuilder.group({
      name: [
        "",
        [
          Validators.required,
          Validators.pattern(AppConfig.USERNAME_ALLOWED_PATTERN),
          Validators.maxLength(AppConfig.MAX_FIELD_LENGTH),
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(AppConfig.MIN_PASSWORD_LENGTH),
          Validators.maxLength(AppConfig.MAX_FIELD_LENGTH),
        ],
      ],
    });
  }

  get nameControl() {
    return this.signUpForm.controls.name;
  }

  get passwordControl() {
    return this.signUpForm.controls.password;
  }

  openSignUpDialog() {
    if (!this.loadingUserSubject$.value) {
      this.signUpForm.reset();
    }
    this.signUpDialog().nativeElement.showModal();
  }

  closeSignUpDialog() {
    this.signUpDialog().nativeElement.close();

    if (!this.loadingUserSubject$.value) {
      this.signUpForm.reset();
    }
  }

  closeSignUpResultDialog() {
    this.signUpResultDialog().nativeElement.close();
  }

  submitSignUpForm() {
    this.registeredUserUpdater$.next();
  }
}
