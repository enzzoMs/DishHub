import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { RestaurantProfileComponent } from "../restaurant-profile/restaurant-profile.component";
import { RestaurantReviewsAndMenuComponent } from "../restaurant-reviews-and-menu/restaurant-reviews-and-menu.component";

@Component({
  selector: "dhub-restaurant-details",
  standalone: true,
  imports: [
    RouterLink,
    RestaurantProfileComponent,
    RestaurantReviewsAndMenuComponent,
  ],
  templateUrl: "./restaurant-details.component.html",
  styleUrl: "./restaurant-details.component.css",
})
export class RestaurantDetailsComponent {}
