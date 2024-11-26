import { Component, input } from "@angular/core";
import { Restaurant } from "../../models/restaurant.model";

@Component({
  selector: "dhub-restaurant-item",
  standalone: true,
  imports: [],
  templateUrl: "./restaurant-item.component.html",
  styleUrl: "./restaurant-item.component.css",
})
export class RestaurantItemComponent {
  restaurantModel = input.required<Restaurant>();
  showDetailsButton = input(true);
}
