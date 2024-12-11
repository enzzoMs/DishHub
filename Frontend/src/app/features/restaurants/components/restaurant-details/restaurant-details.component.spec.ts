import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RestaurantDetailsComponent } from "./restaurant-details.component";
import { ActivatedRoute } from "@angular/router";
import { By } from "@angular/platform-browser";
import { RestaurantsService } from "../../services/restaurants.service";
import { Restaurant } from "../../models/restaurant.model";
import { of } from "rxjs";

describe("RestaurantDetailsComponent", () => {
  let fixture: ComponentFixture<RestaurantDetailsComponent>;
  let component: RestaurantDetailsComponent;

  let restaurantServiceMock: jasmine.SpyObj<RestaurantsService>;

  const routeParamMap = new Map<string, string>();

  beforeEach(async () => {
    const testRestaurant: Restaurant = {
      id: 0,
      name: "",
      description: "",
      location: "",
      score: 0,
    };

    restaurantServiceMock = jasmine.createSpyObj("restaurantService", [
      "getRestaurantById",
    ]);
    restaurantServiceMock.getRestaurantById.and.returnValue(of(testRestaurant));

    await TestBed.configureTestingModule({
      imports: [RestaurantDetailsComponent],
      providers: [
        { provide: RestaurantsService, useValue: restaurantServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: routeParamMap,
            },
          },
        },
      ],
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

  it("should fetch restaurant on initialization using id from route params", () => {
    const restaurantId = 10;
    const testRestaurant: Restaurant = {
      id: restaurantId,
      name: "La Tavola Italiana",
      description: "Italian Restaurant",
      location: "Pasta Lana",
      score: 0,
    };

    restaurantServiceMock.getRestaurantById.and.returnValue(of(testRestaurant));

    routeParamMap.set("id", restaurantId.toString());

    component.ngOnInit();

    let restaurantModel: Restaurant | undefined;
    component.restaurantModel$?.subscribe((currentRestaurantModel) => {
      restaurantModel = currentRestaurantModel;
    });

    component.ngOnInit();

    expect(restaurantServiceMock.getRestaurantById).toHaveBeenCalledWith(
      restaurantId,
    );
    expect(restaurantModel).toEqual(testRestaurant);
  });

  it("'updateReviewCount' should update subject with the new value", () => {
    const newReviewCount = 2;

    let reviewCount: number | undefined;

    component.reviewCount$.subscribe((currentReviewCount) => {
      reviewCount = currentReviewCount;
    });

    component.updateReviewCount(newReviewCount);

    expect(reviewCount).toEqual(newReviewCount);
  });
});
