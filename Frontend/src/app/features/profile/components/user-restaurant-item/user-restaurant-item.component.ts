import { Component, input, output, viewChild } from "@angular/core";
import { Restaurant } from "../../../../shared/models/restaurant.model";
import { MessageDialogComponent } from "../../../../shared/components/message-dialog/message-dialog.component";
import { RouterLink } from "@angular/router";
import { RoutePath } from "../../../../app.routes";
import { AsyncPipe } from "@angular/common";
import { FormDialogComponent } from "../../../../shared/components/form-dialog/form-dialog.component";
import {
  RestaurantForm,
  RestaurantFormConfig,
} from "../restaurant-form-config";
import { BehaviorSubject, combineLatestWith, map, take, timer } from "rxjs";
import { RestaurantsService } from "../../../../shared/services/restaurants/restaurants.service";
import { AppConfig } from "../../../../../config/config-constants";

@Component({
  selector: "dhub-user-restaurant-item",
  standalone: true,
  imports: [MessageDialogComponent, RouterLink, AsyncPipe, FormDialogComponent],
  templateUrl: "./user-restaurant-item.component.html",
  styleUrl: "./user-restaurant-item.component.css",
})
export class UserRestaurantItemComponent {
  restaurantModel = input.required<Restaurant>();

  updateRestaurantDialog = viewChild.required(FormDialogComponent);
  updateSuccessDialog = viewChild.required<MessageDialogComponent>(
    "updateSuccessDialog",
  );

  restaurantUpdated = output<Restaurant>();

  private readonly loadingUpdateSubject$ = new BehaviorSubject(false);
  readonly loadingUpdate$ = this.loadingUpdateSubject$.asObservable();

  deleteRestaurantDialog = viewChild.required<MessageDialogComponent>(
    "deleteRestaurantDialog",
  );
  deleteSuccessDialog = viewChild.required<MessageDialogComponent>(
    "deleteSuccessDialog",
  );

  restaurantDeleted = output<Restaurant>();

  private readonly loadingDeleteSubject$ = new BehaviorSubject(false);
  readonly loadingDelete$ = this.loadingDeleteSubject$.asObservable();

  readonly RoutePaths = RoutePath;
  readonly RestaurantFormConfig = RestaurantFormConfig;

  constructor(private readonly restaurantsService: RestaurantsService) {}

  showUpdateRestaurantDialog() {
    const initialValue: RestaurantForm = {
      name: this.restaurantModel().name,
      description: this.restaurantModel().description,
      location: this.restaurantModel().location,
    };

    this.updateRestaurantDialog().showModal(initialValue);
  }

  showDeleteRestaurantDialog() {
    this.deleteRestaurantDialog().showModal();
  }

  updateRestaurant(restaurantForm: RestaurantForm) {
    const { name, description, location } = restaurantForm;

    this.loadingUpdateSubject$.next(true);

    this.restaurantsService
      .updateRestaurant(this.restaurantModel().id, name, description, location)
      .pipe(
        take(1),
        combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
        map((loadingResult) => loadingResult[0]),
      )
      .subscribe((restaurant) => {
        this.restaurantUpdated.emit(restaurant);

        this.updateRestaurantDialog().closeDialog();
        this.loadingUpdateSubject$.next(false);
        this.updateSuccessDialog().showModal();
      });
  }

  deleteRestaurant() {
    this.loadingDeleteSubject$.next(true);

    this.restaurantsService
      .deleteRestaurant(this.restaurantModel().id)
      .pipe(
        take(1),
        combineLatestWith(timer(AppConfig.MIN_LOADING_TIME_MS)),
        map((loadingResult) => loadingResult[0]),
      )
      .subscribe(() => {
        this.restaurantDeleted.emit(this.restaurantModel());

        this.deleteRestaurantDialog().closeDialog();
        this.loadingDeleteSubject$.next(false);
        this.deleteSuccessDialog().showModal();
      });
  }
}
