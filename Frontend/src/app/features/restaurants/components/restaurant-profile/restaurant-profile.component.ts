import { Component, input } from "@angular/core";
import { Restaurant } from "../../../../shared/models/restaurant.model";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: "dhub-restaurant-profile",
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: "./restaurant-profile.component.html",
  styleUrl: "./restaurant-profile.component.css",
})
export class RestaurantProfileComponent {
  restaurantModel = input<Restaurant>();
}
