import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";

import { HeaderComponent } from "./header.component";
import { By } from "@angular/platform-browser";
import { provideRouter, Router } from "@angular/router";
import { RoutePath, appRoutes } from "../../../app.routes";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { AuthService } from "../../../features/auth/services/auth.service";
import { User } from "../../../features/auth/models/user.model";
import { of, Subject } from "rxjs";
import { AppConfig } from "../../../../config/config-constants";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let loggedInUserUpdater$: Subject<User | null | undefined>;

  beforeEach(async () => {
    loggedInUserUpdater$ = new Subject();
    const authServiceMock: jasmine.SpyObj<AuthService> = jasmine.createSpyObj(
      "AuthService",
      ["logout"],
      {
        loggedInUser$: loggedInUserUpdater$,
      },
    );
    authServiceMock.logout.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter(appRoutes),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should navigate to home on logo click", () => {
    const logoWrapper = fixture.nativeElement.querySelector(
      ".app-brand-wrapper",
    ) as HTMLAnchorElement;

    expect(logoWrapper.href).toBe(document.baseURI);
  });

  it("should create navigation links for Home, Restaurants and About pages", () => {
    const navLinks = fixture.debugElement
      .queryAll(By.css("nav a"))
      .map((debugElement) => debugElement.nativeElement as HTMLAnchorElement);

    expect(navLinks[0].getAttribute("ng-reflect-router-link")).toBe(
      RoutePath.Home,
    );
    expect(navLinks[1].getAttribute("ng-reflect-router-link")).toBe(
      RoutePath.Restaurants,
    );
    expect(navLinks[2].getAttribute("ng-reflect-router-link")).toBe(
      RoutePath.About,
    );
  });

  it("'loggedInUser' should reflect service state", fakeAsync(() => {
    let currentLoggedInUser: User | null | undefined;
    component.loggedInUser$.subscribe((user) => (currentLoggedInUser = user));

    expect(currentLoggedInUser).toBeUndefined();

    const testUser: User = { userName: "Jane" };
    loggedInUserUpdater$.next(testUser);

    fixture.detectChanges();
    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(currentLoggedInUser).toEqual(testUser);

    loggedInUserUpdater$.next(null);

    fixture.detectChanges();
    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(currentLoggedInUser).toBeNull();
  }));

  it("should navigate to home after logout", async () => {
    const router = TestBed.inject(Router);
    spyOn(router, "navigate");

    await component.logoutUser();

    expect(router.navigate).toHaveBeenCalledOnceWith([RoutePath.Home]);
  });

  it("should update loading status when logging out", async () => {
    const loggingOutStatus: boolean[] = [];
    component.isLoggingOut$.subscribe((isLoggingOut) =>
        loggingOutStatus.push(isLoggingOut)
    );

    await component.logoutUser();

    expect(loggingOutStatus.at(-1)).toBeFalse();
    expect(loggingOutStatus.at(-2)).toBeTrue();
  });
});
