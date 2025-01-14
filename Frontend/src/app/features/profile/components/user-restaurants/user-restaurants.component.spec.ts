import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";

import { UserRestaurantsComponent } from "./user-restaurants.component";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { AppConfig } from "../../../../../config/config-constants";
import { RestaurantsService } from "../../../../shared/services/restaurants/restaurants.service";
import { of } from "rxjs";
import { Restaurant } from "../../../../shared/models/restaurant.model";
import { RestaurantForm } from "../restaurant-form-config";
import { UserService } from "../../../../shared/services/user/user.service";

describe("UserRestaurantsComponent", () => {
  let component: UserRestaurantsComponent;
  let fixture: ComponentFixture<UserRestaurantsComponent>;

  let userServiceMock: jasmine.SpyObj<UserService>;
  let restaurantsServiceMock: jasmine.SpyObj<RestaurantsService>;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj("userService", [
      "getUserRestaurants",
    ]);
    userServiceMock.getUserRestaurants.and.returnValue(of([]));

    restaurantsServiceMock = jasmine.createSpyObj("restaurantsService", [
      "createRestaurant",
    ]);
    restaurantsServiceMock.createRestaurant.and.returnValue(
      of({ id: 0, name: "", description: "", location: "", score: 0 }),
    );

    await TestBed.configureTestingModule({
      imports: [UserRestaurantsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RestaurantsService, useValue: restaurantsServiceMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRestaurantsComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with the user restaurants", fakeAsync(() => {
    const testUserRestaurants: Restaurant[] = [
      { id: 0, name: "A", description: "", location: "", score: 1 },
      { id: 1, name: "B", description: "", location: "", score: 2 },
    ];
    userServiceMock.getUserRestaurants.and.returnValue(of(testUserRestaurants));

    let userRestaurants: Restaurant[] | undefined;
    component.userRestaurants$.subscribe((restaurants) => {
      userRestaurants = restaurants;
    });

    component.ngOnInit();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(userRestaurants).toEqual(testUserRestaurants);
  }));

  it("should update restaurant on 'restaurantUpdated' event", fakeAsync(() => {
    const restaurantId = 1;
    const testRestaurant: Restaurant = {
      id: restaurantId,
      name: "",
      description: "",
      location: "",
      score: 1,
    };
    userServiceMock.getUserRestaurants.and.returnValue(of([testRestaurant]));

    const updatedRestaurant: Restaurant = {
      id: restaurantId,
      name: "New name",
      description: "New description",
      location: "New location",
      score: 1,
    };

    let userRestaurants: Restaurant[] | undefined;
    component.userRestaurants$.subscribe((restaurants) => {
      userRestaurants = restaurants;
    });

    component.ngOnInit();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    component.restaurantUpdated(updatedRestaurant);

    expect(
      userRestaurants?.find((restaurant) => restaurant.id === restaurantId),
    ).toEqual(updatedRestaurant);
  }));

  it("should delete restaurant on 'restaurantDelete' event", fakeAsync(() => {
    const restaurantId = 1;
    const testRestaurant: Restaurant = {
      id: restaurantId,
      name: "",
      description: "",
      location: "",
      score: 1,
    };
    userServiceMock.getUserRestaurants.and.returnValue(of([testRestaurant]));

    let userRestaurants: Restaurant[] | undefined;
    component.userRestaurants$.subscribe((restaurants) => {
      userRestaurants = restaurants;
    });

    component.ngOnInit();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    component.restaurantDeleted(testRestaurant);

    expect(userRestaurants?.length).toEqual(0);
  }));

  it("should create restaurant when 'createRestaurant' is called", fakeAsync(() => {
    const creationForm: RestaurantForm = {
      name: "New restaurant",
      description: "A restaurant",
      location: "Pasta Lane",
    };
    const newRestaurant: Restaurant = {
      id: 0,
      name: creationForm.name,
      description: creationForm.description,
      location: creationForm.location,
      score: 0,
    };
    restaurantsServiceMock.createRestaurant.and.returnValue(of(newRestaurant));

    let userRestaurants: Restaurant[] | undefined;
    component.userRestaurants$.subscribe((restaurants) => {
      userRestaurants = restaurants;
    });

    component.createRestaurant(creationForm);

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(restaurantsServiceMock.createRestaurant).toHaveBeenCalledOnceWith(
      creationForm.name,
      creationForm.description,
      creationForm.location,
    );

    expect(userRestaurants?.length).toEqual(1);
    expect(userRestaurants?.at(0)).toEqual(newRestaurant);
  }));

  it("should update loading status while creating restaurant", fakeAsync(() => {
    const loadingStatus: boolean[] = [];
    component.loadingRestaurants$.subscribe((loading) => {
      loadingStatus.push(loading);
    });

    const creationForm: RestaurantForm = {
      name: "New restaurant",
      description: "A restaurant",
      location: "Pasta Lane",
    };

    component.createRestaurant(creationForm);

    expect(loadingStatus.at(-1)).toBeTrue();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(loadingStatus.at(-1)).toBeFalse();
  }));
});
