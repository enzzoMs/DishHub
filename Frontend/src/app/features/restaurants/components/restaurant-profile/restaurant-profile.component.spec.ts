import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RestaurantProfileComponent } from "./restaurant-profile.component";
import { RestaurantsService } from "../../services/restaurants.service";
import { ActivatedRoute } from "@angular/router";
import { Restaurant } from "../../models/restaurant.model";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

describe("RestaurantProfileComponent", () => {
  let component: RestaurantProfileComponent;
  let fixture: ComponentFixture<RestaurantProfileComponent>;

  let restaurantsServiceMock: jasmine.SpyObj<RestaurantsService>;
  const testRestaurantId = 0;

  beforeEach(async () => {
    restaurantsServiceMock = jasmine.createSpyObj("restaurantsServiceMock", [
      "getRestaurantById",
    ]);

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get(name: string): string | null {
            return name === "id" ? testRestaurantId.toString() : null;
          },
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [RestaurantProfileComponent],
      providers: [
        { provide: RestaurantsService, useValue: restaurantsServiceMock },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantProfileComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch restaurant on initialization using id from route params", () => {
    const testRestaurant: Restaurant = {
      id: testRestaurantId,
      name: "",
      description: "",
      location: "",
      score: 0,
    };

    restaurantsServiceMock.getRestaurantById.and.returnValue(
      of(testRestaurant),
    );

    fixture.detectChanges();

    let restaurant: Restaurant | undefined = undefined;

    component.restaurantModel$!.subscribe((restaurantModel) => {
      restaurant = restaurantModel;
    });

    expect(restaurantsServiceMock.getRestaurantById).toHaveBeenCalledOnceWith(
      testRestaurantId,
    );
    expect(restaurant!).toEqual(testRestaurant);
  });

  it("should navigate back when back link is clicked", () => {
    const backLinkElement = fixture.debugElement.query(
      By.css(".back-link-wrapper a"),
    ).nativeElement as HTMLAnchorElement;

    expect(backLinkElement.getAttribute("ng-reflect-router-link")).toBe("../");
  });
});
