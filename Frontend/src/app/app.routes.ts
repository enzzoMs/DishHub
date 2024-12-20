import { Routes } from "@angular/router";
import { HomeComponent } from "./features/home/home.component";
import { RestaurantsComponent } from "./features/restaurants/restaurants.component";
import { AboutComponent } from "./features/about/about.component";
import { RestaurantDetailsComponent } from "./features/restaurants/components/restaurant-details/restaurant-details.component";
import { ErrorComponent } from "./features/error/error.component";
import {ErrorCode} from "./features/error/models/ErrorCodes.model";

export enum RoutePaths {
  Home = "home",
  Restaurants = "restaurants",
  RestaurantDetails = "restaurants/:id",
  About = "about",
  Error = "error/:errorCode",
  ErrorNotFound = `error/${ErrorCode.NotFound}`,
}

export const appRoutes: Routes = [
  {
    path: RoutePaths.Home,
    component: HomeComponent,
    title: "Home - DishHub",
  },
  {
    path: RoutePaths.Restaurants,
    component: RestaurantsComponent,
    title: "Restaurants - DishHub",
  },
  {
    path: RoutePaths.RestaurantDetails,
    component: RestaurantDetailsComponent,
  },
  {
    path: RoutePaths.About,
    component: AboutComponent,
    title: "About - DishHub",
  },
  {
    path: RoutePaths.Error,
    component: ErrorComponent,
    title: "Error - DishHub",
  },
  {
    path: "",
    redirectTo: RoutePaths.Home,
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: RoutePaths.ErrorNotFound,
  },
];
