import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { RestaurantProfileComponent } from "../restaurant-profile/restaurant-profile.component";

@Component({
  selector: "dhub-restaurant-details",
  standalone: true,
  imports: [RouterLink, RestaurantProfileComponent],
  templateUrl: "./restaurant-details.component.html",
  styleUrl: "./restaurant-details.component.css",
})
export class RestaurantDetailsComponent {}
