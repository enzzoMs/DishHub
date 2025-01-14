import { Component, OnInit, viewChild } from "@angular/core";
import { BehaviorSubject, combineLatestWith, map, take, timer } from "rxjs";
import { Restaurant } from "../../../../shared/models/restaurant.model";
import { AppConfig } from "../../../../../config/config-constants";
import {
  RestaurantForm,
  RestaurantFormConfig,
} from "../restaurant-form-config";
import { FormDialogComponent } from "../../../../shared/components/form-dialog/form-dialog.component";
import { UserRestaurantItemComponent } from "../user-restaurant-item/user-restaurant-item.component";
import { EnumeratePipe } from "../../../../shared/pipes/enumerate/enumerate.pipe";
import { RestaurantsService } from "../../../../shared/services/restaurants/restaurants.service";
import { AsyncPipe } from "@angular/common";
import { MessageDialogComponent } from "../../../../shared/components/message-dialog/message-dialog.component";
import { UserService } from "../../../../shared/services/user/user.service";

@Component({
  selector: "dhub-user-restaurants",
  standalone: true,
  imports: [
    FormDialogComponent,
    UserRestaurantItemComponent,
    EnumeratePipe,
    AsyncPipe,
    MessageDialogComponent,
  ],
  templateUrl: "./user-restaurants.component.html",
  styleUrl: "./user-restaurants.component.css",
})
export class UserRestaurantsComponent implements OnInit {
  createRestaurantDialog = viewChild.required(FormDialogComponent);

  creationSuccessDialog = viewChild.required(MessageDialogComponent);

  private readonly userRestaurantsSubject$ = new BehaviorSubject<
    Restaurant[] | undefined
  >(undefined);
  readonly userRestaurants$ = this.userRestaurantsSubject$.asObservable();

  private readonly loadingRestaurantsSubject$ = new BehaviorSubject(true);
  readonly loadingRestaurants$ = this.loadingRestaurantsSubject$.asObservable();

  readonly numOfLoadingSkeletons = 4;

  readonly RestaurantFormConfig = RestaurantFormConfig;

  constructor(
    private readonly userService: UserService,
    private readonly restaurantsService: RestaurantsService,
  ) {}

  ngOnInit() {
    this.userService
      .getUserRestaurants(true)
      .pipe(
        combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
        map((loadingResult) => loadingResult[0]),
        take(1),
      )
      .subscribe((restaurants) => {
        this.userRestaurantsSubject$.next(restaurants);
        this.loadingRestaurantsSubject$.next(false);
      });
  }

  restaurantUpdated(updatedRestaurant: Restaurant) {
    const existingRestaurant = this.userRestaurantsSubject$.value?.find(
      (restaurant) => restaurant.id === updatedRestaurant.id,
    );

    if (!existingRestaurant) {
      return;
    }

    existingRestaurant.name = updatedRestaurant.name;
    existingRestaurant.description = updatedRestaurant.description;
    existingRestaurant.location = updatedRestaurant.location;
  }

  restaurantDeleted(deletedRestaurant: Restaurant) {
    const deletedRestaurantIndex =
      this.userRestaurantsSubject$.value?.findIndex(
        (restaurant) => restaurant.id === deletedRestaurant.id,
      );

    if (deletedRestaurantIndex !== undefined && deletedRestaurantIndex >= 0) {
      this.userRestaurantsSubject$.value?.splice(deletedRestaurantIndex, 1);
    }
  }

  showCreateRestaurantDialog() {
    this.createRestaurantDialog().showModal();
  }

  createRestaurant(restaurantForm: RestaurantForm) {
    const { name, description, location } = restaurantForm;

    this.loadingRestaurantsSubject$.next(true);

    this.restaurantsService
      .createRestaurant(name, description, location)
      .pipe(
        take(1),
        combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
        map((loadingResult) => loadingResult[0]),
      )
      .subscribe((restaurant) => {
        this.userRestaurantsSubject$.next([
          restaurant,
          ...(this.userRestaurantsSubject$.value ?? []),
        ]);

        this.createRestaurantDialog().closeDialog();
        this.loadingRestaurantsSubject$.next(false);
        this.creationSuccessDialog().showModal();
      });
  }
}
