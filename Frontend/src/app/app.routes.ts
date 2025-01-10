import { Routes } from "@angular/router";
import { HomeComponent } from "./features/home/home.component";
import { RestaurantsComponent } from "./features/restaurants/restaurants.component";
import { AboutComponent } from "./features/about/about.component";
import { RestaurantDetailsComponent } from "./features/restaurants/components/restaurant-details/restaurant-details.component";
import { ErrorComponent } from "./features/error/error.component";
import { ErrorCode } from "./features/error/models/error-codes.model";
import { ProfileComponent } from "./features/profile/profile.component";
import {authGuard} from "./shared/guards/auth.guard";

export enum RoutePath {
  Home = "home",
  Restaurants = "restaurants",
  RestaurantDetails = "restaurants/:id",
  About = "about",
  Profile = "profile",
  Error = "error",
  ErrorDetails = "error/:errorCode",
  ErrorNotFound = `${RoutePath.Error}/${ErrorCode.NotFound}`,
}

export const appRoutes: Routes = [
  {
    path: RoutePath.Home,
    component: HomeComponent,
    title: "Home - DishHub",
  },
  {
    path: RoutePath.Restaurants,
    component: RestaurantsComponent,
    title: "Restaurants - DishHub",
  },
  {
    path: RoutePath.RestaurantDetails,
    component: RestaurantDetailsComponent,
  },
  {
    path: RoutePath.About,
    component: AboutComponent,
    title: "About - DishHub",
  },
  {
    path: RoutePath.Profile,
    component: ProfileComponent,
    title: "Profile - DishHub",
    canActivate: [authGuard]
  },
  {
    path: RoutePath.ErrorDetails,
    component: ErrorComponent,
    title: "Error - DishHub",
  },
  {
    path: RoutePath.Error,
    component: ErrorComponent,
    title: "Error - DishHub",
  },
  {
    path: "",
    redirectTo: RoutePath.Home,
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: RoutePath.ErrorNotFound,
  },
];
