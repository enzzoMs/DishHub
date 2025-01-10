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
import { of, throwError } from "rxjs";
import { ErrorCode } from "../../../error/models/error-codes.model";
import {AuthService} from "../../../../shared/services/auth/auth.service";
import {User} from "../../../../shared/models/user.model";

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

  it("should update registered user when form is submitted", fakeAsync(() => {
    const testUser: User = { userName: "Jane" };
    authServiceMock.signUpUser.and.returnValue(of(testUser));

    let registeredUser: User | undefined;
    component.registeredUser$.subscribe((user) => {
      registeredUser = user;
    });

    const userName = "Jane";
    const password = "123456";
    component.signUpUser({ name: userName, password: password });

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

    component.signUpUser({ name: "", password: "" });

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

    component.signUpUser({ name: "", password: "" });

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(component.signUpResult).toEqual("userAlreadyExists");
  }));

  it("should update loading status when signing up user", fakeAsync(() => {
    const loadingStatus: boolean[] = [];

    component.loadingUser$.subscribe((loading) => {
      loadingStatus.push(loading);
    });

    fixture.detectChanges();

    component.signUpUser({ name: "", password: "" });

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(loadingStatus.at(-2)).toBeTrue();
    expect(loadingStatus.at(-1)).toBeFalse();
  }));
});
