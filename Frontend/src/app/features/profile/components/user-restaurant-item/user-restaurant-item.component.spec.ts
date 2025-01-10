import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";

import { UserRestaurantItemComponent } from "./user-restaurant-item.component";
import { provideRouter } from "@angular/router";
import { appRoutes } from "../../../../app.routes";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { Restaurant } from "../../../../shared/models/restaurant.model";
import { RestaurantsService } from "../../../../shared/services/restaurants/restaurants.service";
import { AppConfig } from "../../../../../config/config-constants";
import { RestaurantForm } from "../restaurant-form-config";
import { of } from "rxjs";

describe("UserRestaurantComponent", () => {
  let component: UserRestaurantItemComponent;
  let fixture: ComponentFixture<UserRestaurantItemComponent>;

  let restaurantsServiceMock: jasmine.SpyObj<RestaurantsService>;

  beforeEach(async () => {
    restaurantsServiceMock = jasmine.createSpyObj("restaurantsServiceMock", [
      "updateRestaurant",
      "deleteRestaurant",
    ]);

    const testRestaurant: Restaurant = {
      id: 0,
      name: "",
      description: "",
      location: "",
      score: 0,
    };
    restaurantsServiceMock.updateRestaurant.and.returnValue(of(testRestaurant));
    restaurantsServiceMock.deleteRestaurant.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [UserRestaurantItemComponent],
      providers: [
        provideRouter(appRoutes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RestaurantsService, useValue: restaurantsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRestaurantItemComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("restaurantModel", testRestaurant);

    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should update restaurant when 'updateRestaurant' is called", fakeAsync(() => {
    const testRestaurant: Restaurant = {
      id: 1,
      name: "",
      description: "",
      location: "",
      score: 0,
    };

    const updateForm: RestaurantForm = {
      name: "New name",
      description: "New description",
      location: "New location",
    };

    fixture.componentRef.setInput("restaurantModel", testRestaurant);
    fixture.detectChanges();

    component.updateRestaurant(updateForm);

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(restaurantsServiceMock.updateRestaurant).toHaveBeenCalledOnceWith(
      testRestaurant.id,
      updateForm.name,
      updateForm.description,
      updateForm.location,
    );
  }));

  it("should emit event when restaurant is updated", fakeAsync(() => {
    let updateEvent: Restaurant | undefined;
    component.restaurantUpdated.subscribe((restaurant) => {
      updateEvent = restaurant;
    });

    const updateForm: RestaurantForm = {
      name: "New name",
      description: "New description",
      location: "New location",
    };

    const updatedRestaurant: Restaurant = {
      id: 0,
      name: updateForm.name,
      description: updateForm.description,
      location: updateForm.location,
      score: 0,
    };
    restaurantsServiceMock.updateRestaurant.and.returnValue(
      of(updatedRestaurant),
    );

    component.updateRestaurant(updateForm);

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(updateEvent).toEqual(updatedRestaurant);
  }));

  it("should update loading status while updating", fakeAsync(() => {
    const loadingStatus: boolean[] = [];
    component.loadingUpdate$.subscribe((loading) => {
      loadingStatus.push(loading);
    });

    const updateForm: RestaurantForm = {
      name: "New name",
      description: "New description",
      location: "New location",
    };

    component.updateRestaurant(updateForm);

    expect(loadingStatus.at(-1)).toBeTrue();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(loadingStatus.at(-1)).toBeFalse();
  }));

  it("should delete restaurant when 'deleteRestaurant' is called", fakeAsync(() => {
    const testRestaurant: Restaurant = {
      id: 2,
      name: "",
      description: "",
      location: "",
      score: 0,
    };

    fixture.componentRef.setInput("restaurantModel", testRestaurant);
    fixture.detectChanges();

    component.deleteRestaurant();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(restaurantsServiceMock.deleteRestaurant).toHaveBeenCalledOnceWith(
      testRestaurant.id,
    );
  }));

  it("should emit event when restaurant is deleted", fakeAsync(() => {
    const testRestaurant: Restaurant = {
      id: 2,
      name: "",
      description: "",
      location: "",
      score: 0,
    };

    fixture.componentRef.setInput("restaurantModel", testRestaurant);
    fixture.detectChanges();

    let deleteEvent: Restaurant | undefined;
    component.restaurantDeleted.subscribe((restaurant) => {
      deleteEvent = restaurant;
    });

    component.deleteRestaurant();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(deleteEvent).toEqual(testRestaurant);
  }));

  it("should update loading status while deleting", fakeAsync(() => {
    const loadingStatus: boolean[] = [];
    component.loadingDelete$.subscribe((loading) => {
      loadingStatus.push(loading);
    });

    component.deleteRestaurant();

    expect(loadingStatus.at(-1)).toBeTrue();

    tick(AppConfig.MIN_LOADING_TIME_MS);

    expect(loadingStatus.at(-1)).toBeFalse();
  }));
});
