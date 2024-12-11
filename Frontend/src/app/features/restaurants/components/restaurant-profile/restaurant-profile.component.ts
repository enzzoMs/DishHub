import { Component, input } from "@angular/core";
import { Restaurant } from "../../models/restaurant.model";

@Component({
  selector: "dhub-restaurant-profile",
  standalone: true,
  imports: [],
  templateUrl: "./restaurant-profile.component.html",
  styleUrl: "./restaurant-profile.component.css",
})
export class RestaurantProfileComponent {
  restaurantModel = input<Restaurant>();
}
