import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";

import { LoginButtonComponent } from "./login-button.component";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { of } from "rxjs";
import { AppConfig } from "../../../../../config/config-constants";
import { provideRouter, Router } from "@angular/router";
import { appRoutes, RoutePath } from "../../../../app.routes";
import { AuthForm } from "../auth-form-config";
import { UserService } from "../../../../shared/services/user/user.service";

describe("LoginButtonComponent", () => {
  let component: LoginButtonComponent;
  let fixture: ComponentFixture<LoginButtonComponent>;

  let userServiceMock: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj("AuthService", ["loginUser"]);
    userServiceMock.loginUser.and.returnValue(of({ userName: "" }));

    await TestBed.configureTestingModule({
      imports: [LoginButtonComponent],
      providers: [
        provideRouter(appRoutes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should login user", fakeAsync(() => {
    const testName = "Jane";
    const testPassword = "123456";
    const testAuthForm: AuthForm = {
      name: testName,
      password: testPassword,
    };

    component.loginUser(testAuthForm);

    tick(AppConfig.MIN_LOADING_TIME_MS);
    fixture.detectChanges();

    expect(userServiceMock.loginUser).toHaveBeenCalledOnceWith(
      testName,
      testPassword,
    );
  }));

  it("should update loading status while logging in user", fakeAsync(() => {
    const loadingStatus: boolean[] = [];
    component.loadingUser$.subscribe((isLoading) =>
      loadingStatus.push(isLoading),
    );

    const testAuthForm: AuthForm = {
      name: "",
      password: "",
    };

    component.loginUser(testAuthForm);

    tick(AppConfig.MIN_LOADING_TIME_MS);
    fixture.detectChanges();

    expect(loadingStatus.at(-1)).toBeFalse();
    expect(loadingStatus.at(-2)).toBeTrue();
  }));

  it("should navigate to Home on login", fakeAsync(() => {
    const router = TestBed.inject(Router);
    spyOn(router, "navigate");

    const testAuthForm: AuthForm = {
      name: "",
      password: "",
    };

    component.loginUser(testAuthForm);

    tick(AppConfig.MIN_LOADING_TIME_MS);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledOnceWith([RoutePath.Home]);
  }));
});
