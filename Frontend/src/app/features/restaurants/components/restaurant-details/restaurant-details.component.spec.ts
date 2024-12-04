import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RestaurantDetailsComponent } from "./restaurant-details.component";
import { provideRouter } from "@angular/router";
import { By } from "@angular/platform-browser";

describe("RestaurantDetailsComponent", () => {
  let fixture: ComponentFixture<RestaurantDetailsComponent>;
  let component: RestaurantDetailsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantDetailsComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantDetailsComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should navigate back when back link is clicked", () => {
    const backLinkElement = fixture.debugElement.query(
      By.css(".back-link-wrapper a"),
    ).nativeElement as HTMLAnchorElement;

    expect(backLinkElement.getAttribute("ng-reflect-router-link")).toBe("../");
  });
});
