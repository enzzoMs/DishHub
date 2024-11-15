import { Routes } from "@angular/router";
import { HomeComponent } from "./features/home/home.component";
import { RestaurantsComponent } from "./features/restaurants/restaurants.component";
import { AboutComponent } from "./features/about/about.component";

export enum RoutePaths {
  Home = "home",
  Restaurants = "restaurants",
  About = "about",
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
    path: RoutePaths.About,
    component: AboutComponent,
    title: "About - DishHub",
  },
  { path: "", redirectTo: "home", pathMatch: "full" },
  // TODO: { path: "**", NotFoundComponent}
];
