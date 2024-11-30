import { Component, input } from "@angular/core";
import { Restaurant } from "../../models/restaurant.model";
import { RouterLink } from "@angular/router";
import { RoutePaths } from "../../../../app.routes";

@Component({
  selector: "dhub-restaurant-item",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./restaurant-item.component.html",
  styleUrl: "./restaurant-item.component.css",
})
export class RestaurantItemComponent {
  restaurantModel = input.required<Restaurant>();
  showDetailsButton = input(true);

  readonly RoutePaths = RoutePaths;
}
