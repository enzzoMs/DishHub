import {ComponentFixture, fakeAsync, TestBed, tick} from "@angular/core/testing";

import { RestaurantDetailsComponent } from "./restaurant-details.component";
import { ActivatedRoute } from "@angular/router";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { Restaurant } from "../../../../shared/models/restaurant.model";
import { RestaurantsService } from "../../../../shared/services/restaurants/restaurants.service";
import {AppConfig} from "../../../../../config/config-constants";

describe("RestaurantDetailsComponent", () => {
  let fixture: ComponentFixture<RestaurantDetailsComponent>;
  let component: RestaurantDetailsComponent;

  let restaurantServiceMock: jasmine.SpyObj<RestaurantsService>;

  let routeParamMap: Map<string, string>;

  beforeEach(async () => {
    routeParamMap = new Map<string, string>();

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

  it("should fetch restaurant on initialization using id from route params", fakeAsync(() => {
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

    tick(AppConfig.MIN_LOADING_TIME_MS);

    component.ngOnInit();

    expect(restaurantServiceMock.getRestaurantById).toHaveBeenCalledWith(
      restaurantId,
    );
    expect(restaurantModel).toEqual(testRestaurant);
  }));

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
