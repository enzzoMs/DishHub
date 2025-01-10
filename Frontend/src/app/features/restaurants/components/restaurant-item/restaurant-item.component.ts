import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { RoutePath } from "../../../../app.routes";
import { Restaurant } from "../../../../shared/models/restaurant.model";

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

  readonly RoutePaths = RoutePath;
}
