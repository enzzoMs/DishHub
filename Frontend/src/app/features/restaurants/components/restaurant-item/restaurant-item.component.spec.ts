import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RestaurantItemComponent } from "./restaurant-item.component";
import { By } from "@angular/platform-browser";
import { RoutePath } from "../../../../app.routes";
import { provideRouter } from "@angular/router";
import { Restaurant } from "../../../../shared/models/restaurant.model";

describe("RestaurantItemComponent", () => {
  let component: RestaurantItemComponent;
  let fixture: ComponentFixture<RestaurantItemComponent>;

  const testRestaurantModel: Restaurant = {
    id: 0,
    name: "",
    description: "",
    location: "",
    score: 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantItemComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantItemComponent);
    fixture.componentRef.setInput("restaurantModel", testRestaurantModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should set the correct routerLink on the 'See Details' button", () => {
    const testRestaurantsId = [0, 1, 20, 31, 42, 50];

    testRestaurantsId.forEach((restaurantId) => {
      testRestaurantModel.id = restaurantId;

      fixture.detectChanges();

      const seeDetailsButton = fixture.debugElement.query(
        By.css(".primary-button"),
      ).nativeElement as HTMLButtonElement;

      expect(seeDetailsButton.getAttribute("ng-reflect-router-link")).toBe(
        `/${RoutePath.Restaurants},${restaurantId}`,
      );
    });
  });
});
