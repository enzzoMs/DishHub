import { Component } from "@angular/core";
import { Restaurant } from "../../../restaurants/models/restaurant.model";
import { RestaurantItemComponent } from "../../../restaurants/components/restaurant-item/restaurant-item.component";

@Component({
  selector: "dhub-features",
  standalone: true,
  imports: [RestaurantItemComponent],
  templateUrl: "./features.component.html",
  styleUrl: "./features.component.css",
})
export class FeaturesComponent {
  restaurantExample: Restaurant = {
    id: 0,
    name: "La Tavola Italiana",
    description:
      "Authentic Italian cuisine with fresh pasta, wood-fired pizzas, and a cozy, rustic vibe.",
    location: "Pasta Lane",
    score: 4.8,
  };
}
