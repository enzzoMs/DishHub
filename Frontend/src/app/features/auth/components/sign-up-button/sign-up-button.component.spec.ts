import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";

import { SignUpButtonComponent } from "./sign-up-button.component";
import { HttpErrorResponse, provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { AppConfig } from "../../../../../config/config-constants";
import { AuthService } from "../../services/auth.service";
import { User } from "../../models/user.model";
import { of, throwError } from "rxjs";
import { ErrorCode } from "../../../error/models/error-codes.model";

describe("AuthComponent", () => {
  let component: SignUpButtonComponent;
  let fixture: ComponentFixture<SignUpButtonComponent>;

  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj("authService", ["signUpUser"]);
    authServiceMock.signUpUser.and.returnValue(of({ userName: "" }));

    await TestBed.configureTestingModule({
      imports: [SignUpButtonComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpButtonComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should be invalid when form is empty", () => {
    component.signUpForm.setValue({ name: "", password: "" });
    expect(component.signUpForm.invalid).toBeTrue();
  });

  it("should be invalid when password is shorter than allowed", () => {
    let password = "";
    for (let i = 1; i < AppConfig.MIN_PASSWORD_LENGTH; i++) {
      password = password + i;
    }

    component.signUpForm.setValue({ name: "Jane", password: password });
    expect(component.signUpForm.invalid).toBeTrue();
  });

  it("should be invalid when user name contains special character", () => {
    let password = "";
    for (let i = 1; i <= AppConfig.MIN_PASSWORD_LENGTH; i++) {
      password = password + i;
    }

    const userName = "Jane@--!éá";

    component.signUpForm.setValue({ name: userName, password: password });
    expect(component.signUpForm.invalid).toBeTrue();
  });

  it("should reset form when opening or closing the dialog", () => {
    component.signUpForm.setValue({ name: "Jane", password: "123456" });
    component.openSignUpDialog();

    expect(component.signUpForm.value).toEqual({ name: null, password: null });

    component.signUpForm.setValue({ name: "Jane", password: "123456" });
    component.closeSignUpDialog();

    expect(component.signUpForm.value).toEqual({ name: null, password: null });
  });

  it("should update registered user when form is submitted", fakeAsync(() => {
    const testUser: User = { userName: "Jane" };
    authServiceMock.signUpUser.and.returnValue(of(testUser));

    const userName = "Jane";
    const password = "123456";
    component.signUpForm.setValue({ name: userName, password: password });

    let registeredUser: User | undefined;
    component.registeredUser$.subscribe((user) => {
      registeredUser = user;
    });

    component.submitSignUpForm();

    fixture.detectChanges();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(authServiceMock.signUpUser).toHaveBeenCalledOnceWith(
      userName,
      password,
    );
    expect(registeredUser).toEqual(testUser);
  }));

  it("should update the sign up result if the user was registered", fakeAsync(() => {
    fixture.detectChanges();

    component.submitSignUpForm();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(component.signUpResult).toEqual("success");
  }));

  it("should update the sign up result if the user already exists", fakeAsync(() => {
    authServiceMock.signUpUser.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: ErrorCode.Conflict,
            statusText: "Conflict",
          }),
      ),
    );

    fixture.detectChanges();

    component.submitSignUpForm();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(component.signUpResult).toEqual("userAlreadyExists");
  }));

  it("should update loading status when signing up user", fakeAsync(() => {
    const loadingStatus: boolean[] = [];

    component.loadingUser$.subscribe((loading) => {
      loadingStatus.push(loading);
    });

    fixture.detectChanges();

    component.submitSignUpForm();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    console.log(loadingStatus);
    expect(loadingStatus.at(-2)).toBeTrue();
    expect(loadingStatus.at(-1)).toBeFalse();
  }));
});
