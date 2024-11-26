import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HeaderComponent } from "./header.component";
import { By } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { RoutePaths, appRoutes } from "../../../app.routes";

describe("HeaderComponent", () => {
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter(appRoutes)],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
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

    expect(navLinks[0].href).toBe(document.baseURI + RoutePaths.Home);
    expect(navLinks[1].href).toBe(document.baseURI + RoutePaths.Restaurants);
    expect(navLinks[2].href).toBe(document.baseURI + RoutePaths.About);
  });
});
